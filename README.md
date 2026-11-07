# SEA BREW — وب‌سایت رسمی برند

سایت تک‌صفحه‌ای (one‑page) برند **SEA BREW**؛ نوشیدنی قهوه‌ای آماده‌مصرف از بوشهر.
ساخته‌شده با **React 19 + TypeScript + Vite 6 + Tailwind CSS v4** و انیمیشن‌های **GSAP 3**.

---

## اجرا

```bash
bun install      # یا npm install
bun run dev      # http://localhost:3000
```

| اسکریپت | کار |
| :--- | :--- |
| `bun run dev` | سرور توسعه روی پورت ۳۰۰۰ و `0.0.0.0` |
| `bun run build` | بیلد پروداکشن در `dist/` |
| `bun run preview` | سرو کردن بیلد نهایی |
| `bun run lint` | `eslint .` + `tsc --noEmit` |
| `bun run clean` | حذف `dist/` |

> پروژه با `bun.lock` قفل شده است. اگر با npm نصب می‌کنید، `package-lock.json` جدیدی ساخته می‌شود؛ یکی از این دو را به‌عنوان منبع حقیقت نگه دارید.

---

## ساختار

```
src/
├─ App.tsx                  ترکیب سکشن‌ها، lazy-loading، Preloader
├─ content.ts               ◀ تنها محل ویرایش تمام متن‌ها و داده‌ها
├─ index.css                توکن‌های رنگ/فونت، پالت تم، انیمیشن‌های CSS
├─ lib/
│  ├─ motion.ts             ثبت پلاگین‌های GSAP + ایزهای برند (tide/pour/swell)
│  ├─ theme.ts              تم روشن/تاریک (localStorage + prefers-color-scheme)
│  └─ format.ts             تبدیل ارقام فارسی
├─ components/sections/
│  ├─ Hero.tsx              هیرو + بطری، پارالاکس چندلایه
│  ├─ Drinks.tsx            شبکهٔ محصولات (از productList)
│  ├─ ProductMoment.tsx     «آناتومی طعم» — سکشن pin‑شدهٔ اسکرول
│  ├─ Story.tsx             سه فصل روایت برند
│  └─ Contact.tsx           فرم تماس + راه‌های ارتباطی
└─ components/ui/           ناوبار، فوتر، دکمه، کارت محصول، افکت‌ها، SVGهای برند
```

## ویرایش محتوا

همهٔ متن‌ها، نام محصولات، ترکیبات، روایت برند و راه‌های تماس در `src/content.ts` هستند.
برای افزودن محصول کافی است یک آبجکت به `productList` اضافه کنید؛ قالب کارت و بخش
«آناتومی طعم» خودکار به‌روز می‌شوند. جزئیات کلیدها در [`CONTENT.md`](CONTENT.md).

## تم و دسترس‌پذیری

- تم روشن/تاریک با `data-theme` روی `<html>`؛ انتخاب کاربر در `localStorage` می‌ماند و
  یک اسکریپت کوچک در `index.html` آن را قبل از اولین رسم اعمال می‌کند (بدون فلش).
- `prefers-reduced-motion` جدی گرفته شده: Preloader، پارالاکس، سکشن pin‑شده و افکت‌های
  موس برای این کاربران غیرفعال می‌شوند.
- تصاویر تزئینی `aria-hidden` هستند، لینک‌ها برچسب دارند و فوکوس حلقهٔ مشخص دارد.

## دیپلوی

خروجی `dist/` کاملاً استاتیک است. `netlify.toml` آماده است:

```bash
bun run build       # خروجی: dist/
```

سپس `dist/` را روی هر هاست استاتیک (Netlify، Cloudflare Pages، …) منتشر کنید.
`public/robots.txt` و `public/sitemap.xml` روی دامنهٔ `seabrew.ir` تنظیم شده‌اند؛ اگر دامنه
تغییر کرد، آن دو فایل و متاتگ‌های OG در `index.html` را هم به‌روز کنید.

## فونت

فونت متغیر **Estedad** به‌صورت لوکال در `public/fonts/Estedad-VF.woff2` میزبانی می‌شود
(بدون وابستگی به CDN) و با `font-display: swap` بارگذاری می‌شود.
