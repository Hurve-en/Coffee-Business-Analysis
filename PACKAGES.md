# 📦 CITA Package Documentation

## Table of Contents
1. [Overview](#overview)
2. [Production Dependencies](#production-dependencies)
3. [Development Dependencies](#development-dependencies)
4. [Installation Commands](#installation-commands)
5. [Package Usage Guide](#package-usage-guide)
6. [Version Compatibility](#version-compatibility)
7. [Bundle Size Analysis](#bundle-size-analysis)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides a complete reference for all packages used in the CITA project, including why each package was chosen, how it's used, and any important configuration details.

**Total Packages**: 29 (17 production + 12 development)

---

## Production Dependencies

### Core Framework & Language

#### **next** (14.0.4)
**Purpose**: React framework with server-side rendering

**Why We Use It**:
- Server-side rendering for better SEO
- API routes (serverless functions)
- App Router for modern routing
- Automatic code splitting
- Image optimization
- Built-in TypeScript support

**Used In**: Entire application foundation

---

#### **react** (18.2.0)
**Purpose**: UI library

**Why We Use It**:
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem
- Industry standard

**Used In**: All UI components

---

#### **react-dom** (18.2.0)
**Purpose**: React renderer for web

**Why We Use It**:
- Required for React web applications
- DOM manipulation
- Event handling

**Used In**: Application rendering

---

### Database & ORM

#### **@prisma/client** (5.7.1)
**Purpose**: Type-safe database client

**Why We Use It**:
- Auto-generated TypeScript types
- Type-safe queries
- Excellent VS Code autocomplete
- Connection pooling
- Migration support

**Used In**: All database queries

**Example**:
```tsx
const customers = await prisma.customer.findMany({
  where: { userId: session.user.id }
})
```

---

### Authentication

#### **next-auth** (4.24.13)
**Purpose**: Authentication library for Next.js

**Why We Use It**:
- JWT session management
- Built-in CSRF protection
- Multiple provider support
- Server and client session access
- Secure cookie handling

**Used In**: Authentication system (`lib/auth.ts`, API routes)

**Configuration**:
```tsx
providers: [CredentialsProvider],
session: { strategy: 'jwt' },
pages: { signIn: '/auth/login' }
```

---

#### **bcryptjs** (3.0.3)
**Purpose**: Password hashing

**Why We Use It**:
- Industry-standard hashing
- Salt generation
- Slow hashing (prevents brute force)
- Pure JavaScript (no compilation needed)

**Used In**: User registration, login

**Example**:
```tsx
const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, hash)
```

---

### State Management & Data Fetching

#### **@tanstack/react-query** (5.90.12)
**Purpose**: Server state management

**Why We Use It**:
- Automatic caching (5-minute stale time)
- Background refetching
- Optimistic updates
- Retry logic (3 attempts)
- DevTools for debugging
- Reduces boilerplate code

**Used In**: All data fetching (`hooks/use-cached-data.ts`)

**Configuration**:
```tsx
staleTime: 5 * 60 * 1000,  // 5 minutes
gcTime: 10 * 60 * 1000,     // 10 minutes
refetchOnWindowFocus: true,
retry: 3
```

---

#### **@tanstack/react-query-devtools** (5.91.1)
**Purpose**: React Query debugging tools

**Why We Use It**:
- Visualize query state
- See cache contents
- Debug stale/fresh data
- Monitor refetch behavior

**Used In**: Development only (bottom-right icon)

---

### UI Components & Icons

#### **lucide-react** (0.294.0)
**Purpose**: Icon library

**Why We Use It**:
- Modern, beautiful icons
- Tree-shakeable (only imports used icons)
- Consistent design
- TypeScript support
- Small bundle size

**Used In**: All UI components

**Example**:
```tsx
import { Users, ShoppingCart, Coffee } from 'lucide-react'
<Users className="w-5 h-5" />
```

---

#### **recharts** (2.10.3)
**Purpose**: Chart library

**Why We Use It**:
- Composable chart components
- Responsive by default
- Beautiful default styling
- TypeScript support
- Easy customization

**Used In**: Dashboard, sales analytics, reports

**Charts Used**:
- BarChart (sales trends)
- PieChart (category breakdown)
- LineChart (revenue over time)

**Example**:
```tsx
<BarChart data={salesData}>
  <Bar dataKey="revenue" fill="#334155" />
</BarChart>
```

---

### Styling

#### **tailwindcss** (3.4.0)
**Purpose**: Utility-first CSS framework

**Why We Use It**:
- Rapid development
- Consistent design system
- Responsive utilities
- Tree-shaking (removes unused CSS)
- Small production bundle

**Used In**: All component styling

**Custom Configuration**:
```js
colors: { slate: {...} },
borderRadius: { xl: '1rem', '2xl': '1.5rem' },
fontFamily: { sans: ['Inter'] }
```

---

#### **tailwind-merge** (2.6.0)
**Purpose**: Merge Tailwind classes intelligently

**Why We Use It**:
- Resolves class conflicts
- Ensures correct precedence
- Cleaner component APIs

**Used In**: Component libraries

**Example**:
```tsx
twMerge('px-4 py-2', props.className) // Handles conflicts
```

---

#### **clsx** (2.1.1)
**Purpose**: Conditional class names

**Why We Use It**:
- Simple API
- Tiny size (228 bytes)
- Handles arrays, objects, conditionals

**Used In**: Dynamic styling

**Example**:
```tsx
clsx('btn', {
  'bg-blue-500': isPrimary,
  'bg-gray-500': !isPrimary
})
```

---

### Notifications

#### **react-hot-toast** (2.6.0)
**Purpose**: Toast notifications

**Why We Use It**:
- Beautiful default design
- Customizable
- Promise support
- Accessible
- Small bundle size

**Used In**: Success/error feedback throughout app

**Example**:
```tsx
toast.success('Customer created!')
toast.error('Failed to save')
```

---

### Utilities

#### **date-fns** (3.0.0)
**Purpose**: Date manipulation

**Why We Use It**:
- Modern alternative to Moment.js
- Tree-shakeable (only import what you use)
- Immutable
- TypeScript support
- Smaller bundle size

**Used In**: Date formatting, calculations

**Example**:
```tsx
format(new Date(), 'MMM dd, yyyy')
subDays(new Date(), 30)
```

---

### Progressive Web App

#### **next-pwa** (5.6.0)
**Purpose**: PWA capabilities for Next.js

**Why We Use It**:
- Service worker generation
- Offline support
- App manifest creation
- Installable app
- Cache strategies

**Used In**: PWA functionality

**Configuration**:
```js
dest: 'public',
register: true,
skipWaiting: true,
disable: false
```

---

## Development Dependencies

### TypeScript

#### **typescript** (5.3.3)
**Purpose**: JavaScript with types

**Why We Use It**:
- Type safety
- Better IDE support
- Catches bugs at compile time
- Self-documenting code
- Refactoring confidence

**Configuration**: `tsconfig.json`

---

#### **@types/node** (20.10.6)
**Purpose**: Node.js type definitions

**Why We Use It**:
- TypeScript types for Node.js APIs
- Better autocomplete
- Type checking

---

#### **@types/react** (18.2.46)
**Purpose**: React type definitions

**Why We Use It**:
- TypeScript types for React
- Component prop types
- Hook types

---

#### **@types/react-dom** (18.2.18)
**Purpose**: React DOM type definitions

**Why We Use It**:
- TypeScript types for ReactDOM
- Event types
- DOM element types

---

#### **@types/bcryptjs** (2.4.6)
**Purpose**: bcryptjs type definitions

**Why We Use It**:
- TypeScript types for bcrypt functions
- Better autocomplete

---

### Database

#### **prisma** (5.7.1)
**Purpose**: Database toolkit and migrations

**Why We Use It**:
- Schema management
- Database migrations
- Type generation
- Prisma Studio (database GUI)
- Seeding

**Commands**:
```bash
npx prisma migrate dev    # Create migration
npx prisma generate       # Generate client
npx prisma studio         # Open GUI
```

---

### Build Tools

#### **autoprefixer** (10.4.16)
**Purpose**: Add vendor prefixes to CSS

**Why We Use It**:
- Cross-browser compatibility
- Automatic prefix management
- Works with Tailwind

**Configuration**: `postcss.config.js`

---

#### **postcss** (8.4.32)
**Purpose**: CSS transformation tool

**Why We Use It**:
- Required for Tailwind CSS
- Plugin system
- CSS processing

---

### Linting

#### **eslint** (8.56.0)
**Purpose**: JavaScript linter

**Why We Use It**:
- Code quality
- Catch errors
- Enforce standards
- Consistent code style

**Configuration**: `.eslintrc.json`

---

#### **eslint-config-next** (14.0.4)
**Purpose**: ESLint configuration for Next.js

**Why We Use It**:
- Next.js-specific rules
- React best practices
- Accessibility checks

---

### Bundle Analysis

#### **@next/bundle-analyzer** (14.0.4)
**Purpose**: Visualize bundle size

**Why We Use It**:
- Identify large dependencies
- Optimize imports
- Reduce bundle size

**Command**: `npm run analyze`

---

#### **cross-env** (7.0.3)
**Purpose**: Cross-platform environment variables

**Why We Use It**:
- Works on Windows, Mac, Linux
- Set env vars in scripts
- Consistent behavior

**Example**:
```json
"analyze": "cross-env ANALYZE=true next build"
```

---

### Development Tools

#### **tsx** (4.7.0)
**Purpose**: TypeScript executor

**Why We Use It**:
- Run TypeScript directly
- Fast execution
- Seeding scripts

**Used In**: Database seeding

---

## Installation Commands

### Fresh Install
```bash
npm install
```

### Install Specific Package
```bash
# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

### Update Packages
```bash
# Check for updates
npm outdated

# Update all packages (careful!)
npm update

# Update specific package
npm update package-name
```

---

## Package Usage Guide

### When to Use Each Package

#### **Styling**
```tsx
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

// Conditional classes
className={clsx('btn', { 'active': isActive })}

// Merge with conflict resolution
className={twMerge('px-4', props.className)}
```

#### **Data Fetching**
```tsx
import { useCachedData } from '@/hooks/use-cached-data'

const { data, isLoading } = useCachedData(
  'customers',
  async () => fetch('/api/customers').then(r => r.json())
)
```

#### **Icons**
```tsx
import { Coffee, Users, TrendingUp } from 'lucide-react'

<Coffee className="w-5 h-5 text-slate-700" />
```

#### **Charts**
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<BarChart data={data}>
  <Bar dataKey="value" fill="#334155" />
</BarChart>
```

#### **Dates**
```tsx
import { format, subDays, startOfMonth } from 'date-fns'

format(new Date(), 'MMM dd, yyyy')  // "Dec 25, 2024"
subDays(new Date(), 7)               // 7 days ago
```

#### **Notifications**
```tsx
import toast from 'react-hot-toast'

toast.success('Success!')
toast.error('Error occurred')
toast.loading('Loading...')
```

---

## Version Compatibility

### Node.js Compatibility
- **Minimum**: Node.js 18.0.0
- **Recommended**: Node.js 18.17+ or 20+
- **Tested On**: Node.js 20.10.0

### Package Compatibility Matrix

| Package | Version | Compatible With |
|---------|---------|-----------------|
| Next.js | 14.0.4 | React 18.2+ |
| React | 18.2.0 | React DOM 18.2 |
| Prisma | 5.7.1 | PostgreSQL 12+ |
| NextAuth | 4.24.13 | Next.js 13+ |
| Tailwind | 3.4.0 | PostCSS 8+ |
| React Query | 5.90.12 | React 18+ |

---

## Bundle Size Analysis

### Production Bundle Sizes

**First Load JS**: 82.1 KB

**By Package** (approximate):
- Next.js Framework: 53.3 KB
- React + React DOM: 10 KB
- React Query: 8 KB
- Recharts: 6 KB (code-split)
- Lucide Icons: 2 KB (tree-shaken)
- Other utilities: 2.8 KB

**Optimization Strategies Used**:
- Tree shaking (removes unused code)
- Code splitting (loads on demand)
- Dynamic imports (heavy components)
- Package optimization in next.config.js

---

## Package Update Strategy

### Critical Packages (Update Carefully)
- `next` - Read changelog, test thoroughly
- `react` / `react-dom` - Ensure compatibility
- `prisma` - Check migration guide
- `next-auth` - Review breaking changes

### Regular Packages (Safe to Update)
- `lucide-react` - Usually safe
- `date-fns` - Stable API
- `clsx` / `tailwind-merge` - Minor utilities

### Update Checklist
1. ✅ Read changelog
2. ✅ Check breaking changes
3. ✅ Update locally first
4. ✅ Run `npm run build`
5. ✅ Test all features
6. ✅ Check bundle size
7. ✅ Deploy to staging
8. ✅ Deploy to production

---

## Troubleshooting

### Common Issues

#### Issue: `npm install` fails
**Solutions**:
```bash
# Clear cache
npm cache clean --force

# Delete lock file and node_modules
rm package-lock.json
rm -rf node_modules
npm install
```

#### Issue: Type errors after update
**Solutions**:
```bash
# Regenerate types
npx prisma generate

# Restart TypeScript server in VS Code
Ctrl+Shift+P → "Restart TS Server"
```

#### Issue: Build fails with module error
**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### Issue: Prisma client errors
**Solutions**:
```bash
# Regenerate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push
```

---

## Security Considerations

### Regular Security Audits
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities (careful!)
npm audit fix

# Fix with breaking changes (very careful!)
npm audit fix --force
```

### Package Security Practices
1. ✅ Keep packages updated
2. ✅ Review changelogs before updating
3. ✅ Use exact versions in production
4. ✅ Run `npm audit` regularly
5. ✅ Review dependencies of dependencies
6. ✅ Use `--save-exact` for critical packages

---

## Alternative Packages Considered

### Why We Chose Our Stack

**React Query vs SWR**:
- ✅ React Query: Better DevTools, more features
- ❌ SWR: Simpler but less powerful

**Tailwind vs Styled Components**:
- ✅ Tailwind: Faster development, smaller bundle
- ❌ Styled Components: More runtime overhead

**Prisma vs TypeORM**:
- ✅ Prisma: Better TypeScript support, easier migrations
- ❌ TypeORM: More decorators, less intuitive

**bcryptjs vs bcrypt**:
- ✅ bcryptjs: Pure JS, easier to install
- ❌ bcrypt: Native, needs compilation

**date-fns vs Moment.js**:
- ✅ date-fns: Tree-shakeable, modern, smaller
- ❌ Moment.js: Larger bundle, mutable API

---

## Future Package Additions

### Planned
- [ ] `zod` - Schema validation
- [ ] `react-hook-form` - Form management
- [ ] `jspdf` - PDF generation
- [ ] `xlsx` - Excel export
- [ ] `nodemailer` - Email sending

### Under Consideration
- [ ] `socket.io` - Real-time updates
- [ ] `bull` - Background jobs
- [ ] `winston` - Advanced logging
- [ ] `helmet` - Additional security headers

---

## Package License Summary

**All packages use permissive licenses**:
- MIT License: 25 packages
- ISC License: 2 packages
- Apache 2.0: 2 packages

**No restrictive licenses (GPL, AGPL, etc.)**

---

## Development Workflow

### Daily Development
```bash
npm run dev              # Start dev server
npm run db:studio        # Open database GUI
```

### Before Committing
```bash
npm run lint            # Check code quality
npm run build           # Verify build works
```

### Before Deploying
```bash
npm run build           # Production build
npm run analyze         # Check bundle size
npm audit               # Security check
```

---

## Resources

### Package Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth Docs](https://next-auth.js.org)

### Package Registries
- [npm](https://www.npmjs.com)
- [Bundlephobia](https://bundlephobia.com) - Check bundle sizes

---

## Summary

**Total Production Dependencies**: 17  
**Total Development Dependencies**: 12  
**Total Bundle Size**: 82.1 KB (first load)  
**Node.js Version**: 18+ required  
**Package Manager**: npm (recommended)  

All packages chosen for:
- ✅ Type safety
- ✅ Performance
- ✅ Developer experience
- ✅ Bundle size
- ✅ Maintenance & support
- ✅ Community & ecosystem

---

*Last Updated: December 2024*
*Package versions as of: Next.js 14.0.4*