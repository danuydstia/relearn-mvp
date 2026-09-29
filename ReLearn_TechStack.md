# Re:Learn — Overall Product Planning

> **Status dokumen:** Planning / rancangan awal produk
> **Jenis produk:** Web-based AI Learning Application
> **Target:** Mahasiswa/pelajar
> **Pendekatan arsitektur:** Modular Monolith
> **Backend:** Laravel
> **Frontend:** React/Vite atau Vue/Vite — masih dalam keputusan
> **Database:** PostgreSQL — rekomendasi
> **AI Gateway:** OpenRouter
> **LLM:** Belum ditentukan
> **Object Storage:** S3-compatible storage — belum ditentukan provider
> **Payment Gateway:** Midtrans — kandidat, belum final
> **Real-time:** Laravel Reverb / WebSocket — rekomendasi

---

# 1. Gambaran Produk

## 1.1 Nama Produk

**Re:Learn**

Re:Learn merupakan aplikasi pembelajaran berbasis web yang memanfaatkan Artificial Intelligence (AI) untuk membantu pengguna memahami materi pembelajaran, melakukan pembelajaran secara berkelanjutan, serta mengevaluasi pemahaman melalui kuis yang dibuat berdasarkan materi yang dipelajari.

---

# 2. Permasalahan

Re:Learn dikembangkan berdasarkan beberapa permasalahan dalam proses belajar mandiri:

1. Mahasiswa dapat mengalami kesulitan memahami materi yang kompleks meskipun telah membaca materi tersebut.
2. Materi pembelajaran yang panjang dan tidak terstruktur dapat menyulitkan pengguna menentukan urutan belajar.
3. Pengguna dapat melupakan materi setelah mempelajarinya sehingga membutuhkan mekanisme untuk melakukan review kembali.
4. Pengguna membutuhkan cara yang lebih terstruktur untuk mengevaluasi hasil pembelajarannya.
5. Pembelajaran dapat menjadi kurang interaktif ketika hanya dilakukan secara individual.

---

# 3. Tujuan Produk

Re:Learn bertujuan untuk:

* membantu pengguna memahami materi melalui struktur pembelajaran yang dihasilkan AI;
* mengubah materi pembelajaran menjadi learning path yang lebih terstruktur;
* menyediakan kuis berdasarkan materi yang dipelajari;
* menyimpan hasil pembelajaran agar dapat digunakan kembali;
* menyediakan lingkungan komunitas untuk berbagi dan berdiskusi;
* menyediakan mekanisme gamifikasi untuk meningkatkan keterlibatan pengguna;
* menyediakan sistem berlangganan dan transaksi komunitas sebagai model monetisasi.

---

# 4. Konsep Utama Produk

Konsep utama Re:Learn dapat diringkas menjadi:

```text
Material
   ↓
AI Processing
   ↓
Learning Path
   ↓
Learning
   ↓
Quiz
   ↓
Score / Learning Performance
   ↓
Review / Continuous Learning
```

Sistem tidak menyatakan bahwa skor kuis secara absolut menentukan "mastery" pengguna.

Terminologi yang lebih tepat untuk MVP:

> **Learning Performance / performa pembelajaran berdasarkan hasil evaluasi.**

Estimasi mastery yang lebih kompleks dapat dikembangkan pada tahap selanjutnya.

---

# 5. Aktor Sistem

## 5.1 Free User

Pengguna dengan akun gratis.

Fungsi utama:

* mengunggah materi;
* membuat learning path;
* membuat kuis;
* mengerjakan kuis;
* melihat hasil kuis;
* menggunakan AI berdasarkan kuota yang tersedia;
* bergabung dengan komunitas;
* mengakses fitur komunitas sesuai hak akses.

---

## 5.2 Pro User

Pengguna dengan subscription Pro.

Fungsi tambahan:

* memperoleh kuota AI yang lebih tinggi;
* memperoleh fitur premium;
* memperoleh harga pendaftaran komunitas yang lebih rendah;
* dapat membuat komunitas.

