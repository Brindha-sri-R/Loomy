export const CATEGORIES_LIST = [
  { name: 'New Arrivals', slug: 'New Arrivals', count: 18 },
  { name: 'Best Sellers', slug: 'Best Sellers', count: 14 },
  { name: 'Oversized T-shirts', slug: 'Oversized T-shirts', count: 24 },
  { name: 'Shirts', slug: 'Shirts', count: 32 },
  { name: 'Hoodies & Sweatshirts', slug: 'Hoodies & Sweatshirts', count: 28 },
  { name: 'Jackets & Outerwear', slug: 'Jackets & Outerwear', count: 36 },
  { name: 'Trousers & Pants', slug: 'Trousers & Pants', count: 22 },
  { name: 'Denim', slug: 'Denim', count: 19 },
  { name: 'Knitwear', slug: 'Knitwear', count: 16 },
  { name: 'Shorts', slug: 'Shorts', count: 15 },
  { name: 'Co-ord Sets', slug: 'Co-ord Sets', count: 12 },
  { name: 'Dresses', slug: 'Dresses', count: 21 },
  { name: 'Skirts', slug: 'Skirts', count: 14 },
  { name: 'Activewear', slug: 'Activewear', count: 17 },
  { name: 'Footwear', slug: 'Footwear', count: 29 },
  { name: 'Bags', slug: 'Bags', count: 13 },
  { name: 'Watches', slug: 'Watches', count: 9 },
  { name: 'Accessories', slug: 'Accessories', count: 25 },
];

