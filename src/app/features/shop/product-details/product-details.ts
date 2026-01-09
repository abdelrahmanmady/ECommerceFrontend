//Angular Imports
import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
//Libraries
import { ToastrService } from 'ngx-toastr';
//Services
import {
  AuthService,
  CartService,
  ProductService,
  ReviewService,
  WishlistService,
} from '../../../core/services';
//Models
import { ProductDetailsResponse, CareInstructionType } from '../../../core/models';
import { ReviewProductSummaryDto } from '../../../core/models/review.model';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements AfterViewInit {
  //Declare AOS
  private readonly AOS = (window as any).AOS;
  //Angular
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  //Libraries
  toastr = inject(ToastrService);
  //Services
  productService = inject(ProductService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  reviewService = inject(ReviewService);

  //Product State
  productData = signal<ProductDetailsResponse | null>(null);
  productId: number;

  //Image Gallery State
  mainImage = signal<any>({});
  activeImage = signal(0);

  //Size Selection State
  sizes = signal([
    { name: 'XS', available: false },
    { name: 'S', available: true },
    { name: 'M', available: true },
    { name: 'L', available: true },
    { name: 'XL', available: false },
  ]);
  selectedSize = signal<string | null>(null);

  //Quantity State
  quantity: number = 1;
  maxStock: number = 0;
  isShaking = signal(false);

  //Wishlist State
  isWishlisted = computed(() => this.wishlistService.wishlistIds().includes(this.productId));

  //Helpful State
  helpfulClicked = signal<Set<number>>(new Set());
  processingHelpful = signal<Set<number>>(new Set());

  markHelpful(reviewId: number): void {
    if (this.helpfulClicked().has(reviewId) || this.processingHelpful().has(reviewId)) return;

    this.processingHelpful.update((set) => {
      const newSet = new Set(set);
      newSet.add(reviewId);
      return newSet;
    });

    this.reviewService.markReviewHelpful(reviewId).subscribe({
      next: () => {
        this.processingHelpful.update((set) => {
          const newSet = new Set(set);
          newSet.delete(reviewId);
          return newSet;
        });

        this.helpfulClicked.update((set) => {
          const newSet = new Set(set);
          newSet.add(reviewId);
          return newSet;
        });

        this.reviews.update((reviews) =>
          reviews.map((r) => {
            if (r.id === reviewId) {
              return { ...r, helpfulCount: r.helpfulCount + 1 };
            }
            return r;
          })
        );
      },
      error: (err) => {
        this.processingHelpful.update((set) => {
          const newSet = new Set(set);
          newSet.delete(reviewId);
          return newSet;
        });

        // Error handling delegated to global error interceptor to avoid double toasts
      },
    });
  }

  //Reviews State
  reviews = signal<ReviewProductSummaryDto[]>([]);
  reviewsLoaded = signal(false);
  reviewsLoading = signal(false);
  showAllReviews = signal(false);
  displayedReviews = computed(() =>
    this.showAllReviews() ? this.reviews() : this.reviews().slice(0, 3)
  );

  loadReviews(): void {
    if (this.reviewsLoaded() || this.reviewsLoading()) return;
    this.reviewsLoading.set(true);
    this.reviewService.getProductReviews(this.productId).subscribe({
      next: (res) => {
        this.reviews.set(res);
        this.reviewsLoaded.set(true);
        this.reviewsLoading.set(false);
      },
      error: () => {
        this.reviewsLoading.set(false);
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  //Write Review Form State
  showReviewForm = signal(false);
  newReviewRating = signal(0);
  newReviewComment = signal('');
  hoverRating = signal(0);

  toggleReviewForm(): void {
    this.showReviewForm.update((v) => !v);
    if (!this.showReviewForm()) {
      this.resetReviewForm();
    }
  }

  setRating(rating: number): void {
    this.newReviewRating.set(rating);
  }

  resetReviewForm(): void {
    this.newReviewRating.set(0);
    this.newReviewComment.set('');
    this.hoverRating.set(0);
  }

  submittingReview = signal(false);
  showThankYou = signal(false);

  submitReview(): void {
    if (this.newReviewRating() === 0 || this.submittingReview()) return;

    this.submittingReview.set(true);
    const request = {
      rating: this.newReviewRating(),
      comment: this.newReviewComment() || undefined,
    };

    this.reviewService.addReview(this.productId, request).subscribe({
      next: (newReview) => {
        // Add to local reviews array (prepend so it shows at top)
        this.reviews.update((reviews) => [newReview, ...reviews]);
        // Reset form and hide it
        this.resetReviewForm();
        this.showReviewForm.set(false);
        this.submittingReview.set(false);
        // Show thank you message
        this.showThankYou.set(true);
        setTimeout(() => this.showThankYou.set(false), 4000);
      },
      error: () => {
        setTimeout(() => this.submittingReview.set(false), 400);
      },
    });
  }

  //Care Instructions Mapping
  private readonly careInstructionMap: Record<
    CareInstructionType,
    { icon: string; label: string }
  > = {
    machineWashCold: { icon: 'bi-water', label: 'Machine Wash Cold' },
    machineWashWarm: { icon: 'bi-thermometer-half', label: 'Machine Wash Warm' },
    handWash: { icon: 'bi-hand-index', label: 'Hand Wash Only' },
    doNotWash: { icon: 'bi-droplet-fill', label: 'Do Not Wash' },
    doNotBleach: { icon: 'bi-x-circle', label: 'Do Not Bleach' },
    bleachAny: { icon: 'bi-droplet', label: 'Bleach Safe' },
    tumbleDryLow: { icon: 'bi-wind', label: 'Tumble Dry Low' },
    tumbleDryHigh: { icon: 'bi-tornado', label: 'Tumble Dry High' },
    doNotTumbleDry: { icon: 'bi-x-octagon', label: 'Do Not Tumble Dry' },
    dryFlat: { icon: 'bi-arrows-expand', label: 'Dry Flat' },
    ironLow: { icon: 'bi-thermometer-low', label: 'Iron Low Heat' },
    ironMedium: { icon: 'bi-thermometer-half', label: 'Iron Medium Heat' },
    ironHigh: { icon: 'bi-thermometer-high', label: 'Iron High Heat' },
    doNotIron: { icon: 'bi-slash-circle', label: 'Do Not Iron' },
    dryCleanOnly: { icon: 'bi-building', label: 'Dry Clean Only' },
    doNotDryClean: { icon: 'bi-x-square', label: 'Do Not Dry Clean' },
  };

  getCareInfo(instruction: CareInstructionType): { icon: string; label: string } {
    return this.careInstructionMap[instruction];
  }

  // Generates array of 5 star types: 'full', 'half', or 'empty'
  getStarsArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const clampedRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(clampedRating);
    const hasHalf = clampedRating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalf) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  // ==================== Constructor ====================

  constructor() {
    const idParam = this.activeRoute.snapshot.paramMap.get('id');
    this.productId = idParam ? parseInt(idParam, 10) : 0;

    this.productService.getProductById(this.productId).subscribe((res: ProductDetailsResponse) => {
      this.productData.set(res);
      this.maxStock = res.stockQuantity;

      // If out of stock, set quantity to 0, otherwise default to 1
      this.quantity = this.maxStock > 0 ? 1 : 0;

      if (res.images && res.images.length > 0) {
        const mainImg = res.images.find((img) => img.isMain) || res.images[0];
        this.mainImage.set(mainImg);
        this.activeImage.set(res.images.indexOf(mainImg));
      }
    });
  }

  // ==================== Lifecycle ====================

  ngAfterViewInit(): void {
    if (this.AOS) {
      setTimeout(() => this.AOS.refresh(), 100);
    }
  }

  // ==================== Image Gallery ====================

  selectImage(index: number) {
    const product = this.productData();
    if (product && product.images) {
      this.mainImage.set(product.images[index]);
      this.activeImage.set(index);
    }
  }

  prevImage() {
    const product = this.productData();
    if (product && product.images) {
      const index = this.activeImage() > 0 ? this.activeImage() - 1 : product.images.length - 1;
      this.selectImage(index);
    }
  }

  nextImage() {
    const product = this.productData();
    if (product && product.images) {
      const index = this.activeImage() < product.images.length - 1 ? this.activeImage() + 1 : 0;
      this.selectImage(index);
    }
  }

  // ==================== Size Selection ====================

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  // ==================== Quantity ====================

  increaseQty(): void {
    if (this.quantity < this.maxStock) {
      this.quantity++;
    } else {
      this.triggerShake();
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      this.triggerShake();
    }
  }

  triggerShake(): void {
    this.isShaking.set(true);
    setTimeout(() => this.isShaking.set(false), 400);
  }

  // ==================== Cart ====================

  addToCart(): void {
    if (!this.authService.user()) {
      this.toastr.info('Please login first');
      return;
    }

    const product = this.productData();
    if (!product) return;

    this.cartService.addToCart(product.id, this.quantity).subscribe({
      next: (response) => {
        // Check if product was actually added to cart
        const addedItem = response.items.find((item) => item.productId === product.id);
        if (addedItem) {
          this.toastr.success('Product added to cart');
        }
      },
      error: (err) => {
        this.toastr.error(err.error);
      },
    });
  }

  // ==================== Wishlist ====================

  toggleWishlist(): void {
    if (!this.authService.user()) {
      this.toastr.info('Please login first');
      return;
    }

    if (this.isWishlisted()) {
      this.wishlistService.removeFromWishlist(this.productId).subscribe({
        next: () => {
          this.toastr.success('Removed from wishlist');
        },
        error: (err) => {
          this.toastr.error(err.error || 'Failed to remove from wishlist');
        },
      });
      return;
    }

    this.wishlistService.addToWishlist(this.productId).subscribe({
      next: () => {
        this.toastr.success('Added to wishlist');
      },
      error: (err) => {
        this.toastr.error(err.error || 'Failed to add to wishlist');
      },
    });
  }
}
