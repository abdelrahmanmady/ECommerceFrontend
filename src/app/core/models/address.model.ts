export interface Address {
    id: number;
    isDefault: boolean;
    label: string;
    fullName: string;
    mobileNumber: string;
    street: string;
    building: string;
    city: string;
    district: string;
    governorate: string;
    country: string;
    zipCode: string;
    hints: string;
}
// Request payload for creating a new address
export interface AddressRequest {
    label?: string; // Optional
    fullName: string;
    mobileNumber: string;
    street: string;
    building: string;
    city: string;
    district?: string; // Optional
    governorate?: string; // Optional
    country: string;
    zipCode?: string; // Optional
    hints?: string; // Optional
}
