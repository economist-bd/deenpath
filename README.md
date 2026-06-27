# দ্বীনপথ — সম্পূর্ণ ইসলামিক ওয়েব প্ল্যাটফর্ম

মুসলিমবাংলা.কম থেকে অনুপ্রাণিত একটি স্বতন্ত্র বাংলা ইসলামিক ওয়েবসাইট। সম্পূর্ণ static — কোনো ব্যাকএন্ড সার্ভার লাগে না।

## ফাইল গঠন

```
deenpath/
├── index.html          → হোমপেজ (হিরো, লাইভ নামাজের সময়, ফিচার, আজকের আমল)
├── quran.html           → কুরআন তিলাওয়াত (১১৪ সূরা + রিডার মোডাল)
├── hadith.html          → হাদীস সংকলন (৬টি গ্রন্থ, বিষয়ভিত্তিক ফিল্টার)
├── prayer-times.html    → নামাজের সময়সূচি (লাইভ + মাসিক ক্যালেন্ডার + GPS)
├── masail.html          → মাসায়েল (প্রশ্নোত্তর + প্রশ্ন জিজ্ঞাসা ফর্ম)
├── dua.html             → দু'আ সংগ্রহ (ক্যাটাগরি অনুযায়ী)
├── articles.html        → প্রবন্ধ (স্থির ডেমো ডেটা, অপরিবর্তিত)
├── blog.html            → ব্লগ (Firestore থেকে লাইভ পোস্ট লোড করে)
├── admin.html           → এডমিন প্যানেল (ব্লগ পোস্ট লেখা/এডিট/ডিলিট)
├── zakat.html           → যাকাত ক্যালকুলেটর (লাইভ হিসাব)
├── donation.html        → ডোনেশন (bKash/Nagad/ব্যাংক তথ্য, কপি বাটন)
├── style.css            → সম্পূর্ণ ডিজাইন সিস্টেম (একক ফাইল)
├── common.js            → হেডার/ফুটার/টোস্ট/ক্যাশ হেল্পার (সব পেজে শেয়ার করা)
├── firebase-config.js   → Firebase Auth (Google Sign-In) + Firestore (ইউজার, ব্লগ পোস্ট, এডমিন চেক)
└── data.js              → স্থির ডেটা (সূরা তালিকা, হাদীস, জেলা কোঅর্ডিনেট)
```

## Firebase ইন্টিগ্রেশন

প্রজেক্ট: **deenpath-4e575** (Firebase Console-এ ইতিমধ্যে সেটআপ করা)

- **Authentication** — শুধু Google সাইন-ইন (পপআপ পদ্ধতি)। হেডারের ডান পাশে বাটন থাকে; লগইন করলে নাম + প্রোফাইল ছবি দেখায় ও ড্রপডাউনে লগ-আউট অপশন আসে।
- **Firestore** — লগইন করার সাথে সাথে `users/{uid}` ডকুমেন্টে নাম, ইমেইল, ছবি ও lastLogin সেভ হয় (merge মোডে, তাই বিদ্যমান ডেটা মুছে যায় না)।
- সব পেজে `<script type="module" src="firebase-config.js"></script>` যুক্ত করা আছে — `common.js`-এর পরে লোড হয় যাতে হেডারের `#authSlot` ডিভ আগে তৈরি থাকে।

### Firebase Console-এ যা সক্রিয় করতে হবে (যদি না থাকে)
1. **Authentication → Sign-in method → Google** চালু করুন।
2. **Authentication → Settings → Authorized domains**-এ আপনার ডিপ্লয়মেন্ট ডোমেইন (যেমন `economist-bd.github.io` বা আপনার Vercel ডোমেইন) যুক্ত করুন — নাহলে পপআপ লগইন কাজ করবে না।
3. **Firestore Database** তৈরি করা থাকতে হবে (production মোডে), এবং নিচের সম্পূর্ণ সিকিউরিটি রুল রাখুন (এতে ব্লগ পোস্ট ও এডমিন কালেকশনও কভার করা আছে — পরের সেকশন দেখুন):

## ব্লগ ও এডমিন প্যানেল

`blog.html` সবার জন্য পাবলিক — শুধু `status: "published"` পোস্ট দেখায়, ক্যাটাগরি ফিল্টার সহ। `admin.html` লগইন-প্রটেক্টেড — Google দিয়ে লগইন করতে হবে, এবং Firestore-এর `admins` কালেকশনে আপনার UID থাকলেই এডিটর দেখা যাবে।

**`articles.html` সম্পূর্ণ অপরিবর্তিত আছে** — এটা আগের মতই স্থির ডেমো ডেটা দেখাবে। নতুন লেখা সবসময় `blog.html`-এ যাবে, `articles.html`-এ নয়।

### প্রথম এডমিন যুক্ত করার পদ্ধতি (একবার করতে হবে)

