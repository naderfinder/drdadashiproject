# فاز ۵ — احراز هویت و کاربران

فاز ۵ از نظر طراحی مشخص شده، اما در MVP فعلی عمداً فعال نشده است؛ چون افزودن Authentication بدون Backend و مدیریت امن session/token باعث ایجاد امنیت کاذب می‌شود.

## طراحی پیشنهادی نسخه بعد

### User

- `id`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

### رابطه

```text
User 1 ─────── N Task
```

Task در نسخه Backend باید `user_id` داشته باشد.

## جریان ورود پیشنهادی

```text
Browser
  ↓
POST /api/auth/login
  ↓
Backend validation
  ↓
Password verification
  ↓
Secure session / short-lived token
  ↓
Authenticated requests
```

## الزامات امنیتی

- هرگز password خام ذخیره نشود.
- password با الگوریتم password hashing مناسب سمت سرور ذخیره شود.
- token/session در JavaScript قابل دسترسی در صورت امکان با Cookie امن مدیریت شود.
- HTTPS اجباری در Production باشد.
- CSRF protection در صورت استفاده از cookie-based authentication بررسی شود.
- authorization روی Backend انجام شود؛ مخفی‌کردن UI جایگزین authorization نیست.
- Taskهای کاربر فقط پس از کنترل `user_id` در Backend قابل خواندن/تغییر باشند.

## چرا فعلاً پیاده‌سازی نشد؟

نسخه فعلی یک static MVP است. پیاده‌سازی login در آن بدون Backend نیازمند ذخیره credential یا token در Client می‌شد و با الزامات امنیتی مناسب سازگار نبود. بنابراین Authentication به‌عنوان مرحله بعدی معماری شده است، نه یک قابلیت نمایشی ناقص.
