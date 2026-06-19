require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const User = require('./models/User');

// ─── Image URLs ───────────────────────────────────────────────────────────────

const IMG = [
  'https://images.unsplash.com/photo-1609840112990-4265448268d1?w=600&q=80',
  'https://images.unsplash.com/photo-1584651772793-d555266cce99?w=600&q=80',
  'https://images.unsplash.com/photo-1607516531499-9e57ef94a9d9?w=600&q=80',
  'https://images.unsplash.com/photo-1746351635660-67a0c51f5c6f?w=600&q=80',
  'https://images.unsplash.com/photo-1598046937985-11c320dfd379?w=600&q=80',
  'https://images.unsplash.com/photo-1585690359409-9020f3602bdb?w=600&q=80',
  'https://images.unsplash.com/photo-1583496597467-d968d2fa33a8?w=600&q=80',
  'https://images.unsplash.com/photo-1584109807991-ebfcd80112a8?w=600&q=80',
  'https://images.unsplash.com/photo-1584743578805-d7991ca2d5d4?w=600&q=80',
  'https://images.unsplash.com/photo-1620778864482-5f20e3d9745a?w=600&q=80',
  'https://images.unsplash.com/photo-1708337338728-9fe34ccb91b4?w=600&q=80',
  'https://images.unsplash.com/photo-1734599395438-1ec2a861ed8d?w=600&q=80',
];

const img = (i) => IMG[i % IMG.length];
const imgs = (i) => [img(i), img(i + 2), img(i + 4)];

// ─── Products Data ────────────────────────────────────────────────────────────

