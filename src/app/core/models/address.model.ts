export interface AddressSummaryDto {
    id: number;
    isDefault: boolean;
    fullName: string;
    mobileNumber: string;
    label: string;
    street: string;
    building: string;
    city: string;
    district: string;
    governorate: string;
    country: string;
    zipCode?: string;
    hints?: string;
}

export interface CreateAddressRequest {
    label?: string;
    fullName: string;
    mobileNumber: string;
    street: string;
    building: string;
    city: string;
    district?: string;
    governorate?: string;
    country: string;
    zipCode?: string;
    hints?: string;
}

export interface UpdateAddressRequest {
    label?: string;
    fullName: string;
    mobileNumber: string;
    street: string;
    building: string;
    city: string;
    district?: string;
    governorate?: string;
    country: string;
    zipCode?: string;
    hints?: string;
}

export interface OrderAddress {
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
    zipCode?: string;
    hints?: string;
}