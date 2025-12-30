const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const perfumes = [
  {
    title: "Noir de Noir",
    brand: "Tom Ford",
    price: 299.99,
    category: "Unisex",
    size: "100ml",
    description: "An intoxicating blend of black rose and black truffle creates a mysterious, sultry fragrance. Perfect for evening wear with notes of vanilla, patchouli, and oud wood.",
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"],
    stock: 25
  },
  {
    title: "La Vie Est Belle",
    brand: "Lancôme",
    price: 189.99,
    category: "Women",
    size: "50ml",
    description: "A sweet, floral fragrance featuring iris, patchouli, and gourmand notes. The scent of happiness with a beautiful blend of praline and vanilla.",
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"],
    stock: 30
  },
  {
    title: "Sauvage",
    brand: "Dior",
    price: 149.99,
    category: "Men",
    size: "100ml",
    description: "A fresh and spicy cologne with notes of bergamot, pepper, and ambroxan. Masculine and refined, inspired by wide-open spaces.",
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500"],
    stock: 40
  },
  {
    title: "Black Orchid",
    brand: "Tom Ford",
    price: 279.99,
    category: "Women",
    size: "100ml",
    description: "A luxurious and sensual fragrance with notes of black orchid, spice, and dark chocolate. Rich, elegant, and unforgettable.",
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500"],
    stock: 20
  },
  {
    title: "Acqua Di Gio",
    brand: "Giorgio Armani",
    price: 139.99,
    category: "Men",
    size: "100ml",
    description: "A fresh aquatic fragrance inspired by the sea. Notes of marine accord, bergamot, and cedarwood create a refreshing masculine scent.",
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500"],
    stock: 35
  },
  {
    title: "Chanel No. 5",
    brand: "Chanel",
    price: 249.99,
    category: "Women",
    size: "50ml",
    description: "The iconic timeless fragrance with aldehydes, jasmine, and rose. A symbol of elegance and sophistication.",
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500"],
    stock: 15
  },
  {
    title: "Oud Wood",
    brand: "Tom Ford",
    price: 319.99,
    category: "Unisex",
    size: "100ml",
    description: "Exotic rare oud wood combined with sandalwood, rosewood, and cardamom. A sophisticated oriental woody fragrance.",
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500"],
    stock: 18
  },
  {
    title: "Bleu de Chanel",
    brand: "Chanel",
    price: 179.99,
    category: "Men",
    size: "100ml",
    description: "A woody aromatic fragrance with notes of citrus, mint, and cedar. Refined and elegant for the modern man.",
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500"],
    stock: 28
  },
  {
    title: "Flowerbomb",
    brand: "Viktor & Rolf",
    price: 199.99,
    category: "Women",
    size: "50ml",
    description: "An explosive floral fragrance with jasmine, rose, orchid, and patchouli. Sweet, feminine, and captivating.",
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500"],
    stock: 22
  },
  {
    title: "Aventus",
    brand: "Creed",
    price: 399.99,
    category: "Men",
    size: "100ml",
    description: "A legendary fragrance with pineapple, birch, and musk. Powerful, confident, and sophisticated for the distinguished gentleman.",
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59bd9?w=500"],
    stock: 12
  },
  {
    title: "Good Girl",
    brand: "Carolina Herrera",
    price: 169.99,
    category: "Women",
    size: "50ml",
    description: "A daring fragrance with tuberose, jasmine, and almond. Sweet and sensual with a bold personality.",
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500"],
    stock: 26
  },
  {
    title: "1 Million",
    brand: "Paco Rabanne",
    price: 129.99,
    category: "Men",
    size: "100ml",
    description: "A spicy leather fragrance with cinnamon, rose, and white leather. Bold and seductive for confident men.",
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1565635541918-2ffa137ea6e0?w=500"],
    stock: 32
  },
  {
    title: "Lost Cherry",
    brand: "Tom Ford",
    price: 349.99,
    category: "Unisex",
    size: "50ml",
    description: "A full-bodied fragrance with black cherry, bitter almond, and Turkish rose. Decadent and irresistible.",
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500"],
    stock: 14
  },
  {
    title: "J'adore",
    brand: "Dior",
    price: 189.99,
    category: "Women",
    size: "100ml",
    description: "A luminous floral fragrance with ylang-ylang, Damascus rose, and jasmine. Feminine, sensual, and timeless.",
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500"],
    stock: 24
  },
  {
    title: "Tobacco Vanille",
    brand: "Tom Ford",
    price: 329.99,
    category: "Unisex",
    size: "100ml",
    description: "A warm oriental fragrance with tobacco leaf, vanilla, and cocoa. Rich, opulent, and addictive.",
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500"],
    stock: 16
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(perfumes);
    console.log('✅ Sample perfumes added successfully!');
    console.log(`📊 Total products: ${perfumes.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();
