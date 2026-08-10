import { Injectable, signal, computed } from '@angular/core';
import { Product, FilterOptions, CategoryType } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([
    {
      id: 'prod-1',
      name: 'Aura Studio Wireless Headphones',
      subtitle: 'Réduction de Bruit Active & Audio Hi-Fi',
      description: 'Casque audio premium circum-auriculaire offrant un son acoustique haute définition, une réduction de bruit intelligente et une autonomie de 40 heures. Conçu en aluminium brossé et cuir végétal ultra-doux.',
      price: 289.00,
      originalPrice: 349.00,
      discountPercentage: 17,
      category: 'electronics',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.9,
      reviewCount: 128,
      isNew: true,
      isBestSeller: true,
      inStock: true,
      colors: [
        { name: 'Blanc Crème', hex: '#F5F5F7' },
        { name: 'Gris Sidéral', hex: '#4B4D4F' },
        { name: 'Or Rose', hex: '#E0A899' }
      ],
      specs: [
        { label: 'Autonomie', value: '40 Heures' },
        { label: 'Connectivité', value: 'Bluetooth 5.3 & Jack 3.5mm' },
        { label: 'Poids', value: '250g' },
        { label: 'Garantie', value: '2 Ans Constructeur' }
      ],
      reviews: [
        {
          id: 'rev-1',
          userName: 'Sophie Martin',
          rating: 5,
          date: '14 Juillet 2026',
          comment: 'La qualité sonore est incroyable et le design blanc crème s\'accorde parfaitement avec mon bureau. La réduction de bruit est impressionnante.',
          verifiedPurchase: true
        },
        {
          id: 'rev-2',
          userName: 'Thomas Laurent',
          rating: 5,
          date: '02 Juin 2026',
          comment: 'Autonomie spectaculaire, je le recharge une fois par semaine seulement !',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-2',
      name: 'Montre Chronographe Lumina Lux',
      subtitle: 'Mouvement Automatique Suisse & Verre Saphir',
      description: 'Montre d\'exception alliant la précision horlogère suisse à une esthétique contemporaine épurée. Boîtier en acier inoxydable 316L et cadran blanc nacré anti-rayures.',
      price: 495.00,
      originalPrice: 590.00,
      discountPercentage: 16,
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.8,
      reviewCount: 94,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      colors: [
        { name: 'Argent Pur', hex: '#E0E0E0' },
        { name: 'Or Doré', hex: '#D4AF37' }
      ],
      specs: [
        { label: 'Mouvement', value: 'Automatique Suisse ETA 2824' },
        { label: 'Étanchéité', value: '10 ATM (100m)' },
        { label: 'Diamètre', value: '40 mm' }
      ]
    },
    {
      id: 'prod-3',
      name: 'Sac Cabas Cuir Végétal Ivory',
      subtitle: 'Design Minimaliste & Finition Artisanal',
      description: 'Fabriqué à la main avec du cuir italien de haute qualité tannée aux extraits végétaux. Compartiment rembourré pour ordinateur portable 15 pouces et poches d\'organisation internes.',
      price: 210.00,
      category: 'fashion',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.7,
      reviewCount: 63,
      isNew: true,
      isBestSeller: false,
      inStock: true,
      colors: [
        { name: 'Ivoire Lumineux', hex: '#FFFDD0' },
        { name: 'Camel Naturel', hex: '#C19A6B' }
      ],
      sizes: ['Taille Unique']
    },
    {
      id: 'prod-4',
      name: 'Lampe de Bureau Sculpturale Horizon',
      subtitle: 'Éclairage LED Tactile & Variateur d\'Intensité',
      description: 'Une pièce de design d\'intérieur épurée qui diffuse une lumière douce et naturelle. Munie d\'un socle en marbre blanc et d\'un bras orientable en laiton satiné avec chargeur sans fil Qi intégré.',
      price: 165.00,
      originalPrice: 195.00,
      discountPercentage: 15,
      category: 'home',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.9,
      reviewCount: 42,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      colors: [
        { name: 'Marbre Blanc', hex: '#F9F9F9' },
        { name: 'Laiton Brossé', hex: '#E5C158' }
      ]
    },
    {
      id: 'prod-5',
      name: 'Sérum Éclat Botanical Glow',
      subtitle: 'Formule Biologique aux Huiles Rares',
      description: 'Sérum réhydratant et sublimateur enrichi en vitamine C stabilisée et acide hyaluronique végétal. Procure un teint lumineux et frais dès la première application.',
      price: 78.00,
      category: 'beauty',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597261-833258657b45?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.8,
      reviewCount: 156,
      isNew: true,
      isBestSeller: true,
      inStock: true
    },
    {
      id: 'prod-6',
      name: 'Lunettes de Soleil Silk Crystal',
      subtitle: 'Monture en Acétate Végétal & Verres Polarisés',
      description: 'Lunettes au style intemporel avec monture translucide et verres polarisés anti-reflets catégorie 3. Protection UV400 intégrale.',
      price: 135.00,
      originalPrice: 160.00,
      discountPercentage: 15,
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.6,
      reviewCount: 38,
      isNew: false,
      isBestSeller: false,
      inStock: true
    },
    {
      id: 'prod-7',
      name: 'Enceinte Bluetooth Minimalist Stone',
      subtitle: 'Son Surround 360° & Finition Tissu Maillé',
      description: 'Enceinte nomade étanche IPX7 délivrant des basses profondes et un son pur à 360°. Habillée d\'un tissu acoustique résistant aux éclaboussures.',
      price: 149.00,
      category: 'electronics',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.7,
      reviewCount: 89,
      isNew: true,
      isBestSeller: false,
      inStock: true
    },
    {
      id: 'prod-8',
      name: 'Veste Trench Coat Laiton Silk',
      subtitle: 'Coton Biologique Hydrofuge & Coupe Élégante',
      description: 'L\'incontournable trench réinventé avec une coupe fluide contemporaine, des boutons en corne naturelle et une ceinture amovible.',
      price: 320.00,
      originalPrice: 380.00,
      discountPercentage: 15,
      category: 'fashion',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.9,
      reviewCount: 51,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    }
  ]);

  // Filters State Signal
  filters = signal<FilterOptions>({
    category: 'all',
    maxPrice: 600,
    minRating: 0,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Selected Product for Dedicated Page View
  selectedProduct = signal<Product | null>(null);

  // Filtered Products Computed Signal
  filteredProducts = computed(() => {
    const list = this.products();
    const f = this.filters();

    return list.filter(p => {
      // Category filter
      if (f.category !== 'all' && p.category !== f.category) return false;
      // Price filter
      if (p.price > f.maxPrice) return false;
      // Rating filter
      if (p.rating < f.minRating) return false;
      // Search query filter
      if (f.searchQuery) {
        const q = f.searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = p.subtitle.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (f.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  });

  // Categories list with item counts
  categories = computed(() => {
    const all = this.products();
    return [
      { id: 'all', name: 'Tous les Produits', icon: 'ph-grid-four', count: all.length },
      { id: 'electronics', name: 'Électronique', icon: 'ph-headphones', count: all.filter(p => p.category === 'electronics').length },
      { id: 'fashion', name: 'Mode & Style', icon: 'ph-t-shirt', count: all.filter(p => p.category === 'fashion').length },
      { id: 'accessories', name: 'Accessoires Luxe', icon: 'ph-watch', count: all.filter(p => p.category === 'accessories').length },
      { id: 'home', name: 'Maison & Design', icon: 'ph-lamp', count: all.filter(p => p.category === 'home').length },
      { id: 'beauty', name: 'Beauté & Soins', icon: 'ph-sparkles', count: all.filter(p => p.category === 'beauty').length }
    ];
  });

  allProducts = this.products.asReadonly();

  updateFilter(partialFilter: Partial<FilterOptions>) {
    this.filters.update(curr => ({ ...curr, ...partialFilter }));
  }

  resetFilters() {
    this.filters.set({
      category: 'all',
      maxPrice: 600,
      minRating: 0,
      sortBy: 'featured',
      searchQuery: ''
    });
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  setSelectedProduct(product: Product | null) {
    this.selectedProduct.set(product);
  }

  addProduct(newProd: Omit<Product, 'id'>): Product {
    const created: Product = {
      ...newProd,
      id: 'prod-' + Date.now()
    };
    this.products.update(list => [created, ...list]);
    this.saveProductsToStorage();
    return created;
  }

  updateProduct(id: string, changes: Partial<Product>) {
    this.products.update(list => 
      list.map(p => p.id === id ? { ...p, ...changes } : p)
    );
    this.saveProductsToStorage();
  }

  deleteProduct(id: string) {
    this.products.update(list => list.filter(p => p.id !== id));
    if (this.selectedProduct()?.id === id) {
      this.selectedProduct.set(null);
    }
    this.saveProductsToStorage();
  }

  private saveProductsToStorage() {
    try {
      localStorage.setItem('aura_custom_products', JSON.stringify(this.products()));
    } catch (e) {}
  }
}