Jumlah kuota dan detail fitur premium belum ditentukan.

---

## 5.3 Community Owner

Pengguna Pro yang membuat komunitas.

Fungsi:

* membuat komunitas;
* mengatur komunitas;
* mengatur visibilitas resource;
* membagikan materi;
* membagikan learning path;
* mengelola aktivitas komunitas;
* menyelenggarakan collaborative quiz;
* memperoleh bagian pendapatan dari transaksi komunitas setelah dikurangi komisi platform.

---

## 5.4 Admin

Fungsi:

* mengelola pengguna;
* mengawasi komunitas;
* mengelola subscription/package;
* memantau transaksi;
* melakukan moderasi;
* memantau aktivitas sistem;
* melakukan pengawasan terhadap penggunaan layanan.

---

# 6. Ruang Lingkup Produk

## 6.1 Learning System

### Material

Format material MVP:

* PDF
* DOCX
* PPTX

Fungsi:

* upload material;
* validasi file;
* penyimpanan file;
* ekstraksi teks;
* preprocessing;
* pemrosesan AI.

YouTube **belum termasuk MVP**.

---

### AI Learning Path Generator

Input:

```text
Material
```

Proses:

```text
Material
    ↓
Text Extraction
    ↓
Preprocessing
    ↓
Chunking jika diperlukan
    ↓
AI Service
    ↓
OpenRouter
    ↓
LLM
```

Output:

```text
Learning Path
 ├── Topic
 │    ├── Subtopic
 │    ├── Subtopic
 │    └── ...
 ├── Topic
 └── ...
```

Learning path disimpan agar dapat dipelajari dan digunakan kembali.

---

### Automatic Quiz Generation

AI menghasilkan soal berdasarkan materi atau learning path.

Alur:

```text
Material / Learning Path
        ↓
    AI Service
        ↓
     OpenRouter
        ↓
        LLM
        ↓
      Questions
        ↓
       Quiz
```

Pengguna kemudian dapat mengerjakan quiz dan memperoleh hasil evaluasi.

---

### Quiz Evaluation

Data yang dapat dihasilkan:

* jawaban pengguna;
* jumlah jawaban benar;
* jumlah jawaban salah;
* skor;
* waktu pengerjaan jika diperlukan;
* performa berdasarkan quiz/topic.

---

# 7. Continuous Learning

Material dan learning path yang telah dibuat dapat disimpan sehingga pengguna dapat:

* melanjutkan pembelajaran;
* membuka kembali learning path;
* mengulang materi;
* mengerjakan quiz kembali;
* melihat hasil pembelajaran sebelumnya.

Konsep:

```text
Upload Material
      ↓
Learning Path
      ↓
Save
      ↓
Revisit
      ↓
Review
      ↓
Quiz
      ↓
New Result
```

---

# 8. Community Learning Ecosystem

Community merupakan subsystem tersendiri dalam Re:Learn.

Struktur utama:

```text
Community
│
├── Owner
├── Members
├── Channels
│   └── Discussion
│
├── Shared Resources
│   ├── Material
│   └── Learning Path
│
├── Collaborative Quiz
│
├── Badge / Achievement
└── Leaderboard
```

---

## 8.1 Community Visibility

Rancangan visibility yang sederhana:

```text
Private
Community
Public
```

Community owner dapat menentukan visibilitas resource sesuai kebutuhan.

Detail permission dapat dikembangkan kemudian.

---

## 8.2 Community Discussion

Pengguna dapat:

* membuat diskusi;
* membaca diskusi;
* memberikan tanggapan;
* berdiskusi melalui channel.

---

## 8.3 Shared Resources

Community dapat digunakan untuk berbagi:

* PDF;
* DOCX;
* PPTX;
* learning path.

Akses terhadap resource mengikuti pengaturan visibility dan membership.

---

# 9. Collaborative Quiz

Collaborative quiz direncanakan sebagai fitur real-time.

