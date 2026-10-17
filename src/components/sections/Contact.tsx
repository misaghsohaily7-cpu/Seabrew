import React, { useState } from 'react';
import { siteContent } from '../../content';
import { BrandButton } from '../ui/Button';
import { SunDot } from '../ui/SunDot';

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Composes the message and hands it to the visitor's mail client, so it
    // lands in the real inbox. (Swap this for a form endpoint such as
    // Web3Forms/Formspree if server-side delivery is preferred.)
    const subject = encodeURIComponent(`پیام تازه از سایت SEA BREW — ${name || 'بدون نام'}`);
    const body = encodeURIComponent(
      `نام: ${name}
راه ارتباط: ${email}

${message}
`
    );
    window.location.href = `mailto:${siteContent.contact.direct.email}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[var(--color-lower-surface)] text-[var(--color-lower-text)] py-28 px-[6vw] border-t border-[var(--color-lower-gold)]/20 select-none"
      aria-label="بخش ارتباط و سفارش"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Contact Info (RTL Start) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-lower-gold)] mb-3 flex items-center gap-2">
              <SunDot size="sm" animate={false} />
              <span>{siteContent.contact.sectionTag}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-lower-text)] mb-4">
              {siteContent.contact.heading}
            </h2>
            <p className="text-base font-medium text-[var(--color-lower-muted)] leading-relaxed mb-8">
              {siteContent.contact.subheading}
            </p>
          </div>

          {/* Direct channels */}
          <div className="space-y-4 pt-4 border-t border-[var(--color-lower-gold)]/20">
            <a
              href={`https://wa.me/${siteContent.contact.direct.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between text-sm py-2"
            >
              <span className="text-[var(--color-lower-muted)] group-hover:text-[var(--color-lower-text)] transition-colors">
                {siteContent.contact.direct.whatsappLabel}
              </span>
              <span dir="ltr" className="font-mono text-[var(--color-lower-text)] font-bold group-hover:text-[var(--color-lower-gold)] transition-colors">
                {siteContent.contact.direct.whatsapp}
              </span>
            </a>

            <a
              href={`https://instagram.com/${siteContent.contact.direct.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between text-sm py-2"
            >
              <span className="text-[var(--color-lower-muted)] group-hover:text-[var(--color-lower-text)] transition-colors">
                {siteContent.contact.direct.instagramLabel}
              </span>
              <span dir="ltr" className="font-mono text-[var(--color-lower-text)] font-bold group-hover:text-[var(--color-lower-gold)] transition-colors">
                {siteContent.contact.direct.instagram}
              </span>
            </a>

          </div>
        </div>

        {/* Static Contact Form */}
        <div className="lg:col-span-7 bg-[var(--color-lower-form)] rounded-3xl border border-[var(--color-lower-gold)]/30 p-8 sm:p-10">
          {formSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <SunDot size="lg" className="mb-4" />
              <h3 className="text-2xl font-black text-[var(--color-lower-text)] mb-2">
                پیام شما دریافت شد
              </h3>
              <p className="text-sm text-[var(--color-lower-muted)] max-w-sm mb-6 leading-relaxed">
                همکاران ما در اولین فرصت از طریق ایمیل یا واتساپ با شما تماس خواهند گرفت.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-[var(--color-lower-gold)] hover:text-[var(--color-lower-text)] underline"
              >
                ارسال پیام دیگر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-bold text-[var(--color-lower-muted)] mb-2"
                >
                  {siteContent.contact.form.namePlaceholder}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: علیرضا محمدی"
                  className="w-full rounded-full bg-[var(--color-lower-input)] border border-[var(--color-lower-gold)]/30 px-6 py-3.5 text-sm text-[var(--color-lower-text)] placeholder:text-[var(--color-lower-placeholder)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-lower-text)] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold text-[var(--color-lower-muted)] mb-2"
                >
                  {siteContent.contact.form.emailPlaceholder}
                </label>
                <input
                  id="contact-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  dir="ltr"
                  className="w-full rounded-full bg-[var(--color-lower-input)] border border-[var(--color-lower-gold)]/30 px-6 py-3.5 text-sm text-[var(--color-lower-text)] placeholder:text-[var(--color-lower-placeholder)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-lower-text)] transition-colors text-right"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-msg"
                  className="block text-xs font-bold text-[var(--color-lower-muted)] mb-2"
                >
                  {siteContent.contact.form.messagePlaceholder}
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="متن پیام، جزئیات سفارش یا پرسش..."
                  className="w-full rounded-2xl bg-[var(--color-lower-input)] border border-[var(--color-lower-gold)]/30 px-6 py-3.5 text-sm text-[var(--color-lower-text)] placeholder:text-[var(--color-lower-placeholder)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-lower-text)] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <BrandButton
                  variant="inverse"
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  {siteContent.contact.form.submitLabel}
                </BrandButton>

                {formSubmitted && (
                  <p className="text-[0.75rem] text-[var(--color-lower-gold)] text-center sm:text-start leading-snug">
                    {siteContent.contact.form.successNote}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