1. আপনার ওয়েবসাইটে গিয়ে **Google দিয়ে লগইন** করুন (হেডারের বাটন দিয়ে)।
2. [Firebase Console](https://console.firebase.google.com) → আপনার প্রজেক্ট (`deenpath-4e575`) → **Authentication → Users** ট্যাবে যান। আপনার লগইন করা একাউন্টের পাশে একটা **User UID** দেখবেন (লম্বা একটা কোড) — সেটা কপি করুন।
3. **Firestore Database** ট্যাবে যান → **Start collection** → কালেকশনের নাম দিন `admins`।
4. **Document ID**-তে ধাপ ২ থেকে কপি করা UID-টা পেস্ট করুন। Firestore একটা ফিল্ড চাইবে — যেকোনো নাম দিয়ে `role: "admin"` টাইপের একটা ফিল্ড যুক্ত করে সেভ করুন (ফিল্ডের ভ্যালু যাই হোক, শুধু ডকুমেন্টটা এক্সিস্ট করাই যথেষ্ট)।
5. সেভ করার পর ওয়েবসাইটে ফিরে `admin.html` পেজ রিফ্রেশ করুন — এখন এডিটর দেখা যাবে।

পরবর্তীতে আরও কাউকে এডমিন করতে চাইলে একই পদ্ধতিতে তার UID দিয়ে `admins` কালেকশনে আরেকটা ডকুমেন্ট যুক্ত করুন।

### Firestore সিকিউরিটি রুল (গুরুত্বপূর্ণ — অবশ্যই সেট করুন)

Firebase Console → Firestore Database → Rules ট্যাবে গিয়ে নিচের সম্পূর্ণ রুল বসান, নাহলে যেকেউ পোস্ট লিখতে/ডিলিট করতে পারবে বা নিজেকে এডমিন বানাতে পারবে:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /admins/{uid} {
      allow read: if request.auth != null;
      allow write: if false; // Console থেকেই এডমিন যুক্ত/বাদ দিতে হবে, ওয়েবসাইট থেকে নয়
    }

    match /posts/{postId} {
      allow read: if resource.data.status == "published" || (request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid)));
      allow create, update, delete: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

মানে: যেকেউ published পোস্ট পড়তে পারবে, কিন্তু লেখা/এডিট/ডিলিট শুধু `admins` কালেকশনে UID থাকা ব্যক্তিরাই করতে পারবে। `admins` কালেকশন শুধু Firebase Console থেকেই পরিবর্তনযোগ্য — এটা সিকিউরিটির জন্য জরুরি।

## ডোনেশন পেজ

`donation.html` — কোনো ফর্ম নেই, শুধু bKash, Nagad ও ব্যাংক একাউন্টের তথ্য কার্ড আকারে দেখায়, প্রতিটাতে এক-ক্লিক কপি বাটন। নাম্বার/একাউন্ট তথ্য পরিবর্তন করতে চাইলে `donation.html` ফাইলে সরাসরি এডিট করুন (`bkashNumber`, `nagadNumber`, `bankAccNumber` ইত্যাদি আইডি খুঁজুন)।


## ব্যবহৃত API (সবগুলো ফ্রি, কী-বিহীন, CORS-ওপেন)

- **AlQuran Cloud** (`api.alquran.cloud`) — কুরআন আরবি টেক্সট + বাংলা অনুবাদ (`bn.bengali` edition)
- **AlAdhan** (`api.aladhan.com`) — নামাজের সময়, মাসিক ক্যালেন্ডার, হিজরী তারিখ

হাদীস ও দু'আ ডেটা `data.js`-এ নিজস্বভাবে সংকলিত (কোনো থার্ড-পার্টি হাদীস API যথেষ্ট নির্ভরযোগ্য/CORS-ফ্রি না হওয়ায়)।

## লোকালি চালানো

কোনো বিল্ড স্টেপ লাগে না। যেকোনো স্ট্যাটিক সার্ভার দিয়ে চালান:

```bash
python3 -m http.server 8080
# অথবা
npx serve .
```

## GitHub Pages-এ ডিপ্লয়

```bash
git init
git add .
git commit -m "দ্বীনপথ ইসলামিক প্ল্যাটফর্ম"
git remote add origin https://github.com/economist-bd/deenpath.git
git branch -M main
git push -u origin main
```

তারপর GitHub repo সেটিংসে **Pages** → Source: `main` branch, root folder সিলেক্ট করুন।

## Vercel-এ ডিপ্লয়

```bash
vercel --prod
```

বা GitHub repo Vercel-এ ইম্পোর্ট করুন — কোনো বিল্ড কমান্ড লাগবে না (static site)।

## পরবর্তী উন্নতির সুযোগ

- হাদীস ডেটা বাড়ানো (`data.js`-এর `HADITH_DATA` array-এ আরও এন্ট্রি যুক্ত করুন)
- মাসায়েল ফর্ম সাবমিশন Firestore-এ সংযুক্ত করা (এখন শুধু টোস্ট দেখায়, সেভ হয় না)
- যাকাত ক্যালকুলেটরে লাইভ সোনা/রূপার মূল্য API যুক্ত করা
- কুরআন তিলাওয়াত অডিও প্লেয়ার যুক্ত করা (AlQuran Cloud-এর audio CDN দিয়ে)
- ব্লগ পোস্টে কমেন্ট/লাইক সিস্টেম যুক্ত করা (Firestore সাব-কালেকশন দিয়ে)
- ব্লগ পোস্টের জন্য rich text এডিটর (এখন প্লেইন টেক্সট/লাইন-ব্রেক সাপোর্টেড)
- ইউজার অ্যাকাউন্ট + পঠন অগ্রগতি ট্র্যাকিং (Firestore দিয়ে)