Konsep:

```text
Host
  ↓
Create Quiz Session
  ↓
Generate Join Code
  ↓
Participants Join
  ↓
Host Starts Quiz
  ↓
Question Broadcast
  ↓
Participants Answer
  ↓
Server Validates Answer
  ↓
Score Updated
  ↓
Score Broadcast
  ↓
Final Result
```

Teknologi real-time yang direncanakan:

```text
Laravel
   ↓
Laravel Reverb / WebSocket
   ↓
Client Users
```

Entity yang kemungkinan diperlukan:

* `quiz_sessions`
* `quiz_session_members`
* `quiz_session_answers`

---

# 10. Gamification

Gamifikasi digunakan sebagai fitur pendukung engagement.

Komponen:

```text
User Activity
      ↓
Achievement
      ↓
Badge / Reward Token
      ↓
Leaderboard
```

Komponen yang direncanakan:

* Badge
* Achievement
* Reward Token
* Leaderboard

Detail aturan pemberian reward belum ditentukan.

---

# 11. AI Architecture

## 11.1 AI Service Layer

Laravel tidak sebaiknya memanggil OpenRouter secara langsung dari berbagai bagian aplikasi.

Struktur yang direkomendasikan:

```text
Laravel
   ↓
AI Service Layer
   ├── LearningPathGenerator
   ├── QuizGenerator
   └── Future AI Generators
          ↓
      OpenRouter
          ↓
         LLM
```

Keuntungannya:

* integrasi AI terpusat;
* model lebih mudah diganti;
* kode fitur tidak bergantung langsung pada provider;
* penggunaan token lebih mudah dicatat;
* konfigurasi AI lebih mudah dikelola.

---

# 12. AI Token Management

Penggunaan AI dihitung berdasarkan penggunaan token aktual.

Data yang perlu dicatat antara lain:

```text
AI Usage
├── user_id
├── feature
├── model
├── input_tokens
├── output_tokens
├── total_tokens
├── estimated_cost
├── status
└── timestamp
```

Alur:

```text
User Request
     ↓
Check AI Quota
     ↓
AI Service
     ↓
OpenRouter
     ↓
LLM
     ↓
Response
     ↓
Record AI Usage
     ↓
Update Usage / Quota
```

Sistem tidak menggunakan asumsi:

> 1 request = 1 token.

Penggunaan token bergantung pada input dan output model.

---

# 13. Payment & Monetization

Re:Learn memiliki tiga konsep monetisasi utama.

## 13.1 Pro Subscription

```text
User
 ↓
Choose Pro
 ↓
Payment Gateway
 ↓
Payment Confirmation
 ↓
Webhook
 ↓
Backend Verification
 ↓
Activate Subscription
 ↓
Record Transaction
```

Pro memberikan:

* kuota AI lebih tinggi;
* fitur premium;
* harga komunitas lebih rendah;
* kemampuan membuat komunitas.

---

## 13.2 Community Registration

Pengguna dapat membayar untuk bergabung ke komunitas tertentu.

Alur:

```text
User
 ↓
Register Community
 ↓
Payment Gateway
 ↓
Payment
 ↓
Webhook
 ↓
Backend Verification
 ↓
Activate Membership
 ↓
Record Transaction
```

---

## 13.3 Community Revenue

Pembayaran komunitas dapat dibagi menjadi:

```text
Gross Payment
      │
      ├──────────────→ Platform Commission
      │
      └──────────────→ Community Owner Amount
```

Persentase komisi belum ditentukan.

Mekanisme payout kepada community owner juga masih perlu ditentukan.

---

# 14. Payment Security

Membership atau subscription tidak boleh hanya diaktifkan berdasarkan redirect dari halaman pembayaran.

Alur yang direkomendasikan:

```text
Payment Gateway
      ↓
Webhook
      ↓
Laravel
      ↓
Verify Payment
      ↓
Update Transaction
      ↓
Activate Subscription / Membership
```

