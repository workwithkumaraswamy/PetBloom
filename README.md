# PAW & RITUAL — The Art of Premium Pet Care
### Luxury Pet Grooming & Emergency Kits E-Commerce Platform

---

## 🌿 Brand Vision & Purpose

**PAW & RITUAL** is an international luxury pet wellness and apothecary grooming brand inspired by high-end skincare (Aesop, Le Labo, Augustinus Bader). Developed as a premier full-stack e-commerce experience for **"Pet Grooming Emergency Kits"**, it transforms everyday canine maintenance into a serene, bonded, and veterinary-aligned ritual.

### 🎨 Visual & Aesthetic Identity
- **Palette**: Warm ivory (`#FAF8F5`, `#FAF7F2`), muted sage green (`#5E7060`, `#7A8B7B`), champagne gold detailing (`#D4AF37`, `#C5A059`), and deep charcoal typography (`#1A1A1A`, `#2D2D2D`).
- **Typography**: Editorial serif headings (*Cormorant Garamond*) and modern clean sans-serif body (*Plus Jakarta Sans*).
- **Standards**: Zero cheap cartoon prints, no neon colors, authentic non-fabricated claims, 100% lick-safe ingredients, and precision surgical metallurgy.

---

## 🏛️ System Architecture & Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router v7, Lucide Icons, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST APIs, CORS, rate limiting, error handling) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, Role-Based Access Control (`CUSTOMER`, `ADMIN`) |
| **Database & ORM** | MySQL 8.0 / SQLite dual-ready with **Prisma ORM 5.22**, fully normalized relational schema |
| **Payments** | **Razorpay Test Mode** (cryptographic HMAC-SHA256 signature verification) & **Cash on Delivery (COD)** |
| **Styling & Assets** | Custom luxury Tailwind theme, Google Fonts, Curated Editorial Canine Photography |

---

## 📦 Core Product Curation & Catalog

1. **Safety Dog Nail Clippers** (SKU: `PR-NC-001` • ₹1,450)
   - 3.5mm Japanese surgical-grade stainless steel blades with calibrated quick-stop safety guard plate, ergonomic champagne-gold handle, and size options.
2. **Styptic Powder (Fast-Acting Hemostatic Aid)** (SKU: `PR-ST-002` • ₹850)
   - Stops minor nail trimming nicks within 5 seconds. Apothecary amber glass jar with bentonite clay, potassium alum, and ferric subsulfate. Clear veterinary escalation notice: *persistent bleeding requires veterinary care*.
3. **Tear-Stain Cleansing Botanical Wipes** (SKU: `PR-TS-003` • ₹950)
   - Biodegradable textured wipes with organic German chamomile and eyebright extract, alcohol-free and ophthalmologist pH 6.8 balanced.
4. **Leave-In Detangling & Conditioning Coat Spray** (SKU: `PR-CS-004` • ₹1,250)
   - Hydrolyzed silk protein, cold-pressed Moroccan argan oil, and colloidal oat milk for knot release across double, silky, and curly coats.
5. **Organic Beeswax Botanical Paw Balm** (SKU: `PR-PB-005` • ₹890)
   - 100% natural organic unbleached beeswax, raw fair-trade African shea butter, virgin coconut oil, and calendula. Lick-safe protection against hot pavements.
6. **The Complete Canine Emergency Grooming Kit** (SKU: `PR-EK-006` • ₹3,850)
   - Water-repellent heavy canvas roll holding clippers, 50g styptic powder, 60g paw balm, blunt surgical shears, sterile gauze swabs, cleansing wipes, and a waterproof triage card.

---

## 🗄️ Relational Database Design (19 Tables)

The database is normalized, indexed, and enforces foreign key cascades.

```
users (id, email, passwordHash, firstName, lastName, phone, role, createdAt, updatedAt)
 ├── addresses (id, userId, fullName, phone, streetAddress, apartment, city, state, postalCode, country, isDefault)
 ├── carts (id, userId, createdAt, updatedAt)
 │    └── cart_items (id, cartId, productId, variantId, quantity)
 ├── wishlists (id, userId, createdAt, updatedAt)
 │    └── wishlist_items (id, wishlistId, productId)
 └── orders (id, orderNumber, userId, customerName, customerEmail, customerPhone, status, paymentMethod, paymentStatus, subtotal, shippingFee, discountAmount, totalAmount, couponCode, trackingNumber, notes, shippingAddressSnapshot)
      ├── order_items (id, orderId, productId, productName, productSku, price, quantity, total, variantInfo)
      └── payments (id, orderId, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, currency, status)

categories (id, name, slug, description, image, bannerImage, featured, sortOrder)
 └── products (id, name, slug, sku, shortDescription, fullDescription, price, compareAtPrice, stock, categoryId, isFeatured, isBestseller, isEmergencyKit, isActive, rating, reviewCount, ingredients, directions, safetyInfo, specifications)
      ├── product_images (id, productId, url, altText, isPrimary, sortOrder)
      ├── product_variants (id, productId, name, value, priceAdjustment, stock, sku)
      ├── inventory (id, productId, quantity, type, notes)
      └── reviews (id, productId, userId, authorName, petName, petBreed, rating, title, comment, isVerifiedPurchase, isApproved)

coupons (id, code, discountType, discountValue, minOrderValue, maxDiscount, validUntil, usageLimit, usedCount, isActive)
newsletter_subscribers (id, email, isActive, source, createdAt)
contact_messages (id, name, email, phone, subject, message, isRead, status, createdAt)
blog_posts (id, title, slug, excerpt, content, coverImage, author, category, readTime, isPublished, publishedAt)
```

