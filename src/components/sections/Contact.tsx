import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { BrandButton } from '../ui/Button';
import { SunDot } from '../ui/SunDot';

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.16,
            ease: 'tide',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (channelsRef.current) {
        gsap.fromTo(
          channelsRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'tide',
            scrollTrigger: {
              trigger: channelsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'tide',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#161617] text-[#FFFADE] py-28 px-[6vw] border-t border-[#A78040]/20 select-none"
      aria-label="بخش ارتباط و سفارش"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Contact Info (RTL Start) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div ref={headerRef}>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A78040] mb-3 flex items-center gap-2">
              <SunDot size="sm" animate={false} />
              <span>{siteContent.contact.sectionTag}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFADE] mb-4">
              {siteContent.contact.heading}
            </h2>
            <p className="text-base font-medium text-[#C9B8B6] leading-relaxed mb-8">
              {siteContent.contact.subheading}
            </p>
          </div>

          {/* Direct channels */}
          <div ref={channelsRef} className="space-y-4 pt-4 border-t border-[#A78040]/20">
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-[#C9B8B6]">{siteContent.contact.direct.phoneLabel}</span>
              <span dir="ltr" className="font-mono text-[#FFFADE] font-bold">
                {siteContent.contact.direct.phone}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-[#C9B8B6]">{siteContent.contact.direct.whatsappLabel}</span>
              <span dir="ltr" className="font-mono text-[#FFFADE] font-bold">
                {siteContent.contact.direct.whatsapp}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-[#C9B8B6]">{siteContent.contact.direct.instagramLabel}</span>
              <span dir="ltr" className="font-mono text-[#FFFADE] font-bold">
                {siteContent.contact.direct.instagram}
              </span>
            </div>
          </div>
        </div>

        {/* Static Contact Form */}
        <div ref={formRef} className="lg:col-span-7 bg-[#161617] rounded-3xl border border-[#A78040]/30 p-8 sm:p-10 shadow-2xl">
          {formSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <SunDot size="lg" className="mb-4" />
              <h3 className="text-2xl font-black text-[#FFFADE] mb-2">
                پیام شما دریافت شد
              </h3>
              <p className="text-sm text-[#C9B8B6] max-w-sm mb-6 leading-relaxed">
                همکاران ما در اولین فرصت از طریق ایمیل یا واتساپ با شما تماس خواهند گرفت.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-[#A78040] hover:text-[#FFFADE] underline"
              >
                ارسال پیام دیگر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-bold text-[#C9B8B6] mb-2"
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
                  className="w-full rounded-full bg-[#FFFADE]/10 border border-[#A78040]/30 px-6 py-3.5 text-sm text-[#FFFADE] placeholder:text-[#C9B8B6]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold text-[#C9B8B6] mb-2"
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
                  className="w-full rounded-full bg-[#FFFADE]/10 border border-[#A78040]/30 px-6 py-3.5 text-sm text-[#FFFADE] placeholder:text-[#C9B8B6]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE] transition-colors text-right"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-msg"
                  className="block text-xs font-bold text-[#C9B8B6] mb-2"
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
                  className="w-full rounded-2xl bg-[#FFFADE]/10 border border-[#A78040]/30 px-6 py-3.5 text-sm text-[#FFFADE] placeholder:text-[#C9B8B6]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE] transition-colors resize-none"
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

                <p className="text-[0.75rem] text-[#C9B8B6]/70 text-center sm:text-start leading-snug">
                  {siteContent.contact.form.notice}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
