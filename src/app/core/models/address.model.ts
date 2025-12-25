export interface Address { //Input : AddressDto
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

export interface AddressRequest { //Output : CreateAddressDto
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
