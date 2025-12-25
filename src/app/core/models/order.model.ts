
export interface OrderSummary {

}
export interface OrderItem { // Input :OrderItemDto
    productId: number;
    productName: string;
    productThumbnailUrl: string;
    productPrice: number;
    quantity: number;
    total: number;
}

export interface OrderAddress { //Input : OrderAddress
    id: number;
    fullName: string;
    mobileNumber: string;
    label: string;
    street: string;
    building: string;
    city: string;
    district: string;
    governorate: string;
    country: string;
    zipCode: string;
    hints: string;
}
