import { useState } from "react"
import { Check, Mail, MapPin, Phone, Send } from "lucide-react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 800)) // simulate
    setSent(true)
    setSending(false)
  }

  return (
    <section className="bg-white py-20" id="contact">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
              Contact Us
            </p>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-gray-500">
              Have questions about Healthia? We're here to help. Send us a
              message and we'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Mail size={16} />, text: "support@healthia.com" },
                { icon: <Phone size={16} />, text: "+1 (800) HEALTHIA" },
                {
                  icon: <MapPin size={16} />,
                  text: "Cairo, Egypt & Worldwide",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5ee] text-[#1a6b3a]">
                    {c.icon}
                  </div>
                  {c.text}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5ee]">
                  <Check size={24} className="text-[#1a6b3a]" />
                </div>
                <p className="text-base font-bold text-gray-800">
                  Message Sent!
                </p>
                <p className="text-center text-sm text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-gray-800">Send us a message</h3>
                {(
                  [
                    {
                      label: "Full Name",
                      key: "name",
                      type: "text",
                      placeholder: "Your name",
                    },
                    {
                      label: "Email",
                      key: "email",
                      type: "email",
                      placeholder: "your@email.com",
                    },
                  ] as const
                ).map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a6b3a]"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                    Message
                  </label>
                  <textarea
                    placeholder="How can we help you?"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a6b3a]"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={
                    sending || !form.name || !form.email || !form.message
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1a6b3a] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#155730] disabled:opacity-50"
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={14} /> Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
