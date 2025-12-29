//Angular Imports
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
//Libraries
import { forkJoin, Subscription, timer } from 'rxjs';
//Services
import { OrderService, CartService } from '../../../core/services';
//Models
import { OrderQueryParams, OrderSummaryDto } from '../../../core/models';

@Component({
    selector: 'app-account-orders',
    imports: [CommonModule],
    templateUrl: './orders.html',
    styleUrl: './orders.css',
})
export class AccountOrders implements OnInit, OnDestroy {
    //Angular
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    //Services
    private orderService = inject(OrderService);
    private cartService = inject(CartService);

    //Subscriptions
    private orderSubscription?: Subscription;
    private resizeListener: () => void;

    //Orders State
    orders: OrderSummaryDto[] = [];
    totalCount = 0;
    isLoading = true;
    private isInitialLoad = true;

    //UI State
    visibleItemsLimit = 3;

    //Sort & Filter State
    currentSort = '';
    currentFilter = '';

    //Pagination State
    pageIndex = 1;
    pageSize = 3;

    //Computed Properties
    get totalPages(): number {
        return Math.ceil(this.totalCount / this.pageSize);
    }

    get pages(): number[] {
        const total = this.totalPages;
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        const pages: number[] = [1];
        if (this.pageIndex > 3) pages.push(-1);
        for (let i = Math.max(2, this.pageIndex - 1); i <= Math.min(total - 1, this.pageIndex + 1); i++) {
            pages.push(i);
        }
        if (this.pageIndex < total - 2) pages.push(-1);
        pages.push(total);
        return pages;
    }

    // ==================== Constructor ====================

    constructor() {
        this.resizeListener = () => {
            this.updateVisibleLimit();
            this.cdr.detectChanges();
        };
    }

    // ==================== Lifecycle Hooks ====================

    ngOnInit(): void {
        this.updateVisibleLimit();
        window.addEventListener('resize', this.resizeListener);
        this.loadOrders();
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.resizeListener);
        this.orderSubscription?.unsubscribe();
    }

    // ==================== Data Loading ====================

    loadOrders(): void {
        this.isLoading = true;
        this.cdr.detectChanges();
        this.orderSubscription?.unsubscribe();

        const params: OrderQueryParams = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        };

        if (this.currentSort) {
            switch (this.currentSort) {
                case 'Date: Newest First': params.sort = 'newest'; break;
                case 'Date: Oldest First': params.sort = 'oldest'; break;
                case 'Order Total: Low to High': params.sort = 'totalAsc'; break;
                case 'Order Total: High to Low': params.sort = 'totalDesc'; break;
            }
        }

        if (this.currentFilter && this.currentFilter !== 'All Orders') {
            params.status = this.currentFilter.toLowerCase() as any;
        }

        const apiCall = this.orderService.getOrders(params);
        const minDelay = timer(300);

        this.orderSubscription = forkJoin([apiCall, minDelay])
            .subscribe({
                next: ([response]) => {
                    this.orders = response.items;
                    this.totalCount = response.totalCount;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                    if (!this.isInitialLoad) {
                        this.scrollToSection();
                    }
                    this.isInitialLoad = false;
                },
                error: () => {
                    this.orders = [];
                    this.totalCount = 0;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
    }

    // ==================== Sort & Filter ====================

    setSort(option: string): void {
        this.currentSort = option;
        this.pageIndex = 1;
        this.loadOrders();
    }

    setFilter(option: string): void {
        this.currentFilter = option;
        this.pageIndex = 1;
        this.loadOrders();
    }

    // ==================== Pagination ====================

    onPageChange(page: number): void {
        if (page < 1 || page > this.totalPages || page === this.pageIndex) return;
        this.pageIndex = page;
        this.loadOrders();
    }

    // ==================== Timeline Helpers ====================

    getMilestoneTimestamp(milestones: { status: string; timestamp: string }[], status: string): string | null {
        if (!milestones || milestones.length === 0) return null;
        const milestone = milestones.find(m => m.status.toLowerCase() === status.toLowerCase());
        if (!milestone && status.toLowerCase() === 'pending' && milestones.length > 0) {
            return milestones[0].timestamp;
        }
        return milestone?.timestamp || null;
    }

    isMilestoneCompleted(milestones: { status: string; timestamp: string }[], status: string): boolean {
        if (!milestones || milestones.length === 0) return false;
        return milestones.some(m => m.status.toLowerCase() === status.toLowerCase());
    }

    isCurrentStatus(order: { status: string }, status: string): boolean {
        return order.status.toLowerCase() === status.toLowerCase();
    }

    getTimelineItemClass(order: { status: string; orderTrackingMilestones: { status: string; timestamp: string }[] }, status: string): string {
        const isCompleted = this.isMilestoneCompleted(order.orderTrackingMilestones, status);
        const isCurrent = this.isCurrentStatus(order, status);

        if (isCompleted && !isCurrent) return 'completed';
        if (isCurrent) return 'active';
        return '';
    }

    // ==================== Formatting Helpers ====================

    formatPaymentMethod(method: string): string {
        const spaced = method.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
        return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    }

    formatShippingMethod(method: string): string {
        const spaced = method.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
        const formatted = spaced.charAt(0).toUpperCase() + spaced.slice(1);
        if (method.toLowerCase().includes('standard')) {
            return `${formatted} (5 - 7 days)`;
        } else if (method.toLowerCase().includes('express')) {
            return `${formatted} (2 - 3 days)`;
        }
        return formatted;
    }

    // ==================== Cart Actions ====================

    reOrder(order: OrderSummaryDto): void {
        if (!order.items || order.items.length === 0) return;

        const cartItems = order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        this.cartService.updateCart(cartItems).subscribe({
            next: () => this.router.navigate(['/cart']),
            error: () => { }
        });
    }

    // ==================== Private Helpers ====================

    private updateVisibleLimit(): void {
        const width = window.innerWidth;
        if (width < 576) {
            this.visibleItemsLimit = 3;
        } else if (width < 768) {
            this.visibleItemsLimit = 4;
        } else if (width < 1200) {
            this.visibleItemsLimit = 5;
        } else {
            this.visibleItemsLimit = 7;
        }
    }

    private scrollToSection(): void {
        const element = document.getElementById('account');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