Data transaksi yang disimpan dapat mencakup:

* user;
* community;
* gross amount;
* platform commission;
* owner amount;
* payment reference;
* payment status;
* timestamp.

---

# 15. System Architecture

Arsitektur utama menggunakan pendekatan **Modular Monolith**.

```text
                         USER
                           │
                           ↓
                  ┌─────────────────┐
                  │ Frontend        │
                  │ React/Vite      │
                  │ atau Vue/Vite   │
                  └────────┬────────┘
                           │
                        REST API
                           │
                           ↓
                  ┌─────────────────┐
                  │ Laravel Backend │
                  └────────┬────────┘
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ↓                   ↓                    ↓
  PostgreSQL         Object Storage         External
                                            Services
                                                │
                            ┌───────────────────┼──────────────┐
                            ↓                   ↓              ↓
                       OpenRouter          Payment         Reverb
                            ↓               Gateway        /WebSocket
                           LLM
```

---

# 16. Modular Monolith

Laravel menjadi satu aplikasi utama, tetapi terdiri dari modul yang memiliki tanggung jawab berbeda.

```text
Laravel Application
│
├── Authentication
├── User & Subscription
├── Material Management
├── AI Learning Path
├── Quiz
├── Token & AI Usage
├── Community
├── Gamification
├── Payment & Transaction
└── Admin
```

Pendekatan ini dipilih karena Re:Learn merupakan proyek yang masih berada pada tahap MVP dan belum membutuhkan kompleksitas microservices.

Microservices dapat dipertimbangkan pada tahap pengembangan selanjutnya jika terdapat kebutuhan skalabilitas yang nyata.

---

# 17. Material Processing Architecture

Pipeline pemrosesan material:

```text
Upload
  ↓
File Validation
  ↓
Object Storage
  ↓
Text Extraction
  ↓
Preprocessing
  ↓
Chunking (jika diperlukan)
  ↓
AI Service
  ↓
OpenRouter
  ↓
LLM
  ↓
Structured Output
  ↓
Validation
  ↓
Learning Path / Quiz
  ↓
Database
```

Pemrosesan material dan AI dapat menggunakan background job agar request utama tidak harus menunggu proses yang panjang.

---

# 18. File Storage

File PDF/DOCX/PPTX tidak disarankan disimpan sebagai BLOB langsung di PostgreSQL.

Pembagian:

```text
PostgreSQL
├── file metadata
├── user_id
├── file_name
├── file_type
├── file_size
├── storage_path
├── processing_status
└── timestamps

Object Storage
├── PDF
├── DOCX
└── PPTX
```

Storage yang dapat digunakan:

* AWS S3;
* Cloudflare R2;
* MinIO untuk development;
* S3-compatible provider lainnya.

Provider final belum ditentukan.

---

# 19. Database Planning

Database yang direkomendasikan:

**PostgreSQL**

Alasan:

* cocok untuk data relasional;
* mendukung struktur data kompleks;
* memiliki JSONB untuk data semi-terstruktur jika diperlukan;
* kompatibel dengan Laravel;
* dapat digunakan untuk kebutuhan analitik dan pengembangan lanjutan.

MySQL tetap merupakan alternatif yang valid jika kebutuhan deployment atau tim lebih sesuai dengannya.

---

# 20. Core Data Entities

Entity utama yang diperkirakan diperlukan:

```text
users
subscriptions
materials

learning_paths
learning_topics

quizzes
questions
quiz_attempts
quiz_answers

communities
community_members
community_channels
community_posts
community_resources

quiz_sessions
quiz_session_members
quiz_session_answers

ai_usage
token_transactions

transactions

badges
user_badges
achievements
```

Daftar ini masih dapat berubah selama desain database dan implementasi.

---

# 21. Core Learning Data Relationship

Secara konseptual:

