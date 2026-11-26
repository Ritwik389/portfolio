"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/sections/SectionHead";
import { profile } from "@/lib/data";

const accessKey =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  "737db4f4-8e52-467b-965a-82ba064bac13";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied("Email copied");
    } catch {
      setCopied(`Copy manually: ${profile.email}`);
    }
  }
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
    formData.append(
      "subject",
      `Portfolio enquiry: ${formData.get("topic") || "New message"}`,
    );
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        form.reset();
        setResult("Message sent! I'll get back to you shortly.");
      } else {
        setResult(
          "Your message couldn't be sent. Please try again or email me directly.",
        );
      }
    } catch {
      setResult(
        "Unable to send right now. Please try again or email me directly.",
      );
    } finally {
      window.clearTimeout(timeout);
      pending.current = false;
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section section-contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <SectionHead
            num="06"
            kicker="Contact"
            id="contact-title"
            title={
              <>
                Let’s build something <em>measurable</em>
              </>
            }
            intro="Research internships, collaborations, a hard ML problem, or just a good paper recommendation: my inbox is open."
          />
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <div className="contact-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={copyEmail}>
              {copied === "Email copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              Copy email
            </button>
            <a className="btn btn-ghost btn-sm" href={profile.resumeUrl} download="Ritwik_Jain_Resume.pdf">
              Résumé PDF
            </a>
          </div>
          <p role="status" className="copy-status">
            {copied}
          </p>
        </div>
        <form
          className="contact-form"
          onSubmit={onSubmit}
          aria-busy={isSending}
          aria-describedby="contact-status"
        >
          <div>
            <label htmlFor="topic">What would you like to talk about?</label>
            <select
              id="topic"
              name="topic"
              autoComplete="off"
              defaultValue="A research internship"
              className="field"
            >
              <option>A research internship</option>
              <option>A research collaboration</option>
              <option>An ML engineering role</option>
              <option>A freelance project</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="contact-fields">
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                className="field"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Your name…"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="field"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                spellCheck={false}
                placeholder="you@example.com…"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              className="field"
              rows={5}
              required
              maxLength={5000}
              placeholder="Tell me about the opportunity or your idea…"
            />
          </div>
          <div hidden aria-hidden="true">
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              aria-label="Leave this field unchecked"
            />
          </div>
          <motion.button
            className="btn btn-primary contact-submit"
            type="submit"
            disabled={isSending}
            whileTap={{ scale: 0.98 }}
          >
            {isSending ? "Sending…" : "Send message"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </motion.button>
          <p className="form-privacy">
            Your message goes straight to my inbox through Web3Forms. No tracking, no mailing list.
          </p>
          <p
            id="contact-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {result}
          </p>
        </form>
      </div>
    </section>
  );
}
