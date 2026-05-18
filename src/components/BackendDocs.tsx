import { useState } from 'react';
import {
  Database, Server, Shield, CreditCard, Code2, Copy, Check,
  FolderOpen, FileCode, Terminal, Zap, Globe, Lock, Package,
  ChevronRight, ChevronDown,
  AlertCircle, CheckCircle, ArrowRight, X
} from 'lucide-react';

// ─── Copy Button Component ────────────────────────────────────────────────────
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{ background: copied ? '#22c55e20' : '#ffffff15', color: copied ? '#22c55e' : '#94a3b8' }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

// ─── Code Block Component ─────────────────────────────────────────────────────
const CodeBlock = ({ code, title }: { code: string; lang?: string; title?: string }) => (
  <div className="rounded-xl overflow-hidden border border-white/10 my-4">
    {title && (
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#1e293b' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">{title}</span>
        </div>
        <CopyButton text={code} />
      </div>
    )}
    <div className="relative" style={{ background: '#0f172a' }}>
      {!title && (
        <div className="absolute top-3 right-3">
          <CopyButton text={code} />
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-300 font-mono">{code}</code>
      </pre>
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, color }: any) => (
  <div className="flex items-start gap-4 mb-8">
    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}20` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-slate-400 text-sm leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

// ─── Tech Badge ───────────────────────────────────────────────────────────────
const TechBadge = ({ name, color, desc }: { name: string; color: string; desc: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background: '#1e293b' }}>
    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
    <div>
      <div className="text-sm font-semibold text-white">{name}</div>
      <div className="text-xs text-slate-400">{desc}</div>
    </div>
  </div>
);

// ─── File Tree Component ──────────────────────────────────────────────────────
const FileTree = () => {
  const [expanded, setExpanded] = useState<string[]>(['backend', 'src', 'prisma', 'routes', 'middleware', 'services', 'frontend', 'frontend-src']);
  const toggle = (key: string) => setExpanded(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);
  const Folder = ({ label, id, children }: any) => (
    <div>
      <div className="flex items-center gap-1.5 py-0.5 cursor-pointer text-yellow-400 hover:text-yellow-300" onClick={() => toggle(id)}>
        {expanded.includes(id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <FolderOpen size={14} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {expanded.includes(id) && <div className="ml-5 border-l border-white/10 pl-3">{children}</div>}
    </div>
  );
  const File = ({ name, color = '#94a3b8', badge }: { name: string; color?: string; badge?: string }) => (
    <div className="flex items-center gap-1.5 py-0.5">
      <FileCode size={13} style={{ color }} />
      <span className="text-sm" style={{ color }}>{name}</span>
      {badge && <span className="text-xs px-1.5 py-0.5 rounded text-white font-bold" style={{ background: '#f97316' }}>{badge}</span>}
    </div>
  );
  return (
    <div className="p-5 rounded-xl font-mono" style={{ background: '#0f172a', border: '1px solid #ffffff15' }}>
      <Folder label="desirent-backend/" id="backend">
        <Folder label="src/" id="src">
          <Folder label="routes/" id="routes">
            <File name="auth.routes.ts" color="#60a5fa" badge="AUTH" />
            <File name="booking.routes.ts" color="#34d399" badge="BOOK" />
            <File name="cars.routes.ts" color="#a78bfa" />
            <File name="payment.routes.ts" color="#fb923c" badge="PAY" />
            <File name="admin.routes.ts" color="#f87171" badge="ADMIN" />
            <File name="user.routes.ts" color="#facc15" />
          </Folder>
          <Folder label="middleware/" id="middleware">
            <File name="auth.middleware.ts" color="#60a5fa" />
            <File name="admin.middleware.ts" color="#f87171" />
            <File name="rateLimiter.ts" color="#94a3b8" />
            <File name="validate.ts" color="#94a3b8" />
          </Folder>
          <Folder label="services/" id="services">
            <File name="auth.service.ts" color="#60a5fa" />
            <File name="booking.service.ts" color="#34d399" />
            <File name="payment.service.ts" color="#fb923c" />
            <File name="email.service.ts" color="#c084fc" />
            <File name="sms.service.ts" color="#22d3ee" />
          </Folder>
          <File name="app.ts" color="#f8fafc" />
          <File name="server.ts" color="#f8fafc" />
        </Folder>
        <Folder label="prisma/" id="prisma">
          <File name="schema.prisma" color="#34d399" badge="DB" />
          <File name="seed.ts" color="#94a3b8" />
        </Folder>
        <File name=".env" color="#fbbf24" />
        <File name=".env.example" color="#94a3b8" />
        <File name="package.json" color="#94a3b8" />
        <File name="tsconfig.json" color="#94a3b8" />
        <File name="Dockerfile" color="#22d3ee" />
        <File name="docker-compose.yml" color="#22d3ee" />
      </Folder>
      <Folder label="desirent-frontend/ (React + Vite)" id="frontend">
        <Folder label="src/" id="frontend-src">
          <File name="App.tsx" color="#60a5fa" />
          <File name="main.tsx" color="#60a5fa" />
          <File name="api.ts" color="#34d399" badge="API" />
          <File name="context/AuthContext.tsx" color="#a78bfa" />
          <File name="db/database.ts" color="#fb923c" />
        </Folder>
        <File name=".env.local" color="#fbbf24" />
      </Folder>
    </div>
  );
};

// ─── API Route Card ───────────────────────────────────────────────────────────
const RouteCard = ({ method, path, desc, auth }: { method: string; path: string; desc: string; auth?: boolean }) => {
  const colors: any = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444', PATCH: '#8b5cf6' };
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all" style={{ background: '#1e293b' }}>
      <span className="text-xs font-black px-2.5 py-1 rounded-lg min-w-[56px] text-center" style={{ background: `${colors[method]}20`, color: colors[method] }}>{method}</span>
      <span className="text-sm font-mono text-slate-200 flex-1">{path}</span>
      <span className="text-xs text-slate-400 hidden md:block">{desc}</span>
      {auth && <Lock size={12} className="text-yellow-400 flex-shrink-0" aria-label="Requires Auth" />}
    </div>
  );
};

// ─── Step Card ────────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, code, lang }: any) => (
  <div className="relative pl-12 pb-8">
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>{num}</div>
    <div className="absolute left-4 top-8 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #f97316, transparent)' }} />
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-slate-400 text-sm mb-3">{desc}</p>
    {code && <CodeBlock code={code} lang={lang} />}
  </div>
);

// ─── Main BackendDocs Component ───────────────────────────────────────────────
const BackendDocs = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'setup', label: 'Setup', icon: Terminal },
    { id: 'schema', label: 'DB Schema', icon: Database },
    { id: 'auth', label: 'Auth API', icon: Shield },
    { id: 'booking', label: 'Booking API', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'frontend', label: 'Frontend API', icon: Code2 },
    { id: 'deploy', label: 'Deploy', icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" style={{ background: '#020617' }}>
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-10 border-b border-white/10" style={{ background: '#0f172a' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
              <Server size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">DesiRent Backend</h1>
              <p className="text-xs text-slate-400">Full-Stack Starter Kit — Node.js + Prisma + PostgreSQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all"
              style={{
                borderColor: activeTab === tab.id ? '#f97316' : 'transparent',
                color: activeTab === tab.id ? '#f97316' : '#94a3b8'
              }}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ══════════ OVERVIEW ══════════ */}
        {activeTab === 'overview' && (
          <div>
            <SectionHeader icon={Globe} title="DesiRent Full-Stack Architecture" color="#f97316"
              subtitle="Production-ready backend using Node.js, Express, Prisma ORM, PostgreSQL, JWT Auth, Razorpay Payments & Twilio SMS." />

            {/* Architecture Diagram */}
            <div className="rounded-2xl p-6 mb-8 border border-white/10" style={{ background: '#0f172a' }}>
              <h3 className="text-sm font-bold text-slate-300 mb-5 uppercase tracking-wider">System Architecture</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 text-center text-xs">
                {[
                  { label: 'React\nFrontend', color: '#60a5fa', icon: '⚛️' },
                  { label: '→', color: '#475569', icon: '' },
                  { label: 'Express\nAPI Server', color: '#34d399', icon: '🚀' },
                  { label: '→', color: '#475569', icon: '' },
                  { label: 'Prisma\nORM', color: '#a78bfa', icon: '🔷' },
                  { label: '→', color: '#475569', icon: '' },
                  { label: 'PostgreSQL\nDatabase', color: '#fb923c', icon: '🐘' },
                ].map((item, i) => item.label === '→' ? (
                  <ArrowRight key={i} size={20} className="text-slate-600" />
                ) : (
                  <div key={i} className="p-4 rounded-xl border border-white/10 min-w-[90px]" style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}>
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-bold whitespace-pre-line leading-tight" style={{ color: item.color }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'JWT Auth', color: '#60a5fa', desc: 'Access + Refresh Tokens' },
                  { name: 'Razorpay', color: '#fb923c', desc: 'UPI + Card + NetBanking' },
                  { name: 'Twilio SMS', color: '#34d399', desc: 'OTP + Booking Alerts' },
                  { name: 'Nodemailer', color: '#a78bfa', desc: 'Email Confirmations' },
                ].map(t => <TechBadge key={t.name} {...t} />)}
              </div>
            </div>

            {/* Tech Stack */}
            <h3 className="text-lg font-bold text-white mb-4">Complete Tech Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {[
                { name: 'Node.js 20 LTS + Express 5', color: '#84cc16', desc: 'Backend runtime & HTTP framework' },
                { name: 'TypeScript 5', color: '#60a5fa', desc: 'Full type safety across the stack' },
                { name: 'Prisma ORM 5', color: '#a78bfa', desc: 'Type-safe database access & migrations' },
                { name: 'PostgreSQL 16', color: '#38bdf8', desc: 'Primary relational database' },
                { name: 'Redis 7', color: '#f87171', desc: 'Session store & rate limiting cache' },
                { name: 'JWT + bcryptjs', color: '#facc15', desc: 'Authentication & password hashing' },
                { name: 'Razorpay SDK', color: '#fb923c', desc: 'Indian payment gateway (UPI/Card)' },
                { name: 'Twilio + Nodemailer', color: '#34d399', desc: 'SMS OTP & email notifications' },
                { name: 'Zod', color: '#e879f9', desc: 'Schema validation for all API inputs' },
                { name: 'Docker + docker-compose', color: '#22d3ee', desc: 'Containerized dev & production' },
                { name: 'Railway / Render', color: '#94a3b8', desc: 'Free cloud deployment options' },
                { name: 'React 19 + Vite 6', color: '#60a5fa', desc: 'Frontend framework (current)' },
              ].map(t => <TechBadge key={t.name} {...t} />)}
            </div>

            {/* Folder Structure */}
            <h3 className="text-lg font-bold text-white mb-4">📁 Folder Structure</h3>
            <FileTree />
          </div>
        )}

        {/* ══════════ SETUP ══════════ */}
        {activeTab === 'setup' && (
          <div>
            <SectionHeader icon={Terminal} title="Project Setup" color="#22c55e"
              subtitle="Get the complete DesiRent backend running locally in under 10 minutes." />

            <StepCard num="1" title="Clone & Install Dependencies"
              desc="Create the backend project and install all required packages."
              code={`# Create backend directory
mkdir desirent-backend && cd desirent-backend
npm init -y

# Install production dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken \
  @prisma/client razorpay twilio nodemailer zod express-rate-limit \
  express-validator cookie-parser uuid

# Install dev dependencies
npm install -D typescript ts-node-dev prisma \
  @types/express @types/node @types/bcryptjs \
  @types/jsonwebtoken @types/nodemailer @types/cors \
  @types/cookie-parser @types/uuid`} lang="bash" />

            <StepCard num="2" title="TypeScript Configuration"
              desc="Create tsconfig.json for the backend."
              code={`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`} lang="json" />

            <StepCard num="3" title="Environment Variables"
              desc="Create .env file with all required secrets."
              code={`# ── Server ──────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ── Database ─────────────────────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/desirent_db"
REDIS_URL="redis://localhost:6379"

# ── JWT Secrets ──────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_here
JWT_REFRESH_SECRET=your_refresh_secret_key_also_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Razorpay (Indian Payments) ────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# ── Twilio (SMS OTP) ─────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ── Email (SMTP / Gmail) ─────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@desirent.in
SMTP_PASS=your_gmail_app_password
EMAIL_FROM="DesiRent Support <support@desirent.in>"

# ── Admin ────────────────────────────────────
ADMIN_EMAIL=admin@desirent.in
ADMIN_PASSWORD=Admin@DesiRent2024`} lang="bash" />

            <StepCard num="4" title="Initialize Prisma & Database"
              desc="Set up Prisma ORM and run the first migration."
              code={`# Initialize Prisma
npx prisma init

# After editing schema.prisma (see DB Schema tab), run:
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed

# Open Prisma Studio (visual DB editor)
npx prisma studio`} lang="bash" />

            <StepCard num="5" title="Add Scripts to package.json"
              desc="Configure npm scripts for development and production."
              code={`{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts",
    "db:reset": "prisma migrate reset"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}`} lang="json" />

            <StepCard num="6" title="Start Development Server"
              desc="Run Docker for PostgreSQL + Redis, then start the API server."
              code={`# Start PostgreSQL + Redis with Docker
docker-compose up -d

# Or if you have PostgreSQL installed locally:
createdb desirent_db

# Start the dev server (auto-restarts on changes)
npm run dev

# ✅ API running at: http://localhost:5000
# ✅ Prisma Studio:  http://localhost:5555
# ✅ Health check:   http://localhost:5000/api/health`} lang="bash" />

            <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-semibold text-sm mb-1">Docker Compose File</p>
                  <p className="text-yellow-200/70 text-xs">Create docker-compose.yml in root directory:</p>
                </div>
              </div>
            </div>

            <CodeBlock title="docker-compose.yml" code={`version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: desirent_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`} lang="yaml" />
          </div>
        )}

        {/* ══════════ DB SCHEMA ══════════ */}
        {activeTab === 'schema' && (
          <div>
            <SectionHeader icon={Database} title="Prisma Database Schema" color="#a78bfa"
              subtitle="Complete PostgreSQL schema with 8 models covering users, cars, bookings, payments, reviews, and notifications." />

            <CodeBlock title="prisma/schema.prisma" code={`generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ──────────────────────────────────────────────────────
enum Role {
  USER
  ADMIN
  DRIVER
}

enum BookingStatus {
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  UPI
  CARD
  NETBANKING
  CASH
  WALLET
}

enum FuelType {
  PETROL
  DIESEL
  CNG
  ELECTRIC
  HYBRID
}

enum TransmissionType {
  MANUAL
  AUTOMATIC
  AMT
  DCT
  CVT
}

enum CarSegment {
  STANDARD
  LUXURY
  PREMIUM
}

// ─── USER MODEL ─────────────────────────────────────────────────
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String    @unique
  password      String
  role          Role      @default(USER)
  avatar        String?
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  licenseNumber String?
  aadhaarLast4  String?
  address       String?
  city          String?
  state         String?
  pincode       String?
  totalBookings Int       @default(0)
  totalSpent    Float     @default(0)
  loyaltyPoints Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  bookings      Booking[]
  reviews       Review[]
  notifications Notification[]
  otpCodes      OtpCode[]
  refreshTokens RefreshToken[]

  @@map("users")
}

// ─── CAR MODEL ──────────────────────────────────────────────────
model Car {
  id           String           @id @default(uuid())
  name         String
  brand        String
  model        String
  year         Int
  category     String
  segment      CarSegment       @default(STANDARD)
  color        String
  plateNumber  String           @unique
  pricePerDay  Float
  pricePerKm   Float            @default(12)
  seats        Int
  transmission TransmissionType
  fuel         FuelType
  mileage      String
  hasAC        Boolean          @default(true)
  image        String
  images       String[]
  features     String[]
  description  String?
  rating       Float            @default(0)
  totalReviews Int              @default(0)
  totalKms     Int              @default(0)
  isAvailable  Boolean          @default(true)
  isActive     Boolean          @default(true)
  location     String           @default("Sector 37, Noida")
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  // Relations
  bookings Booking[]
  reviews  Review[]

  @@map("cars")
}

// ─── BOOKING MODEL ───────────────────────────────────────────────
model Booking {
  id              String        @id @default(uuid())
  bookingRef      String        @unique @default(cuid())
  userId          String
  carId           String
  status          BookingStatus @default(PENDING)

  // Trip Details
  pickupLocation  String
  dropLocation    String
  pickupDate      DateTime
  returnDate      DateTime
  totalDays       Int
  estimatedKms    Int?
  withDriver      Boolean       @default(false)
  tripType        String?

  // Personal Details
  passengerName   String
  passengerPhone  String
  passengerEmail  String
  licenseNumber   String

  // Pricing Breakdown
  baseAmount      Float
  driverCharge    Float         @default(0)
  gst             Float
  totalAmount     Float
  discountAmount  Float         @default(0)
  couponCode      String?

  // Payment
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod @default(UPI)
  razorpayOrderId String?
  razorpayPaymentId String?

  // Tracking
  actualPickupTime  DateTime?
  actualReturnTime  DateTime?
  actualKms         Int?
  finalAmount       Float?
  cancelReason      String?
  cancelledAt       DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user    User     @relation(fields: [userId], references: [id])
  car     Car      @relation(fields: [carId], references: [id])
  payment Payment?
  review  Review?

  @@map("bookings")
}

// ─── PAYMENT MODEL ───────────────────────────────────────────────
model Payment {
  id                String        @id @default(uuid())
  bookingId         String        @unique
  userId            String
  amount            Float
  currency          String        @default("INR")
  status            PaymentStatus @default(PENDING)
  method            PaymentMethod
  razorpayOrderId   String?       @unique
  razorpayPaymentId String?       @unique
  razorpaySignature String?
  refundId          String?
  refundAmount      Float?
  refundedAt        DateTime?
  metadata          Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id])

  @@map("payments")
}

// ─── REVIEW MODEL ────────────────────────────────────────────────
model Review {
  id        String   @id @default(uuid())
  userId    String
  carId     String
  bookingId String   @unique
  rating    Int
  comment   String?
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  car     Car     @relation(fields: [carId], references: [id])
  booking Booking @relation(fields: [bookingId], references: [id])

  @@map("reviews")
}

// ─── NOTIFICATION MODEL ──────────────────────────────────────────
model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  message   String
  type      String   @default("info")
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("notifications")
}

// ─── OTP MODEL ──────────────────────────────────────────────────
model OtpCode {
  id        String   @id @default(uuid())
  userId    String
  code      String
  type      String
  expiresAt DateTime
  isUsed    Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("otp_codes")
}

// ─── REFRESH TOKEN MODEL ─────────────────────────────────────────
model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("refresh_tokens")
}`} lang="prisma" />
          </div>
        )}

        {/* ══════════ AUTH API ══════════ */}
        {activeTab === 'auth' && (
          <div>
            <SectionHeader icon={Shield} title="Authentication API" color="#60a5fa"
              subtitle="JWT-based auth with access tokens, refresh tokens, OTP verification, and role-based access control." />

            {/* Routes */}
            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Auth Endpoints</h3>
            <div className="space-y-2 mb-8">
              <RouteCard method="POST" path="/api/auth/register" desc="Register new user" />
              <RouteCard method="POST" path="/api/auth/login" desc="Login with email + password" />
              <RouteCard method="POST" path="/api/auth/logout" desc="Logout & invalidate token" auth />
              <RouteCard method="POST" path="/api/auth/refresh" desc="Get new access token" />
              <RouteCard method="POST" path="/api/auth/send-otp" desc="Send OTP to phone" />
              <RouteCard method="POST" path="/api/auth/verify-otp" desc="Verify OTP code" />
              <RouteCard method="GET" path="/api/auth/me" desc="Get current user profile" auth />
              <RouteCard method="PUT" path="/api/auth/me" desc="Update profile" auth />
              <RouteCard method="POST" path="/api/auth/forgot-password" desc="Send reset email" />
              <RouteCard method="POST" path="/api/auth/reset-password" desc="Reset with token" />
            </div>

            <CodeBlock title="src/server.ts" code={`import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { bookingRouter } from './routes/booking.routes';
import { carsRouter } from './routes/cars.routes';
import { paymentRouter } from './routes/payment.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// ── API Routes ──────────────────────────────────
app.use('/api/auth',    authRouter);
app.use('/api/bookings',bookingRouter);
app.use('/api/cars',    carsRouter);
app.use('/api/payments',paymentRouter);
app.use('/api/admin',   adminRouter);

// ── Health Check ─────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'DesiRent API', time: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🚗 DesiRent API running on port \${PORT}\`);
});

export default app;`} lang="typescript" />

            <CodeBlock title="src/routes/auth.routes.ts" code={`import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth.middleware';
import { sendOTP } from '../services/sms.service';
import { sendWelcomeEmail } from '../services/email.service';

export const authRouter = Router();

// ── Validation Schemas ──────────────────────────────────────────
const registerSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  phone:    z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(8)
             .regex(/[A-Z]/, 'Must have uppercase')
             .regex(/[0-9]/, 'Must have number'),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ── Helper: Generate Tokens ──────────────────────────────────────
const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

// ── POST /api/auth/register ──────────────────────────────────────
authRouter.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: exists.email === data.email
          ? 'Email already registered' : 'Phone already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword }
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId:  user.id,
        title:   '🎉 Welcome to DesiRent!',
        message: 'Use code FIRST500 for ₹500 off your first booking!',
        type:    'promo',
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId,
        token:     refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email,
                phone: user.phone, role: user.role },
        accessToken,
      }
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated. Contact support.'
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        userId:    user.id,
        token:     refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email,
                phone: user.phone, role: user.role,
                totalBookings: user.totalBookings },
        accessToken,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────
authRouter.get('/me', authMiddleware, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where:  { id: req.userId },
    select: { id: true, name: true, email: true, phone: true,
              role: true, avatar: true, address: true, city: true,
              licenseNumber: true, totalBookings: true,
              totalSpent: true, loyaltyPoints: true, createdAt: true }
  });
  res.json({ success: true, data: user });
});`} lang="typescript" />

            <CodeBlock title="src/middleware/auth.middleware.ts" code={`import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (
  req: AuthRequest, res: Response, next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false, message: 'Access token required'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.userId   = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({
      success: false, message: 'Invalid or expired token'
    });
  }
};

export const adminMiddleware = (
  req: AuthRequest, res: Response, next: NextFunction
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({
      success: false, message: 'Admin access required'
    });
  }
  next();
};`} lang="typescript" />
          </div>
        )}

        {/* ══════════ BOOKING API ══════════ */}
        {activeTab === 'booking' && (
          <div>
            <SectionHeader icon={Package} title="Booking API" color="#34d399"
              subtitle="Full booking lifecycle: create, confirm, track, cancel, review. Uber-like real-time status updates." />

            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Booking Endpoints</h3>
            <div className="space-y-2 mb-8">
              <RouteCard method="POST" path="/api/bookings" desc="Create new booking" auth />
              <RouteCard method="GET" path="/api/bookings" desc="My bookings (paginated)" auth />
              <RouteCard method="GET" path="/api/bookings/:id" desc="Booking details" auth />
              <RouteCard method="PATCH" path="/api/bookings/:id/cancel" desc="Cancel booking" auth />
              <RouteCard method="PATCH" path="/api/bookings/:id/status" desc="Update status (Admin)" auth />
              <RouteCard method="POST" path="/api/bookings/:id/review" desc="Submit review" auth />
              <RouteCard method="GET" path="/api/bookings/admin/all" desc="All bookings (Admin)" auth />
            </div>

            <CodeBlock title="src/routes/booking.routes.ts" code={`import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { sendBookingConfirmation } from '../services/email.service';
import { sendBookingSMS } from '../services/sms.service';

export const bookingRouter = Router();

// ── Validation Schema ────────────────────────────────────────────
const bookingSchema = z.object({
  carId:          z.string().uuid(),
  pickupLocation: z.string().min(3),
  dropLocation:   z.string().min(3),
  pickupDate:     z.string().datetime(),
  returnDate:     z.string().datetime(),
  withDriver:     z.boolean().default(false),
  tripType:       z.string().optional(),
  passengerName:  z.string().min(2),
  passengerPhone: z.string().regex(/^[6-9]\d{9}$/),
  passengerEmail: z.string().email(),
  licenseNumber:  z.string().min(5),
  couponCode:     z.string().optional(),
  paymentMethod:  z.enum(['UPI','CARD','NETBANKING','CASH','WALLET']),
});

// ── POST /api/bookings ───────────────────────────────────────────
bookingRouter.post('/', authMiddleware, async (req: any, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    // 1. Fetch car & check availability
    const car = await prisma.car.findUnique({ where: { id: data.carId } });
    if (!car || !car.isAvailable) {
      return res.status(400).json({
        success: false, message: 'Car is not available'
      });
    }

    // 2. Calculate dates & pricing
    const pickup  = new Date(data.pickupDate);
    const returnD = new Date(data.returnDate);
    const msPerDay  = 1000 * 60 * 60 * 24;
    const totalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / msPerDay));

    const baseAmount    = car.pricePerDay * totalDays;
    const driverCharge  = data.withDriver ? 800 * totalDays : 0;
    const gst           = (baseAmount + driverCharge) * 0.18;

    // 3. Apply coupon
    let discountAmount = 0;
    if (data.couponCode === 'FIRST500') discountAmount = 500;
    if (data.couponCode === 'DESI10')   discountAmount = baseAmount * 0.10;

    const totalAmount = baseAmount + driverCharge + gst - discountAmount;

    // 4. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId:         req.userId,
        carId:          data.carId,
        pickupLocation: data.pickupLocation,
        dropLocation:   data.dropLocation,
        pickupDate:     pickup,
        returnDate:     returnD,
        totalDays,
        withDriver:     data.withDriver,
        tripType:       data.tripType,
        passengerName:  data.passengerName,
        passengerPhone: data.passengerPhone,
        passengerEmail: data.passengerEmail,
        licenseNumber:  data.licenseNumber,
        baseAmount,
        driverCharge,
        gst,
        discountAmount,
        couponCode:     data.couponCode,
        totalAmount,
        paymentMethod:  data.paymentMethod as any,
        status:         'PENDING',
      },
      include: { car: true, user: true }
    });

    // 5. Mark car unavailable
    await prisma.car.update({
      where: { id: data.carId },
      data:  { isAvailable: false }
    });

    // 6. Create notification
    await prisma.notification.create({
      data: {
        userId:  req.userId,
        title:   '✅ Booking Confirmed!',
        message: \`\${car.name} booked for \${totalDays} day(s). Ref: \${booking.bookingRef}\`,
        type:    'booking',
      }
    });

    // 7. Send confirmation (async)
    sendBookingConfirmation(booking).catch(console.error);
    sendBookingSMS(data.passengerPhone, booking.bookingRef, car.name).catch(console.error);

    // 8. Update user stats
    await prisma.user.update({
      where: { id: req.userId },
      data:  {
        totalBookings: { increment: 1 },
        totalSpent:    { increment: totalAmount },
        loyaltyPoints: { increment: Math.floor(totalAmount / 100) },
      }
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data:    booking
    });

  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
});

// ── GET /api/bookings ────────────────────────────────────────────
bookingRouter.get('/', authMiddleware, async (req: any, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const where: any = { userId: req.userId };
  if (status) where.status = status;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { car: { select: { name: true, image: true, brand: true } } },
      orderBy: { createdAt: 'desc' },
      skip:    (Number(page) - 1) * Number(limit),
      take:    Number(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data:    bookings,
    pagination: { page: Number(page), limit: Number(limit), total,
                  pages: Math.ceil(total / Number(limit)) }
  });
});

// ── PATCH /api/bookings/:id/cancel ───────────────────────────────
bookingRouter.patch('/:id/cancel', authMiddleware, async (req: any, res) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, userId: req.userId }
  });

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  if (['COMPLETED','CANCELLED'].includes(booking.status)) {
    return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data:  { status: 'CANCELLED', cancelReason: req.body.reason,
             cancelledAt: new Date() }
  });

  await prisma.car.update({
    where: { id: booking.carId },
    data:  { isAvailable: true }
  });

  res.json({ success: true, message: 'Booking cancelled successfully' });
});`} lang="typescript" />
          </div>
        )}

        {/* ══════════ PAYMENT ══════════ */}
        {activeTab === 'payment' && (
          <div>
            <SectionHeader icon={CreditCard} title="Razorpay Payment Integration" color="#fb923c"
              subtitle="Indian payment gateway supporting UPI, Cards, Net Banking, and Wallets. Includes webhook verification." />

            <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-300 font-semibold text-sm">Get Razorpay Test Keys</p>
                  <p className="text-orange-200/70 text-xs mt-1">Sign up free at <span className="text-orange-300 font-mono">dashboard.razorpay.com</span> → Settings → API Keys → Generate Test Key</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Payment Endpoints</h3>
            <div className="space-y-2 mb-6">
              <RouteCard method="POST" path="/api/payments/create-order" desc="Create Razorpay order" auth />
              <RouteCard method="POST" path="/api/payments/verify" desc="Verify payment signature" auth />
              <RouteCard method="POST" path="/api/payments/webhook" desc="Razorpay webhook handler" />
              <RouteCard method="POST" path="/api/payments/refund" desc="Initiate refund" auth />
              <RouteCard method="GET" path="/api/payments/:bookingId" desc="Payment details" auth />
            </div>

            <CodeBlock title="src/routes/payment.routes.ts" code={`import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth.middleware';

export const paymentRouter = Router();

// ── Initialize Razorpay ──────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ── POST /api/payments/create-order ─────────────────────────────
paymentRouter.post('/create-order', authMiddleware, async (req: any, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.userId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount:   Math.round(booking.totalAmount * 100), // paise
      currency: 'INR',
      receipt:  booking.bookingRef,
      notes: {
        bookingId:   booking.id,
        bookingRef:  booking.bookingRef,
        userId:      req.userId,
        description: \`DesiRent - Car Booking \${booking.bookingRef}\`,
      }
    });

    // Save order ID to booking
    await prisma.booking.update({
      where: { id: bookingId },
      data:  { razorpayOrderId: order.id }
    });

    // Create pending payment record
    await prisma.payment.create({
      data: {
        bookingId:      bookingId,
        userId:         req.userId,
        amount:         booking.totalAmount,
        status:         'PENDING',
        method:         booking.paymentMethod,
        razorpayOrderId: order.id,
      }
    });

    res.json({
      success: true,
      data: {
        orderId:  order.id,
        amount:   order.amount,
        currency: order.currency,
        key:      process.env.RAZORPAY_KEY_ID,
        // Prefill for Indian users
        prefill: {
          name:    booking.passengerName,
          email:   booking.passengerEmail,
          contact: \`+91\${booking.passengerPhone}\`,
        },
        theme: { color: '#f97316' }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment order failed' });
  }
});

// ── POST /api/payments/verify ────────────────────────────────────
paymentRouter.post('/verify', authMiddleware, async (req: any, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const sign   = \`\${razorpay_order_id}|\${razorpay_payment_id}\`;
    const digest = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update booking & payment
    await prisma.booking.update({
      where: { id: bookingId },
      data:  {
        status:             'CONFIRMED',
        paymentStatus:      'PAID',
        razorpayPaymentId:  razorpay_payment_id,
      }
    });

    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data:  {
        status:             'PAID',
        razorpayPaymentId:  razorpay_payment_id,
        razorpaySignature:  razorpay_signature,
      }
    });

    // Notification
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    await prisma.notification.create({
      data: {
        userId:  req.userId,
        title:   '💳 Payment Successful!',
        message: \`₹\${booking?.totalAmount?.toLocaleString('en-IN')} paid. Booking confirmed!\`,
        type:    'payment',
      }
    });

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// ── POST /api/payments/webhook ───────────────────────────────────
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const body      = req.body.toString();

  const digest = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (digest !== signature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.failed') {
    const { order_id } = event.payload.payment.entity;
    await prisma.payment.update({
      where: { razorpayOrderId: order_id },
      data:  { status: 'FAILED' }
    });
  }

  res.json({ received: true });
});`} lang="typescript" />

            <CodeBlock title="Frontend Razorpay Integration (React)" code={`// src/api/payment.ts
import { loadScript } from './utils';

export const initiatePayment = async (bookingId: string, token: string) => {
  // 1. Load Razorpay SDK
  const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!loaded) throw new Error('Razorpay SDK failed to load');

  // 2. Create order from backend
  const res = await fetch('/api/payments/create-order', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json',
               'Authorization': \`Bearer \${token}\` },
    body:    JSON.stringify({ bookingId }),
  });
  const { data } = await res.json();

  // 3. Open Razorpay checkout
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      key:         data.key,
      amount:      data.amount,
      currency:    data.currency,
      order_id:    data.orderId,
      name:        'DesiRent',
      description: 'Car Rental Booking',
      image:       '/logo.png',
      prefill:     data.prefill,
      theme:       data.theme,
      handler: async (response: any) => {
        // 4. Verify on backend
        const verifyRes = await fetch('/api/payments/verify', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json',
                     'Authorization': \`Bearer \${token}\` },
          body: JSON.stringify({ ...response, bookingId }),
        });
        const result = await verifyRes.json();
        result.success ? resolve(result) : reject(result);
      },
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) }
    });
    rzp.open();
  });
};`} lang="typescript" />
          </div>
        )}

        {/* ══════════ FRONTEND API ══════════ */}
        {activeTab === 'frontend' && (
          <div>
            <SectionHeader icon={Code2} title="Frontend API Client" color="#a78bfa"
              subtitle="Type-safe API client for React. Connects DesiRent frontend to the Express backend with auto token refresh." />

            <CodeBlock title="src/api.ts (Frontend API Client)" code={`// Central API client for DesiRent frontend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private accessToken: string | null = null;

  setToken(token: string) { this.accessToken = token; }
  clearToken()            { this.accessToken = null;  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as any),
    };

    if (this.accessToken) {
      headers['Authorization'] = \`Bearer \${this.accessToken}\`;
    }

    const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      ...options,
      headers,
      credentials: 'include', // send cookies
    });

    if (res.status === 401) {
      // Auto-refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers['Authorization'] = \`Bearer \${this.accessToken}\`;
        const retryRes = await fetch(\`\${BASE_URL}\${endpoint}\`, { ...options, headers });
        return retryRes.json();
      }
      throw new Error('Session expired');
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Request failed');
    return data;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const res  = await fetch(\`\${BASE_URL}/auth/refresh\`, {
        method: 'POST', credentials: 'include'
      });
      const data = await res.json();
      if (data.success) { this.accessToken = data.data.accessToken; return true; }
      return false;
    } catch { return false; }
  }

  // ── Auth ──────────────────────────────────────────────────────
  auth = {
    register: (data: any)  => this.request('/auth/register', { method:'POST', body:JSON.stringify(data) }),
    login:    (data: any)  => this.request('/auth/login',    { method:'POST', body:JSON.stringify(data) }),
    logout:   ()           => this.request('/auth/logout',   { method:'POST' }),
    me:       ()           => this.request('/auth/me'),
    updateMe: (data: any)  => this.request('/auth/me',       { method:'PUT',  body:JSON.stringify(data) }),
  };

  // ── Cars ──────────────────────────────────────────────────────
  cars = {
    getAll:   (params?: any) => this.request(\`/cars?\${new URLSearchParams(params)}\`),
    getById:  (id: string)   => this.request(\`/cars/\${id}\`),
    search:   (q: string)    => this.request(\`/cars/search?q=\${q}\`),
  };

  // ── Bookings ──────────────────────────────────────────────────
  bookings = {
    create:    (data: any)  => this.request('/bookings',             { method:'POST',  body:JSON.stringify(data) }),
    getAll:    (params?: any)=> this.request(\`/bookings?\${new URLSearchParams(params)}\`),
    getById:   (id: string) => this.request(\`/bookings/\${id}\`),
    cancel:    (id: string, reason: string) =>
                              this.request(\`/bookings/\${id}/cancel\`, { method:'PATCH', body:JSON.stringify({ reason }) }),
    review:    (id: string, data: any) =>
                              this.request(\`/bookings/\${id}/review\`, { method:'POST',  body:JSON.stringify(data) }),
  };

  // ── Payments ──────────────────────────────────────────────────
  payments = {
    createOrder: (bookingId: string) =>
                              this.request('/payments/create-order', { method:'POST', body:JSON.stringify({ bookingId }) }),
    verify:      (data: any) => this.request('/payments/verify',     { method:'POST', body:JSON.stringify(data) }),
  };

  // ── Notifications ─────────────────────────────────────────────
  notifications = {
    getAll:   () => this.request('/notifications'),
    markRead: (id: string) => this.request(\`/notifications/\${id}/read\`, { method:'PATCH' }),
    markAllRead: () =>        this.request('/notifications/read-all',     { method:'PATCH' }),
  };
}

export const api = new APIClient();
export default api;`} lang="typescript" />

            <CodeBlock title=".env.local (Frontend Environment)" code={`VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxx
VITE_APP_NAME=DesiRent`} lang="bash" />
          </div>
        )}

        {/* ══════════ DEPLOY ══════════ */}
        {activeTab === 'deploy' && (
          <div>
            <SectionHeader icon={Zap} title="Deployment Guide" color="#facc15"
              subtitle="Deploy DesiRent backend free on Railway or Render in under 5 minutes. Frontend on Vercel or Netlify." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { name: '🚂 Railway', desc: 'Best for backend (Node + PostgreSQL + Redis). Free $5/month credit.', color: '#7c3aed', recommended: true },
                { name: '🟢 Render', desc: 'Free tier for backend. Auto-deploy from GitHub.', color: '#22c55e', recommended: false },
                { name: '▲ Vercel', desc: 'Best for React frontend. Free tier. Auto HTTPS.', color: '#ffffff', recommended: true },
                { name: '🔷 Supabase', desc: 'Free PostgreSQL database (500MB). Drop-in replacement.', color: '#3ecf8e', recommended: false },
              ].map(opt => (
                <div key={opt.name} className="p-4 rounded-xl border border-white/10 relative" style={{ background: '#1e293b' }}>
                  {opt.recommended && (
                    <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Recommended</span>
                  )}
                  <div className="text-base font-bold mb-1" style={{ color: opt.color }}>{opt.name}</div>
                  <div className="text-xs text-slate-400">{opt.desc}</div>
                </div>
              ))}
            </div>

            <CodeBlock title="Deploy Backend to Railway" code={`# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login & initialize
railway login
railway init

# 3. Add PostgreSQL database
railway add postgresql
railway add redis

# 4. Set environment variables
railway variables set JWT_SECRET=your_secret_here
railway variables set RAZORPAY_KEY_ID=rzp_live_xxxx
railway variables set RAZORPAY_KEY_SECRET=xxxx
# ... set all other .env variables

# 5. Deploy!
railway up

# ✅ Your API will be live at:
# https://your-project.up.railway.app`} lang="bash" />

            <CodeBlock title="Deploy Frontend to Vercel" code={`# 1. Install Vercel CLI
npm install -g vercel

# 2. In your frontend project root
vercel

# 3. Set environment variable
vercel env add VITE_API_URL
# Enter: https://your-project.up.railway.app/api

# 4. Deploy to production
vercel --prod

# ✅ Frontend live at: https://desirent.vercel.app`} lang="bash" />

            <CodeBlock title="Dockerfile (Backend)" code={`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]`} lang="dockerfile" />

            {/* Summary */}
            <div className="rounded-2xl p-6 border border-white/10 mt-6" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                Complete Stack Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Frontend', items: ['React 19 + Vite', 'Tailwind CSS v4', 'Zustand / Context API', 'Razorpay JS SDK', 'Vercel Deploy'], color: '#60a5fa' },
                  { title: 'Backend', items: ['Node.js + Express', 'TypeScript 5', 'JWT Auth + Refresh', 'Razorpay Payments', 'Railway Deploy'], color: '#34d399' },
                  { title: 'Database', items: ['PostgreSQL 16', 'Prisma ORM v5', 'Redis Cache', 'Twilio SMS OTP', 'Nodemailer Email'], color: '#fb923c' },
                ].map(col => (
                  <div key={col.title}>
                    <div className="text-sm font-bold mb-3" style={{ color: col.color }}>{col.title}</div>
                    {col.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendDocs;
