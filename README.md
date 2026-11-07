# Akabati Enterprise — E-Commerce Platform

> **"Quality, Our Pride"**  
> *Ejisu, Ashanti Region, Ghana*  
> **Contact:** +233 244 027 477 (0244 027 477)  
> **Email:** felixakabati007@gmail.com  
> **Business Scope:** Electronics & Vehicles  

---

## 🌟 Overview

**Akabati Enterprise** is a high-performance, responsive e-commerce web platform engineered for Ghanaian commerce standards. It provides a customer storefront for smart electronics and certified vehicles, coupled with a business operations console for catalogue, inventory, orders, and financial reconciliation.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Dual Department Specialization:**
  - **Electronics:** Smart 4K TVs, Apple MacBooks, flagships smartphones, studio headphones, and smart home appliances with detailed tech specifications (RAM, SSD, processor, display, warranty).
  - **Vehicles:** Certified 4x4 SUVs, luxury sedans, commercial pickups, and hybrids with structured automotive attributes (Year, Transmission, Mileage, Engine displacement, 120-Point Inspection, Showroom Location).
- **Interactive Catalogue:** Real-time search, category filtering, price sorting, and live stock availability badges.
- **Side-by-Side Product Comparison:** Compare up to 3 items with an interactive side-by-side specification matrix.
- **Quick View & Gallery Switcher:** Detailed specification sheets, photo galleries, and direct WhatsApp enquiry links.
- **Cart & Multi-Step Checkout:**
  - **Step 1:** Recipient contact & Ghana delivery address (Region, City, Ghana Post Digital Address).
  - **Step 2:** Fulfilment selection (Ejisu Showroom Pickup, Ashanti Regional Courier, or Nationwide Express Delivery).
  - **Step 3:** Payment channel (MTN Mobile Money, Telecel Cash, Card / Bank Transfer via Paystack adapter, or Official WhatsApp Concierge).
  - **Step 4:** Idempotent order placement generating an authoritative reference (e.g. `AKB-78291`).
- **Live Order Tracking:** Multi-stage visual state timeline (Placed → Verified → Picking → Dispatch → Delivered).

### 🛠️ Business Operations & Admin Console (Staff Portal)
- **Executive Metrics:** Authoritative revenue, total orders placed, on-hand inventory units, and low-stock alerts.
- **Catalogue Management:** Add new electronics or vehicles with structured attributes, adjust prices in GH₵, toggle active/archived publication status.
- **Audited Inventory Balances:** View on-hand and reserved stock; perform adjustments with mandatory audit reason codes (*Stock Receipt*, *Physical Count Correction*, *Damage/Loss*).
- **Orders Fulfilment Pipeline:** Advance orders through explicit state transitions (`PROCESSING` → `READY_FOR_PICKUP` → `DISPATCHED` → `DELIVERED`).
- **Financial Reconciliation:** Transaction log recording MoMo and card settlement statuses.

---

## 📁 Repository Structure

```text
Akabati Enterprise/
├── ARCHITECTURE.md          # Full production system architecture & delivery specification
├── README.md                # Project documentation and feature overview
├── index.html               # Main interactive storefront application
├── assets/
│   └── images/              # Authentic company photographs (Ejisu showroom, brand wall, team)
│       ├── akabati-showroom-main.jpg
│       ├── akabati-brand-wall.jpg
│       ├── akabati-customer-service.jpg
│       └── akabati-packaging-dispatch.jpg
├── css/
│   └── style.css            # Responsive CSS design system (Ghana Gold & Dark Slate palette)
└── js/
    ├── products-data.js     # Verified seed catalogue for electronics & vehicles
    └── app.js               # State engine, cart, checkout, tracking & admin console
```

---

## 💻 Quick Start / Local Preview

1. Clone the repository:
   ```bash
   git clone https://github.com/FelixAkabati007/AkabatiEnterprise.git
   cd AkabatiEnterprise
   ```

2. Open `index.html` in any modern web browser or start a local HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000` to interact with the storefront, track existing orders (`AKB-78291` or `AKB-84910`), test the cart and checkout, or open the **Staff Console** in the top navigation!

---

## 🛡️ License & Trademarks

© 2026 Akabati Enterprise. All rights reserved.  
*Ejisu, Ashanti Region, Ghana.*
