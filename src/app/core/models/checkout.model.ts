import { CartItem } from './cart.model';
import { OrderItem, OrderAddress } from './order.model';

export interface CheckoutPreviewResponse { //Input CheckoutPreviewDto
    subtotal: number;
    shippingFees: number;
    taxes: number;
    total: number;
    estimatedDeliveryDateStart: string;
    estimatedDeliveryDateEnd: string;
    items: CartItem[];
}

export interface PlaceOrderRequest { //Output : CheckoutDto
    shippingAddressId: number;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'cashOnDelivery' | 'stripe' | 'paymob';
}

export interface OrderConfirmationResponse { //Input : OrderConfirmationDto
    id: number;
    created: string;
    subtotal: number;
    shippingFees: number;
    taxes: number;
    totalAmount: number;
    estimatedDeliveryDateStart: string;
    estimatedDeliveryDateEnd: string;
    shippingMethod: 'standard' | 'express';
    shippingAddress: OrderAddress;
    userEmail: string;
    paymentMethod: 'cashOnDelivery' | 'stripe' | 'paymob';
    itemsCount: number;
    items: OrderItem[];
}