const PRODUCTS = [
  /* ===================== FACE TISSUE (22) ===================== */
  {
    slug: 'nada-classic-600',
    name: 'مناديل NOVI كلاسيك — ٦٠٠ منديل',
    nameEn: 'NOVI Classic 600',
    category: 'face-tissue',
    price: 29.99, comparePrice: 39.99,
    rating: 4.9, reviewCount: 842, stock: 500, sold: 12400, sku: 'ND-FT-001',
    badge: { label: 'الأكثر مبيعاً', color: 'gold' },
    images: imgs(0), tags: ['مناديل', 'كلاسيك'],
    description: 'مناديل NOVI كلاسيك الفاخرة بـ٣ طبقات من الألياف الطبيعية النقية. ٦٠٠ منديل في كل علبة — أكثر من المنافسين. نعومة استثنائية تشعر بها من أول لمسة، ولطيفة جداً على البشرة الحساسة والأطفال.',
    features: ['٣ طبقات فاخرة ناعمة', '٦٠٠ منديل في كل علبة', 'مواد طبيعية ١٠٠٪', 'معتمدة من هيئة الغذاء والدواء السعودية', 'لطيفة على البشرة الحساسة', 'متاحة بلون وردي وأخضر'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['الطبقات', '٣'], ['الحجم', '٢١×٢١ سم'], ['الوزن', '٥٨٠ جم'], ['اللون', 'وردي / أخضر'], ['SKU', 'ND-FT-001']]),
    isBestSeller: true, isFeatured: true,
  },
  {
    slug: 'nada-ultra-soft-600',
    name: 'مناديل NOVI الترا سوفت — ٦٠٠',
    nameEn: 'Ultra Soft 600',
    category: 'face-tissue',
    price: 34.99, comparePrice: 44.99,
    rating: 4.8, reviewCount: 634, stock: 380, sold: 9800, sku: 'ND-FT-002',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(1), tags: ['مناديل', 'فائقة النعومة'],
    description: 'مناديل ترا سوفت الجديدة بتركيبة فائقة النعومة من ٤ طبقات. تقنية الألياف المائية تجعلها أكثر نعومة وامتصاصاً من أي مناديل أخرى في السوق.',
    features: ['٤ طبقات فائقة النعومة', 'تقنية الألياف المائية', 'بدون عطور أو كيماويات', '٦٠٠ منديل', 'آمنة للبشرة الحساسة جداً', 'مقاومة للتفتت حتى مبللة'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['الطبقات', '٤'], ['الحجم', '٢١×٢٢ سم'], ['الوزن', '٦٢٠ جم']]),
    isNewArrival: true,
  },
  {
    slug: 'nada-maxi-1800',
    name: 'مناديل NOVI ماكسي — ١٨٠٠ منديل',
    nameEn: 'NOVI Maxi 1800',
    category: 'face-tissue',
    price: 64.99, comparePrice: 89.99,
    rating: 4.9, reviewCount: 521, stock: 200, sold: 7200, sku: 'ND-FT-003',
    badge: { label: 'وفّر ٢٨٪', color: 'red' },
    images: imgs(2), tags: ['مناديل', 'ماكسي', 'كبير'],
    description: 'أكبر علبة مناديل في المملكة! ١٨٠٠ منديل بـ٥ طبقات فاخرة. تدوم ٣ أضعاف العلبة العادية. تأتي مع ٣ علاقات مجانية. حصرية في متجر NOVI.',
    features: ['١٨٠٠ منديل ضخمة', '٥ طبقات سميكة', '٣ علاقات مجانية مضمنة', 'الأطول دواماً في المملكة', 'حصرية في NOVI'],
    specs: new Map([['العدد', '١٨٠٠ منديل'], ['الطبقات', '٥'], ['الحجم', '٢٣×٢٣ سم'], ['الوزن', '١.٨ كجم']]),
    isFeatured: true, isBestSeller: true,
  },
  {
    slug: 'nada-classic-400',
    name: 'مناديل NOVI كلاسيك — ٤٠٠ منديل',
    nameEn: 'Classic 400',
    category: 'face-tissue',
    price: 21.99, comparePrice: 27.99,
    rating: 4.7, reviewCount: 389, stock: 600, sold: 8900, sku: 'ND-FT-004',
    images: imgs(3), tags: ['مناديل', 'متوسط'],
    description: 'مناديل كلاسيك حجم متوسط مثالية للغرف والمكاتب. ٤٠٠ منديل بـ٣ طبقات ناعمة.',
    features: ['٤٠٠ منديل', '٣ طبقات', 'حجم مثالي للمكتب', 'تصميم أنيق', 'ألوان متعددة متاحة'],
    specs: new Map([['العدد', '٤٠٠ منديل'], ['الطبقات', '٣'], ['الحجم', '٢٠×٢٠ سم']]),
  },
  {
    slug: 'nada-premium-white',
    name: 'مناديل NOVI بريميوم وايت — ٦٠٠',
    nameEn: 'Premium White 600',
    category: 'face-tissue',
    price: 37.99, comparePrice: 49.99,
    rating: 4.8, reviewCount: 445, stock: 320, sold: 6700, sku: 'ND-FT-005',
    badge: { label: 'مميز', color: 'gold' },
    images: imgs(4), tags: ['مناديل', 'أبيض', 'فاخر'],
    description: 'مناديل بيضاء فاخرة بتقنية التبييض الطبيعي بدون كلور.',
    features: ['بياض طبيعي بدون كلور', '٦٠٠ منديل', '٣ طبقات مضغوطة', 'بدون عطور', 'آمنة بيئياً ومعتمدة'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['الطبقات', '٣'], ['اللون', 'أبيض ناصع طبيعي']]),
  },
  {
    slug: 'nada-aloe-vera-600',
    name: 'مناديل NOVI بالصبار — ٦٠٠ منديل',
    nameEn: 'Aloe Vera 600',
    category: 'face-tissue',
    price: 39.99, comparePrice: 52.99,
    rating: 4.9, reviewCount: 612, stock: 280, sold: 9100, sku: 'ND-FT-006',
    badge: { label: 'الأكثر مبيعاً', color: 'gold' },
    images: imgs(5), tags: ['مناديل', 'صبار', 'ترطيب'],
    description: 'مناديل مدعمة بخلاصة الصبار الطبيعية. تغذي البشرة وترطبها مع كل استخدام.',
    features: ['مدعمة بخلاصة صبار ٢٠٪', 'ترطيب فوري للبشرة', 'بدون كحول', 'آمنة للبشرة الحساسة جداً', '٦٠٠ منديل بـ٣ طبقات'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['المكونات النشطة', 'خلاصة صبار ٢٠٪'], ['الطبقات', '٣']]),
    isBestSeller: true,
  },
  {
    slug: 'nada-sensitive-skin',
    name: 'مناديل NOVI للبشرة الحساسة — ٦٠٠',
    nameEn: 'Sensitive Skin 600',
    category: 'face-tissue',
    price: 41.99, comparePrice: 54.99,
    rating: 4.9, reviewCount: 778, stock: 350, sold: 11200, sku: 'ND-FT-007',
    badge: { label: 'موصى به طبياً', color: 'green' },
    images: imgs(6), tags: ['مناديل', 'حساسة', 'طبي'],
    description: 'مناديل خصيصاً للبشرة الحساسة والمهيجة. مختبرة ومعتمدة جلدياً من كبرى المختبرات الأوروبية.',
    features: ['معتمدة جلدياً ١٠٠٪', 'بدون عطور أو صبغات', 'بدون كحول أو بارابين', 'اختبار حساسية صفري', 'مناسبة لمرضى الأكزيما والصدفية'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['الاعتمادات', 'SFDA، Allergy UK، ISO'], ['الطبقات', '٤']]),
    isFeatured: true,
  },
  {
    slug: 'nada-lavender-500',
    name: 'مناديل NOVI برائحة اللافندر — ٥٠٠',
    nameEn: 'Lavender 500',
    category: 'face-tissue',
    price: 32.99, comparePrice: 41.99,
    rating: 4.6, reviewCount: 234, stock: 420, sold: 4500, sku: 'ND-FT-008',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(7), tags: ['مناديل', 'معطر', 'لافندر'],
    description: 'مناديل معطرة برائحة اللافندر الهادئة المريحة.',
    features: ['عطر لافندر طبيعي', '٥٠٠ منديل', '٣ طبقات', 'ليست قوية على الجهاز التنفسي', 'تصميم أرجواني جميل'],
    specs: new Map([['العدد', '٥٠٠ منديل'], ['العطر', 'لافندر طبيعي'], ['الطبقات', '٣']]),
    isNewArrival: true,
  },
  {
    slug: 'nada-economy-600',
    name: 'مناديل NOVI اقتصادية — ٦٠٠ منديل',
    nameEn: 'Economy 600',
    category: 'face-tissue',
    price: 17.99,
    rating: 4.4, reviewCount: 156, stock: 800, sold: 6700, sku: 'ND-FT-009',
    images: imgs(0), tags: ['مناديل', 'اقتصادي', 'مكتب'],
    description: 'مناديل اقتصادية بجودة مقبولة وسعر مناسب للجميع.',
    features: ['سعر مناسب للجميع', '٦٠٠ منديل', 'طبقتان متينتان', 'مثالية للمكاتب الكبيرة', 'كميات جملة متاحة'],
    specs: new Map([['العدد', '٦٠٠ منديل'], ['الطبقات', '٢'], ['الحجم', '١٩×١٩ سم']]),
  },
  {
    slug: 'nada-designer-blue',
    name: 'مناديل NOVI ديزاينر — تصميم أزرق',
    nameEn: 'Designer Blue',
    category: 'face-tissue',
    price: 44.99, comparePrice: 55.99,
    rating: 4.7, reviewCount: 198, stock: 150, sold: 2800, sku: 'ND-FT-010',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(1), tags: ['مناديل', 'ديزاينر', 'هدية'],
    description: 'مناديل فاخرة في علبة ديزاينر زرقاء أنيقة. تزين أي طاولة.',
    features: ['علبة ديزاينر فاخرة', '٥٠٠ منديل', '٤ طبقات', 'تصميم حصري', 'هدية مثالية للمناسبات'],
    specs: new Map([['العدد', '٥٠٠ منديل'], ['الطبقات', '٤'], ['التصميم', 'ديزاينر أزرق فاخر']]),
    isNewArrival: true,
  },
  {
    slug: 'nada-ultra-thick-300',
    name: 'مناديل NOVI الثقيلة — ٣٠٠ منديل',
    nameEn: 'Ultra Thick 300',
    category: 'face-tissue',
    price: 36.99, comparePrice: 46.99,
    rating: 4.8, reviewCount: 312, stock: 270, sold: 5100, sku: 'ND-FT-011',
    images: imgs(2), tags: ['مناديل', 'سميك', 'قوي'],
    description: 'مناديل بـ٦ طبقات ثقيلة جداً. كل منديل يكفي وحده ويعادل ٣ مناديل عادية.',
    features: ['٦ طبقات سميكة', 'كل منديل يعادل ٣ مناديل', 'لا تتفتت حتى مبللة', 'مثالية للرياضة', '٣٠٠ منديل'],
    specs: new Map([['العدد', '٣٠٠ منديل'], ['الطبقات', '٦'], ['السماكة', '٠.٨ مم']]),
  },
  {
    slug: 'nada-kids-cartoon',
    name: 'مناديل NOVI للأطفال — رسوم كرتونية',
    nameEn: 'Kids Cartoon',
    category: 'face-tissue',
    price: 27.99, comparePrice: 34.99,
    rating: 4.8, reviewCount: 489, stock: 430, sold: 7800, sku: 'ND-FT-012',
    badge: { label: 'الأطفال يحبونه', color: 'gold' },
    images: imgs(3), tags: ['مناديل', 'أطفال', 'كرتون'],
    description: 'مناديل مزينة برسوم كرتونية محببة للأطفال. آمنة ١٠٠٪ من يوم الولادة.',
    features: ['رسوم كرتونية ملونة محببة', 'آمنة للأطفال من ٠ سنة', 'بدون كيماويات ضارة', 'لطيفة على بشرة الأطفال', '٥٠٠ منديل بـ٣ طبقات'],
    specs: new Map([['العدد', '٥٠٠ منديل'], ['عمر الاستخدام', 'من ٠ سنة'], ['الطبقات', '٣']]),
  },
  {
    slug: 'nada-bamboo-600',
    name: 'مناديل NOVI بامبو — ٦٠٠ منديل',
    nameEn: 'Bamboo 600',
    category: 'face-tissue',
    price: 49.99, comparePrice: 64.99,
    rating: 4.9, reviewCount: 267, stock: 180, sold: 3900, sku: 'ND-FT-013',
    badge: { label: 'صديق للبيئة', color: 'green' },
    images: imgs(4), tags: ['مناديل', 'بامبو', 'بيئة'],
    description: 'مناديل مصنوعة من ألياف الخيزران الطبيعية. أسرع تحللاً وأكثر استدامة للبيئة.',
    features: ['ألياف خيزران طبيعية ١٠٠٪', 'صديق للبيئة قابل للتحلل', 'أكثر نعومة من القطن العادي', 'ضد البكتيريا طبيعياً', 'شهادة FSC'],
    specs: new Map([['المادة', 'ألياف خيزران ١٠٠٪'], ['الشهادة', 'FSC، ISO 14001'], ['العدد', '٦٠٠ منديل']]),
    isNewArrival: true, isFeatured: true,
  },
  {
    slug: 'nada-rose-500',
    name: 'مناديل NOVI برائحة الورد — ٥٠٠',
    nameEn: 'Rose 500',
    category: 'face-tissue',
    price: 31.99, comparePrice: 39.99,
    rating: 4.6, reviewCount: 198, stock: 360, sold: 4200, sku: 'ND-FT-014',
    images: imgs(5), tags: ['مناديل', 'ورد', 'معطر'],
    description: 'مناديل معطرة بعطر الورد الجوري الطبيعي.',
    features: ['عطر ورد جوري طبيعي', '٥٠٠ منديل', '٣ طبقات', 'علبة وردية أنيقة', 'هدية مثالية'],
    specs: new Map([['العطر', 'ورد جوري طبيعي'], ['العدد', '٥٠٠ منديل'], ['الطبقات', '٣']]),
  },
  {
    slug: 'nada-vitamin-e-600',
    name: 'مناديل NOVI بفيتامين E — ٦٠٠',
    nameEn: 'Vitamin E 600',
    category: 'face-tissue',
    price: 43.99, comparePrice: 55.99,
    rating: 4.8, reviewCount: 341, stock: 210, sold: 5800, sku: 'ND-FT-015',
    badge: { label: 'عناية فائقة', color: 'gold' },
    images: imgs(6), tags: ['مناديل', 'فيتامين', 'عناية'],
    description: 'مناديل مدعمة بفيتامين E المضاد للأكسدة.',
    features: ['مدعمة بفيتامين E قوي', 'مضاد للأكسدة', 'يحارب علامات التقدم', '٦٠٠ منديل', '٤ طبقات فاخرة'],
    specs: new Map([['فيتامين E', '١٥٪'], ['العدد', '٦٠٠ منديل'], ['الطبقات', '٤']]),
  },
  {
    slug: 'nada-antibacterial-600',
    name: 'مناديل NOVI مضادة للبكتيريا — ٦٠٠',
    nameEn: 'Antibacterial 600',
    category: 'face-tissue',
    price: 46.99, comparePrice: 59.99,
    rating: 4.8, reviewCount: 389, stock: 240, sold: 6800, sku: 'ND-FT-016',
    badge: { label: 'حماية فائقة', color: 'green' },
    images: imgs(7), tags: ['مناديل', 'بكتيريا', 'حماية'],
    description: 'مناديل بتركيبة نانو-فضية مضادة للبكتيريا والفيروسات. تقضي على ٩٩.٩٪ من الجراثيم الضارة.',
    features: ['تقنية نانو فضية', 'تقضي على ٩٩.٩٪ البكتيريا', 'مضادة للفيروسات', '٦٠٠ منديل', 'آمنة للاستخدام اليومي'],
    specs: new Map([['الفعالية', '٩٩.٩٪ ضد البكتيريا'], ['التقنية', 'نانو فضية'], ['العدد', '٦٠٠ منديل']]),
    isFeatured: true,
  },
  {
    slug: 'nada-luxury-5layer',
    name: 'مناديل NOVI لوكشري — ٥ طبقات ٤٠٠',
    nameEn: 'Luxury 5-Layer 400',
    category: 'face-tissue',
    price: 58.99, comparePrice: 74.99,
    rating: 4.9, reviewCount: 167, stock: 130, sold: 2300, sku: 'ND-FT-017',
    badge: { label: 'الأفخم', color: 'gold' },
    images: imgs(0), tags: ['مناديل', 'لوكشري', 'فاخر'],
    description: 'أفخم مناديل وجه في المملكة العربية السعودية. ٥ طبقات فائقة السماكة والنعومة.',
    features: ['٥ طبقات فائقة الجودة', 'أسمك وأنعم منديل', 'ألياف مستوردة ممتازة', 'تجربة فندقية في منزلك', '٤٠٠ منديل'],
    specs: new Map([['العدد', '٤٠٠ منديل'], ['الطبقات', '٥'], ['المادة', 'ألياف مستوردة ممتازة']]),
    isFeatured: true,
  },
  {
    slug: 'nada-gold-box-500',
    name: 'مناديل NOVI علبة ذهبية — ٥٠٠',
    nameEn: 'Gold Box 500',
    category: 'face-tissue',
    price: 54.99, comparePrice: 69.99,
    rating: 4.9, reviewCount: 156, stock: 100, sold: 2100, sku: 'ND-FT-018',
    badge: { label: 'فاخر', color: 'gold' },
    images: imgs(1), tags: ['مناديل', 'ذهبي', 'هدية'],
    description: 'العلبة الذهبية الفاخرة — قمة الرقي والفخامة.',
    features: ['علبة ذهبية فاخرة حصرية', '٥٠٠ منديل', '٥ طبقات', 'مثالية كهدية فاخرة', 'تصميم حصري'],
    specs: new Map([['العدد', '٥٠٠ منديل'], ['الطبقات', '٥'], ['التصميم', 'ذهبي فاخر']]),
    isFeatured: true,
  },
  {
    slug: 'nada-2pack-600',
    name: 'عبوة ثنائية NOVI — ٢ × ٦٠٠',
    nameEn: 'Twin Pack 2x600',
    category: 'face-tissue',
    price: 52.99, comparePrice: 69.98,
    rating: 4.8, reviewCount: 445, stock: 300, sold: 8200, sku: 'ND-FT-019',
    badge: { label: 'وفّر ٢٤٪', color: 'red' },
    images: imgs(2), tags: ['مناديل', 'عبوة', 'توفير'],
    description: 'عبوة ثنائية اقتصادية من مناديل NOVI كلاسيك.',
    features: ['علبتان كلاسيك كاملتان', 'إجمالي ١٢٠٠ منديل', 'توفير ١٧ ريال فعلي', 'نفس الجودة الفاخرة', 'أفضل قيمة للعائلات'],
    specs: new Map([['العدد', '٢ علبة'], ['الإجمالي', '١٢٠٠ منديل'], ['الطبقات', '٣']]),
  },
  {
    slug: 'nada-cube-200',
    name: 'مناديل NOVI كيوب — ٢٠٠ منديل',
    nameEn: 'Cube Box 200',
    category: 'face-tissue',
    price: 16.99, comparePrice: 21.99,
    rating: 4.6, reviewCount: 234, stock: 550, sold: 5400, sku: 'ND-FT-020',
    images: imgs(3), tags: ['مناديل', 'كيوب', 'حمام'],
    description: 'علبة مناديل مكعبة صغيرة ومريحة.',
    features: ['شكل مكعب أنيق', '٢٠٠ منديل', '٣ طبقات', 'مناسبة للحمام والسرير', 'ألوان متعددة متاحة'],
    specs: new Map([['الشكل', 'مكعب ١٢×١٢×١٢ سم'], ['العدد', '٢٠٠ منديل'], ['الطبقات', '٣']]),
  },
  {
    slug: 'nada-flat-box-600',
    name: 'مناديل NOVI فلات بوكس — ٦٠٠',
    nameEn: 'Flat Box 600',
    category: 'face-tissue',
    price: 33.99, comparePrice: 42.99,
    rating: 4.7, reviewCount: 223, stock: 290, sold: 5600, sku: 'ND-FT-021',
    images: imgs(4), tags: ['مناديل', 'فلات', 'سيارة'],
    description: 'علبة مناديل أفقية مسطحة تناسب طاولات السيارات والمكاتب.',
    features: ['تصميم مسطح أفقي', 'مثالية للسيارة والمكتب', 'علبة قوية لا تنهار', '٦٠٠ منديل', 'ألوان متعددة'],
    specs: new Map([['القياسات', '٣٠×١٢×٩ سم'], ['العدد', '٦٠٠ منديل'], ['الطبقات', '٣']]),
  },
  {
    slug: 'nada-pink-600',
    name: 'مناديل NOVI وردية — ٦٠٠ منديل',
    nameEn: 'Pink Edition 600',
    category: 'face-tissue',
    price: 28.99, comparePrice: 36.99,
    rating: 4.6, reviewCount: 178, stock: 450, sold: 6100, sku: 'ND-FT-022',
    images: imgs(5), tags: ['مناديل', 'وردي', 'ديكور'],
    description: 'مناديل وردية اللون لتزيين غرفتك.',
    features: ['لون وردي مميز', '٦٠٠ منديل', '٣ طبقات', 'صبغة آمنة غير سامة', 'لتزيين الغرف بأناقة'],
    specs: new Map([['اللون', 'وردي فاتح'], ['العدد', '٦٠٠ منديل'], ['الطبقات', '٣']]),
  },

  /* ===================== WET WIPES (16) ===================== */
  {
    slug: 'wipe-classic-80',
    name: 'مناديل مبللة نَدى كلاسيك — ٨٠',
    nameEn: 'Wet Wipes Classic 80',
    category: 'wet-wipes',
    price: 19.99, comparePrice: 24.99,
    rating: 4.9, reviewCount: 1240, stock: 800, sold: 22000, sku: 'ND-WW-001',
    badge: { label: 'الأكثر مبيعاً', color: 'gold' },
    images: imgs(6), tags: ['مبللة', 'صبار', 'وجه'],
    description: 'مناديل مبللة برائحة الصبار اللطيفة. ٨٠ منديل كبير في كل عبوة. خالية من الكحول.',
    features: ['تركيبة صبار طبيعية ٢٠٪', 'خالية من الكحول والبارابين', 'مناسبة للوجه واليدين', '٨٠ منديل كبير الحجم', 'غطاء محكم الإغلاق'],
    specs: new Map([['العدد', '٨٠ منديل'], ['المكونات', 'صبار، فيتامين E'], ['بدون', 'كحول، بارابين']]),
    isBestSeller: true, isFeatured: true,
  },
  {
    slug: 'wipe-baby-100',
    name: 'مناديل أطفال مبللة نَدى — ١٠٠',
    nameEn: 'Baby Wipes 100',
    category: 'wet-wipes',
    price: 22.99, comparePrice: 27.99,
    rating: 5.0, reviewCount: 678, stock: 650, sold: 15400, sku: 'ND-WW-002',
    badge: { label: '⭐ ٥ نجوم', color: 'gold' },
    images: imgs(7), tags: ['مبللة', 'أطفال', 'رضع'],
    description: 'مناديل مبللة فائقة اللطف للأطفال والرضع. آمنة من يوم الولادة.',
    features: ['آمنة من يوم الولادة ١٠٠٪', 'مختبرة جلدياً بالكامل', 'بدون كحول أو بارابين', 'مدعمة بفيتامين E وD', '١٠٠ منديل كبير'],
    specs: new Map([['العدد', '١٠٠ منديل'], ['العمر', 'من ٠ سنة'], ['الاعتمادات', 'SFDA، Allergy UK']]),
    isBestSeller: true, isFeatured: true,
  },
  {
    slug: 'wipe-makeup-60',
    name: 'مناديل مزيل مكياج نَدى — ٦٠',
    nameEn: 'Makeup Remover 60',
    category: 'wet-wipes',
    price: 26.99, comparePrice: 34.99,
    rating: 4.8, reviewCount: 534, stock: 380, sold: 8900, sku: 'ND-WW-003',
    badge: { label: 'للنساء', color: 'gold' },
    images: imgs(0), tags: ['مبللة', 'مكياج', 'نساء'],
    description: 'مناديل متخصصة لإزالة المكياج بلطف تام.',
    features: ['تزيل المكياج بلطف تام', 'مستخلص الورد الطبيعي', 'لا تهيج العيون', 'تنظيف عميق وترطيب', '٦٠ منديل كبير'],
    specs: new Map([['العدد', '٦٠ منديل'], ['المكونات', 'ورد، ميسيلار واتر'], ['آمن للعيون', 'نعم']]),
  },
  {
    slug: 'wipe-antibac-80',
    name: 'مناديل معقمة نَدى — ٨٠ منديل',
    nameEn: 'Antibacterial Wipes 80',
    category: 'wet-wipes',
    price: 24.99, comparePrice: 31.99,
    rating: 4.7, reviewCount: 445, stock: 520, sold: 11200, sku: 'ND-WW-004',
    badge: { label: 'تعقيم فوري', color: 'green' },
    images: imgs(1), tags: ['مبللة', 'معقمة', 'بكتيريا'],
    description: 'مناديل معقمة بتركيبة قوية ضد البكتيريا والفيروسات.',
    features: ['تقتل ٩٩.٩٪ البكتيريا', 'مضادة للفيروسات', 'فعالة ضد الانفلونزا', '٨٠ منديل', 'رائحة منعشة خفيفة'],
    specs: new Map([['الفعالية', '٩٩.٩٪'], ['العدد', '٨٠ منديل'], ['التعقيم', 'كحول ٧٠٪']]),
  },
  {
    slug: 'wipe-travel-30',
    name: 'مناديل سفر نَدى — ٣٠ منديل',
    nameEn: 'Travel Wipes 30',
    category: 'wet-wipes',
    price: 12.99, comparePrice: 16.99,
    rating: 4.6, reviewCount: 289, stock: 700, sold: 7800, sku: 'ND-WW-005',
    badge: { label: 'للسفر', color: 'blue' },
    images: imgs(2), tags: ['مبللة', 'سفر', 'مدمج'],
    description: 'عبوة سفر مدمجة ٣٠ منديل.',
    features: ['عبوة مدمجة للسفر', '٣٠ منديل كبير', 'سهلة الحمل', 'بدون كحول', 'لكل أفراد العائلة'],
    specs: new Map([['العدد', '٣٠ منديل'], ['الحجم', 'مدمج ١٥×١١ سم']]),
  },
  {
    slug: 'wipe-hand-sanitizer-50',
    name: 'مناديل معقم اليدين نَدى — ٥٠',
    nameEn: 'Hand Sanitizer Wipes 50',
    category: 'wet-wipes',
    price: 17.99, comparePrice: 22.99,
    rating: 4.8, reviewCount: 534, stock: 680, sold: 13200, sku: 'ND-WW-006',
    badge: { label: 'ضروري', color: 'green' },
    images: imgs(3), tags: ['مبللة', 'معقم', 'يدين'],
    description: 'مناديل معقمة لليدين بتركيبة كحول ٧٠٪.',
    features: ['كحول ٧٠٪ فعّال', 'تعقيم فوري في ثوانٍ', 'مرطبة لا تجفف', '٥٠ منديل', 'مثالية للسفر والعمل'],
    specs: new Map([['العدد', '٥٠ منديل'], ['نسبة الكحول', '٧٠٪'], ['المرطب', 'صبار وجليسرين']]),
    isBestSeller: true,
  },
  {
    slug: 'wipe-multipack-5x80',
    name: 'بكج مبللة NOVI — ٥ × ٨٠ منديل',
    nameEn: 'Multipack 5x80',
    category: 'wet-wipes',
    price: 79.99, comparePrice: 124.95,
    rating: 4.9, reviewCount: 445, stock: 250, sold: 8900, sku: 'ND-WW-012',
    badge: { label: 'وفّر ٣٦٪', color: 'red' },
    images: imgs(1), tags: ['مبللة', 'عبوة', 'توفير'],
    description: 'عبوة اقتصادية ضخمة ٥ عبوات × ٨٠ = ٤٠٠ منديل إجمالاً.',
    features: ['٥ عبوات كاملة', 'إجمالي ٤٠٠ منديل', 'شحن مجاني', 'توفير ٤٥ ريال حقيقي', 'نفس جودة الكلاسيك'],
    specs: new Map([['العدد', '٥ عبوات'], ['الإجمالي', '٤٠٠ منديل']]),
  },

  /* ===================== COTTON TOWELS (12) ===================== */
  {
    slug: 'towel-cotton-10',
    name: 'مناشف NOVI القطنية — ١٠ قطع',
    nameEn: 'Cotton Towels 10pk',
    category: 'cotton-towels',
    price: 49.99, comparePrice: 64.99,
    rating: 4.7, reviewCount: 410, stock: 320, sold: 6800, sku: 'ND-CT-001',
    badge: { label: 'شائع', color: 'gold' },
    images: imgs(6), tags: ['مناشف', 'قطن', 'تنظيف'],
    description: 'مناشف تنظيف من الألياف القطنية قابلة لإعادة الاستخدام.',
    features: ['قابلة لإعادة الاستخدام ٥٠+ مرة', 'مضادة للبكتيريا طبيعياً', 'امتصاص فائق السرعة', 'قوية لا تنقطع', 'صديقة للبيئة'],
    specs: new Map([['العدد', '١٠ قطع'], ['المادة', 'قطن ١٠٠٪'], ['القياسات', '٣٠×٣٠ سم']]),
    isBestSeller: true,
  },
  {
    slug: 'towel-microfiber-10',
    name: 'مناشف NOVI مايكروفايبر — ١٠',
    nameEn: 'Microfiber Towels 10',
    category: 'cotton-towels',
    price: 59.99, comparePrice: 74.99,
    rating: 4.8, reviewCount: 312, stock: 250, sold: 5200, sku: 'ND-CT-002',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(7), tags: ['مناشف', 'مايكروفايبر', 'امتصاص'],
    description: 'مناشف مايكروفايبر فائقة الامتصاص. تمتص ٧ أضعاف وزنها من الماء.',
    features: ['امتصاص ٧× الوزن', 'لا تترك خطوطاً', 'سريعة الجفاف', '١٠ قطع', 'ألوان متعددة'],
    specs: new Map([['العدد', '١٠ قطع'], ['المادة', 'مايكروفايبر ٣٠٠ GSM']]),
    isNewArrival: true,
  },
  {
    slug: 'towel-bamboo-5',
    name: 'مناشف NOVI بامبو — ٥ قطع',
    nameEn: 'Bamboo Towels 5pk',
    category: 'cotton-towels',
    price: 69.99, comparePrice: 89.99,
    rating: 4.9, reviewCount: 189, stock: 150, sold: 2800, sku: 'ND-CT-003',
    badge: { label: 'صديق للبيئة', color: 'green' },
    images: imgs(0), tags: ['مناشف', 'بامبو', 'بيئة'],
    description: 'مناشف من ألياف الخيزران الطبيعية.',
    features: ['خيزران طبيعي ١٠٠٪', 'أنعم من القطن', 'مضادة للبكتيريا', 'قابلة للتحلل', 'شهادة FSC'],
    specs: new Map([['العدد', '٥ قطع'], ['المادة', 'ألياف خيزران طبيعية']]),
  },
  {
    slug: 'towel-organic-8',
    name: 'مناشف NOVI العضوية — ٨ قطع',
    nameEn: 'Organic Towels 8',
    category: 'cotton-towels',
    price: 74.99, comparePrice: 94.99,
    rating: 4.8, reviewCount: 145, stock: 120, sold: 1900, sku: 'ND-CT-005',
    badge: { label: 'عضوي معتمد', color: 'green' },
    images: imgs(2), tags: ['مناشف', 'عضوي', 'طبيعي'],
    description: 'مناشف من قطن عضوي معتمد بدون مبيدات أو كيماويات.',
    features: ['قطن عضوي معتمد GOTS', 'بدون مبيدات أو كيماويات', '٨ قطع', 'تحلل طبيعي كامل', 'ألوان طبيعية'],
    specs: new Map([['العدد', '٨ قطع'], ['الشهادة', 'GOTS Organic Certified']]),
  },

  /* ===================== KITCHEN (10) ===================== */
  {
    slug: 'kitchen-roll-3',
    name: 'رولات مطبخ NOVI — ٣ رولات',
    nameEn: 'Kitchen Roll 3-Pack',
    category: 'kitchen',
    price: 34.99, comparePrice: 44.99,
    rating: 4.7, reviewCount: 520, stock: 450, sold: 9800, sku: 'ND-KT-001',
    badge: { label: 'الأكثر مبيعاً', color: 'gold' },
    images: imgs(2), tags: ['مطبخ', 'رول', 'امتصاص'],
    description: 'رولات مطبخ عالية الامتصاص. ٣ رولات في عبوة واحدة.',
    features: ['امتصاص فائق السرعة', 'تنظيف عميق بدون جهد', 'لا تترك ألياف', '٣ رولات في العبوة', 'للمطبخ التجاري'],
    specs: new Map([['العدد', '٣ رولات'], ['ورقات/رول', '٥٠٠ ورقة']]),
    isBestSeller: true,
  },
  {
    slug: 'kitchen-roll-jumbo',
    name: 'رول مطبخ NOVI جامبو',
    nameEn: 'Jumbo Kitchen Roll',
    category: 'kitchen',
    price: 24.99, comparePrice: 31.99,
    rating: 4.8, reviewCount: 198, stock: 380, sold: 5100, sku: 'ND-KT-002',
    badge: { label: 'الأكبر', color: 'gold' },
    images: imgs(3), tags: ['مطبخ', 'جامبو', 'ضخم'],
    description: 'رول مطبخ جامبو ضخم. يدوم ضعف الرولات العادية.',
    features: ['ضعف الحجم العادي', '٨٠٠ ورقة كاملة', 'امتصاص مضاعف', 'ورق سميك قوي', 'قيمة ممتازة'],
    specs: new Map([['الورقات', '٨٠٠ ورقة'], ['الحجم', 'جامبو ضخم']]),
  },
  {
    slug: 'kitchen-roll-5',
    name: 'رولات مطبخ NOVI — ٥ رولات',
    nameEn: 'Kitchen Roll 5-Pack',
    category: 'kitchen',
    price: 54.99, comparePrice: 69.95,
    rating: 4.7, reviewCount: 345, stock: 300, sold: 7200, sku: 'ND-KT-003',
    badge: { label: 'وفّر ٢١٪', color: 'red' },
    images: imgs(4), tags: ['مطبخ', 'رول', 'توفير'],
    description: 'عبوة اقتصادية ٥ رولات مطبخ.',
    features: ['٥ رولات كاملة', 'امتصاص فائق', 'لا تتمزق', 'مثالية للمطبخ التجاري', 'توفير ممتاز'],
    specs: new Map([['العدد', '٥ رولات'], ['الإجمالي', '٢٥٠٠ ورقة']]),
  },
  {
    slug: 'kitchen-complete-set',
    name: 'طقم مطبخ NOVI الكامل',
    nameEn: 'Complete Kitchen Set',
    category: 'kitchen',
    price: 79.99, comparePrice: 109.99,
    rating: 4.9, reviewCount: 145, stock: 120, sold: 2100, sku: 'ND-KT-010',
    badge: { label: 'طقم كامل', color: 'gold' },
    images: imgs(3), tags: ['مطبخ', 'طقم', 'شامل'],
    description: 'طقم مطبخ شامل: رول ورق + ورق شمع + ورق ألومنيوم + نايلون تغليف.',
    features: ['٤ منتجات مطبخ شاملة', 'رول ورق + ورق شمع', 'ألومنيوم + نايلون', 'توفير ٣٠ ريال', 'في علبة تخزين جميلة'],
    specs: new Map([['المحتويات', 'رول + شمع + ألومنيوم + نايلون']]),
    isFeatured: true,
  },

  /* ===================== POCKET TISSUE (10) ===================== */
  {
    slug: 'pocket-classic-20',
    name: 'مناديل جيب نَدى كلاسيك — ٢٠ حزمة',
    nameEn: 'Pocket Classic 20pk',
    category: 'pocket',
    price: 15.99, comparePrice: 19.99,
    rating: 4.6, reviewCount: 280, stock: 700, sold: 7800, sku: 'ND-PT-001',
    badge: { label: 'للسفر', color: 'blue' },
    images: imgs(4), tags: ['جيب', 'سفر', 'مدمج'],
    description: 'مناديل جيب مدمجة وعملية. ٢٠ حزمة × ١٠ مناديل = ٢٠٠ منديل.',
    features: ['٢٠ حزمة مدمجة', '٢٠٠ منديل إجمالاً', 'مثالية للحمل والسفر', 'خفيفة ومريحة', 'بدون عطور'],
    specs: new Map([['العدد', '٢٠ حزمة × ١٠'], ['الإجمالي', '٢٠٠ منديل']]),
  },
  {
    slug: 'pocket-aloe-20',
    name: 'مناديل جيب نَدى بالصبار — ٢٠',
    nameEn: 'Pocket Aloe 20',
    category: 'pocket',
    price: 17.99, comparePrice: 22.99,
    rating: 4.7, reviewCount: 234, stock: 480, sold: 5900, sku: 'ND-PT-002',
    images: imgs(5), tags: ['جيب', 'صبار', 'ترطيب'],
    description: 'مناديل جيب مدعمة بالصبار. مرطبة وناعمة حتى بعد الاستخدام المتكرر.',
    features: ['صبار طبيعي مدعم', 'مرطبة للبشرة', '٢٠ حزمة', 'ناعمة جداً', 'للبشرة الحساسة'],
    specs: new Map([['العدد', '٢٠ حزمة'], ['المكونات', 'صبار، فيتامين E']]),
  },
  {
    slug: 'pocket-kids-20',
    name: 'مناديل جيب أطفال نَدى — ٢٠',
    nameEn: 'Kids Pocket 20',
    category: 'pocket',
    price: 14.99, comparePrice: 18.99,
    rating: 4.8, reviewCount: 312, stock: 550, sold: 7200, sku: 'ND-PT-003',
    badge: { label: 'للأطفال', color: 'gold' },
    images: imgs(6), tags: ['جيب', 'أطفال', 'كرتون'],
    description: 'مناديل جيب بشخصيات كرتونية محببة للأطفال.',
    features: ['شخصيات كرتونية', 'آمنة للأطفال ١٠٠٪', 'بدون كيماويات', 'ناعمة على بشرة الأطفال', '٢٠ حزمة'],
    specs: new Map([['العدد', '٢٠ حزمة'], ['التصميم', 'شخصيات كرتونية']]),
  },
  {
    slug: 'pocket-luxury-10',
    name: 'مناديل جيب نَدى فاخرة — ١٠ حزم',
    nameEn: 'Luxury Pocket 10',
    category: 'pocket',
    price: 22.99, comparePrice: 28.99,
    rating: 4.8, reviewCount: 145, stock: 280, sold: 3200, sku: 'ND-PT-005',
    badge: { label: 'فاخر', color: 'gold' },
    images: imgs(0), tags: ['جيب', 'فاخر', 'هدية'],
    description: 'مناديل جيب فاخرة بغلاف جلدي أنيق.',
    features: ['غلاف جلدي فاخر', '١٠ حزم بـ٣ طبقات', 'مثالية للهدايا', 'تصميم حصري', 'ألوان متعددة'],
    specs: new Map([['العدد', '١٠ حزم'], ['الغلاف', 'جلد طبيعي']]),
  },

  /* ===================== SPECIALTY (5) ===================== */
  {
    slug: 'spec-makeup-sponge-10',
    name: 'إسفنجات ترتيب مكياج نَدى — ١٠',
    nameEn: 'Makeup Sponges 10',
    category: 'specialty',
    price: 34.99, comparePrice: 44.99,
    rating: 4.8, reviewCount: 312, stock: 200, sold: 4800, sku: 'ND-SP-001',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(6), tags: ['خاص', 'مكياج', 'نساء'],
    description: 'إسفنجات تطبيق المكياج الاحترافية.',
    features: ['تطبيق متساوٍ بدون خطوط', 'ناعمة على البشرة', 'قابلة للغسيل', '١٠ قطع', 'احترافية للمكياج'],
    specs: new Map([['العدد', '١٠ قطع'], ['المادة', 'إسفنج طبي ناعم']]),
    isNewArrival: true,
  },
  {
    slug: 'spec-cotton-pads-100',
    name: 'قطن ديسك نَدى — ١٠٠ قرص',
    nameEn: 'Cotton Pads 100',
    category: 'specialty',
    price: 16.99, comparePrice: 21.99,
    rating: 4.7, reviewCount: 445, stock: 600, sold: 8900, sku: 'ND-SP-002',
    badge: { label: 'شائع', color: 'gold' },
    images: imgs(7), tags: ['خاص', 'قطن', 'مكياج'],
    description: 'أقراص قطن طبيعية ناعمة ١٠٠٪ لإزالة المكياج والعناية بالبشرة.',
    features: ['قطن طبيعي ١٠٠٪', 'ناعمة جداً على البشرة', '١٠٠ قرص', 'بدون نسالة', 'للمكياج والعناية'],
    specs: new Map([['العدد', '١٠٠ قرص'], ['المادة', 'قطن طبيعي ١٠٠٪']]),
    isBestSeller: true,
  },
  {
    slug: 'spec-cotton-buds-200',
    name: 'أعواد قطن نَدى — ٢٠٠ عود',
    nameEn: 'Cotton Buds 200',
    category: 'specialty',
    price: 12.99, comparePrice: 16.99,
    rating: 4.6, reviewCount: 389, stock: 800, sold: 11200, sku: 'ND-SP-003',
    images: imgs(0), tags: ['خاص', 'أعواد', 'آذان'],
    description: 'أعواد قطن ناعمة ومتينة للعناية بالأذنين والتجميل والفنون.',
    features: ['قطن ناعم ١٠٠٪', '٢٠٠ عود في العبوة', 'للأذنين والتجميل', 'عصا بلاستيكية أو ورقية', 'متينة لا تتكسر'],
    specs: new Map([['العدد', '٢٠٠ عود'], ['المادة', 'قطن + عصا آمنة']]),
  },
  {
    slug: 'spec-facial-mask-10',
    name: 'أقنعة وجه نَدى — ١٠ قطع',
    nameEn: 'Facial Sheet Masks 10',
    category: 'specialty',
    price: 49.99, comparePrice: 64.99,
    rating: 4.8, reviewCount: 234, stock: 180, sold: 3200, sku: 'ND-SP-004',
    badge: { label: 'جديد', color: 'blue' },
    images: imgs(1), tags: ['خاص', 'قناع', 'بشرة'],
    description: 'أقنعة ورقية للوجه بخلاصات طبيعية. ترطيب عميق وتغذية فائقة للبشرة.',
    features: ['ورقة مشبعة بالسيروم', '١٠ قطع متنوعة', 'صبار + فيتامين C + الكولاجين', 'ترطيب عميق', 'مناسبة لكل أنواع البشرة'],
    specs: new Map([['العدد', '١٠ قطع'], ['الأنواع', 'صبار، فيتامين C، كولاجين']]),
    isNewArrival: true,
  },
  {
    slug: 'spec-eye-patches-20',
    name: 'لصقات تحت العين نَدى — ٢٠ زوج',
    nameEn: 'Eye Patches 20pr',
    category: 'specialty',
    price: 54.99, comparePrice: 69.99,
    rating: 4.7, reviewCount: 178, stock: 150, sold: 2800, sku: 'ND-SP-005',
    badge: { label: 'عناية فائقة', color: 'gold' },
    images: imgs(2), tags: ['خاص', 'عين', 'عناية'],
    description: 'لصقات هيدروجيل تحت العين لتفتيح الهالات وتقليل الانتفاخ.',
    features: ['تفتيح الهالات الداكنة', 'تقليل الانتفاخ', 'هيدروجيل فائق الترطيب', '٢٠ زوج', 'نتيجة من أول استخدام'],
    specs: new Map([['العدد', '٢٠ زوج'], ['المادة', 'هيدروجيل']]),
  },

  /* ===================== BUNDLES (5) ===================== */
  {
    slug: 'bundle-6x-classic',
    name: 'بكج NOVI التوفير — ٦ علب كلاسيك',
    nameEn: 'Bundle 6x Classic',
    category: 'bundles',
    price: 149.99, comparePrice: 239.94,
    rating: 4.9, reviewCount: 890, stock: 200, sold: 12800, sku: 'ND-BD-001',
    badge: { label: 'وفّر ٣٧٪', color: 'red' },
    images: imgs(3), tags: ['بكج', 'توفير', 'عائلة'],
    description: 'أفضل قيمة! ٦ علب من مناديل NOVI كلاسيك ٦٠٠ منديل. إجمالي ٣٦٠٠ منديل.',
    features: ['٦ علب كلاسيك كاملة', 'إجمالي ٣٦٠٠ منديل', 'شحن مجاني مضمون', 'توفير ٩٠ ريال', 'خليط وردي وأخضر'],
    specs: new Map([['العدد', '٦ علب'], ['الإجمالي', '٣٦٠٠ منديل'], ['الشحن', 'مجاني']]),
    isBestSeller: true, isFeatured: true,
  },
  {
    slug: 'bundle-12x-mega',
    name: 'بكج NOVI ميجا — ١٢ علبة',
    nameEn: 'Mega Bundle 12x',
    category: 'bundles',
    price: 269.99, comparePrice: 479.88,
    rating: 4.8, reviewCount: 340, stock: 100, sold: 5800, sku: 'ND-BD-002',
    badge: { label: 'وفّر ٤٤٪', color: 'red' },
    images: imgs(4), tags: ['بكج', 'ميجا', 'ضخم'],
    description: 'الباقة العائلية الضخمة! ١٢ علبة كلاسيك فاخرة.',
    features: ['١٢ علبة كاملة', 'إجمالي ٧٢٠٠ منديل', 'توفير ٢١٠ ريال', 'توصيل سريع مجاني', 'نقاط ولاء مضاعفة'],
    specs: new Map([['العدد', '١٢ علبة'], ['الإجمالي', '٧٢٠٠ منديل']]),
    isFeatured: true,
  },
  {
    slug: 'bundle-wipes-family',
    name: 'بكج عائلة المبللة — ٥ عبوات متنوعة',
    nameEn: 'Wipes Family Bundle',
    category: 'bundles',
    price: 89.99, comparePrice: 124.95,
    rating: 4.8, reviewCount: 445, stock: 220, sold: 7100, sku: 'ND-BD-003',
    badge: { label: 'وفّر ٢٨٪', color: 'red' },
    images: imgs(5), tags: ['بكج', 'مبللة', 'عائلة'],
    description: '٥ عبوات مبللة متنوعة: كلاسيك + أطفال + معقمة + سفر + جسم.',
    features: ['٥ عبوات متنوعة', 'أطفال + بالغين', 'معقمة + صبار', 'إجمالي ٣٨٠ منديل', 'شحن مجاني'],
    specs: new Map([['العدد', '٥ عبوات'], ['الأنواع', 'كلاسيك، أطفال، معقمة، سفر، جسم']]),
  },
  {
    slug: 'bundle-home-complete',
    name: 'بكج المنزل الشامل — ١٠ منتجات',
    nameEn: 'Home Complete Bundle',
    category: 'bundles',
    price: 199.99, comparePrice: 299.99,
    rating: 4.9, reviewCount: 234, stock: 80, sold: 3200, sku: 'ND-BD-004',
    badge: { label: 'الأشمل', color: 'gold' },
    images: imgs(6), tags: ['بكج', 'منزل', 'شامل'],
    description: 'بكج المنزل الشامل! كل ما يحتاجه منزلك.',
    features: ['٤ علب مناديل وجه', '٢ عبوة مبللة', '١ مناشف قطنية', '١ رول مطبخ', 'توفير ١٠٠ ريال + شحن مجاني'],
    specs: new Map([['العناصر', '١٠ منتجات متنوعة']]),
    isFeatured: true,
  },
  {
    slug: 'bundle-gift-luxury',
    name: 'بكج الهدايا الفاخرة — صندوق مميز',
    nameEn: 'Luxury Gift Bundle',
    category: 'bundles',
    price: 179.99, comparePrice: 249.99,
    rating: 4.9, reviewCount: 167, stock: 60, sold: 2100, sku: 'ND-BD-005',
    badge: { label: 'هدية مثالية', color: 'gold' },
    images: imgs(7), tags: ['بكج', 'هدايا', 'فاخر'],
    description: 'صندوق هدايا فاخر يشمل أفضل منتجات NOVI.',
    features: ['صندوق هدايا أنيق', '٦ منتجات فاخرة مختارة', 'تغليف هدايا مجاني', 'بطاقة تهنئة', 'توصيل معبأ بعناية'],
    specs: new Map([['العناصر', '٦ منتجات فاخرة'], ['التغليف', 'هدايا بصندوق أنيق']]),
  },
];