```text
USER
 │
 ↓
MATERIAL
 │
 ↓
LEARNING PATH
 │
 ├── TOPIC
 │     └── SUBTOPIC
 │
 ↓
QUIZ
 │
 ↓
QUIZ ATTEMPT
 │
 ↓
QUIZ ANSWERS
 │
 ↓
SCORE / PERFORMANCE
```

---

# 22. External Integration

## OpenRouter

Digunakan sebagai AI gateway.

```text
Laravel
   ↓
AI Service
   ↓
OpenRouter
   ↓
Selected LLM
```

Model yang digunakan belum ditentukan.

---

## Payment Gateway

Kandidat:

**Midtrans**

Fungsi:

* pembayaran Pro;
* pembayaran community registration;
* payment notification/webhook;
* payment status.

Provider final masih dapat berubah.

---

## Real-time Service

Rancangan:

**Laravel Reverb / WebSocket**

Digunakan untuk:

* collaborative quiz;
* real-time score;
* quiz session events;
* future real-time community features.

---

# 23. Frontend Architecture

Frontend bertanggung jawab terhadap:

* user interface;
* dashboard;
* material management;
* learning path display;
* quiz interface;
* quiz result;
* community interface;
* subscription;
* payment status;
* profile;
* leaderboard.

Pilihan teknologi:

```text
React + Vite
atau
Vue + Vite
```

Pilihan final belum ditentukan.

Frontend berkomunikasi dengan Laravel melalui REST API.

---

# 24. Backend Responsibilities

Laravel bertanggung jawab terhadap:

* authentication;
* authorization;
* business logic;
* material management;
* AI integration;
* learning path;
* quiz;
* scoring;
* community;
* gamification;
* token management;
* subscription;
* payment;
* transaction;
* API;
* real-time event broadcasting.

---

# 25. Authentication & Authorization

Authentication dapat menggunakan:

**Laravel Sanctum**

Authorization perlu membedakan:

```text
Free User
Pro User
Community Owner
Admin
```

Selain role, sistem juga perlu memeriksa ownership dan membership.

Contoh:

```text
User
 ↓
Request Resource
 ↓
Check Authentication
 ↓
Check Community Membership / Visibility
 ↓
Allow / Deny
```

---

# 26. Security Requirements

Aspek keamanan utama:

### Authentication

* secure login;
* session/token management;
* password protection.

### Authorization

* role-based access;
* community ownership;
* resource access control.

### File Security

* validasi extension;
* validasi MIME type;
* batas ukuran file;
* secure storage;
* akses file berdasarkan authorization.

### API Security

* authentication;
* authorization;
* validation;
* rate limiting.

### AI Security

* quota enforcement;
* abuse prevention;
* input validation;
* API key protection;
* usage monitoring.

### Payment Security

* webhook verification;
* payment status verification;
* transaction integrity.

### Application Security

* SQL injection prevention;
* XSS prevention;
* CSRF protection sesuai arsitektur;
* secure error handling;
* protection terhadap unauthorized access.

---

# 27. Non-Functional Requirements

## Performance

Sistem harus memberikan respons yang wajar untuk operasi biasa dan tidak memblokir request utama pada proses AI/file processing yang membutuhkan waktu lama.

---

## Scalability

Arsitektur harus memungkinkan komponen tertentu dikembangkan secara independen pada tahap berikutnya.

Contohnya:

```text
Laravel Monolith
       ↓
High AI Usage
       ↓
AI Processing Worker
       ↓
Separate AI Service
```

Tidak perlu langsung menggunakan microservices pada MVP.

---

## Reliability

Sistem perlu menangani:

* AI request failure;
* payment failure;
* file processing failure;
* incomplete transaction;
* real-time connection failure.

Status proses sebaiknya dapat diketahui oleh sistem.

Contoh:

```text
uploaded
   ↓
processing
   ↓
completed

atau

processing
   ↓
failed
```

---

## Maintainability

Kode dibagi berdasarkan domain/module sehingga perubahan pada satu fitur tidak terlalu memengaruhi fitur lainnya.

---

## Observability

Sistem sebaiknya mencatat:

