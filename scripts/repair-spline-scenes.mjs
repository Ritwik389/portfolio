import { Packr, addExtension } from "msgpackr";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Preserve Spline's six MessagePack extension types when editing its export.
class RecordValue {}
class ListValue extends Array {}
class OrderedListValue extends Array {}
class Reference { constructor(id) { this.id = id; } }
class DataValue { constructor(data) { this.data = data; } }
class ObjectValue {}
for (const [Class, type, write, read] of [
  [RecordValue, 1, (v) => ({ ...v }), (v) => Object.setPrototypeOf(v, RecordValue.prototype)],
  [ListValue, 2, (v) => [...v], (v) => Object.setPrototypeOf(v, ListValue.prototype)],
  [OrderedListValue, 3, (v) => [...v], (v) => Object.setPrototypeOf(v, OrderedListValue.prototype)],
  [Reference, 4, (v) => v.id, (v) => new Reference(v)],
  [DataValue, 5, (v) => v.data, (v) => new DataValue(v)],
  [ObjectValue, 6, (v) => ({ ...v }), (v) => Object.setPrototypeOf(v, ObjectValue.prototype)],
]) addExtension({ Class, type, write, read });

const codec = new Packr({ structuredClone: true });
const sources = {
  hero: "https://prod.spline.design/GwxV5oCmB76tUGRR/scene.splinecode",
  about: "https://prod.spline.design/nfobiJJ6uygdFskf/scene.splinecode",
  footer: "https://prod.spline.design/VKSgNEdt6wKREEnz/scene.splinecode",
};
const manifest = {};
await mkdir("public/scenes", { recursive: true });

for (const [name, url] of Object.entries(sources)) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Unable to retrieve ${name}: ${response.status}`);
  const original = Buffer.from(await response.arrayBuffer());
  const scene = codec.unpack(original);
  const nodes = new Map();
  const walk = (value, callback) => {
    if (!value || typeof value !== "object" || ArrayBuffer.isView(value)) return;
    callback(value);
    for (const child of Object.values(value)) walk(child, callback);
  };
  walk(scene.scene, (value) => { if (value.id && value.data?.states) nodes.set(value.id, value); });
  const repairs = [];
  walk(scene.scene, (value) => {
    if (!Array.isArray(value.actions)) return;
    value.actions = value.actions.filter((action) => {
      if (action.data?.type !== "Transition") return true;
      const target = nodes.get(action.data.object);
      const states = target?.data.states || [];
      const ids = states.map((state) => state.id);
      const missing = action.data.tweens.some((tween) => typeof tween.data.state === "string" && !ids.includes(tween.data.state));
      if (!missing) return true;
      if (states.length === 1) {
        for (const tween of action.data.tweens) if (typeof tween.data.state === "string" && !ids.includes(tween.data.state)) {
          repairs.push({ object: target.data.name, action: action.id, from: tween.data.state, to: ids[0] });
          tween.data.state = ids[0];
        }
        return true;
      }
      repairs.push({ object: target?.data.name, action: action.id, removed: "Transition references a deleted state; retain the parent event." });
      return false;
    });
  });
  const fixed = codec.pack(scene);
  // The encoded result must decode to the same edited data, including typed arrays.
  if (JSON.stringify(codec.unpack(fixed)) !== JSON.stringify(scene)) throw new Error(`Round-trip verification failed: ${name}`);
  await writeFile(`public/scenes/${name}.splinecode`, fixed);
  manifest[name] = { source: url, version: scene.version, sourceSha256: createHash("sha256").update(original).digest("hex"), repairs };
  console.log(`${name}: ${repairs.length} repaired reference(s)`);
}
await writeFile("public/scenes/source-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
