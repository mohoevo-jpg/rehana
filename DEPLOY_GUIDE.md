# دليل رفع النظام على rehanaforflowers.com

لقد قمنا بتجهيز النظام ليكون جاهزاً للرفع. اتبع الخطوات التالية بناءً على نوع استضافتك.

## الملفات المطلوبة
يوجد مجلدان رئيسيان يجب رفعهما:
1.  `dist`: يحتوي على واجهة الموقع (بعد البناء).
2.  `backend`: يحتوي على السيرفر والكود الخلفي.

---

## الخيار 1: استضافة VPS (مثل DigitalOcean, AWS) - **مستحسن**

1.  **نقل الملفات:**
    *   قم بإنشاء مجلد باسم `rehana` في المسار `/var/www/`.
    *   ارفع مجلد `dist` ومجلد `backend` داخل `/var/www/rehana/` بحيث يكونان متجاورين.
    *   النتيجة النهائية للمسارات يجب أن تكون:
        *   `/var/www/rehana/dist`
        *   `/var/www/rehana/backend`

2.  **تثبيت المكاتب:**
    *   ادخل لمجلد الباك إند: `cd /var/www/rehana/backend`
    *   ثبت المكاتب: `npm install`

3.  **تشغيل السيرفر:**
    *   استخدم `pm2` لإبقاء السيرفر يعمل دائماً:
        ```bash
        npm install -g pm2
        pm2 start server.js --name "rehana-app"
        pm2 save
        pm2 startup
        ```

4.  **ربط الدومين (Nginx):**
    *   إذا كنت تستخدم Nginx، قم بإعداد `Proxy Pass` للمنفذ 3001. ولكن بما أننا دمجنا الواجهة مع السيرفر، يمكنك ببساطة توجيه الدومين `rehanaforflowers.com` إلى المنفذ 3001 مباشرة أو استخدام Nginx كـ Reverse Proxy (وهو الأفضل).

---

## الخيار 2: استضافة مشتركة (cPanel)

1.  **Setup Node.js App:**
    *   في لوحة cPanel، ابحث عن **"Setup Node.js App"**.
    *   انشئ تطبيق جديد.
    *   **Application Root:** `rehana/backend`
    *   **Application URL:** `rehanaforflowers.com`
    *   **Application Startup File:** `server.js`

2.  **رفع الملفات:**
    *   استخدم "مدير الملفات" (File Manager) لرفع مجلد `backend` ومجلد `dist` داخل مجلد `rehana` في المسار الرئيسي لملفاتك.
    *   تأكد أن `dist` موجود بجانب `backend` (وليس داخله).

3.  **تثبيت المكاتب:**
    *   في واجهة Node.js App في cPanel، اضغط على زر **"Run NPM Install"**.

4.  **التشغيل:**
    *   اضغط **Start App**.

---

## ملاحظة هامة حول .env
تأكد من إنشاء ملف `.env` داخل مجلد `backend` في السيرفر يحتوي على نفس الإعدادات الموجودة في جهازك (مثل إعدادات البريد الإلكتروني إذا وجدت)، أو قم بتعيين المتغيرات في لوحة التحكم.
