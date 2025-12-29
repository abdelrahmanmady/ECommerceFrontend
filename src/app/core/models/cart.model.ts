export interface CartResponse {
    items: CartItemDto[];
    total: number;
    warnings: string[];
}

export interface UpdateCartItemDto {
    productId: number;
    quantity: number;
}

export interface CartItemDto {
    productId: number;
    productName: string;
    productThumbnailUrl: string;
    productPrice: number;
    quantity: number;
    total: number;
}
