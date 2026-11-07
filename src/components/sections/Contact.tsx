import React, { useState } from 'react';
import { siteContent } from '../../content';
import { BrandButton } from '../ui/Button';
import { SunDot } from '../ui/SunDot';

// The field is labelled "ایمیل یا شماره همراه", so an address OR a phone number
// has to be accepted; a plain type="email" would reject phone numbers.
const CONTACT_VALUE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$|^\+?[\d\s()-]{8,}$/;

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!CONTACT_VALUE_PATTERN.test(email.trim())) {
      setContactError(siteContent.contact.form.invalidContact);
      return;
    }
    setContactError('');
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
      className="relative w-full bg-[var(--color-lower-surface)] text-[var(--color-lower-text)] py-28 px-[6vw] border-t border-[var(--color-lower-gold)]/20"
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

            <a
              href={`mailto:${siteContent.contact.direct.email}`}
              className="group flex items-center justify-between text-sm py-2"
            >
              <span className="text-[var(--color-lower-muted)] group-hover:text-[var(--color-lower-text)] transition-colors">
                {siteContent.contact.direct.emailLabel}
              </span>
              <span dir="ltr" className="font-mono text-[var(--color-lower-text)] font-bold group-hover:text-[var(--color-lower-gold)] transition-colors">
                {siteContent.contact.direct.email}
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
                {siteContent.contact.form.successTitle}
              </h3>
              <p className="text-sm text-[var(--color-lower-muted)] max-w-sm mb-4 leading-relaxed">
                {siteContent.contact.form.successNote}
              </p>
              <p className="text-xs text-[var(--color-lower-muted)] max-w-sm mb-6 leading-relaxed">
                {siteContent.contact.form.successFallback}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6">
                <a
                  href={`mailto:${siteContent.contact.direct.email}`}
                  dir="ltr"
                  className="font-mono text-xs font-bold text-[var(--color-lower-gold)] hover:text-[var(--color-lower-text)] transition-colors"
                >
                  {siteContent.contact.direct.email}
                </a>
                <a
                  href={`https://wa.me/${siteContent.contact.direct.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="font-mono text-xs font-bold text-[var(--color-lower-gold)] hover:text-[var(--color-lower-text)] transition-colors"
                >
                  {siteContent.contact.direct.whatsapp}
                </a>
              </div>

              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-[var(--color-lower-gold)] hover:text-[var(--color-lower-text)] underline"
              >
                {siteContent.contact.form.sendAnotherLabel}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (contactError) setContactError('');
                  }}
                  placeholder="name@domain.com یا ۰۹۱۲..."
                  inputMode="email"
                  autoComplete="email"
                  dir="ltr"
                  aria-invalid={Boolean(contactError)}
                  aria-describedby={contactError ? 'contact-email-error' : undefined}
                  className={`w-full rounded-full bg-[var(--color-lower-input)] border px-6 py-3.5 text-sm text-[var(--color-lower-text)] placeholder:text-[var(--color-lower-placeholder)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-lower-text)] transition-colors text-right ${
                    contactError
                      ? 'border-[var(--color-maroon)]'
                      : 'border-[var(--color-lower-gold)]/30'
                  }`}
                />
                {contactError && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-2 text-[0.75rem] font-bold text-[var(--color-maroon)]"
                  >
                    {contactError}
                  </p>
                )}
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
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
