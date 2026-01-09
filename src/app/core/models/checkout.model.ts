import { OrderAddress } from './address.model';
import { OrderItemDto, ShippingMethod, PaymentMethod } from './order.model';

export interface CheckoutPreviewResponse {
  subtotal: number;
  shippingFees: number;
  taxes: number;
  total: number;
  estimatedDeliveryDateStart: string;
  estimatedDeliveryDateEnd: string;
  items: OrderItemDto[];
}

export interface CheckoutRequest {
  shippingAddressId: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}

export interface OrderConfirmationResponse {
  id: number;
  created: string;
  subtotal: number;
  shippingFees: number;
  taxes: number;
  totalAmount: number;
  estimatedDeliveryDateStart: string;
  estimatedDeliveryDateEnd: string;
  shippingMethod: ShippingMethod;
  shippingAddress: OrderAddress;
  userEmail: string;
  paymentMethod: PaymentMethod;
  itemsCount: number;
  items: OrderItemDto[];
}
