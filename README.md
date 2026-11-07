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
- **Dual Department Specialization (Preserved Content):**
  - **Electronics:** Smart 4K TVs, Apple MacBooks, flagship smartphones, studio headphones, and smart home appliances with detailed tech specifications (RAM, SSD, processor, display, warranty).
  - **Vehicles:** Certified 4x4 SUVs, luxury sedans, commercial pickups, and hybrids with structured automotive attributes (Year, Transmission, Mileage, Engine displacement, 120-Point Inspection, Showroom Location).
- **Interactive Catalogue & Faceted Discovery:**
  - Real-time search with keyboard focus shortcut (`/`).
  - View mode toggle: Switch between **Grid View** and **List View**.
  - In-Stock Only filter and category department tabs.
  - Live stock health meter and automatic discount percentage badge.
- **Wishlist & Side-by-Side Comparison:**
  - Save items to a persistent wishlist with header badge counter.
  - Compare up to 3 electronics or vehicles simultaneously with a full specification matrix.
- **Enhanced Quick View Modal:** 3 tabbed inspection views (Technical Specs, Quality Guarantee & 120-Point Inspection, and Showroom & Delivery times).
- **Cart & Multi-Step Checkout:**
  - **Free Delivery Progress Meter:** Dynamic visual bar tracking threshold for free delivery or Ejisu pickup.
  - **Coupon / Promo Code Engine:** Validates discounts (`AKABATI10`, `EJISUFREE`, `WELCOME50`) on the server layer.
  - **Step 1:** Recipient contact & Ghana delivery address (Region, City, Ghana Post Digital Address).
  - **Step 2:** Fulfilment selection (Ejisu Showroom Pickup, Ashanti Regional Courier, or Nationwide Express Delivery).
  - **Step 3:** Payment channel with **Interactive MoMo USSD Phone Simulator** (`*170#`), Paystack tokenized card gateway, or Official WhatsApp Concierge.
  - **Step 4:** Idempotent order placement generating an authoritative reference (e.g. `AKB-78291`).
- **Live Order Tracking & Tax Invoice Printing:**
  - Multi-stage visual state timeline (Placed → Verified → Picking → Dispatch → Delivered).
  - Route visualizer (*Ejisu Hub → Delivery Destination*).
  - Official Tax Invoice modal with print/save PDF support (`window.print()`).
- **Customer Portal:** Tabbed user dashboard with active orders tracking, saved wishlist items, and saved delivery addresses.

### 🛠️ Business Operations & Admin Console (Staff Portal)
- **Executive Metrics:** Authoritative revenue, total orders placed, on-hand inventory units, low-stock alerts, and Department performance split (Electronics vs Vehicles).
- **Catalogue Management:** Add new electronics or vehicles with structured attributes, adjust prices in GH₵, toggle active/archived publication status.
- **Audited Inventory Balances:** View on-hand and reserved stock; perform adjustments with mandatory audit reason codes (*Stock Receipt*, *Physical Count Correction*, *Damage/Loss*).
- **Orders Fulfilment Pipeline:** Advance orders through explicit state transitions (`PROCESSING` → `READY_FOR_PICKUP` → `DISPATCHED` → `DELIVERED`).
- **Financial Reconciliation:** Transaction log recording MoMo and card settlement statuses.
- **Promotions & Vouchers Manager:** Inspect active promo codes and thresholds.
- **System Audit Log:** Immutable chronological log of all administrative actions with actor and timestamp.

---

## 📁 Repository Structure

```text
Akabati Enterprise/
├── ARCHITECTURE.md          # Full production system architecture & delivery specification
├── README.md                # Project documentation and feature overview
├── index.html               # Main interactive storefront application
├── assets/
│   └── images/              # Official company logos
│       ├── akabati-logo-icon.png             # Official circular "AE" gold monogram logo
│       └── akabati-logo-full.png             # Official full horizontal logo lockup
├── css/
│   └── style.css            # Responsive CSS design system (Ghana Gold & Dark Slate palette)
└── js/
    ├── backend-service.js   # Domain services engine (Catalog, Inventory, Orders, Audit, Promo)
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
