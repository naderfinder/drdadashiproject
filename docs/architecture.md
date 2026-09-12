# فاز ۲ — معماری و طراحی

## تصمیم معماری

برای MVP از یک وب‌اپ تک‌صفحه‌ای سبک استفاده می‌کنیم. داده‌های Task در `localStorage` مرورگر نگهداری می‌شوند تا MVP بدون نیاز به سرور و پایگاه‌داده خارجی قابل اجرا باشد.

این تصمیم عمداً ساده است: هدف فازهای بعدی محصول، ساخت یک هسته قابل استفاده است؛ مرزهای داده و API در مستندات مشخص می‌شوند تا مهاجرت به Backend/Database بدون بازطراحی UI ممکن باشد.

## لایه‌ها

- **UI:** `index.html` + `styles.css`
- **Application:** `app.js` برای state، validation، filtering و rendering
- **Persistence:** `localStorage`
- **Future API boundary:** endpointهای تعریف‌شده در `requirements.md`

## مدل داده

```text
Task
├── id: string
├── title: string
├── description: string
├── status: todo | in_progress | done
├── priority: low | medium | high
├── due_date: string | null
├── created_at: ISO datetime
└── updated_at: ISO datetime
```

## تصمیم امنیتی

در MVP فعلی هیچ رمز عبور، توکن یا credential در Client ذخیره نمی‌شود. `localStorage` برای داده‌های حساس مناسب نیست و در فاز Authentication باید داده‌ها به Backend منتقل شوند.

## مسیر توسعه بعدی

1. استخراج repository به لایه API
2. افزودن Backend
3. افزودن Database
4. افزودن User و Authentication
5. انتقال ownership هر Task به User
6. افزودن تست‌های API و E2E
