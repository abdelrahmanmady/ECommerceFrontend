import { CartItem } from './cart.model';

export interface CheckoutPreviewResponse {
    subtotal: number;
    shippingFees: number;
    taxes: number;
    total: number;
    estimatedDeliveryDateStart: string;
    estimatedDeliveryDateEnd: string;
    items: CartItem[];
}

export interface PlaceOrderRequest {
    shippingAddressId: number;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'CashOnDelivery' | 'Stripe' | 'Paymob';
}