export const PRODUCTS = [
  {
    id: 'summer-t-shirts',
    name: 'Boxy Heavyweight Tee',
    category: 'Oversized T-shirts',
    gender: 'Men',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 105.55,
    originalPrice: 145.0,
    discount: '27% Off',
    rating: 4.8,
    reviews: 128,
    badge: 'New Arrivals',
    isFeaturedHero: true,
    wishlistedDefault: true,
    colors: ['#FF7A45', '#111111', '#E5E5EA'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Breathable 280gsm organic cotton jersey with a relaxed boxy silhouette and contrast pocket detailing.',
  },
  {
    id: 'oversized-hoodie',
    name: 'Studio Oversized Hoodie',
    category: 'Hoodies & Sweatshirts',
    gender: 'Men',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 185.0,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 94,
    badge: 'Best Sellers',
    colors: ['#5F6C7B', '#F2C94C', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Heavyweight 480gsm French terry hoodie with dropped shoulders and structured ribbed cuffs.',
  },
  {
    id: 'puffer-jacket',
    name: 'Colorblock Puffer Jacket',
    category: 'Jackets & Outerwear',
    gender: 'Unisex',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 389.99,
    originalPrice: 440.0,
    discount: '11% Off',
    rating: 4.8,
    reviews: 162,
    badge: 'Signature',
    colors: ['#FF6B35', '#0D9488', '#EC4899'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Colorblock insulated puffer built with recycled ripstop shell and ergonomic baffle construction.',
  },
  {
    id: 'short-sleeve-shirt',
    name: 'Camp Collar Utility Shirt',
    category: 'Shirts',
    gender: 'Men',
    trending: false,
    isNewDrop: true,
    bestSeller: false,
    price: 149.0,
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviews: 73,
    badge: 'New Arrivals',
    colors: ['#5E6B47', '#111111', '#D6D3CD'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Crisp camp-collar utility shirt crafted from breathable Tencel-cotton poplin.',
  },
  {
    id: 'pullover-hoodie',
    name: 'Pigment Pullover Hoodie',
    category: 'Hoodies & Sweatshirts',
    gender: 'Women',
    trending: true,
    isNewDrop: true,
    bestSeller: false,
    price: 172.0,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviews: 112,
    badge: 'Limited Drop',
    colors: ['#EC4899', '#7C8BFF', '#111111'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Pigment-dyed pullover featuring double-lined hood and hidden kangaroo seam pockets.',
  },
  {
    id: 'crewneck-sweater',
    name: 'Merino Crewneck Knit',
    category: 'Knitwear',
    gender: 'Men',
    trending: false,
    isNewDrop: false,
    bestSeller: true,
    price: 228.0,
    originalPrice: 280.0,
    discount: '18% Off',
    rating: 4.8,
    reviews: 64,
    badge: 'Best Sellers',
    colors: ['#18181B', '#71717A', '#E4E4E7'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Architectural merino-blend crewneck with sculpted raglan seams and matte finish.',
  },
  {
    id: 'aero-tech-windbreaker',
    name: 'Aero Tech Windbreaker',
    category: 'Jackets & Outerwear',
    gender: 'Women',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 340.0,
    originalPrice: 390.0,
    discount: '13% Off',
    rating: 4.8,
    reviews: 89,
    badge: 'New Arrivals',
    colors: ['#2563EB', '#4ADE80', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Water-repellent technical shell with reflective piping and articulated sleeves.',
  },
  {
    id: 'kinetic-runner-sneaker',
    name: 'Kinetic Runner 01',
    category: 'Footwear',
    gender: 'Unisex',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 315.0,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 141,
    badge: 'Best Sellers',
    colors: ['#E5E7EB', '#111111', '#7C8BFF'],
    sizes: ['40', '41', '42', '43', '44'],
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Lightweight silhouette with breathable mesh upper and dual-density EVA midsole.',
  },
  {
    id: 'pleated-wide-trousers',
    name: 'Pleated Wide Trousers',
    category: 'Trousers & Pants',
    gender: 'Men',
    trending: true,
    isNewDrop: true,
    bestSeller: false,
    price: 195.0,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 52,
    badge: 'New Arrivals',
    colors: ['#111111', '#78716C'],
    sizes: ['28', '30', '32', '34', '36'],
    image:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Relaxed double-pleat wool-blend trousers with crisp drape and concealed hook closure.',
  },
  {
    id: 'raw-selvedge-denim',
    name: 'Selvedge Straight Denim',
    category: 'Denim',
    gender: 'Unisex',
    trending: false,
    isNewDrop: true,
    bestSeller: true,
    price: 240.0,
    originalPrice: 280.0,
    discount: '14% Off',
    rating: 4.8,
    reviews: 84,
    badge: 'Denim',
    colors: ['#1E3A8A', '#111111'],
    sizes: ['28', '30', '32', '34'],
    image:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      '14oz Japanese selvedge denim cut in a clean straight leg with tonal stitching.',
  },
  {
    id: 'atelier-coord-set',
    name: 'Tailored Co-ord Set',
    category: 'Co-ord Sets',
    gender: 'Women',
    trending: true,
    isNewDrop: true,
    bestSeller: false,
    price: 295.0,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 39,
    badge: 'Co-ord Sets',
    colors: ['#D6CFC7', '#111111'],
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Matched cropped blazer and relaxed wide-leg trouser set in breathable linen-viscose.',
  },
  {
    id: 'sculpted-midi-dress',
    name: 'Sculpted Poplin Dress',
    category: 'Dresses',
    gender: 'Women',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 265.0,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 67,
    badge: 'Dresses',
    colors: ['#111111', '#F5A6D8'],
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Architectural midi silhouette in crisp organic cotton poplin with asymmetrical pleats.',
  },
  {
    id: 'pleated-midi-skirt',
    name: 'Asymmetric Midi Skirt',
    category: 'Skirts',
    gender: 'Women',
    trending: false,
    isNewDrop: true,
    bestSeller: false,
    price: 165.0,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviews: 44,
    badge: 'Skirts',
    colors: ['#111111', '#E5E7EB'],
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Fluid knife-pleated skirt with high-rise tailored waistband and concealed side zip.',
  },
  {
    id: 'kinetic-active-shell',
    name: 'Kinetic Active Half-Zip',
    category: 'Activewear',
    gender: 'Unisex',
    trending: true,
    isNewDrop: true,
    bestSeller: false,
    price: 155.0,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 58,
    badge: 'Activewear',
    colors: ['#7C8BFF', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Four-way stretch moisture-wicking training layer with laser-cut ventilation.',
  },
  {
    id: 'structured-crossbody-bag',
    name: 'Monolith Crossbody Bag',
    category: 'Bags',
    gender: 'Unisex',
    trending: true,
    isNewDrop: true,
    bestSeller: true,
    price: 225.0,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 71,
    badge: 'Bags',
    colors: ['#111111', '#78716C'],
    sizes: ['One Size'],
    image:
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Matte ballistic-nylon and calfskin crossbody with magnetic fidlock buckle.',
  },
  {
    id: 'chronos-minimal-watch',
    name: 'Chronos Steel Watch',
    category: 'Watches',
    gender: 'Unisex',
    trending: false,
    isNewDrop: true,
    bestSeller: true,
    price: 420.0,
    originalPrice: 480.0,
    discount: '12% Off',
    rating: 4.9,
    reviews: 49,
    badge: 'Watches',
    colors: ['#94A3B8', '#111111'],
    sizes: ['40mm'],
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Brushed 316L stainless steel timepiece with sapphire crystal and Swiss quartz movement.',
  },
  {
    id: 'sculpted-visor-shades',
    name: 'Aura Visor Shades',
    category: 'Accessories',
    gender: 'Women',
    trending: true,
    isNewDrop: false,
    bestSeller: true,
    price: 195.0,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 77,
    badge: 'Accessories',
    colors: ['#111111', '#94A3B8', '#7C8BFF'],
    sizes: ['One Size'],
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Wrap-around shield sunglasses with UV400 mirrored lens and bio-acetate temples.',
  },
  {
    id: 'utility-cargo-shorts',
    name: 'Utility Cargo Shorts',
    category: 'Shorts',
    gender: 'Men',
    trending: false,
    isNewDrop: false,
    bestSeller: false,
    price: 145.0,
    originalPrice: 175.0,
    discount: '17% Off',
    rating: 4.5,
    reviews: 61,
    badge: 'Summer Edit',
    colors: ['#18181B', '#78716C', '#D6D3D1'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Relaxed-fit nylon twill shorts featuring gusseted bellows pockets and quick-dry finish.',
  },
];

export const FEATURED_CATEGORY_CARDS = [
  {
    name: 'Shirts',
    count: '32 Pieces',
    filterKey: 'Shirts',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Hoodies & Sweatshirts',
    count: '28 Pieces',
    filterKey: 'Hoodies & Sweatshirts',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Jackets & Outerwear',
    count: '36 Pieces',
    filterKey: 'Jackets & Outerwear',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Trousers & Pants',
    count: '22 Pieces',
    filterKey: 'Trousers & Pants',
    image:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Knitwear',
    count: '16 Pieces',
    filterKey: 'Knitwear',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Dresses',
    count: '21 Pieces',
    filterKey: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Footwear',
    count: '29 Pieces',
    filterKey: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Accessories',
    count: '25 Pieces',
    filterKey: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
  },
];

export const FILTER_CATEGORIES = [
  'All Items',
  'Oversized T-shirts',
  'Shirts',
  'Hoodies & Sweatshirts',
  'Jackets & Outerwear',
  'Trousers & Pants',
  'Denim',
  'Knitwear',
  'Dresses',
  'Skirts',
  'Co-ord Sets',
  'Activewear',
  'Footwear',
  'Bags',
  'Watches',
  'Accessories',
  'Shorts',
];
