import React, { useState, useEffect } from 'react';
import { ProductReview } from '../../types';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  CheckCircle,
  MessageSquare,
  PenLine,
  X,
  Send,
  ThumbsUp,
} from 'lucide-react';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFilterRating, setSelectedFilterRating] = useState<number | 'all'>('all');

  // Load reviews on mount or productId change
  useEffect(() => {
    setIsLoading(true);
    reviewService.getReviewsByProductId(productId).then(data => {
      setReviews(data);
      setIsLoading(false);
    });
  }, [productId]);

  // Sync author name if user logs in
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setAuthor(user.name);
    }
  }, [isAuthenticated, user]);

  const stats = reviewService.calculateStats(reviews);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      addToast('Please select a star rating', 'error', 'Choose from 1 to 5 stars for your review.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      addToast('Review comment too short', 'error', 'Please provide at least 5 characters of feedback.');
      return;
    }

    const reviewerName = author.trim() || (user ? user.name : 'Collector');

    setIsSubmitting(true);
    try {
      const newRev = await reviewService.addReview({
        productId,
        author: reviewerName,
        rating,
        comment: comment.trim(),
      });

      setReviews(prev => [newRev, ...prev]);
      setComment('');
      setShowReviewForm(false);
      addToast(
        'Review published',
        'success',
        `Thank you for reviewing the ${productName}. Your feedback is now live.`
      );
    } catch {
      addToast('Unable to submit review', 'error', 'Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = selectedFilterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === selectedFilterRating);

  const RATING_LABELS: Record<number, string> = {
    5: 'Exceptional',
    4: 'Very Good',
    3: 'Average',
    2: 'Needs Improvement',
    1: 'Disappointing',
  };

  return (
    <section
      aria-label="Client Reviews & Ratings"
      className="pt-12 border-t border-[#E4E1DA] space-y-8"
    >
      {/* Section Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E4E1DA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#171A19] tracking-tight">
              Client Reviews
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#EDE4D2] text-[#123C35] rounded-full">
              {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          <p className="text-xs text-[#666B67] mt-1">
            Real impressions from verified collectors and studio owners
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setShowReviewForm(prev => !prev)}
          className="self-start md:self-auto px-4 py-2.5 bg-[#123C35] hover:bg-[#0E2F29] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          {showReviewForm ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel Review</span>
            </>
          ) : (
            <>
              <PenLine className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </>
          )}
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl shadow-xs">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[#E4E1DA]">
          <span className="text-5xl font-bold text-[#171A19] tabular-nums tracking-tight">
            {stats.average.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2" aria-label={`Rating: ${stats.average} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.average)
                    ? 'text-[#B89B5E] fill-[#B89B5E]'
                    : 'text-[#E4E1DA]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#666B67]">
            Based on {stats.count} verified {stats.count === 1 ? 'evaluation' : 'evaluations'}
          </p>
        </div>

        {/* Star Rating Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = stats.distribution[stars as keyof typeof stats.distribution] || 0;
            const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
            const isFilterActive = selectedFilterRating === stars;

            return (
              <button
                key={stars}
                type="button"
                onClick={() => setSelectedFilterRating(prev => (prev === stars ? 'all' : stars))}
                className={`w-full flex items-center gap-3 text-xs group text-left cursor-pointer transition-colors p-1 rounded-sm ${
                  isFilterActive ? 'bg-[#EDE4D2]/40 font-semibold' : 'hover:bg-[#F7F5F0]'
                }`}
                title={`Filter by ${stars} stars (${count} reviews)`}
              >
                <div className="w-14 flex items-center gap-1 text-[#666B67] shrink-0">
                  <span className="tabular-nums">{stars}</span>
                  <Star className="w-3 h-3 text-[#B89B5E] fill-[#B89B5E]" />
                </div>

                <div className="flex-1 h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#123C35] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-10 text-right text-[#666B67] tabular-nums shrink-0">
                  {count}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Drawer/Modal */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-6 bg-[#FDFCFB] border-2 border-[#123C35]/30 rounded-2xl shadow-sm space-y-5 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
            <h3 className="text-base font-semibold text-[#171A19]">
              Share Your Experience
            </h3>
            <span className="text-xs text-[#666B67]">
              Reviewing: <span className="font-medium text-[#171A19]">{productName}</span>
            </span>
          </div>

          {/* Interactive Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#171A19] uppercase tracking-wider mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map(star => {
                  const filled = hoverRating > 0 ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 rounded hover:scale-110 transition-transform cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#123C35]"
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          filled ? 'text-[#B89B5E] fill-[#B89B5E]' : 'text-[#E4E1DA]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-medium text-[#123C35] px-2 py-0.5 bg-[#EDE4D2] rounded">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Reviewer Name */}
          <div>
            <label
              htmlFor="review-author"
              className="block text-xs font-semibold text-[#171A19] uppercase tracking-wider mb-1"
            >
              Your Name / Handle
            </label>
            <input
              id="review-author"
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g., Marcus Vance"
              maxLength={50}
              className="w-full sm:max-w-md px-3.5 py-2 text-sm bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg text-[#171A19] placeholder:text-[#666B67]/50 focus:border-[#123C35] focus:outline-hidden"
            />
          </div>

          {/* Review Comment Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="review-comment"
                className="block text-xs font-semibold text-[#171A19] uppercase tracking-wider"
              >
                Review Comments <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-[#666B67]">
                {comment.length}/500
              </span>
            </div>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Describe sound reproduction, build quality, tactile resistance, or daily ergonomics..."
              maxLength={500}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg text-[#171A19] placeholder:text-[#666B67]/50 focus:border-[#123C35] focus:outline-hidden leading-relaxed resize-y"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || comment.trim().length < 5}
              className="px-5 py-2.5 bg-[#123C35] hover:bg-[#0E2F29] disabled:bg-[#666B67]/40 text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Submit Review'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2.5 text-xs text-[#666B67] hover:text-[#171A19] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review List Filter Bar */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-[#666B67] pt-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#123C35]" />
            <span>
              Showing {filteredReviews.length} of {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {selectedFilterRating !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedFilterRating('all')}
              className="text-[#123C35] hover:underline font-semibold cursor-pointer"
            >
              Clear filter ({selectedFilterRating} Stars)
            </button>
          )}
        </div>
      )}

      {/* Clean Review List Format */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E4E1DA]" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3 bg-[#E4E1DA] rounded" />
                  <div className="w-16 h-2.5 bg-[#E4E1DA] rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-[#E4E1DA]/60 rounded" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-10 text-center bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl space-y-3">
          <p className="text-sm font-medium text-[#171A19]">
            {selectedFilterRating !== 'all'
              ? `No ${selectedFilterRating}-star reviews yet.`
              : 'Be the first to share an evaluation of this instrument.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilterRating('all');
              setShowReviewForm(true);
            }}
            className="px-4 py-2 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Leave a Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => {
            const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <article
                key={review.id}
                className="p-6 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl space-y-3 transition-shadow hover:shadow-xs"
              >
                {/* Review Header: Author, Rating, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Author Initial Badge */}
                    <div className="w-8 h-8 rounded-full bg-[#EDE4D2] text-[#123C35] font-semibold text-xs flex items-center justify-center border border-[#B89B5E]/30 shrink-0">
                      {review.author.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#171A19]">
                          {review.author}
                        </span>
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[#123C35]">
                            <CheckCircle className="w-3 h-3 text-[#123C35]" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#666B67]">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1" aria-label={`${review.rating} of 5 stars`}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating
                            ? 'text-[#B89B5E] fill-[#B89B5E]'
                            : 'text-[#E4E1DA]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text Body */}
                <p className="text-sm text-[#171A19]/90 leading-relaxed font-sans pt-1">
                  {review.comment}
                </p>

                {/* Helpful feedback affordance */}
                <div className="pt-2 flex items-center gap-4 text-xs text-[#666B67]">
                  <button
                    type="button"
                    onClick={() => addToast('Feedback noted', 'info', 'Thank you for your helpfulness vote.')}
                    className="flex items-center gap-1.5 hover:text-[#123C35] transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
