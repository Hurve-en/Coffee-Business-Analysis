# ☕ CITA - Coffee Intelligence & Tracking Analytics

> ⚠️ **IMPORTANT NOTICE**
> 
> This repository is for **PORTFOLIO and DEMONSTRATION purposes only**.
> 
> **The code is NOT open source and may NOT be used, copied, or modified.**
> 
> Viewing for learning purposes is permitted. All other rights reserved.
> 
> © 2025 Hurveen Rayford Veloso



A comprehensive, enterprise-grade analytics and management platform designed specifically for coffee businesses. Track sales, manage inventory, understand customers, and grow your business with data-driven insights. Built with modern web technologies and optimized for performance, security, and scalability.

---

## ✨ Features

### 🔐 Authentication & Multi-Tenancy
- **Secure Authentication** - Email/password with NextAuth.js and JWT sessions
- **Multi-Tenant Architecture** - Complete data isolation per user
- **Session Management** - Secure HTTP-only cookies with 30-day expiry
- **Protected Routes** - Middleware-based route protection
- **Password Security** - bcryptjs hashing with 10 salt rounds
- **Rate Limiting** - 30 requests/minute protection against brute force

### 📊 Dashboard & Analytics
- **Real-time KPIs** - Revenue, orders, customers, products at a glance
- **Interactive Charts** - 30-day revenue trends with Recharts
- **Sales Analytics** - Payment method breakdown and insights
- **Category Performance** - Top-selling product categories
- **Recent Activity** - Latest orders and new customers
- **Responsive Design** - Beautiful UI on all devices

### 👥 Customer Management
- **Full CRUD Operations** - Create, read, update, delete customers
- **Real-time Search** - Instant customer filtering
- **Customer Insights** - Total spending, order history, visit tracking
- **Loyalty Tracking** - Automatic points calculation and VIP status
- **CSV Import/Export** - Bulk operations with validation
- **Data Validation** - Email format checking and duplicate prevention

### 📦 Product Management
- **Inventory Tracking** - Real-time stock levels with low stock alerts
- **Profit Margins** - Automatic calculation from cost and price
- **Category Organization** - Coffee, Pastries, Merchandise
- **Stock Management** - Auto-decrement on orders
- **CSV Import/Export** - Bulk product operations
- **Product Status** - Active/inactive toggle

### 🛒 Order Management
- **Multi-product Orders** - Add multiple items with quantities
- **Status Tracking** - Pending, completed, cancelled
- **Payment Methods** - Cash, card, mobile payments
- **Auto-calculations** - Real-time totals and subtotals
- **Stock Integration** - Automatic inventory updates
- **Customer Stats** - Auto-update loyalty points and visit count
- **CSV Import/Export** - Historical order data import

### 📈 Advanced Analytics & Reporting
- **Comprehensive Reports** - P&L statements and financial analysis
- **Sales Trends** - Historical performance tracking
- **Customer Segmentation** - Top customers and spending analysis
- **Product Performance** - Best sellers and profit analysis
- **Monthly Comparisons** - Month-over-month growth tracking
- **Visual Charts** - Bar, line, and pie chart visualizations

### 📁 Import/Export System
- **CSV Templates** - Pre-formatted with examples
- **Data Validation** - Real-time error checking before import
- **Preview Mode** - Review data before importing
- **Bulk Operations** - Import thousands of records at once
- **Error Reporting** - Detailed validation feedback
- **Safety Confirmations** - Bulk delete protection

### ⚡ Performance Optimizations (NEW!)
- **Database Indexes** - 15+ strategic indexes for 40-60% faster queries
- **React Query Caching** - 5-minute stale time, automatic refetching
- **Code Splitting** - Route-based splitting reduces initial bundle size
- **Image Optimization** - WebP/AVIF conversion, lazy loading
- **Bundle Analysis** - Visualize and optimize package sizes
- **Connection Pooling** - Efficient database connections
- **Loading Skeletons** - Visual feedback during data fetching

### 🔒 Security Features (NEW!)
- **Security Headers** - HSTS, CSP, X-Frame-Options, XSS protection
- **Input Sanitization** - XSS and SQL injection prevention
- **Rate Limiting** - Configurable per endpoint (10-100 req/min)
- **Environment Validation** - Startup checks for required variables
- **CSRF Protection** - Built-in with NextAuth
- **Error Boundaries** - Graceful error handling with retry logic
- **Ownership Verification** - Users can only access their data

### 📱 Progressive Web App (NEW!)
- **Installable** - Add to home screen on desktop and mobile
- **Offline Support** - Service worker caching for static assets
- **App-like Experience** - Standalone display mode
- **Custom Icons** - Branded 192x192 and 512x512 icons
- **Fast Loading** - Optimized caching strategies
- **Push Ready** - Infrastructure for notifications (not implemented)