// ─── Coupons Data ─────────────────────────────────────────────────────────────

const COUPONS = [
  {
    code: 'NOVI10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    maxUses: 0,
    isActive: true,
  },
  {
    code: 'NOVI15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 100,
    maxUses: 0,
    isActive: true,
  },
  {
    code: 'NOVI20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 150,
    maxUses: 0,
    isActive: true,
  },
  {
    code: 'WELCOME5',
    discountType: 'percentage',
    discountValue: 5,
    minOrderAmount: 0,
    maxUses: 0,
    isActive: true,
  },
  {
    code: 'FIRST50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 0,
    maxUses: 1,
    isActive: true,
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

const seed = async () => {
  try {
    console.log('\n🌱 Starting seed process...\n');

    await connectDB();

    // ── Clear existing data ──
    console.log('🗑️  Clearing existing products, coupons, and admin user...');
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({ email: 'admin@nada.sa' });
    console.log('   ✅ Cleared\n');

    // ── Seed products ──
    console.log(`📦 Inserting ${PRODUCTS.length} products...`);
    const insertedProducts = await Product.insertMany(PRODUCTS);
    console.log(`   ✅ Inserted ${insertedProducts.length} products\n`);

    // ── Log category breakdown ──
    const categories = {};
    insertedProducts.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('   Category breakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} products`);
    });
    console.log();

    // ── Seed coupons ──
    console.log(`🎟️  Inserting ${COUPONS.length} coupons...`);
    const insertedCoupons = await Coupon.insertMany(COUPONS);
    console.log(`   ✅ Inserted ${insertedCoupons.length} coupons:`);
    insertedCoupons.forEach((c) => {
      const info =
        c.discountType === 'percentage'
          ? `${c.discountValue}%`
          : `${c.discountValue} SAR`;
      const uses = c.maxUses === 0 ? 'unlimited' : `${c.maxUses} use(s)`;
      const min = c.minOrderAmount > 0 ? ` (min: ${c.minOrderAmount} SAR)` : '';
      console.log(`   - ${c.code}: ${info} off${min} — ${uses}`);
    });
    console.log();

    // ── Create admin user ──
    console.log('👤 Creating admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@nada.sa' });

    if (existingAdmin) {
      console.log('   ℹ️  Admin user already exists, skipping\n');
    } else {
      const adminUser = await User.create({
        firstName: 'نَدى',
        lastName: 'الحرير',
        email: 'admin@nada.sa',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      console.log(`   ✅ Admin created: ${adminUser.email}\n`);
    }

    // ── Summary ──
    const totalProducts = await Product.countDocuments();
    const totalCoupons = await Coupon.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    console.log('╔═══════════════════════════════════════╗');
    console.log('║         Seed Complete! Summary        ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║  Products:  ${String(totalProducts).padEnd(27)}║`);
    console.log(`║  Coupons:   ${String(totalCoupons).padEnd(27)}║`);
    console.log(`║  Admins:    ${String(totalAdmins).padEnd(27)}║`);
    console.log('╠═══════════════════════════════════════╣');
    console.log('║  Admin credentials:                   ║');
    console.log('║  Email:  admin@nada.sa                ║');
    console.log('║  Pass:   Admin@123456                 ║');
    console.log('╚═══════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error.message);
    if (error.writeErrors) {
      error.writeErrors.forEach((e) => {
        console.error(`  - ${e.errmsg}`);
      });
    }
    process.exit(1);
  }
};

seed();
