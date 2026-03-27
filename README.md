# DMVPrep Pro 🚗

> Production-ready SaaS for DMV knowledge test preparation — built with Next.js 14, PostgreSQL, Prisma, Stripe, and Tailwind CSS.

## What's Included

| Feature | Status |
|--------|--------|
| Landing page with hero, features, testimonials | ✅ |
| All 50 states listing | ✅ |
| SEO pages for each state (6 types × 50 states = 300 pages) | ✅ |
| Interactive practice test (Quick / Signs / Full Exam) | ✅ |
| User authentication (email/password) | ✅ |
| User dashboard with readiness score | ✅ |
| Freemium model (Free vs $9/mo Premium) | ✅ |
| Stripe checkout + billing portal + webhooks | ✅ |
| Admin dashboard | ✅ |
| CSV bulk question import | ✅ |
| Auto-generated sitemap.xml (300+ pages) | ✅ |
| robots.txt | ✅ |
| Vercel-ready deployment config | ✅ |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4 (credentials)
- **Payments**: Stripe (subscriptions + webhooks)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd dmv-prep
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string (Vercel Postgres, Supabase, or Neon)
- `NEXTAUTH_SECRET` — Random 32+ character string
- `NEXTAUTH_URL` — Your production URL (or `http://localhost:3000` for dev)
- `STRIPE_SECRET_KEY` — From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` — From Stripe CLI or dashboard
- `STRIPE_PREMIUM_PRICE_ID` — The price ID for your $9/month product

### 3. Database Setup

```bash
npx prisma db push        # Create tables
npx tsx prisma/seed.ts    # Seed with sample data + admin user
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Stripe Setup

1. Create a product in Stripe: "DMVPrep Pro Premium" — $9/month recurring
2. Copy the Price ID → `STRIPE_PREMIUM_PRICE_ID`
3. Set up webhook at `https://yourdomain.com/api/webhooks/stripe`

Webhook events needed:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Deploying to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables
4. Add Vercel Postgres (or connect external DB)
5. Set build command: `prisma generate && next build`

---

## Admin Access

After seeding:
- Email: `admin@dmvprep.pro`
- Password: `admin123`

Change this immediately in production!

---

## Adding Questions

### Via CSV Upload (Admin Panel)
1. Log in as admin → `/admin/upload`
2. Upload CSV with format:
```
state,topic,question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,difficulty
```

See `sample-questions.csv` for examples.

### Via Database Seed
Edit `src/data/questions.ts` and re-run `npx tsx prisma/seed.ts`

---

## SEO Architecture

300 static pages auto-generated:
- `/state/[state]/dmv-practice-test`
- `/state/[state]/road-sign-practice-test`
- `/state/[state]/permit-test-questions`
- `/state/[state]/dmv-handbook-summary`
- `/state/[state]/dmv-test-in-english`
- `/state/[state]/dmv-test-tips`

Each page has:
- Unique title/meta optimized per state
- Structured JSON metadata
- 5 sample questions with interactive answers
- CTA to register / start full test
- Auto-included in sitemap.xml

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register pages
│   ├── admin/            # Admin dashboard + upload
│   ├── api/              # API routes
│   ├── dashboard/        # User dashboard
│   ├── practice/         # Interactive test page
│   ├── state/[state]/    # SEO state pages
│   ├── pricing/          # Pricing page
│   └── states/           # All states listing
├── components/
│   ├── layout/           # Header, Footer, Providers
│   └── test/             # QuestionPreview
├── data/
│   ├── states.ts         # All 50 states data
│   └── questions.ts      # Sample questions
└── lib/
    ├── auth.ts           # NextAuth config
    ├── prisma.ts         # DB client
    ├── stripe.ts         # Stripe config
    └── utils.ts          # Helpers
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Seed script
```

---

## License

MIT — build something great!
