"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile, socials } from "@/lib/data";

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "737db4f4-8e52-467b-965a-82ba064bac13";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isSending, setIsSending] = useState(false);
  const pending = useRef(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    pending.current = true;
    setIsSending(true);
    setResult("Sending your message…");
    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "New message from Ritwik Jain's portfolio");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData, signal: controller.signal });
      const data = await response.json();
      if (response.ok && data.success) {
        form.reset();
        setResult("Message sent! I'll get back to you shortly.");
      } else {
        setResult("Your message couldn't be sent. Please try again or email me directly.");
      }
    } catch {
      setResult("Unable to send right now. Please try again or email me directly.");
    } finally {
      window.clearTimeout(timeout);
      pending.current = false;
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-4 text-center">Get in touch</p>
        <h2 className="text-center font-display text-4xl text-espresso md:text-5xl">Let&apos;s talk.</h2>
        <p className="mx-auto mt-5 max-w-md text-center font-body text-sm leading-relaxed text-espresso/80">Have an internship opportunity or a project in mind? I&apos;d love to hear from you.</p>
        <motion.form onSubmit={onSubmit} aria-busy={isSending} aria-describedby="contact-status" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} className="glass-panel mt-10 space-y-5 rounded-2xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wide text-espresso/70">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" className="w-full rounded-lg border border-champagne/40 bg-bone/60 px-4 py-2.5 font-body text-base text-espresso outline-none placeholder:text-espresso/30" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wide text-espresso/70">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className="w-full rounded-lg border border-champagne/40 bg-bone/60 px-4 py-2.5 font-body text-base text-espresso outline-none placeholder:text-espresso/30" />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wide text-espresso/70">Message</label>
            <textarea id="message" name="message" rows={5} required maxLength={5000} placeholder="Tell me about the opportunity or your idea…" className="w-full resize-y rounded-lg border border-champagne/40 bg-bone/60 px-4 py-2.5 font-body text-base text-espresso outline-none placeholder:text-espresso/30" />
          </div>
          <div hidden aria-hidden="true"><input type="checkbox" name="botcheck" tabIndex={-1} aria-label="Leave this field unchecked" /></div>
          <button type="submit" disabled={isSending} className="min-h-12 w-full rounded-full border border-oxblood/70 bg-oxblood py-3 font-body text-sm font-semibold uppercase tracking-wide text-bone transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">{isSending ? "Sending…" : "Send message"}</button>
          <p id="contact-status" role="status" aria-live="polite" aria-atomic="true" className="min-h-5 text-center font-body text-sm font-semibold text-oxblood">{result}</p>
        </motion.form>
        <p className="mt-6 text-center font-body text-sm text-espresso/70">Prefer email? <a href={`mailto:${profile.email}`} className="break-all text-oxblood underline underline-offset-4">{profile.email}</a></p>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {socials.map((social) => <a key={social.id} href={social.href} target={social.href.startsWith("https:") ? "_blank" : undefined} rel={social.href.startsWith("https:") ? "noopener noreferrer" : undefined} className="inline-flex min-h-11 items-center font-body text-sm font-semibold uppercase tracking-wide text-espresso/70 transition-colors hover:text-oxblood">{social.label}</a>)}
        </div>
      </div>
    </section>
  );
}