* application error;
* AI usage;
* payment status;
* processing status;
* important system events.

---

# 28. Background Processing

Proses yang berpotensi membutuhkan waktu lama dapat dipindahkan ke background job.

Contoh:

```text
Upload Material
      ↓
Create Processing Job
      ↓
Queue
      ↓
Worker
      ↓
Text Extraction
      ↓
AI Processing
      ↓
Save Result
```

Candidate background jobs:

* document extraction;
* AI learning path generation;
* AI quiz generation;
* large file processing;
* notification;
* beberapa proses payment handling.

---

# 29. Core User Flow

## Learning Flow

```text
User
 ↓
Upload Material
 ↓
File Validation
 ↓
Processing
 ↓
AI Learning Path
 ↓
Learning Path Saved
 ↓
User Studies
 ↓
Generate / Open Quiz
 ↓
Answer Quiz
 ↓
Score
 ↓
Review Performance
```

---

# 30. Community Flow

```text
Pro User
 ↓
Create Community
 ↓
Configure Visibility
 ↓
Community Created
 ↓
Users Join
 ↓
Discussion / Resource Sharing
 ↓
Collaborative Quiz
 ↓
Real-time Results
```

---

# 31. Subscription Flow

```text
User
 ↓
Select Pro
 ↓
Payment
 ↓
Payment Gateway
 ↓
Webhook
 ↓
Backend Verification
 ↓
Subscription Activated
 ↓
Pro Features Available
```

---

# 32. AI Usage Flow

```text
User
 ↓
Request AI Feature
 ↓
Check Authentication
 ↓
Check AI Quota
 ↓
AI Service
 ↓
OpenRouter
 ↓
LLM
 ↓
Response
 ↓
Record Usage
 ↓
Return Result
```

---

# 33. High-Level System Diagram

Diagram yang digunakan untuk menjelaskan sistem secara sederhana:

```text
                         USER
                           │
                           ↓
                    ┌─────────────┐
                    │  FRONTEND   │
                    │ React/Vite  │
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │   LARAVEL   │
                    │   BACKEND   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
     PostgreSQL       AI Service       Object Storage
                           │
                           ↓
                      OpenRouter
                           │
                           ↓
                          LLM

          Laravel
             │
       ┌─────┴─────┐
       ↓           ↓
   Payment       Reverb
   Gateway      WebSocket
```

---

# 34. Core System Components

| Komponen        | Tanggung Jawab                   |
| --------------- | -------------------------------- |
| Frontend        | Interface dan interaksi pengguna |
| Laravel Backend | Business logic dan API           |
| PostgreSQL      | Penyimpanan data terstruktur     |
| Object Storage  | Penyimpanan file material        |
| AI Service      | Abstraksi integrasi AI           |
| OpenRouter      | AI model gateway                 |
| LLM             | Pemrosesan dan generasi AI       |
| Payment Gateway | Pemrosesan pembayaran            |
| Laravel Reverb  | Real-time communication          |
| Queue/Worker    | Background processing            |

---

# 35. MVP Scope

## Included

### Learning

* [x] Authentication
* [x] Free/Pro account
* [x] PDF upload
* [x] DOCX upload
* [x] PPTX upload
* [x] Text extraction
* [x] AI Learning Path
* [x] Learning Path persistence
* [x] AI Quiz Generation
* [x] Quiz Attempt
* [x] Quiz Score
* [x] AI Usage Tracking

### Community

* [x] Community creation
* [x] Community membership
* [x] Community discussion
* [x] Resource sharing
* [x] Visibility control
* [x] Collaborative Quiz
* [x] Real-time quiz

### Gamification

* [x] Basic Badge
* [x] Achievement
* [x] Reward Token
* [x] Basic Leaderboard

### Monetization

* [x] Pro Subscription
* [x] Community Registration
* [x] Payment Gateway
* [x] Platform Commission
* [x] Community Owner Revenue

---

# 36. Potential Future Scope

