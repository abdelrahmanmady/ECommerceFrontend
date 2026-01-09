import { OrderAddress } from './address.model';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ShippingMethod = 'standard' | 'express';
export type PaymentMethod = 'cashOnDelivery' | 'stripe' | 'paymob';

export interface AdminOrderSummaryDto {
  id: number;
  userName: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  created: string;
  updated?:string;
}

export interface OrderDetailsResponse {
  id: number;
  userName: string;
  userId: string;
  totalAmount: number;
  created: string;
  updated: string;
  status: OrderStatus;
  shippingAddress: OrderAddress;
  items: OrderItemDto[];
}

export interface UpdateOrderRequest {
  status: OrderStatus;
  shippingAddressId?: number;
}

export interface OrderSummaryDto {
  id: number;
  created: string;
  updated: string;
  items: OrderItemDto[];
  itemsCount: number;
  status: OrderStatus;
  subtotal: number;
  shippingFees: number;
  taxes: number;
  totalAmount: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
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
  status: OrderStatus;
  timestamp: string;
}

export interface AdminOrderQueryParams {
  status?: OrderStatus;
  search?: string;
  sort?: 'newest' | 'oldest' | 'totalAsc' | 'totalDesc';
  pageIndex?: number;
  pageSize?: number;
}

export interface OrderQueryParams {
  status?: OrderStatus;
  sort?: 'newest' | 'oldest' | 'totalAsc' | 'totalDesc';
  pageIndex?: number;
  pageSize?: number;
}
