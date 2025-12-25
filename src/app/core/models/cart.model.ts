export interface Cart { //Input : ShoppingCartDto
    items: CartItem[];
    cartTotal: number;
}

export interface CartItem {  //Input : OrderItemDto
    productId: number;
    productThumbnailUrl: string;
    productName: string;
    productPrice: number;
    quantity: number;
    total: number;
}


export interface CartUpdateRequest { //Output : UpdateShoppingCartDto
    items: Pick<CartItem, 'productId' | 'quantity'>[]; //Output: UpdateCartItemDto
}