Fitur berikut belum menjadi bagian utama MVP:

* YouTube material processing;
* advanced mastery estimation;
* sophisticated recommendation engine;
* advanced AI tutoring/chat;
* mobile application;
* advanced analytics;
* advanced AI moderation;
* microservices architecture;
* large-scale recommendation system.

---

# 37. Open Decisions

Hal yang masih harus diputuskan sebelum implementasi final:

| Keputusan                        | Status            |
| -------------------------------- | ----------------- |
| React atau Vue                   | Belum final       |
| LLM yang digunakan               | Belum final       |
| AI model selection strategy      | Belum final       |
| AI quota Free                    | Belum final       |
| AI quota Pro                     | Belum final       |
| Object storage provider          | Belum final       |
| Payment gateway                  | Midtrans kandidat |
| Platform commission percentage   | Belum final       |
| Community owner payout mechanism | Belum final       |
| Detail Pro features              | Belum final       |
| Gamification rules               | Belum final       |
| Badge/achievement criteria       | Belum final       |
| Leaderboard calculation          | Belum final       |
| File size limit                  | Belum final       |
| Exact chunking strategy          | Belum final       |
| Queue infrastructure             | Belum final       |

---

# 38. Architecture Decisions

## Decision 1 — Modular Monolith

**Dipilih sebagai pendekatan MVP.**

Alasan:

* lebih sederhana untuk dikembangkan;
* deployment lebih mudah;
* debugging lebih mudah;
* cocok untuk ukuran tim/proyek mahasiswa;
* tetap memungkinkan pemisahan module secara logis.

---

## Decision 2 — Laravel sebagai Backend

Laravel menjadi pusat:

```text
Business Logic
API
Authentication
Database Access
AI Integration
Payment
Community
Real-time Events
```

---

## Decision 3 — AI melalui Service Layer

Fitur aplikasi tidak langsung bergantung pada provider AI.

```text
Feature
 ↓
AI Service
 ↓
OpenRouter
 ↓
LLM
```

---

## Decision 4 — Object Storage untuk File

File besar tidak disimpan sebagai database BLOB.

```text
Database → Metadata
Storage → Actual File
```

---

## Decision 5 — Asynchronous Processing

Proses berat seperti ekstraksi dokumen dan AI generation dapat menggunakan background job.

---

# 39. Traceability: Problem → Feature → Technology

| Problem                                     | Feature                           | Teknologi                  |
| ------------------------------------------- | --------------------------------- | -------------------------- |
| Sulit memahami materi                       | AI Learning Path                  | Laravel + OpenRouter + LLM |
| Materi tidak terstruktur                    | Learning Path                     | AI + PostgreSQL            |
| Mudah lupa                                  | Continuous Learning               | PostgreSQL                 |
| Sulit mengevaluasi pemahaman                | AI Quiz + Quiz Score              | Laravel + LLM              |
| Pembelajaran kurang interaktif              | Community                         | Laravel + Frontend         |
| Kurang motivasi                             | Badge / Achievement / Leaderboard | Laravel + PostgreSQL       |
| Membutuhkan layanan premium                 | Pro Subscription                  | Payment Gateway            |
| Komunitas berbayar                          | Community Registration            | Payment Gateway            |
| Quiz bersama membutuhkan interaksi langsung | Collaborative Quiz                | Laravel Reverb/WebSocket   |

---

# 40. Product Construction Hierarchy

Konstruksi produk Re:Learn dapat dijelaskan dalam lima tingkat:

```text
LEVEL 1 — PRODUCT
Problem
   ↓
Solution
   ↓
Features
   ↓
Scope

LEVEL 2 — SYSTEM
User
   ↓
Frontend
   ↓
Backend
   ↓
External Services

LEVEL 3 — MODULE
Auth
Material
AI
Quiz
Community
Payment
Gamification

LEVEL 4 — PROCESS
Upload
   ↓
Processing
   ↓
AI
   ↓
Learning Path
   ↓
Quiz
   ↓
Result

LEVEL 5 — INFRASTRUCTURE
PostgreSQL
Object Storage
OpenRouter
Payment Gateway
Reverb
Queue/Worker
```

