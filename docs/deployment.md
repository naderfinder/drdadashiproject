# فاز ۶ — استقرار

## وضعیت فعلی

برنامه یک static web app است و می‌تواند روی هر static hosting سرو شود. فایل‌های اصلی عبارت‌اند از `index.html`, `styles.css` و `app.js`.

## گزینه پیشنهادی

برای MVP می‌توان پروژه را روی GitHub Pages منتشر کرد. چون برنامه Backend ندارد، نیازی به اجرای Node server در محیط Production نیست.

## چک‌لیست Production

- فعال‌بودن HTTPS
- تنظیم cache مناسب برای assetها
- بررسی عملکرد در موبایل و دسکتاپ
- اجرای چک‌لیست تست
- بررسی Console برای خطاهای JavaScript
- بررسی رفتار localStorage در مرورگرهای هدف

## نکته مهم درباره داده‌ها

`localStorage` یک persistence محلی است، نه Database مرکزی. با پاک‌شدن داده‌های مرورگر یا تغییر دستگاه، داده‌ها منتقل نمی‌شوند. برای نسخه چندکاربره باید Backend + Database اضافه شود.

## مسیر بعدی

1. ساخت Backend
2. Database migration
3. Authentication
4. User ownership
5. API integration
6. CI/CD و تست خودکار
7. Deployment نهایی
