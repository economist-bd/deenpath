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
├── articles.html        → প্রবন্ধ (ফিল্টারযোগ্য গ্রিড)
├── zakat.html           → যাকাত ক্যালকুলেটর (লাইভ হিসাব)
├── donation.html        → ডোনেশন (bKash/Nagad/ব্যাংক তথ্য, কপি বাটন)
├── style.css            → সম্পূর্ণ ডিজাইন সিস্টেম (একক ফাইল)
├── common.js            → হেডার/ফুটার/টোস্ট/ক্যাশ হেল্পার (সব পেজে শেয়ার করা)
├── firebase-config.js   → Firebase Auth (Google Sign-In) + Firestore ইউজার প্রোফাইল
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
3. **Firestore Database** তৈরি করা থাকতে হবে (production মোডে), এবং নিচের মতো একটা বেসিক সিকিউরিটি রুল রাখুন:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

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
- মাসায়েল ফর্ম সাবমিশন Firebase Firestore-এ সংযুক্ত করা (আপনার `neera-d1df0` প্রজেক্ট ব্যবহার করতে পারেন)
- যাকাত ক্যালকুলেটরে লাইভ সোনা/রূপার মূল্য API যুক্ত করা
- কুরআন তিলাওয়াত অডিও প্লেয়ার যুক্ত করা (AlQuran Cloud-এর audio CDN দিয়ে)
- ইউজার অ্যাকাউন্ট + পঠন অগ্রগতি ট্র্যাকিং (Firestore দিয়ে)