---

# 41. Recommended Canva Construction

Untuk dokumentasi konstruksi produk, diagram tidak perlu dibuat menjadi satu diagram raksasa.

Gunakan beberapa diagram dengan tingkat abstraksi berbeda:

### Diagram 1 — Product Overview

```text
Problem → Re:Learn → Solution → Users
```

### Diagram 2 — Scope

```text
Learning
Community
Gamification
Monetization
```

### Diagram 3 — High-Level Architecture

```text
User
 ↓
Frontend
 ↓
Laravel
 ↓
Database / Storage / External Services
```

### Diagram 4 — AI Architecture

```text
Material
 ↓
Extraction
 ↓
AI Service
 ↓
OpenRouter
 ↓
LLM
 ↓
Learning Path / Quiz
```

### Diagram 5 — Community Architecture

```text
Community
 ↓
Discussion
Resource
Collaborative Quiz
 ↓
Real-time
```

### Diagram 6 — Payment Architecture

```text
User
 ↓
Re:Learn
 ↓
Payment Gateway
 ↓
Webhook
 ↓
Transaction
 ↓
Subscription / Membership
```

### Diagram 7 — Core Learning Flow

```text
Material
 ↓
Learning Path
 ↓
Study
 ↓
Quiz
 ↓
Score
 ↓
Learning Performance
```

---

# 42. Overall Product Blueprint

Secara keseluruhan, Re:Learn dapat diringkas menjadi:

```text
                             RE:LEARN
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ↓                  ↓                  ↓
         LEARNING           COMMUNITY         MONETIZATION
             │                  │                  │
      ┌──────┼──────┐      ┌────┼────┐       ┌────┴────┐
      ↓      ↓      ↓      ↓    ↓    ↓       ↓         ↓
   Material  AI    Quiz   Share Discuss Co-   Pro      Payment
            Path                Resource Quiz  │
                                                │
                                                ↓
                                          Subscription
                                                │
                                                ↓
                                        Community Pricing
```

Infrastructure:

```text
                         RE:LEARN
                             │
                      Laravel Backend
                             │
        ┌────────────┬───────┼────────┬────────────┐
        ↓            ↓       ↓        ↓            ↓
   PostgreSQL   Object    OpenRouter Payment    Reverb
                Storage       │       Gateway      │
                              ↓                    ↓
                             LLM              Real-time
```

Core learning loop:

```text
       ┌───────────────────────────────┐
       │                               ↓
Material → Learning Path → Learning → Quiz
                                      │
                                      ↓
                                    Score
                                      │
                                      ↓
                              Review / Relearn
                                      │
                                      └────────→ Learning
```

---

# 43. Prinsip Utama Perancangan

Re:Learn dirancang dengan prinsip:

1. **AI sebagai core feature**, bukan sekadar tambahan.
2. **Backend terpusat melalui Laravel**.
3. **AI provider diabstraksikan melalui AI Service Layer**.
4. **File dan database dipisahkan**.
5. **Modular monolith untuk MVP**.
6. **Proses AI/file yang berat dapat dilakukan secara asynchronous**.
7. **Payment diverifikasi melalui backend/webhook**.
8. **Community memiliki access control berdasarkan membership dan visibility**.
9. **Real-time hanya digunakan pada fitur yang memang membutuhkan komunikasi langsung**, terutama collaborative quiz.
10. **Arsitektur dibuat sederhana dan dapat dikembangkan**, bukan langsung menggunakan kompleksitas enterprise.
11. **Fitur MVP diprioritaskan pada alur inti:**

```text
Material
   ↓
AI
   ↓
Learning Path
   ↓
Quiz
   ↓
Learning Performance
```

Community, gamification, dan monetization berfungsi sebagai ecosystem pendukung di sekitar core learning experience.
