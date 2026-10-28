# KPESH Admin ব্যবহার নির্দেশিকা

## লগইন

1. ওয়েবসাইটের `/admin/login` ঠিকানায় যান।
2. আপনার Admin account-এর email ও password দিয়ে লগইন করুন।
3. কাজ শেষে **Logout** চাপুন; shared device-এ সেশন খোলা রাখবেন না।

প্রথম Admin account তৈরি হয় `db:seed` চালানোর সময় `SEED_ADMIN_EMAIL` ও
`SEED_ADMIN_PASSWORD` থেকে। এই মান বা `.env.local` কখনো chat, screenshot বা
GitHub-এ প্রকাশ করবেন না।

## কনটেন্ট পরিচালনা

- **Settings:** সাইটের নাম, logo, favicon URL, রং, যোগাযোগ, social link ও SEO তথ্য
  সংরক্ষণ করুন।
- **Media:** JPG, PNG, WebP, AVIF বা GIF (সর্বোচ্চ ৮ MB) ImageKit-এ upload করুন।
  Bangla ও English alt text দিন। কনটেন্টে ছবি লাগালে সংশ্লিষ্ট ছবিটি Media picker
  থেকে নির্বাচন করুন। কোনো কনটেন্টে ব্যবহৃত ছবি মুছতে হলে আগে কনটেন্ট থেকে সরান।
- **Services / Projects / Products / Blog:** আলাদা management page-এ item যোগ,
  সম্পাদনা বা মুছুন। Slug URL-এ ব্যবহৃত হয়; lowercase English ও hyphen ব্যবহার করুন।
- **Product specifications:** প্রতি লাইনে `বাংলা নাম | English name | value` লিখুন।
- **Blog:** Bangla ও English editor-এ লেখা লিখুন; **Preview before publish** দেখে
  তারপর Draft বা Published নির্বাচন করে সংরক্ষণ করুন।
- **Categories / FAQs / Testimonials / Navigation:** প্রতিটি আলাদা page থেকে
  সম্পাদনা করুন। Navigation-এর link-এ নিজের সাইটের অভ্যন্তরীণ path ব্যবহার করুন।
- **Inquiries:** গ্রাহকের বার্তা পড়ুন, status ও internal note বদলান, প্রয়োজনে CSV
  export করুন। CSV ফাইল ব্যক্তিগত গ্রাহক-তথ্য রাখতে পারে—নিরাপদে সংরক্ষণ করুন।
- **Users:** Admin-ই user যোগ করতে ও role বদলাতে পারবেন। Author, Editor, Admin
  role অনুযায়ী access আলাদা। শেষ সক্রিয় Admin-কে disable/demote করা যায় না।
- **Audit log:** সাম্প্রতিক Admin পরিবর্তন ও আগের/পরের মান দেখুন।

## Email notification

Inquiry email পাঠাতে Resend-এর API key, verified sender address এবং notification
recipient configure করতে হবে। Recipient `INQUIRY_NOTIFICATION_EMAIL` অথবা
Settings-এর contact email হতে পারে। Email না গেলেও enquiry database-এ রাখা হয়;
server log-এ configuration বা send failure দেখা যাবে।

## নিরাপত্তা

- Strong, unique password ব্যবহার করুন এবং অন্য কাউকে নিজের account দেবেন না।
- Admin role শুধু প্রয়োজনীয় ব্যক্তিকে দিন।
- `.env.local`-এর secret কাউকে পাঠাবেন না; production secret hosting provider-এর
  protected environment settings-এ দিন।
- Media delete করার আগে নিশ্চিত করুন সেটি কোনো live page-এ ব্যবহার হচ্ছে না।
- GitHub backup চালু করলে `MONGODB_URI` ও শক্তিশালী `BACKUP_ENCRYPTION_KEY`-কে
  Actions secrets হিসেবে দিন। Backup artifact encrypted থাকে; restore করার সময়
  নিজের নিরাপদ পরিবেশে একই passphrase দিয়ে GPG decrypt করুন।
