import { ProductReview } from '../types';

const STORAGE_KEY = 'nexora_reviews_v1';

const SEED_REVIEWS: Record<string, Omit<ProductReview, 'id' | 'productId'>[]> = {
  'prod-1': [
    {
      author: 'Marcus Vance',
      rating: 5,
      comment: 'The planar magnetic drivers provide soundstage separation I have never heard in closed-back cans before. The walnut acoustic chambers feel artisanal and warm.',
      createdAt: '2026-09-14T10:30:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Evelyn Shaw',
      rating: 5,
      comment: 'Incredible acoustic balance. Bass is tight without bleeding into the mid-range vocals. The leather padding is comfortable even during 6-hour master recording sessions.',
      createdAt: '2026-09-22T14:15:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Devon Reed',
      rating: 4,
      comment: 'Superb build quality and pristine sound. It is slightly on the heavier side due to the solid aluminum frame, but the headband distributes the weight well.',
      createdAt: '2026-09-28T09:40:00Z',
      verifiedPurchase: true,
    },
  ],
  'prod-2': [
    {
      author: 'Julian Thorne',
      rating: 5,
      comment: 'The gasket mount gives every keystroke a deep, marble "thock" sound that feels therapeutic. The milled brass weight adds serious desk presence.',
      createdAt: '2026-09-18T16:20:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Chloe Lin',
      rating: 5,
      comment: 'Unbelievably good factory switches. No pinging or scratchiness out of the box. Easily the best mechanical board I have owned in 8 years of collecting.',
      createdAt: '2026-09-25T11:05:00Z',
      verifiedPurchase: true,
    },
  ],
  'prod-3': [
    {
      author: 'Aaron K.',
      rating: 5,
      comment: 'The 360-degree aluminum volume drum has the most satisfying tactile damping. Connected seamlessly via optical to my studio monitor system.',
      createdAt: '2026-09-10T12:00:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Sophie M.',
      rating: 4,
      comment: 'Pure class on my credenza. The sound fills a 400 sq ft room with authoritative clarity. Bluetooth 5.3 range is rock solid throughout my apartment.',
      createdAt: '2026-09-29T18:45:00Z',
      verifiedPurchase: true,
    },
  ],
  'prod-4': [
    {
      author: 'Rohan Mehra',
      rating: 5,
      comment: 'The machined knurled rotary dimmer gives you cinema-grade warmth adjustment. No flicker, zero hum, and heavy architectural base prevents tipping.',
      createdAt: '2026-09-20T08:30:00Z',
      verifiedPurchase: true,
    },
  ],
};

const DEFAULT_FALLBACK_REVIEWS: Omit<ProductReview, 'id' | 'productId'>[] = [
  {
    author: 'Kavita Sundaram',
    rating: 5,
    comment: 'Exceptional craftsmanship. The tactile feel and minimalist finishing exceeded expectations. Packaging was immaculate with cloth dust sleeves.',
    createdAt: '2026-09-15T15:20:00Z',
    verifiedPurchase: true,
  },
  {
    author: 'Arjun Patel',
    rating: 5,
    comment: 'Precision engineering at its finest. Worth every rupee for the durable tactile materials and attention to micro-details.',
    createdAt: '2026-09-24T17:10:00Z',
    verifiedPurchase: true,
  },
];

class ReviewService {
  private getStoredReviews(): ProductReview[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredReviews(reviews: ProductReview[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Retrieves all reviews for a product (stored custom reviews + seeded reviews)
   */
  async getReviewsByProductId(productId: string): Promise<ProductReview[]> {
    const userReviews = this.getStoredReviews().filter(r => r.productId === productId);

    const baseSeeds = SEED_REVIEWS[productId] || DEFAULT_FALLBACK_REVIEWS;
    const formattedSeeds: ProductReview[] = baseSeeds.map((seed, idx) => ({
      ...seed,
      id: `seed_${productId}_${idx}`,
      productId,
    }));

    // Combine: user reviews first (newest), then seed reviews
    const combined = [...userReviews, ...formattedSeeds];
    return Promise.resolve(combined);
  }

  /**
   * Adds a new user review
   */
  async addReview(data: {
    productId: string;
    author: string;
    rating: number;
    comment: string;
  }): Promise<ProductReview> {
    const newReview: ProductReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: data.productId,
      author: data.author.trim() || 'Verified Client',
      rating: Math.min(5, Math.max(1, data.rating)),
      comment: data.comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    const current = this.getStoredReviews();
    const updated = [newReview, ...current];
    this.saveStoredReviews(updated);

    return Promise.resolve(newReview);
  }

  /**
   * Calculates review stats: average rating and star counts
   */
  calculateStats(reviews: ProductReview[]) {
    if (reviews.length === 0) {
      return {
        average: 5.0,
        count: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const count = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / count).toFixed(1));

    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      average,
      count,
      distribution,
    };
  }
}

export const reviewService = new ReviewService();
