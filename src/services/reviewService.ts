import { ProductReview } from '../types';

const STORAGE_KEY = 'nexora_reviews_v1';

const SEED_REVIEWS: Record<string, Omit<ProductReview, 'id' | 'productId'>[]> = {
  'sony-wh-1000xm5': [
    {
      author: 'Vikram Malhotra',
      rating: 5,
      comment: 'The active noise cancellation is unmatched during metro and flight commutes. Multi-point connection between my MacBook and iPhone switches instantly. Easily 30 hours of battery life.',
      createdAt: '2026-09-14T10:30:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Pooja Iyer',
      rating: 5,
      comment: 'Extremely lightweight and comfortable for all-day office calls. Voice isolation microphones pick up my voice clearly even in noisy coworking spaces. Genuine Sony India warranty verified.',
      createdAt: '2026-09-22T14:15:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Aditya Sen',
      rating: 4,
      comment: 'Audio quality with LDAC enabled is stellar. Bass response is deep and controlled. Comes with a sturdy travel case. Dispatched and delivered to Bengaluru within 48 hours.',
      createdAt: '2026-09-28T09:40:00Z',
      verifiedPurchase: true,
    },
  ],
  'apple-iphone-16-pro-max': [
    {
      author: 'Rohan Mehra',
      rating: 5,
      comment: 'The Grade 5 titanium body feels noticeably balanced in hand. Battery easily lasts 1.5 days on heavy 5G usage. Camera button shortcut makes candid street photography effortless.',
      createdAt: '2026-09-18T16:20:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Ananya Sharma',
      rating: 5,
      comment: 'Display brightness in peak outdoor Indian sunlight is unbelievable. Apple Care registration worked smoothly on activation. Delivered in tamper-evident security packaging.',
      createdAt: '2026-09-25T11:05:00Z',
      verifiedPurchase: true,
    },
  ],
  'apple-macbook-pro-16-m3-max': [
    {
      author: 'Karthik Raman',
      rating: 5,
      comment: 'The M3 Max renders 8K ProRes timelines and Docker microservice stacks without spinning up fans. Liquid Retina XDR screen color accuracy is reference grade. Worth every rupee.',
      createdAt: '2026-09-10T12:00:00Z',
      verifiedPurchase: true,
    },
    {
      author: 'Devika Nair',
      rating: 5,
      comment: '128GB unified memory allows local LLM quantization and training with zero memory swapping. Keyboard tactile travel is superb. Official Indian retail unit.',
      createdAt: '2026-09-29T18:45:00Z',
      verifiedPurchase: true,
    },
  ],
};

const DEFAULT_FALLBACK_REVIEWS: Omit<ProductReview, 'id' | 'productId'>[] = [
  {
    author: 'Kavita Sundaram',
    rating: 5,
    comment: '100% genuine sealed retail unit with valid manufacturer warranty. Dispatched via express courier and delivered within 3 days. Excellent customer service support.',
    createdAt: '2026-09-15T15:20:00Z',
    verifiedPurchase: true,
  },
  {
    author: 'Arjun Patel',
    rating: 5,
    comment: 'Exceptional build quality and authentic performance. Works exactly as advertised. Transparent pricing with GST invoice provided.',
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
