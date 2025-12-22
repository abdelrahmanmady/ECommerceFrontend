/**
 * Represents a single item in the shopping cart
 */
export interface CartItem {
    productId: number;
    productThumbnailUrl: string;
    productName: string;
    productPrice: number;
    quantity: number;
    total: number;
}

/**
 * Represents the complete cart response from the API
 */
export interface Cart {
    items: CartItem[];
    cartTotal: number;
}

/**
 * Request payload for updating cart
 */
export interface CartUpdateRequest {
    items: Pick<CartItem, 'productId' | 'quantity'>[];
}
