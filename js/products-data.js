/**
 * Akabati Enterprise — Initial Authoritative Product Catalogue
 * Quality, Our Pride — Ejisu, Ashanti, Ghana
 */

const INITIAL_PRODUCTS = [
  // --- ELECTRONICS ---
  {
    id: 'EL-001',
    sku: 'EL-SAM-65UHD',
    name: 'Samsung 65" Crystal UHD 4K Smart Television',
    slug: 'samsung-65-crystal-uhd-4k-smart-tv',
    category: 'Electronics',
    subcategory: 'Smart TVs',
    brand: 'Samsung',
    price: 7850,
    compareAtPrice: 8500,
    stock: 8,
    status: 'ACTIVE',
    tag: 'Popular',
    featured: true,
    condition: 'Brand New (Sealed)',
    warranty: '2 Years Official Samsung Ghana Warranty',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Immerse yourself in vivid 4K resolution with Crystal Processor 4K, HDR10+, Dynamic Crystal Color, and intuitive Smart Hub powered by Tizen OS.',
    specs: {
      'Display Size': '65-inch Crystal UHD',
      'Resolution': '3840 x 2160 (4K UHD)',
      'Refresh Rate': '60Hz Motion Xcelerator',
      'Smart OS': 'Samsung Tizen OS with AirPlay 2',
      'Connectivity': '3x HDMI, 2x USB, Wi-Fi 5, Bluetooth 5.2, Optical Audio',
      'Audio Output': '20W 2.0CH with Q-Symphony',
      'In The Box': 'Smart Remote, Power Cable, Stand Feet, User Manual'
    }
  },
  {
    id: 'EL-002',
    sku: 'EL-APP-MBP14',
    name: 'Apple MacBook Pro 14" (M3 Pro Chip)',
    slug: 'apple-macbook-pro-14-m3-pro',
    category: 'Electronics',
    subcategory: 'Computers & Laptops',
    brand: 'Apple',
    price: 28500,
    compareAtPrice: 30000,
    stock: 4,
    status: 'ACTIVE',
    tag: 'Flagship',
    featured: true,
    condition: 'Brand New (Factory Sealed)',
    warranty: '1 Year Apple International Warranty',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Blazing performance with Apple M3 Pro chip (11-core CPU, 14-core GPU), 18GB Unified Memory, and stunning 14.2" Liquid Retina XDR display with ProMotion 120Hz.',
    specs: {
      'Processor': 'Apple M3 Pro (11-Core CPU, 14-Core GPU)',
      'Memory': '18GB Unified RAM',
      'Storage': '512GB High-Speed SSD',
      'Display': '14.2" Liquid Retina XDR (3024x1964), 1600 nits peak',
      'Battery Life': 'Up to 18 hours wireless web',
      'Ports': '3x Thunderbolt 4 / USB-C, MagSafe 3, HDMI, SDXC slot',
      'Keyboard': 'Backlit Magic Keyboard with Touch ID'
    }
  },
  {
    id: 'EL-003',
    sku: 'EL-SNY-XM5',
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    category: 'Electronics',
    subcategory: 'Audio & Sound',
    brand: 'Sony',
    price: 4200,
    compareAtPrice: 4600,
    stock: 12,
    status: 'ACTIVE',
    tag: 'Best Seller',
    featured: true,
    condition: 'Brand New',
    warranty: '1 Year Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Industry-leading noise cancellation with dual Auto NC Optimizer processors, 8 microphones for crystal-clear calls, LDAC Hi-Res Wireless Audio, and 30-hour battery life.',
    specs: {
      'Driver Size': '30mm Carbon Fiber Composite',
      'Battery Life': 'Up to 30 Hours (ANC On), 40 Hours (ANC Off)',
      'Fast Charge': '3 min charge gives 3 hours playback',
      'Bluetooth': 'Version 5.2, Multipoint Connection (2 devices)',
      'Weight': '250g ultra-light comfort fit',
      'Codec Support': 'LDAC, AAC, SBC'
    }
  },
  {
    id: 'EL-004',
    sku: 'EL-APP-IP16P',
    name: 'iPhone 16 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-16-pro-max-256gb-natural-titanium',
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    price: 19800,
    compareAtPrice: 21500,
    stock: 6,
    status: 'ACTIVE',
    tag: 'New Arrival',
    featured: true,
    condition: 'Brand New (Factory Unlocked)',
    warranty: '1 Year Apple Official Warranty',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Engineered with Grade 5 Titanium, Camera Control button, 48MP Fusion camera system with 5x Telephoto, A18 Pro chip, and industry-leading battery longevity.',
    specs: {
      'Display': '6.9" Super Retina XDR OLED, Always-On, ProMotion 120Hz',
      'Chipset': 'Apple A18 Pro (6-core CPU, 6-core GPU, 16-core NPU)',
      'Storage': '256GB NVMe',
      'Main Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Network': '5G NR (Supports MTN, Telecel, AT Ghana)',
      'Build': 'Titanium Frame with Ceramic Shield Front'
    }
  },
  {
    id: 'EL-005',
    sku: 'EL-DEL-XPS15',
    name: 'Dell XPS 15 9530 Core i7 / 32GB / RTX 4060',
    slug: 'dell-xps-15-9530-core-i7-rtx-4060',
    category: 'Electronics',
    subcategory: 'Computers & Laptops',
    brand: 'Dell',
    price: 22400,
    compareAtPrice: 24500,
    stock: 5,
    status: 'ACTIVE',
    tag: 'High Performance',
    featured: false,
    condition: 'Brand New in Box',
    warranty: '2 Years Premium On-Site Warranty',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'The master workstation for creators and executives. 13th Gen Intel Core i7-13700H, NVIDIA GeForce RTX 4060 8GB GDDR6, 3.5K OLED Touch InfinityEdge screen.',
    specs: {
      'CPU': 'Intel Core i7-13700H (14 cores, up to 5.0 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6 (40W)',
      'RAM': '32GB DDR5 4800MHz Dual-Channel',
      'Storage': '1TB PCIe 4.0 NVMe M.2 SSD',
      'Screen': '15.6" 3.5K (3456x2160) OLED Touch Display, 400-nit',
      'Chassis': 'CNC Machined Aluminum with Carbon Fiber Palmrest'
    }
  },
  {
    id: 'EL-006',
    sku: 'EL-CAN-R6M2',
    name: 'Canon EOS R6 Mark II Mirrorless Camera + 24-105mm Kit',
    slug: 'canon-eos-r6-mark-ii-mirrorless-camera',
    category: 'Electronics',
    subcategory: 'Cameras & Photography',
    brand: 'Canon',
    price: 31200,
    compareAtPrice: 33500,
    stock: 3,
    status: 'ACTIVE',
    tag: 'Professional',
    featured: false,
    condition: 'Brand New',
    warranty: '2 Years Official Canon Warranty',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Versatile hybrid camera capturing 24.2MP full-frame stills up to 40 fps, oversampled 6K to 4K 60p 10-bit internal video, Dual Pixel CMOS AF II, and in-body 8-stop IS.',
    specs: {
      'Sensor': '24.2MP Full-Frame CMOS Sensor',
      'Video': '4K60p 10-Bit Internal, 6K RAW External via HDMI',
      'Continuous Shooting': 'Up to 40 fps Electronic / 12 fps Mechanical',
      'Stabilization': 'In-Body Image Stabilizer (IBIS) up to 8 Stops',
      'Lens Included': 'Canon RF 24-105mm f/4-7.1 IS STM Lens',
      'Card Slots': 'Dual SD/SDHC/SDXC (UHS-II) Slots'
    }
  },
  {
    id: 'EL-007',
    sku: 'EL-HIS-500FR',
    name: 'Hisense 500L Inverter French Door Smart Refrigerator',
    slug: 'hisense-500l-inverter-french-door-refrigerator',
    category: 'Electronics',
    subcategory: 'Home Appliances',
    brand: 'Hisense',
    price: 11500,
    compareAtPrice: 12800,
    stock: 7,
    status: 'ACTIVE',
    tag: 'Household Choice',
    featured: false,
    condition: 'Brand New',
    warranty: '3 Years Comprehensive, 10 Years Compressor Warranty',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Energy-efficient inverter compressor, Multi-Air Flow 360 cooling system, Total No Frost technology, digital temperature touch display, and spacious vegetable crisper drawers.',
    specs: {
      'Total Capacity': '500 Litres (Fridge: 350L / Freezer: 150L)',
      'Compressor': 'Intelligent Digital Inverter Technology',
      'Cooling System': 'Multi-Air Flow Surround Cooling',
      'Finish': 'Fingerprint Resistant Stainless Steel',
      'Noise Level': 'Quiet 38 dB operation',
      'Energy Efficiency': 'A+ High Efficiency Rating'
    }
  },
  {
    id: 'EL-008',
    sku: 'EL-JBL-PB310',
    name: 'JBL PartyBox 310 Portable Bluetooth High-Power Speaker',
    slug: 'jbl-partybox-310-portable-bluetooth-speaker',
    category: 'Electronics',
    subcategory: 'Audio & Sound',
    brand: 'JBL',
    price: 6900,
    compareAtPrice: 7500,
    stock: 9,
    status: 'ACTIVE',
    tag: 'Popular',
    featured: false,
    condition: 'Brand New',
    warranty: '1 Year Warranty',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=85'
    ],
    description: '240 watts of powerful JBL Pro Sound, dynamic synchronized light show that dances to the beat, 18-hour battery with built-in smooth glide wheels and telescopic handle.',
    specs: {
      'Power Output': '240W RMS',
      'Battery Life': 'Up to 18 Hours Rechargeable Battery',
      'Water Resistance': 'IPX4 Splashproof',
      'Inputs': 'Mic, Guitar, Bluetooth 5.1, USB, AUX 3.5mm',
      'Mobility': 'Built-in Wheels & Telescopic Trolley Handle',
      'Sound Modes': 'Bass Boost, True Wireless Stereo (TWS) Pairing'
    }
  },

  // --- VEHICLES ---
  {
    id: 'VH-001',
    sku: 'VH-TOY-PRADO23',
    name: '2023 Toyota Land Cruiser Prado TX-L 2.8L Turbo Diesel',
    slug: '2023-toyota-land-cruiser-prado-tx-l-diesel',
    category: 'Vehicles',
    subcategory: 'SUVs & 4x4',
    brand: 'Toyota',
    price: 890000,
    compareAtPrice: 940000,
    stock: 1,
    status: 'ACTIVE',
    tag: 'Ejisu Showroom',
    featured: true,
    condition: 'Foreign Used / Certified Clean Title',
    warranty: '6 Months Powertrain Warranty + 120-Point Inspection',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Renowned durability and luxury comfort. Full option 7-seater SUV with genuine leather interior, sunroof, dual-zone climate control, cool box, side steps, and robust 4WD capability.',
    specs: {
      'Make / Model': 'Toyota Land Cruiser Prado TX-L',
      'Year': '2023',
      'Mileage': '24,500 km verified',
      'Transmission': '6-Speed Automatic with Sequential Shift',
      'Engine': '2.8L 1GD-FTV Inline-4 Turbocharged Diesel',
      'Drivetrain': 'Full-Time 4WD with Torsen Limited-Slip Differential',
      'Fuel Type': 'Diesel (Highly fuel efficient)',
      'Seating Capacity': '7 Passengers with power-fold 3rd row',
      'Interior': 'Perforated beige leather, cooled & heated front seats',
      'Location': 'Available for physical inspection at Ejisu Showroom'
    }
  },
  {
    id: 'VH-002',
    sku: 'VH-MB-GLE450',
    name: '2022 Mercedes-Benz GLE 450 4MATIC AMG Line',
    slug: '2022-mercedes-benz-gle-450-4matic-amg-line',
    category: 'Vehicles',
    subcategory: 'Luxury SUVs',
    brand: 'Mercedes-Benz',
    price: 980000,
    compareAtPrice: 1050000,
    stock: 1,
    status: 'ACTIVE',
    tag: 'Executive Luxury',
    featured: true,
    condition: 'Foreign Used / First Owner Grade',
    warranty: '6 Months Dealership Mechanical Warranty',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Uncompromising luxury with AMG Styling Package, 21" AMG multi-spoke wheels, panoramic sliding glass roof, Burmester Surround Sound system, and dual 12.3-inch widescreen displays.',
    specs: {
      'Make / Model': 'Mercedes-Benz GLE 450 4MATIC',
      'Year': '2022',
      'Mileage': '31,200 km',
      'Transmission': '9G-TRONIC 9-Speed Automatic',
      'Engine': '3.0L Turbo Inline-6 with EQ Boost Mild Hybrid (362 hp)',
      'Drivetrain': '4MATIC Intelligent All-Wheel Drive',
      'Fuel Type': 'Petrol / Hybrid Assist',
      'Seating': '5 Luxury Seats, Nappa Leather Interior',
      'Features': 'AIRMATIC Air Suspension, 360-Degree Camera, Head-Up Display',
      'Location': 'Ejisu Showroom, Ashanti Region'
    }
  },
  {
    id: 'VH-003',
    sku: 'VH-TOY-RAV4HY',
    name: '2021 Toyota RAV4 Hybrid Limited AWD',
    slug: '2021-toyota-rav4-hybrid-limited-awd',
    category: 'Vehicles',
    subcategory: 'Compact SUVs',
    brand: 'Toyota',
    price: 395000,
    compareAtPrice: 420000,
    stock: 2,
    status: 'ACTIVE',
    tag: 'High Efficiency',
    featured: true,
    condition: 'Certified Pre-Owned',
    warranty: '6 Months Engine & Hybrid Battery Warranty',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Top-tier fuel efficiency averaging 40 MPG with electronic on-demand All-Wheel Drive. Equipped with JBL premium 11-speaker audio, SofTex trimmed heated/ventilated front seats, and digital rearview mirror.',
    specs: {
      'Make / Model': 'Toyota RAV4 Hybrid Limited',
      'Year': '2021',
      'Mileage': '42,800 km',
      'Transmission': 'Electronically controlled Continuously Variable (eCVT)',
      'Engine': '2.5L 4-Cylinder Hybrid System (219 combined hp)',
      'Drivetrain': 'Electronic On-Demand All-Wheel Drive (AWD)',
      'Fuel Economy': '41 City / 38 Highway MPG',
      'Safety': 'Toyota Safety Sense 2.0 (Lane Tracing, Pre-Collision)',
      'Location': 'Ready for immediate delivery in Ejisu or Kumasi'
    }
  },
  {
    id: 'VH-004',
    sku: 'VH-HON-ACC22',
    name: '2022 Honda Accord Touring 2.0L Turbo',
    slug: '2022-honda-accord-touring-2-0t',
    category: 'Vehicles',
    subcategory: 'Sedans & Saloons',
    brand: 'Honda',
    price: 310000,
    compareAtPrice: 335000,
    stock: 1,
    status: 'ACTIVE',
    tag: 'Executive Sedan',
    featured: false,
    condition: 'Foreign Used / Mint Condition',
    warranty: '3 Months Dealership Warranty',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Refined driving dynamics with a 252-horsepower turbocharged engine, adaptive damper suspension, head-up display, wireless Apple CarPlay & Android Auto, and ventilated leather seats.',
    specs: {
      'Make / Model': 'Honda Accord Touring 2.0T',
      'Year': '2022',
      'Mileage': '36,500 km',
      'Transmission': '10-Speed Shiftable Automatic with Paddle Shifters',
      'Engine': '2.0L VTEC Turbocharged 4-Cylinder (252 hp / 273 lb-ft)',
      'Drivetrain': 'Front-Wheel Drive',
      'Fuel Type': 'Petrol',
      'Audio': '450-Watt Premium Audio with 10 Speakers & Subwoofer',
      'Location': 'Akabati Enterprise Lot, Ejisu'
    }
  },
  {
    id: 'VH-005',
    sku: 'VH-TOY-HILUX23',
    name: '2023 Toyota Hilux Revo Rocco 4x4 Double Cabin (2.8L Diesel)',
    slug: '2023-toyota-hilux-revo-rocco-4x4-double-cabin',
    category: 'Vehicles',
    subcategory: 'Pickups & Trucks',
    brand: 'Toyota',
    price: 540000,
    compareAtPrice: 575000,
    stock: 2,
    status: 'ACTIVE',
    tag: 'Heavy Duty 4x4',
    featured: true,
    condition: 'Foreign Used Grade A+',
    warranty: '6 Months Mechanical Warranty',
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Built for tough Ghanaian terrain with the highest comfort. Rocco exterior sport bar, dark grey metallic styling, leather seats with electric adjustment, Apple CarPlay, and heavy-duty suspension.',
    specs: {
      'Make / Model': 'Toyota Hilux Revo Rocco Double Cab',
      'Year': '2023',
      'Mileage': '18,200 km',
      'Transmission': '6-Speed Super ECT Automatic',
      'Engine': '2.8L VN Turbo Diesel (204 hp / 500 Nm torque)',
      'Drivetrain': 'Part-time 4WD with Rear Differential Lock',
      'Payload / Towing': '1 Ton payload capacity / 3.5 Ton towing',
      'Body Type': 'Double Cabin Pickup',
      'Location': 'Ejisu Showroom Lot'
    }
  },
  {
    id: 'VH-006',
    sku: 'VH-HYU-TUC22',
    name: '2022 Hyundai Tucson N-Line AWD 2.5L',
    slug: '2022-hyundai-tucson-n-line-awd',
    category: 'Vehicles',
    subcategory: 'Compact SUVs',
    brand: 'Hyundai',
    price: 285000,
    compareAtPrice: 305000,
    stock: 1,
    status: 'ACTIVE',
    tag: 'Sport Styling',
    featured: false,
    condition: 'Certified Clean Title',
    warranty: '6 Months Warranty',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Sporty design cues with N-Line aerodynamic front grille, 19-inch alloy wheels, twin-tip exhaust, panoramic sunroof, Bose premium 8-speaker audio, and digital key convenience.',
    specs: {
      'Make / Model': 'Hyundai Tucson N-Line AWD',
      'Year': '2022',
      'Mileage': '28,400 km',
      'Transmission': '8-Speed Automatic with SHIFTRONIC',
      'Engine': '2.5L Smartstream 4-Cylinder (187 hp)',
      'Drivetrain': 'HTRAC All-Wheel Drive with Multi-Terrain Modes',
      'Interior': 'N-Line Sport Seats with Leather and Alcantara Inserts',
      'Location': 'Ejisu Showroom'
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_PRODUCTS };
}