- **MySQL Relational Schema Dump**: `backend/paw_and_ritual_mysql.sql`
- **Prisma Schema (SQLite local zero-setup)**: `backend/prisma/schema.prisma`
- **Prisma Schema (Production MySQL)**: `backend/prisma/schema.mysql.prisma`

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### 1. Setup Backend
```bash
cd backend
npm install
npm run db:setup
```
*This command runs `prisma generate`, `prisma db push`, and seeds the complete catalog, admin, customer, reviews, and blog posts!*

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run build
```

### 3. Run Development Servers
Open two terminal windows:

**Terminal 1 (Backend API on http://localhost:5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend on http://localhost:5173):**
```bash
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser!

---

## 🔑 Demonstration Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@pawandritual.com` | `Admin@PawRitual2024` | Executive Dashboard, Catalog CRUD, Order Tracking, Coupons, Messages |
| **Client / Customer** | `elena.vance@example.com` | `Password@123` | Storefront, Wishlist, Bag, Checkout, Order History, Addresses |

*Note: On the `/login` page, click the **"Fill Customer Demo"** or **"Fill Admin Portal Demo"** buttons for 1-click test login!*

---

## 💳 Payment Gateway Testing (Razorpay & COD)

### 1. Razorpay Test Mode
1. Add any grooming essentials to your bag and proceed to `/checkout`.
2. Select **"Razorpay Test Mode"**.
3. Click **"Proceed to Razorpay"** — this opens an interactive simulator with test card / UPI credentials.
4. Click **"Simulate Successful Payment"**.
5. The backend verifies the cryptographic HMAC signature, sets payment to `PAID`, updates order to `PROCESSING`, and redirects to the celebration confirmation screen.

### 2. Cash on Delivery (COD)
1. Select **"Cash on Delivery"** on the checkout page.
2. Click **"Confirm Cash on Delivery"**.
3. Order is placed with `PENDING` payment status and tracking is initialized.

---

## 🛡️ Administrative Portal (`/admin`)

Logged-in administrators can access:
- **Executive Dashboard** (`/admin`): Live statistics (Total Revenue, Total Orders, Registered Clients, Active Formulations, Pending Orders, Low Stock Alerts) and monthly revenue bar charts.
- **Product Management** (`/admin/products`): Add new formulations, edit pricing, update descriptions, manage stock, and upload imagery.
- **Order Logistics** (`/admin/orders`): Review orders, update status (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), and enter BlueDart/Delhivery tracking numbers.
- **Client Directory** (`/admin/customers`): Review customer order counts and lifetime spend.
- **Coupons Engine** (`/admin/coupons`): Create percentage or fixed discount promo codes (e.g., `RITUAL10`, `EMERGENCY15`).
- **Inquiries & Subscribers** (`/admin/messages`): Review contact form submissions and newsletter leads.

---

## 🔌 Switching from SQLite to MySQL Server 8.0

To run directly on MySQL:
1. Create database:
   ```sql
   CREATE DATABASE paw_and_ritual CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. In `backend/.env`, set:
   ```env
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/paw_and_ritual"
   ```
3. Push schema or import SQL:
   ```bash
   npx prisma db push --schema=prisma/schema.mysql.prisma
   node prisma/seed.js
   ```
   *Or import the provided `backend/paw_and_ritual_mysql.sql` into MySQL Workbench or phpMyAdmin.*

---

## 🧪 Automated End-to-End Verification

To verify all 11 critical user workflows (Health, Products, Category filters, Slugs, Auth, Admin Stats, Coupons, Order creation, Razorpay HMAC verification, Contact submission):

```bash
cd backend
node test_workflow.js
```

---

© 2024 PAW & RITUAL. Handcrafted with reverence for canine care.
