const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Paw & Ritual Database Seed ---');

  // Clear existing data in reverse dependency order
  await prisma.review.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.blogPost.deleteMany({});

  // 1. Seed Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@PawRitual2024', salt);
  const customerPasswordHash = await bcrypt.hash('Password@123', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@pawandritual.com',
      passwordHash: adminPasswordHash,
      firstName: 'Alastair',
      lastName: 'Montague',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'elena.vance@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'Elena',
      lastName: 'Vance',
      phone: '+91 98111 22334',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            fullName: 'Elena Vance',
            phone: '+91 98111 22334',
            streetAddress: 'Apartment 4B, The Grand Residences, Golf Links',
            apartment: 'Tower 2, Apt 4B',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110003',
            country: 'India',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('Seeded Users: Admin and Customer');

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Nail Care',
      slug: 'nail-care',
      description: 'Precision ergonomic trimmers, guards, and hemostatic care designed for calm, safe, stress-free claw maintenance.',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1600&q=80',
      featured: true,
      sortOrder: 1,
    },
    {
      name: 'Paw Protection',
      slug: 'paw-protection',
      description: 'Nourishing organic beeswax salves and barrier balms shielding delicate pads from scorching asphalt and abrasive terrains.',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=80',
      featured: true,
      sortOrder: 2,
    },
    {
      name: 'Tear-Stain Care',
      slug: 'tear-stain-care',
      description: 'Gentle botanical wipes and soothing tonics formulated to cleanse discharge and prevent oxidation around sensitive canine eyes.',
      image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1000&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1600&q=80',
      featured: true,
      sortOrder: 3,
    },
    {
      name: 'Coat Care',
      slug: 'coat-care',
      description: 'Botanical leave-in elixirs, detangling sprays, and silk-protein infusions for effortless brush-outs and lustrous sheen.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=1600&q=80',
      featured: true,
      sortOrder: 4,
    },
    {
      name: 'Emergency Grooming Kits',
      slug: 'emergency-grooming-kits',
      description: 'Veterinary-curated first-response kits containing sterile tools, styptic aids, and step-by-step guidance for at-home incidents.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1600&q=80',
      featured: true,
      sortOrder: 5,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log('Seeded 5 Categories');

  // 3. Seed Products
  const productsData = [
    {
      name: 'Safety Dog Nail Clippers',
      slug: 'safety-dog-nail-clippers',
      sku: 'PR-NC-001',
      shortDescription: 'Surgical stainless steel precision clippers with integrated quick-stop guard and champagne gold ergonomic handle.',
      fullDescription: 'Crafted for discerning pet guardians, our Safety Dog Nail Clippers transform an anxious chore into a serene grooming ritual. Engineered from 3.5mm Japanese surgical-grade stainless steel, each blade delivers a clean, swift shear that prevents crushing of the nail bed. The built-in safety sensor guard creates an insurmountable barrier against over-cutting, protecting the sensitive quick. Finished with a brushed champagne gold matte handle wrapped in non-slip tactile silicone for supreme stability in either hand.',
      price: 1450,
      compareAtPrice: 1850,
      stock: 65,
      categoryId: categories['nail-care'].id,
      isFeatured: true,
      isBestseller: true,
      isEmergencyKit: false,
      rating: 4.9,
      reviewCount: 48,
      ingredients: 'Japanese 440C Stainless Steel, Champagne Gold PVD Coating, BPA-free Medical Grade Silicone Grip, Tempered Recoil Spring.',
      directions: '1. Settle your canine in a calm, well-illuminated setting.\n2. Gently inspect the underside of the claw to identify the quick (pink blood vessel line).\n3. Position the claw against the safety guard plate at a 45-degree angle.\n4. Apply firm, steady pressure in a single continuous movement.\n5. Reward your pet warmly after each paw.',
      safetyInfo: 'Inspect claw transparency prior to trimming. On dark claws, trim minuscule slivers incrementally rather than large segments. Keep Styptic Powder immediately accessible on your grooming tray. Store in dry case out of reach of children.',
      specifications: JSON.stringify({
        'Blade Material': 'High-Carbon Japanese 440C Stainless Steel',
        'Handle Finish': 'Textured Champagne Gold PVD with Tactile Grip',
        'Safety Feature': 'Integrated Sliding Quick-Stop Guard (2mm standard spacing)',
        'Locking Mechanism': 'Concealed Safety Slide Lock',
        'Origin': 'Designed in London, Hand-Assembled',
      }),
      variants: [
        { name: 'Size', value: 'Medium (Up to 22kg)', priceAdjustment: 0, stock: 40, sku: 'PR-NC-001-M' },
        { name: 'Size', value: 'Large (22kg to 50kg)', priceAdjustment: 200, stock: 25, sku: 'PR-NC-001-L' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Safety Dog Nail Clippers Luxury View' },
        { url: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Safety Guard Mechanism Close Up' },
        { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Paw Grooming in Progress' },
      ],
    },
    {
      name: 'Styptic Powder (Fast-Acting Hemostatic Aid)',
      slug: 'styptic-powder',
      sku: 'PR-ST-002',
      shortDescription: 'Fast-acting botanical hemostatic grooming powder in an apothecary amber glass jar for minor nail-trimming nicks.',
      fullDescription: 'An indispensable cornerstone of every thoughtful grooming apothecary. Formulated specifically to stop accidental capillary oozing during nail trimming in under 5 seconds. Combining pharmaceutical-grade ferric subsulfate with soothing bentonite clay, micronized potassium alum, and calendula flower extract, this ultra-fine powder creates a comfortable, instant hemostatic seal without distressing stinging. Encased in an ultraviolet-protective amber glass jar with a brass-finished airtight seal.',
      price: 850,
      compareAtPrice: 1050,
      stock: 90,
      categoryId: categories['nail-care'].id,
      isFeatured: true,
      isBestseller: true,
      isEmergencyKit: false,
      rating: 5.0,
      reviewCount: 62,
      ingredients: 'Active: Ferric Subsulfate 28%, Potassium Aluminum Sulfate (Alum), Bentonite Clay USP, Diatomaceous Earth, Calendula Officinalis Flower Powder, Zinc Oxide.',
      directions: '1. If the quick is nicked, remain calm to keep your dog at ease.\n2. Dispense a small pinch of powder into the jar lid or clean fingertip.\n3. Dip the bleeding nail tip directly into the powder, or apply with a dry cotton swab.\n4. Apply gentle, direct pressure to the nail tip for 5 to 10 seconds without rubbing.\n5. Wipe away excess powder once bleeding ceases.',
      safetyInfo: 'IMPORTANT VETERINARY NOTICE: Formulated exclusively for minor nail-trimming nicks and superficial claw abrasions. Never apply to deep puncture wounds, eye injuries, or body lacerations. If bleeding persists beyond 5 minutes of continuous pressure, seek immediate emergency veterinary attention.',
      specifications: JSON.stringify({
        'Net Weight': '50g (approx. 180 applications)',
        'Packaging': 'Apothecary Amber UV-Shield Glass with Brass Cap',
        'Shelf Life': '36 Months sealed, store below 28°C in a dry place',
        'Cruelty Free': '100% Leaping Bunny Standard Compliant',
      }),
      variants: [
        { name: 'Volume', value: '50g Apothecary Jar', priceAdjustment: 0, stock: 60, sku: 'PR-ST-002-50' },
        { name: 'Volume', value: '100g Studio Refill', priceAdjustment: 550, stock: 30, sku: 'PR-ST-002-100' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1608248597359-253303649692?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Styptic Powder Apothecary Amber Jar' },
        { url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Careful Canine Paw Care' },
        { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Fine Powder Texture' },
      ],
    },
    {
      name: 'Tear-Stain Cleansing Botanical Wipes',
      slug: 'tear-stain-wipes',
      sku: 'PR-TS-003',
      shortDescription: 'Ultra-soft biodegradable textured wipes infused with organic chamomile and eyebright extract for gentle eye hygiene.',
      fullDescription: 'Specially developed for delicate facial contours and sensitive tear ducts. Our Tear-Stain Botanical Wipes gently lift porphyrin buildup, dry mucus, and saliva stains without irritating sensitive eyes. Woven from 100% biodegradable eucalyptus pulp fibers, each pre-moistened wipe is infused with organic German chamomile hydrosol, euphrasia (eyebright), and soothing aloe vera. Free from parabens, bleach, sulfates, alcohol, synthetic fragrances, and optical brighteners.',
      price: 950,
      compareAtPrice: 1200,
      stock: 80,
      categoryId: categories['tear-stain-care'].id,
      isFeatured: true,
      isBestseller: false,
      isEmergencyKit: false,
      rating: 4.8,
      reviewCount: 39,
      ingredients: 'Purified Water (Aqua), Organic Matricaria Chamomilla Hydrosol, Euphrasia Officinalis (Eyebright) Extract, Aloe Barbadensis Leaf Juice, Vegetable Glycerin, Decyl Glucoside (Coconut Derived), Sodium Benzoate, Potassium Sorbate.',
      directions: '1. Pull a single fresh wipe from the sealed foil-lined canister.\n2. Gently wipe downward along the fur below the inner corner of the eye.\n3. Use a separate clean portion of the wipe for each eye to prevent cross-contamination.\n4. No rinsing required. Safe for twice-daily morning and evening rituals.',
      safetyInfo: 'For external ocular hygiene only. Do not place directly onto the eyeball or inside the eyelid. If pet exhibits redness, swelling, or excessive pawing at the eye, discontinue use and consult your veterinarian.',
      specifications: JSON.stringify({
        'Count': '80 Textured Botanical Wipes',
        'Material': '100% Biodegradable Unbleached Eucalyptus Fiber',
        'pH Balance': 'pH 6.8 (Ophthalmologist-balanced for canine tears)',
        'Free From': 'Alcohol, Fragrance, Parabens, Dyes, Bleaching Agents',
      }),
      variants: [
        { name: 'Count', value: '80 Wipes Tub', priceAdjustment: 0, stock: 50, sku: 'PR-TS-003-80' },
        { name: 'Count', value: 'Twin Pack (160 Wipes)', priceAdjustment: 750, stock: 30, sku: 'PR-TS-003-160' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Gentle Pet Eye Care Wipes' },
        { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Canine Facial Cleansing' },
      ],
    },
    {
      name: 'Leave-In Detangling & Conditioning Coat Spray',
      slug: 'leave-in-detangling-coat-spray',
      sku: 'PR-CS-004',
      shortDescription: 'Silkening leave-in botanical mist with cold-pressed Moroccan argan oil and hydrolyzed silk proteins for knot release.',
      fullDescription: 'The ultimate antidote to brushing resistance and stubborn knots. Our Leave-In Detangling Coat Spray softens the hair cuticle, eliminates static electricity, and restores natural gloss without leaving heavy silicone residue. Infused with cold-pressed organic Moroccan argan oil, plant-based hydrolyzed silk amino acids, and colloidal oat milk, it penetrates deeply into the undercoat to unravel mats effortlessly while imparting a subtle whisper of French lavender and cedarwood.',
      price: 1250,
      compareAtPrice: 1550,
      stock: 55,
      categoryId: categories['coat-care'].id,
      isFeatured: true,
      isBestseller: true,
      isEmergencyKit: false,
      rating: 4.9,
      reviewCount: 54,
      ingredients: 'Organic Aloe Barbadensis Leaf Juice, Hydrolyzed Silk Amino Acids, Cold-Pressed Argania Spinosa (Argan) Kernel Oil, Colloidal Avena Sativa (Oat) Extract, Rosemary Leaf Water, Vegetable Glycerin, Hydrolyzed Wheat Protein, Lavandula Angustifolia (0.05% gentle therapeutic distillate).',
      directions: '1. Shake bottle gently before use.\n2. Mist evenly over dry or damp fur from a distance of 15-20cm, shielding pet eyes.\n3. For stubborn mats, spray directly onto the knot and allow 2 minutes to penetrate.\n4. Gently separate fur with fingertips or slicker brush starting at the tips, working toward the roots.\n5. Follow with full body brushing for brilliant shine.',
      safetyInfo: 'For topical fur application only. Avoid direct spraying into eyes, inside ears, or on open skin lesions. Safe for puppies over 8 weeks old. Non-toxic if licked in small grooming amounts.',
      specifications: JSON.stringify({
        'Volume': '250ml Amber PET Fine-Mist Bottle',
        'Coat Suitability': 'Ideal for Long, Double, Curly, Silky, and Drop Coats',
        'Residue': 'Zero greasy residue, quick air-drying formulation',
        'pH Level': 'pH 6.5 (Balanced for canine epidermal barrier)',
      }),
      variants: [
        { name: 'Volume', value: '250ml Fine-Mist Bottle', priceAdjustment: 0, stock: 35, sku: 'PR-CS-004-250' },
        { name: 'Volume', value: '500ml Salon Refill', priceAdjustment: 850, stock: 20, sku: 'PR-CS-004-500' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Leave-In Conditioning Coat Spray' },
        { url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Dog Fur Brushing Luxury' },
      ],
    },
    {
      name: 'Organic Beeswax Botanical Paw Balm',
      slug: 'organic-beeswax-paw-balm',
      sku: 'PR-PB-005',
      shortDescription: '100% natural organic beeswax and unrefined shea butter salve for dry, cracked pads and hot pavement defense.',
      fullDescription: 'Handcrafted in micro-batches, our Organic Beeswax Paw Balm forms a breathable, semi-permeable protective shield over delicate foot pads and dry noses. Blended from unbleached wild beeswax, raw fair-trade African shea butter, virgin coconut oil, and solar-infused calendula flower oil. It locks in cellular moisture while shielding sensitive pads against abrasive city concrete, heated asphalt, and sharp garden debris. 100% lick-safe and entirely edible.',
      price: 890,
      compareAtPrice: 1150,
      stock: 75,
      categoryId: categories['paw-protection'].id,
      isFeatured: true,
      isBestseller: true,
      isEmergencyKit: false,
      rating: 5.0,
      reviewCount: 71,
      ingredients: 'Cera Alba (Pure Organic Unbleached Beeswax), Butyrospermum Parkii (Fair Trade Raw Shea Butter), Cocos Nucifera (Virgin Cold-Pressed Coconut Oil), Olea Europaea (Olive) Fruit Oil Infused with Calendula Flowers, Non-GMO Tocopherol (Natural Vitamin E).',
      directions: '1. Cleanse paw pads with a damp cloth or warm water and pat dry.\n2. Warm a modest amount between fingers or rub the tin directly onto the pad surface.\n3. Massage tenderly into paw pads, webbing, and dry nose leather.\n4. Allow 1-2 minutes for absorption. Distract with a treat or belly rub while the balm penetrates.',
      safetyInfo: 'Completely lick-safe and non-toxic. Formulated without essential oils, synthetic petroleum, zinc, or artificial preservatives. Store in a cool, shaded environment below 30°C to prevent natural melting.',
      specifications: JSON.stringify({
        'Net Weight': '60g Brushed Gold Screw-Top Tin',
        'Safety': '100% Lick-Safe, Human-Grade Organic Ingredients',
        'Protection': 'All-Weather (Hot Asphalt, Rough Gravel, Winter Salts)',
        'Texture': 'Rich, melt-on-contact melting balm',
      }),
      variants: [
        { name: 'Weight', value: '60g Travel Tin', priceAdjustment: 0, stock: 45, sku: 'PR-PB-005-60' },
        { name: 'Weight', value: '120g Family Tin', priceAdjustment: 600, stock: 30, sku: 'PR-PB-005-120' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Organic Beeswax Paw Balm Tin' },
        { url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Canine Paws Protected and Soft' },
      ],
    },
    {
      name: 'The Complete Canine Emergency Grooming Kit',
      slug: 'complete-canine-emergency-grooming-kit',
      sku: 'PR-EK-006',
      shortDescription: 'The ultimate veterinary-inspired emergency grooming kit in an olive-green roll case for absolute peace of mind.',
      fullDescription: 'Every pet parent dreads the unexpected: a sudden nail split during a brisk walk, an accidental nick near the quick, burrs matted painfully close to the skin, or cracked bleeding pads on summer concrete. The Paw & Ritual Complete Canine Emergency Grooming Kit is your calm, composed response. Housed in a water-resistant olive-green roll case with brushed champagne hardware, this collection brings together professional-grade surgical tools and soothing botanical treatments with a waterproof Emergency Action protocol card.',
      price: 3850,
      compareAtPrice: 4800,
      stock: 40,
      categoryId: categories['emergency-grooming-kits'].id,
      isFeatured: true,
      isBestseller: true,
      isEmergencyKit: true,
      rating: 5.0,
      reviewCount: 31,
      ingredients: 'Kit includes full-size editions: 1x Safety Japanese Steel Nail Clippers, 1x 50g Fast-Acting Styptic Powder, 1x 60g Organic Beeswax Paw Balm, 1x Blunt-Tip Stainless Surgical Grooming Shears, 20x Sterile Gauze Swabs, 20x Botanical Tear & Paw Wipes, 1x Waterproof Step-by-Step Emergency Guide.',
      directions: 'Unroll the kit flat onto a clean surface. Refer to the water-resistant triage card for the specific incident (e.g. nail quicking, matted fur close to skin, foreign burs). Keep calm and speak softly to comfort your pet.',
      safetyInfo: 'Intended for minor home grooming emergencies, first-aid, and routine preventative care. In cases of arterial bleeding, puncture wounds, eye trauma, or severe pain, apply initial pressure and transport your dog immediately to an accredited emergency veterinary clinic.',
      specifications: JSON.stringify({
        'Case Material': 'Water-Repellent Sage Green Heavy Canvas with Brass Hardware',
        'Dimensions': '24cm x 14cm x 8cm (rolled)',
        'Inclusions': '7 Essential Tools & Apothecary Essentials',
        'Warranty': 'Lifetime Guarantee on all surgical stainless steel tools',
      }),
      variants: [
        { name: 'Kit Edition', value: 'Complete Edition with Luxury Canvas Roll', priceAdjustment: 0, stock: 25, sku: 'PR-EK-006-STD' },
        { name: 'Kit Edition', value: 'Deluxe Edition with Vegan Leather Travel Case', priceAdjustment: 950, stock: 15, sku: 'PR-EK-006-DLX' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Complete Canine Emergency Grooming Kit' },
        { url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Grooming Tools and Dog' },
        { url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1200&q=80', isPrimary: false, altText: 'Pet First Aid Kit Essentials' },
      ],
    },
    {
      name: 'Soothing Antiseptic Paw & Coat Cleansing Mist',
      slug: 'antiseptic-paw-coat-cleansing-mist',
      sku: 'PR-AM-007',
      shortDescription: 'Hypochlorous botanical cleansing mist that neutralizes outdoor bacteria, mud, and minor scuffs after park excursions.',
      fullDescription: 'Formulated with veterinary-grade hypochlorous acid (HOCl) and colloidal silver, this soothing mist instantly sanitizes paws, belly fur, and minor scrapes without stinging or stripping the skin microbiome. Perfect for spraying paws before re-entering the home after muddy walks or city sidewalks. Lick-safe, non-sensitizing, and hypoallergenic.',
      price: 1100,
      compareAtPrice: 1350,
      stock: 50,
      categoryId: categories['paw-protection'].id,
      isFeatured: false,
      isBestseller: false,
      isEmergencyKit: false,
      rating: 4.7,
      reviewCount: 22,
      ingredients: 'Electrolyzed Oxygenated Water, Hypochlorous Acid (0.015%), Pharmaceutical Grade Colloidal Silver, Chamomile Floral Hydrosol.',
      directions: 'Spray generously directly onto paws and underside after walks. Allow 30 seconds of contact time, then wipe clean with a soft towel.',
      safetyInfo: 'Safe if licked. Safe for all dog breeds and puppies over 6 weeks old.',
      specifications: JSON.stringify({
        'Volume': '200ml Fine Spray',
        'Active Agent': 'Pure Hypochlorous Acid 0.015%',
        'Action': '99.9% Antibacterial, Anti-itch, Hypoallergenic',
      }),
      variants: [
        { name: 'Volume', value: '200ml Bottle', priceAdjustment: 0, stock: 35, sku: 'PR-AM-007-200' },
        { name: 'Volume', value: '500ml Refill', priceAdjustment: 700, stock: 15, sku: 'PR-AM-007-500' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Antiseptic Paw Cleansing Mist' },
      ],
    },
    {
      name: 'Botanical Coat De-Shedding & Massage Rake',
      slug: 'botanical-coat-deshedding-rake',
      sku: 'PR-DR-008',
      shortDescription: 'Dual-density stainless steel rounded pin rake with solid beechwood handle for removing loose undercoat without irritation.',
      fullDescription: 'Engineered for dense double coats and shedding breeds, this grooming rake features 360-degree rotating rounded stainless steel pins that glide smoothly through thick fur without tugging the skin. Carved from sustainable German beechwood with brass ferrule accents, it turns daily brushing into an affectionate therapeutic massage.',
      price: 1650,
      compareAtPrice: 2100,
      stock: 45,
      categoryId: categories['coat-care'].id,
      isFeatured: false,
      isBestseller: true,
      isEmergencyKit: false,
      rating: 4.9,
      reviewCount: 28,
      ingredients: 'Sustainably Harvested FSC Beechwood, Marine-Grade Stainless Steel Pins with Rounded Tips, Antiqued Brass Ferrule.',
      directions: 'Hold handle loosely. Brush gently in the direction of hair growth using long, flowing strokes. Clear gathered undercoat from pins periodically.',
      safetyInfo: 'Do not use excessive pressure against bare skin. Keep away from water immersion to preserve natural wood luster.',
      specifications: JSON.stringify({
        'Material': 'FSC Beechwood & Stainless Steel',
        'Pin Count': '24 Rotating Smooth Pins',
        'Recommended For': 'Golden Retrievers, German Shepherds, Huskies, Corgis, and Double Coats',
      }),
      variants: [
        { name: 'Size', value: 'Standard (All Breeds)', priceAdjustment: 0, stock: 45, sku: 'PR-DR-008-STD' },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80', isPrimary: true, altText: 'Botanical De-Shedding Rake' },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, images, ...productFields } = p;
    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: idx,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            value: v.value,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock,
            sku: v.sku,
          })),
        },
        inventoryLogs: {
          create: {
            quantity: productFields.stock,
            type: 'INITIAL',
            notes: 'Initial production batch stock',
          },
        },
      },
    });

    // Add sample reviews for this product
    if (createdProduct.slug === 'safety-dog-nail-clippers') {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            authorName: 'Aarav Mehta',
            petName: 'Leo',
            petBreed: 'Golden Retriever',
            rating: 5,
            title: 'Finally, no fear during nail trims!',
            comment: 'Nail clipping used to be a two-person wrestling match with Leo. The safety guard gives me the exact confidence I needed. The Japanese blades cut like warm butter without making that terrifying loud snap.',
            isVerifiedPurchase: true,
          },
          {
            productId: createdProduct.id,
            authorName: 'Sunita Rao',
            petName: 'Milo',
            petBreed: 'French Bulldog',
            rating: 5,
            title: 'Worth every rupee for peace of mind.',
            comment: 'The champagne gold finish and weight in hand feels like a high-end salon tool. Very comfortable grip and zero slipping.',
            isVerifiedPurchase: true,
          },
        ],
      });
    } else if (createdProduct.slug === 'styptic-powder') {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            authorName: 'Pooja Hegde',
            petName: 'Bruno',
            petBreed: 'Labrador Retriever',
            rating: 5,
            title: 'A true emergency lifesaver',
            comment: 'Accidentally trimmed Bruno’s black nail slightly too close. I dipped his nail into the jar and the bleeding stopped in under three seconds. The apothecary glass jar is gorgeous too.',
            isVerifiedPurchase: true,
          },
        ],
      });
    } else if (createdProduct.slug === 'organic-beeswax-paw-balm') {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            authorName: 'Vikramaditya S.',
            petName: 'Casper',
            petBreed: 'Samoyed',
            rating: 5,
            title: 'Healed dry, cracked paws in 3 days',
            comment: 'Living in Delhi, the hot pavements dry out Casper’s paw pads. This balm smells so gentle and natural, no synthetic perfume, and his pads are baby-soft now. Plus it is 100% lick-safe!',
            isVerifiedPurchase: true,
          },
        ],
      });
    } else if (createdProduct.slug === 'complete-canine-emergency-grooming-kit') {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            authorName: 'Nandini Sen',
            petName: 'Bella & Cooper',
            petBreed: 'Beagle & Cockapoo',
            rating: 5,
            title: 'The best gift for any responsible dog parent',
            comment: 'The presentation is stunning. The heavy canvas roll feels so luxurious, and having the waterproof emergency triage card right next to the styptic powder and shears gives me immense confidence when traveling.',
            isVerifiedPurchase: true,
          },
        ],
      });
    }
  }

  console.log('Seeded 8 Products with Variants, Images, Inventory, and Reviews');

  // 4. Seed Coupons
  const couponsData = [
    {
      code: 'RITUAL10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 500,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'EMERGENCY15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 2000,
      maxDiscount: 1000,
      usageLimit: 200,
      isActive: true,
    },
    {
      code: 'WELCOME50',
      discountType: 'FIXED',
      discountValue: 150,
      minOrderValue: 1200,
      usageLimit: 300,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }
  console.log('Seeded Promotional Coupons');

  // 5. Seed Sample Orders for Admin Dashboard demonstration
  const nailClipper = await prisma.product.findUnique({ where: { slug: 'safety-dog-nail-clippers' } });
  const stypticPowder = await prisma.product.findUnique({ where: { slug: 'styptic-powder' } });
  const emergencyKit = await prisma.product.findUnique({ where: { slug: 'complete-canine-emergency-grooming-kit' } });

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'PR-2024-8841',
      userId: customer.id,
      customerName: 'Elena Vance',
      customerEmail: 'elena.vance@example.com',
      customerPhone: '+91 98111 22334',
      status: 'DELIVERED',
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      subtotal: 2300,
      shippingFee: 0,
      discountAmount: 230,
      totalAmount: 2070,
      couponCode: 'RITUAL10',
      trackingNumber: 'BLUEDART-8829104',
      notes: 'Please leave with concierge if unavailable.',
      shippingAddressSnapshot: JSON.stringify({
        fullName: 'Elena Vance',
        phone: '+91 98111 22334',
        streetAddress: 'Apartment 4B, The Grand Residences, Golf Links',
        apartment: 'Tower 2, Apt 4B',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110003',
        country: 'India',
      }),
      items: {
        create: [
          {
            productId: nailClipper.id,
            productName: nailClipper.name,
            productSku: nailClipper.sku,
            price: nailClipper.price,
            quantity: 1,
            total: nailClipper.price,
            variantInfo: 'Size: Medium (Up to 22kg)',
          },
          {
            productId: stypticPowder.id,
            productName: stypticPowder.name,
            productSku: stypticPowder.sku,
            price: stypticPowder.price,
            quantity: 1,
            total: stypticPowder.price,
            variantInfo: 'Volume: 50g Apothecary Jar',
          },
        ],
      },
      payment: {
        create: {
          paymentMethod: 'RAZORPAY',
          razorpayOrderId: 'order_Nxk92Jksd0281',
          razorpayPaymentId: 'pay_Nxk94Kjsd0192',
          razorpaySignature: 'simulated_valid_signature_2024',
          amount: 2070,
          currency: 'INR',
          status: 'SUCCESS',
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'PR-2024-8842',
      customerName: 'Raghav Singhania',
      customerEmail: 'raghav.s@corporate.in',
      customerPhone: '+91 99220 11223',
      status: 'PROCESSING',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      subtotal: 3850,
      shippingFee: 0,
      discountAmount: 0,
      totalAmount: 3850,
      trackingNumber: 'DELHIVERY-993810',
      notes: 'Call before delivery.',
      shippingAddressSnapshot: JSON.stringify({
        fullName: 'Raghav Singhania',
        phone: '+91 99220 11223',
        streetAddress: 'Bungalow 18, Koregaon Park North',
        apartment: '',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
      }),
      items: {
        create: [
          {
            productId: emergencyKit.id,
            productName: emergencyKit.name,
            productSku: emergencyKit.sku,
            price: emergencyKit.price,
            quantity: 1,
            total: emergencyKit.price,
            variantInfo: 'Kit Edition: Complete Edition with Luxury Canvas Roll',
          },
        ],
      },
      payment: {
        create: {
          paymentMethod: 'COD',
          amount: 3850,
          currency: 'INR',
          status: 'PENDING',
        },
      },
    },
  });

  console.log('Seeded Sample Orders and Payments');

  // 6. Seed Blog Posts / Guides
  const blogPostsData = [
    {
      title: 'How to Safely Clip Dog Nails Without Hitting the Quick: A Calming Ritual',
      slug: 'how-to-safely-clip-dog-nails-without-hitting-the-quick',
      excerpt: 'Learn the gentle art of claw trimming. Step-by-step guidance on identifying the quick, desensitizing paws, and keeping your canine serene.',
      content: `Nail maintenance should never feel like an anxious struggle. For our dogs, paws are hyper-sensitive tactile instruments packed with nerve endings, proprioceptive receptors, and vascular conduits.

### Understanding the Anatomy of the Quick
Inside every canine claw lies the 'quick'—a living core containing blood vessels and sensitive nerve fibers. On clear or translucent nails, the quick is readily identifiable as a delicate pinkish triangle. On dark or black nails, the quick remains concealed within the pigmented keratin sheath.

### The Gradual Angle Method
Rather than positioning the clippers horizontally across the claw, hold the clippers at a 45-degree angle beneath the claw tip. Clip only 1 to 2 millimeters at a time. After each micro-shear, examine the exposed center:
- If the cross-section appears chalky and dry white, you are safely within dead keratin.
- As you approach the living quick, you will notice a dark, slightly moist circular center. This is your cue to cease cutting immediately.

### Creating a Peaceful Atmosphere
Always prepare your grooming space in advance:
1. Lay down an orthopedic grooming mat with good grip.
2. Have your Safety Dog Nail Clippers and an open jar of Styptic Powder right at hand.
3. Offer gentle touch desensitization on the paws before clipping.
4. Reward warmly after each claw.

If an accidental nick ever occurs, stay calm. Pet anxiety mirrors human tension. Gently press a pinch of styptic powder onto the claw tip for 5 seconds to establish an immediate hemostatic seal.`,
      coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      category: 'Grooming Care',
      readTime: '5 min read',
    },
    {
      title: 'Emergency First-Response: Minor Grooming Nicks vs. Urgent Veterinary Visits',
      slug: 'minor-grooming-nicks-vs-urgent-veterinary-visits',
      excerpt: 'A comprehensive medical guide for pet parents on triaging home grooming incidents and knowing when emergency clinic care is necessary.',
      content: `At Paw & Ritual, we advocate for transparent, responsible pet stewardship. While high-quality grooming tools reduce accidents, knowing how to differentiate between minor at-home incidents and veterinary emergencies is vital for every dog guardian.

### Minor Situations Manageable at Home
1. **Accidental Quick Nicks:** Blood loss is superficial and easily arrested within seconds using hemostatic styptic powder and continuous gentle pressure.
2. **Surface Pad Scrapes:** Minor abrasions from sidewalk friction that have stopped bleeding and show no signs of deep punctures. Thoroughly cleanse with an antiseptic mist and seal with pure organic beeswax balm.
3. **Superficial Matting:** Knots that have at least 1cm of daylight between the fur base and the skin, which can be eased using silk detangling spray and blunt shears.

### Urgent Veterinary Emergencies (Do Not Hesitate)
Seek immediate emergency medical care if you observe any of the following:
- **Pulsing or Arterial Bleeding:** Blood spurting in sync with heartbeats or bleeding that fails to stop after 5 full minutes of firm, direct pressure.
- **Deep Skin Tears or Lacerations:** Any wound through the dermal layer where subcutaneous fat or muscle is visible.
- **Eye Trauma:** Blepharospasm (squinting), cloudiness, cornea scratches, or discharge following eye-area grooming.
- **Signs of Heat Shock:** Excessive panting, brick-red gums, glazed eyes, or collapse during warm grooming sessions.`,
      coverImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
      category: 'Emergency Care',
      readTime: '6 min read',
    },
    {
      title: 'The Anatomy of a Paw: Hot Pavements, Winter Salts & Botanical Protection',
      slug: 'the-anatomy-of-a-paw-botanical-protection',
      excerpt: 'Discover why dog paw pads are vulnerable to urban hazards and how organic beeswax creates a breathable protective barrier.',
      content: `Dog foot pads are extraordinary biomechanical shock absorbers. Composed of specialized keratinized stratified squamous epithelium and subcutaneous adipose tissue, they insulate canines from varied terrains.

However, modern asphalt absorbs solar radiation intensely. When ambient air temperature is 30°C (86°F), dark asphalt can exceed 57°C (135°F) in direct midday sunlight. At this temperature, irreversible thermal burns can occur in less than 60 seconds of contact.

### The 7-Second Rule
Before taking your dog on a stroll, place the back of your bare hand firmly against the pavement for 7 seconds. If it is uncomfortable for your skin, it is dangerously hot for your pet's paw pads.

### Botanical Salves: The Breathable Shield
Synthetic petroleum jellies form an impermeable suffocating layer that softens the pad tissue excessively, increasing the risk of tears. In contrast, pure organic unbleached beeswax paired with cold-pressed coconut oil and wild-harvested calendula provides a flexible, semi-permeable shield. It repels pavement heat, locks in natural moisture, and allows the sweat glands in the paw pads to respirate normally.`,
      coverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
      category: 'Paw Wellness',
      readTime: '4 min read',
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.create({ data: post });
  }
  console.log('Seeded Editorial Blog Posts');

  // 7. Seed Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'sophia.laurent@gmail.com', source: 'homepage' },
      { email: 'karan.johar@agency.in', source: 'checkout' },
    ],
  });

  console.log('--- Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
