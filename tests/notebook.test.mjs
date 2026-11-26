import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function load(name, imports = {}) {
  const source = readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const exports = {};
  new Function("require", "exports", outputText)((id) => {
    if (id in imports) return imports[id];
    throw new Error(`Unexpected import ${id}`);
  }, exports);
  return exports;
}

const data = load("data", { "@/lib/paths": { assetPath: (p) => p } });
const nb = load("notebook");
const run = (src) => nb.run(src, data);

test("core commands return structured output from the site data", () => {
  const about = run("ritwik.about()");
  assert.equal(about[0].kind, "md");
  assert.match(about[0].title, /Ritwik Jain/);

  const projects = run("ritwik.projects()");
  assert.equal(projects[0].kind, "table");
  assert.equal(projects[0].rows.length, data.projects.length + data.archive.length);
  assert.ok(projects[0].rows.some((row) => row[0] === "voicesep"));

  const deep = run('ritwik.project("pramana")');
  assert.ok(deep.some((o) => o.kind === "links" && o.links.some((l) => l.href.includes("PRAMANA"))));

  const plot = run('ritwik.eval("digital-twin")');
  assert.equal(plot[0].kind, "bars");
  assert.deepEqual(plot[0].bars.map((b) => b.display), ["33.3%", "47.2%", "0.248", "0.394"]);
});

test("every documented call actually runs", () => {
  for (const doc of Object.values(nb.docs)) {
    const out = run(doc.call);
    assert.ok(out.length > 0, doc.call);
    assert.ok(!out.some((o) => o.kind === "error"), `${doc.call} should not error`);
  }
  for (const suggestion of nb.suggestions) {
    assert.ok(!run(suggestion).some((o) => o.kind === "error"), suggestion);
  }
  for (const file of nb.files) {
    assert.ok(!run(file.run).some((o) => o.kind === "error"), file.run);
  }
});

test("actions are emitted rather than performed", () => {
  assert.deepEqual(run("exit()")[0].action, { type: "site" });
  assert.deepEqual(run('ritwik.theme("dark")')[0].action, { type: "theme", theme: "dark" });
  assert.deepEqual(run("ritwik.resume()")[0].action, { type: "resume" });
  assert.equal(run("clear")[0].action.type, "clear");
});

test("unknown input never executes; it errors helpfully", () => {
  let touched = false;
  globalThis.__pwned = () => {
    touched = true;
  };
  for (const attack of ["__pwned()", "globalThis.__pwned()", "eval('__pwned()')", "constructor.constructor('__pwned()')()", "fetch('https://example.com')", "<img src=x onerror=__pwned()>"]) {
    const out = run(attack);
    assert.equal(out.length, 1);
    assert.equal(out[0].kind, "error", attack);
  }
  assert.equal(touched, false);
  delete globalThis.__pwned;

  const typo = run("ritwik.projcts()");
  assert.equal(typo[0].ename, "AttributeError");
  assert.match(typo[0].hint, /ritwik\.projects\(\)/);

  const missing = run('ritwik.project("voicesepp")');
  assert.equal(missing[0].ename, "KeyError");
  assert.match(missing[0].hint, /voicesep/);
});

test("arithmetic is parsed, not evaluated", () => {
  assert.equal(nb.arithmetic("2 + 3 * 4"), 14);
  assert.equal(nb.arithmetic("(2 + 3) * 4"), 20);
  assert.equal(nb.arithmetic("2 ** 10"), 1024);
  assert.equal(nb.arithmetic("-3 + 5"), 2);
  assert.equal(nb.arithmetic("10 % 4"), 2);
  assert.equal(nb.arithmetic("2 +"), null);
  assert.equal(nb.arithmetic("process.exit()"), null);
  assert.equal(run("1/0")[0].text, "ZeroDivisionError: division by zero");
});

test("completion and easter eggs", () => {
  assert.ok(nb.complete("ritwik.pro").includes("ritwik.projects("));
  assert.ok(nb.complete("ritwik.pro").includes("ritwik.project("));
  assert.deepEqual(nb.complete(""), []);
  assert.equal(run("!nvidia-smi")[0].kind, "pre");
  assert.equal(run("model.fit(life)")[0].kind, "stream");
  assert.equal(run("import this")[0].kind, "md");
  assert.equal(run("!sudo hire ritwik").at(-1).action.type, "mail");
});