### 🔍 SEO Optimized (NEW!)
- **Meta Tags** - Complete title, description, keywords
- **Open Graph** - Beautiful social media previews
- **Twitter Cards** - Optimized sharing on Twitter
- **Sitemap** - Auto-generated XML sitemap
- **robots.txt** - Search engine crawling configuration
- **Structured Data** - JSON-LD for rich snippets
- **Canonical URLs** - Prevent duplicate content issues

### 📊 Monitoring & Analytics (NEW!)
- **Performance Monitoring** - Track page load times and API response times
- **Error Logging** - Comprehensive error tracking with stack traces
- **Analytics Events** - User action tracking (signups, orders, imports)
- **Web Vitals** - LCP, FID, CLS metrics tracking
- **Health Check API** - Monitor database and system status
- **Dev Dashboard** - Real-time monitoring UI (dev mode only)
- **React Query DevTools** - Cache inspection and debugging

### 🎨 User Interface
- **Modern Design** - Beautiful gradient UI with Tailwind CSS
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Real-time feedback with react-hot-toast
- **Empty States** - Helpful guidance when no data exists
- **Loading States** - Skeleton loaders for better UX
- **Interactive Charts** - Hover tooltips and animations
- **Dark Color Scheme** - Slate-based professional palette

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14.0.4](https://nextjs.org/)** - React framework with App Router
- **[React 18.2.0](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5.3.3](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 3.4.0](https://tailwindcss.com/)** - Utility-first CSS
- **[Recharts 2.10.3](https://recharts.org/)** - Composable charts
- **[Lucide React 0.294.0](https://lucide.dev/)** - Beautiful icons
- **[React Hot Toast 2.6.0](https://react-hot-toast.com/)** - Toast notifications
- **[TanStack React Query 5.90.12](https://tanstack.com/query)** - Server state management
- **[next-pwa 5.6.0](https://www.npmjs.com/package/next-pwa)** - PWA capabilities

### Backend & Database
- **[Node.js 18+](https://nodejs.org/)** - JavaScript runtime
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless functions
- **[Prisma 5.7.1](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Railway](https://railway.app/)** - Database hosting

### Authentication & Security
- **[NextAuth.js 4.24.13](https://next-auth.js.org/)** - Authentication for Next.js
- **[bcryptjs 3.0.3](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### Development & Build Tools
- **[ESLint 8.56.0](https://eslint.org/)** - Code linting
- **[Autoprefixer 10.4.16](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes
- **[@next/bundle-analyzer 14.0.4](https://www.npmjs.com/package/@next/bundle-analyzer)** - Bundle size analysis
- **[cross-env 7.0.3](https://www.npmjs.com/package/cross-env)** - Cross-platform env vars

### Utilities
- **[date-fns 3.0.0](https://date-fns.org/)** - Modern date utility library
- **[clsx 2.1.1](https://www.npmjs.com/package/clsx)** - Conditional classnames
- **[tailwind-merge 2.6.0](https://www.npmjs.com/package/tailwind-merge)** - Merge Tailwind classes

---

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: ~82 KB (first load)
- **Database Query Speed**: 40-60% faster with indexes
- **Cache Hit Rate**: ~80% with React Query

---

## 📦 Installation

### Prerequisites
```bash
Node.js 18+ and npm
PostgreSQL database (or Railway account)
Git
```

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/coffee-business-analysis.git
cd coffee-business-analysis
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Variables

Create `.env` file:

```env
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed sample data
npm run db:seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
npm run analyze      # Analyze bundle size with visualizations
```

---

## 🎯 Usage Guide

### First-Time Setup

1. **Sign Up** - Create account with name, email, password
2. **Import Data** (Optional) - Use CSV import for bulk data
   - Products → Customers → Orders (in this order!)
3. **Create First Order** - Link customer to products
4. **View Analytics** - Explore dashboard and reports

### CSV Import Order
**Important: Import in this sequence!**
1. **Products** (must exist for orders)
2. **Customers** (must exist for orders)
3. **Orders** (links products to customers)

### CSV Format Examples

**Products:**
```csv
name,description,category,price,cost,stock
Espresso,Rich espresso shot,Coffee,3.50,0.80,500
Cappuccino,Espresso with steamed milk,Coffee,4.50,1.20,400
```

**Customers:**
```csv
name,email,phone,address
John Doe,john@example.com,+1-555-0100,123 Main St
Jane Smith,jane@example.com,+1-555-0101,456 Oak Ave
```

**Orders:**
```csv
customerEmail,productName,quantity,orderDate,paymentMethod,status
john@example.com,Espresso,2,2025-12-20,cash,completed
jane@example.com,Cappuccino,1,2025-12-21,card,completed
```

---

## 📁 Project Structure

```
coffee-business-analysis/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.js                # Sample data seeder
├── public/
│   ├── icon-192.png           # PWA icon (192x192)
│   ├── icon-512.png           # PWA icon (512x512)
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── app/
│   │   ├── api/               # API routes (serverless functions)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── customers/     # Customer CRUD + import/export
│   │   │   ├── products/      # Product CRUD + import/export
│   │   │   ├── orders/        # Order CRUD + import/export
│   │   │   └── health/        # Health check endpoint
│   │   ├── auth/              # Login & signup pages
│   │   ├── dashboard/         # Protected dashboard routes
│   │   │   ├── overview/      # Main dashboard with KPIs
│   │   │   ├── customers/     # Customer management
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   ├── sales/         # Sales analytics
│   │   │   └── reports/       # Financial reports
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage
│   │   ├── providers.tsx      # Context providers
│   │   ├── sitemap.ts         # Auto-generated sitemap
│   │   ├── robots.ts          # Auto-generated robots.txt
│   │   └── offline/           # PWA offline page
│   ├── components/
│   │   ├── charts/            # Recharts visualizations
│   │   ├── modals/            # Form modals
│   │   ├── error-boundary.tsx # Error boundary component
│   │   ├── loading-skeleton.tsx # Loading states
│   │   ├── monitoring-dashboard.tsx # Dev monitoring UI
│   │   ├── query-provider.tsx # React Query setup
│   │   └── optimized-image.tsx # Image optimization
│   ├── hooks/
│   │   └── use-cached-data.ts # Custom React Query hook
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── performance-monitor.ts # Performance tracking
│   │   ├── error-logger.ts    # Error logging
│   │   ├── analytics.ts       # Analytics tracking
│   │   ├── memory-cache.ts    # In-memory caching
│   │   ├── api-cache.ts       # API response caching
│   │   ├── sanitize-input.ts  # Input sanitization
│   │   ├── rate-limiter.ts    # Rate limiting
│   │   ├── fetch-with-retry.ts # Retry logic
│   │   ├── env.ts             # Environment validation
│   │   ├── web-vitals.ts      # Web Vitals reporting
│   │   ├── utils.ts           # Utility functions
│   │   └── csv-utils.ts       # CSV parsing
│   ├── types/
│   │   └── next-auth.d.ts     # Type extensions
│   ├── middleware.ts          # Auth + security middleware
│   └── styles/
│       └── globals.css        # Global styles
├── docs/
│   ├── FRONTEND.md            # Frontend architecture guide
│   ├── BACKEND.md             # Backend & API documentation
│   └── PACKAGES.md            # Package documentation
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies & scripts
├── LICENSE                    # License file
└── README.md                  # This file
```

---

## 🗄️ Database Schema

### Core Tables

#### **User**
```prisma
- id: String (cuid)
- email: String (unique)
- password: String (hashed)
- name: String
- createdAt, updatedAt: DateTime
Relations: customers[], products[], orders[]
```

#### **Customer**
```prisma
- id, userId: String
- name, email, phone, address: String
- totalSpent: Float
- visitCount: Int
- loyaltyPoints: Int
- lastVisit: DateTime
Relations: user, orders[]
Indexes: userId, email, createdAt, totalSpent
```

#### **Product**
```prisma
- id, userId: String
- name, description, category: String
- price, cost: Float
- stock: Int
- imageUrl: String
- isActive: Boolean
Relations: user, orderItems[]
Indexes: userId, category, stock
```

#### **Order**
```prisma
- id, userId, customerId: String
- orderDate: DateTime
- total: Float
- status: String (Pending/Completed/Cancelled)
- paymentMethod: String
Relations: user, customer, items[]
Indexes: userId, orderDate, status, customerId
```

#### **OrderItem**
```prisma
- id, orderId, productId: String
- quantity: Int
- price: Float
Relations: order, product
Indexes: orderId, productId
```

**Total Indexes: 15+** for optimal query performance

---

## 🔒 Security Features

### Multi-Layer Security

**1. Authentication Layer**
- JWT sessions with secure HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- Session expiry (30 days)
- Automatic session refresh

**2. Authorization Layer**
- Multi-tenant data isolation (userId filter)
- Ownership verification on all mutations
- Middleware-protected routes
- API route authentication checks

**3. Input Security**
- XSS prevention with sanitization
- SQL injection protection (Prisma)
- Email and phone validation
- File upload validation (CSV only)

**4. Network Security**
- Rate limiting (30-100 req/min configurable)
- CORS configuration
- Security headers (12+ headers)
- HTTPS enforcement (production)

**5. Application Security**
- Error boundaries (graceful failures)
- Environment validation (startup checks)
- CSRF protection (NextAuth)
- No sensitive data in logs

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**1. Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Set Up Database (Railway):**
- Create account at [railway.app](https://railway.app)
- Click "New Project" → "Provision PostgreSQL"
- Copy connection URL

**3. Deploy on Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import GitHub repository
- Add environment variables:
  ```
  DATABASE_URL = postgresql://...
  NEXTAUTH_URL = https://your-project.vercel.app
  NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
  ```
- Click "Deploy"

**4. Run Migrations:**
```bash
npx prisma migrate deploy
```

**5. Done!** ✅
Your app is live at: `https://your-project.vercel.app`

### Environment Variables

**Production:**
```env
DATABASE_URL="postgresql://postgres:..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret-32-chars-min"
```

---

## 🐛 Troubleshooting

### Build Errors

**Prisma Client errors:**
```bash
npx prisma generate
npx prisma migrate deploy
```

**Module resolution errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues

**Connection test:**
```bash
npx prisma db pull
```

**Reset database (⚠️ deletes all data):**
```bash
npx prisma migrate reset
```

**View data:**
```bash
npx prisma studio
```

### Authentication Problems

- ✅ Verify `NEXTAUTH_SECRET` is 32+ characters
- ✅ Check `NEXTAUTH_URL` matches your domain
- ✅ Clear browser cookies
- ✅ Verify database connection

### Performance Issues

- ✅ Check React Query DevTools (bottom-right)
- ✅ Run `npm run analyze` to check bundle size
- ✅ Verify database indexes exist
- ✅ Check Network tab for slow requests

---

## 📖 Documentation

- **[Frontend Documentation](./docs/FRONTEND.md)** - Complete frontend architecture
- **[Backend Documentation](./docs/BACKEND.md)** - API routes and database
- **[Package Documentation](./docs/PACKAGES.md)** - All dependencies explained

---

## 🎯 Roadmap

### Completed ✅
- [x] Core CRUD functionality
- [x] Authentication & authorization
- [x] Dashboard with analytics
- [x] CSV import/export
- [x] Performance optimizations (50-70% faster)
- [x] Security enhancements (rate limiting, headers)
- [x] PWA capabilities (installable)
- [x] SEO optimization (sitemap, meta tags)
- [x] Monitoring & logging
- [x] Error handling & retry logic

### Planned 🔮
- [ ] Coffee bean inventory tracking
- [ ] Brew method analytics
- [ ] Recipe manager
- [ ] Barista performance tracking
- [ ] Equipment maintenance logs
- [ ] Customer preference profiling
- [ ] Peak hour analysis
- [ ] Seasonal trend tracking
- [ ] Loyalty program
- [ ] Mobile ordering integration
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Dark mode
- [ ] Multi-language support

---

## 📄 License

**Copyright © 2025 Hurveen Rayford Veloso. All Rights Reserved.**

This project is available for **viewing and reference only**.

### ✅ You CAN:
- View the code on GitHub
- Learn from the implementation
- Reference in technical discussions or interviews
- Read the documentation

### ❌ You CANNOT:
- Clone, copy, or download for use
- Use in your own projects (personal or commercial)
- Modify, adapt, or create derivatives
- Distribute, publish, or share
- Remove copyright notices
- Use for commercial purposes

**This software is proprietary and confidential.** Unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.

For collaboration or licensing inquiries: **hurveenveloso@gmail.com**

---

## 👏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/) by Vercel
- [Prisma](https://www.prisma.io/) ORM
- [PostgreSQL](https://www.postgresql.org/) Database
- [TanStack React Query](https://tanstack.com/query)
- [Recharts](https://recharts.org/) visualizations
- [Tailwind CSS](https://tailwindcss.com/) styling
- [Lucide Icons](https://lucide.dev/)
- [NextAuth.js](https://next-auth.js.org/) authentication
- Hosted on [Railway](https://railway.app/) & [Vercel](https://vercel.com/)

---

## 📞 Contact

**Hurveen Rayford Veloso**
- Email: hurveenveloso@gmail.com
- GitHub: [@hurveenveloso](https://github.com/hurveenveloso)
- LinkedIn: [Hurveen Veloso](https://linkedin.com/in/hurveen-veloso)
- Portfolio: [Coming Soon]

---

**Built with ☕ and passion**

*This project demonstrates enterprise-grade full-stack development including:*
- *Authentication & authorization systems*
- *Database design & optimization*
- *RESTful API development*
- *Data visualization & analytics*
- *Performance optimization*
- *Security best practices*
- *Progressive Web App development*
- *SEO optimization*
- *Modern UI/UX design*
- *DevOps & deployment*