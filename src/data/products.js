export const products = [
  {
    id: 1,
    name: "IGET Bar Plus – Blue Razz Lemonade",
    price: 54.95,
    originalPrice: null,
    category: "IGET",
    brand: "IGET",
    puffs: "6000 Puffs",
    image: "/assets/Blue-Razz-Lemonade-247x296.jpg",
    description: "A tangy-sweet fusion of blue raspberry and lemonade. One of our bestsellers.",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "IGET Bar Plus – Cola Ice",
    price: 54.95,
    originalPrice: null,
    category: "IGET",
    brand: "IGET",
    puffs: "6000 Puffs",
    image: "/assets/Cola-Ice-247x296.jpg",
    description: "Classic cola flavour with a cool refreshing icy finish. Fan favourite.",
    badge: "Hot"
  },
  {
    id: 3,
    name: "IGET Bar Plus – Hubba Bubba",
    price: 54.95,
    originalPrice: null,
    category: "IGET",
    brand: "IGET",
    puffs: "6000 Puffs",
    image: "/assets/Hubba-247x296.jpg",
    description: "Nostalgic sweet bubblegum flavour. Smooth and satisfying every time.",
    badge: null
  },
  {
    id: 4,
    name: "IGET Bar Plus – Blueberry Raspberry Ice",
    price: 54.95,
    originalPrice: null,
    category: "IGET",
    brand: "IGET",
    puffs: "6000 Puffs",
    image: "/assets/Blueberry-Raspberry-Ice-247x296.jpg",
    description: "Sweet blueberry and tart raspberry with an icy menthol kick.",
    badge: "New"
  },
  {
    id: 5,
    name: "GEEK BAR – Blackberry Ice",
    price: 51.95,
    originalPrice: null,
    category: "Geek Bar",
    brand: "GEEK BAR",
    puffs: "5000 Puffs",
    image: "/assets/Blackberry-Ice-280x280.jpg",
    description: "Bold blackberry flavour chilled to perfection. Rich, dark, and icy.",
    badge: null
  },
  {
    id: 6,
    name: "Fumot – Grape Ice",
    price: 52.95,
    originalPrice: null,
    category: "Fumot",
    brand: "Fumot",
    puffs: "7000 Puffs",
    image: "/assets/Grape-Ice-280x280.jpg",
    description: "Juicy concord grape flavour with a smooth icy finish.",
    badge: null
  },
  {
    id: 7,
    name: "Vozol – Cool Mint",
    price: 49.95,
    originalPrice: null,
    category: "Vozol",
    brand: "VOZOL",
    puffs: "5000 Puffs",
    image: "/assets/Cool-Mint-280x280.jpg",
    description: "Pure, clean, and refreshing spearmint. The classic choice.",
    badge: null
  },
  {
    id: 8,
    name: "Alibarbar – Mango Ice",
    price: 49.00,
    originalPrice: null,
    category: "Alibarbar",
    brand: "Alibarbar",
    puffs: "5000 Puffs",
    image: "/assets/Mango-Ice-280x280.jpg",
    description: "Tropical ripe mango with a light icy undertone. Summer in a stick.",
    badge: "Top Rated"
  },
  {
    id: 9,
    name: "Elf Bar – Strawberry Watermelon",
    price: 51.95,
    originalPrice: null,
    category: "Elf Bar",
    brand: "Elf Bar",
    puffs: "5000 Puffs",
    image: "/assets/Strawberry-Watermelon-280x280.jpg",
    description: "Sweet strawberry meets juicy watermelon. Fruity and light.",
    badge: null
  },
  {
    id: 10,
    name: "WALA – Peach Ice",
    price: 51.95,
    originalPrice: null,
    category: "WALA",
    brand: "WALA",
    puffs: "6000 Puffs",
    image: "/assets/Peach-Ice-1-280x280.jpg",
    description: "Ripe, juicy peach chilled with icy menthol. Perfectly balanced.",
    badge: null
  },
  {
    id: 12,
    name: "NEXA – Blueberry Blast",
    price: 52.95,
    originalPrice: null,
    category: "NEXA",
    brand: "NEXA",
    puffs: "8000 Puffs",
    image: "/assets/Blueberry-Blast-280x280.jpg",
    description: "An explosive burst of blueberry flavour that lasts all day.",
    badge: "New"
  },
  {
    id: 11,
    name: "JNR – Raspberry Grape",
    price: 49.95,
    originalPrice: null,
    category: "JNR",
    brand: "JNR",
    puffs: "5000 Puffs",
    image: "/assets/Raspberry_Grape-280x280.jpg",
    description: "A beautiful blend of sharp raspberry and sweet grape.",
    badge: null
  },
  {
    id: 13,
    name: "SMOK – Kiwi Pineapple",
    price: 53.95,
    originalPrice: null,
    category: "SMOK",
    brand: "SMOK",
    puffs: "6000 Puffs",
    image: "/assets/Kiwi-Pineapple-280x280.jpg",
    description: "Tangy kiwi meets tropical pineapple. Vibrant and refreshing.",
    badge: null
  },
  {
    id: 14,
    name: "Bang – Cherry Pomegranate",
    price: 49.00,
    originalPrice: null,
    category: "BANG",
    brand: "Bang",
    puffs: "5000 Puffs",
    image: "/assets/Cherry_Pomegranate-280x280.jpg",
    description: "Deep cherry and rich pomegranate in every draw. Bold and intense.",
    badge: null
  }
];

export const brands = [...new Set(products.map(p => p.brand))];
export const categories = ['All', ...new Set(products.map(p => p.category))];
