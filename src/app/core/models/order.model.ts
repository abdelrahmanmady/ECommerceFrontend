import { OrderAddress } from "./address.model";

export interface AdminOrderSummaryDto {
    id: number;
    userName: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    itemsCount: number;
    created: string;
}

export interface OrderDetailsResponse {
    id: number;
    userName: string;
    userId: string;
    totalAmount: number;
    created: string;
    updated: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: OrderAddress;
    items: OrderItemDto[];
}

export interface UpdateOrderRequest {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddressId?: number;
}

export interface OrderSummaryDto {
    id: number;
    created: string;
    updated: string;
    items: OrderItemDto[];
    itemsCount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shippingFees: number;
    taxes: number;
    totalAmount: number;
    shippingMethod: string;
    paymentMethod: string;
    shippingAddress: OrderAddress;
    orderTrackingMilestones: OrderTrackingMilestoneDto[];
}

export interface OrderItemDto {
    productId: number;
    productName: string;
    productThumbnailUrl: string;
    productPrice: number;
    quantity: number;
    total: number;
}

export interface OrderTrackingMilestoneDto {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    timestamp: string;
}

export interface AdminOrderQueryParams {
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    search?: string;
    sort?: 'newest' | 'oldest' | 'totalAsc' | 'totalDesc';
    pageIndex?: number;
    pageSize?: number;
}

export interface OrderQueryParams {
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    sort?: 'newest' | 'oldest' | 'totalAsc' | 'totalDesc';
    pageIndex?: number;
    pageSize?: number;
}