//Angular Imports
import { Component, inject, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
//Libraries
import { forkJoin, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//Services
import { AddressService, CityService } from '../../../core/services';
//Models
import { AddressSummaryDto, CreateAddressRequest, UpdateAddressRequest } from '../../../core/models';

declare var bootstrap: any;

@Component({
    selector: 'app-account-addresses',
    imports: [CommonModule, FormsModule],
    templateUrl: './addresses.html',
    styleUrl: './addresses.css',
})
export class AccountAddresses implements OnInit, AfterViewInit {
    //Angular
    private cdr = inject(ChangeDetectorRef);
    //Libraries
    private toastr = inject(ToastrService);
    //Services
    private addressService = inject(AddressService);
    private cityService = inject(CityService);

    //Loading State
    isLoading = true;

    //Addresses State
    addresses: AddressSummaryDto[] = [];

    //Modal State
    isEditing = false;
    modalTitle = 'Add New Address';
    editingAddressId: number | null = null;
    @ViewChild('addressForm') addressForm!: NgForm;

    //City Autocomplete State
    availableCities: string[] = [];
    filteredCities: string[] = [];
    showCitySuggestions = false;
    highlightedIndex = -1;
    cityInvalid = false;

    //Country Autocomplete State
    availableCountries: string[] = [];
    filteredCountries: string[] = [];
    showCountrySuggestions = false;
    countryHighlightedIndex = -1;
    countryInvalid = false;

    //New Address Form
    newAddress = {
        label: '',
        fullName: '',
        mobileNumber: '',
        street: '',
        building: '',
        district: '',
        city: '',
        governorate: '',
        zipCode: '',
        country: 'Egypt',
        hints: ''
    };

    // ==================== Lifecycle Hooks ====================

    ngOnInit(): void {
        this.loadAddresses();
        this.availableCountries = this.cityService.getCountries();
        this.onCountryChange();
    }

    ngAfterViewInit(): void {
        const addressModal = document.getElementById('addressModal');
        if (addressModal) {
            addressModal.addEventListener('hide.bs.modal', () => {
                (document.activeElement as HTMLElement)?.blur();
            });
        }
    }

    // ==================== Data Loading ====================

    loadAddresses(): void {
        this.isLoading = true;
        this.cdr.detectChanges();

        const apiCall = this.addressService.getUserAddresses();
        const minDelay = timer(300);

        forkJoin([apiCall, minDelay]).subscribe({
            next: ([addresses]) => {
                this.addresses = this.sortAddresses(addresses);
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.addresses = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==================== Modal Methods ====================

    openAddModal(): void {
        this.isEditing = false;
        this.modalTitle = 'Add New Address';
        this.resetForm();
        // Reset form validation state
        if (this.addressForm) {
            this.addressForm.resetForm();
        }
    }

    openEditModal(address: AddressSummaryDto): void {
        this.isEditing = true;
        this.modalTitle = 'Edit Address';
        this.editingAddressId = address.id;

        // Reset form validation state before populating
        if (this.addressForm) {
            this.addressForm.resetForm();
        }

        // Populate form with existing address data
        this.newAddress = {
            label: address.label || '',
            fullName: address.fullName,
            mobileNumber: address.mobileNumber,
            street: address.street,
            building: address.building,
            district: address.district || '',
            city: address.city,
            governorate: address.governorate || '',
            zipCode: address.zipCode || '',
            country: address.country,
            hints: address.hints || ''
        };

        // Update available cities for the selected country
        this.availableCities = this.cityService.getCities(address.country);
    }

    // ==================== Form Methods ====================

    saveNewAddress(form: NgForm): void {
        this.validateCity();
        this.validateCountry();

        if (form.invalid || this.cityInvalid || this.countryInvalid) {
            Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
            return;
        }

        const payload: CreateAddressRequest | UpdateAddressRequest = {
            fullName: this.newAddress.fullName,
            mobileNumber: this.newAddress.mobileNumber,
            street: this.newAddress.street,
            building: this.newAddress.building,
            city: this.newAddress.city,
            country: this.newAddress.country
        };

        if (this.newAddress.label?.trim()) payload.label = this.newAddress.label.trim();
        if (this.newAddress.district?.trim()) payload.district = this.newAddress.district;
        if (this.newAddress.governorate?.trim()) payload.governorate = this.newAddress.governorate;
        if (this.newAddress.zipCode?.trim()) payload.zipCode = this.newAddress.zipCode;
        if (this.newAddress.hints?.trim()) payload.hints = this.newAddress.hints;

        if (this.isEditing && this.editingAddressId !== null) {
            // Update existing address
            this.addressService.updateAddress(this.editingAddressId, payload).subscribe({
                next: (updatedAddress: AddressSummaryDto) => {
                    const index = this.addresses.findIndex(a => a.id === this.editingAddressId);
                    if (index !== -1) {
                        this.addresses[index] = updatedAddress;
                        this.addresses = this.sortAddresses([...this.addresses]);
                    }
                    this.cdr.detectChanges();
                    this.toastr.success('Address updated successfully');
                    this.closeModal();
                    this.resetForm();
                    form.resetForm();
                },
                error: (err) => {
                    console.error('Error updating address', err);
                    this.toastr.error('Failed to update address');
                }
            });
        } else {
            // Add new address
            this.addressService.addAddress(payload).subscribe({
                next: (newAddress: AddressSummaryDto) => {
                    this.addresses = this.sortAddresses([...this.addresses, newAddress]);
                    this.cdr.detectChanges();
                    this.toastr.success('Address added successfully');
                    this.closeModal();
                    this.resetForm();
                    form.resetForm();
                },
                error: (err) => {
                    console.error('Error adding address', err);
                    this.toastr.error('Failed to add address');
                }
            });
        }
    }

    removeAddress(addressId: number): void {
        this.addressService.deleteAddress(addressId).subscribe({
            next: () => {
                this.addresses = this.addresses.filter(a => a.id !== addressId);
                this.cdr.detectChanges();
                this.toastr.success('Address removed successfully');
            },
            error: (err) => {
                console.error('Error removing address', err);
                this.toastr.error('Failed to remove address');
            }
        });
    }

    makeDefault(addressId: number): void {
        this.addressService.setDefaultAddress(addressId).subscribe({
            next: (updatedAddresses: AddressSummaryDto[]) => {
                this.addresses = this.sortAddresses(updatedAddresses);
                this.cdr.detectChanges();
                this.toastr.success('Default address updated');
            },
            error: (err) => {
                console.error('Error setting default address', err);
                this.toastr.error('Failed to set default address');
            }
        });
    }

    resetForm(): void {
        this.newAddress = {
            label: '',
            fullName: '',
            mobileNumber: '',
            street: '',
            building: '',
            district: '',
            city: '',
            governorate: '',
            zipCode: '',
            country: 'Egypt',
            hints: ''
        };
        this.filteredCities = [];
        this.filteredCountries = [];
        this.showCitySuggestions = false;
        this.showCountrySuggestions = false;
        this.cityInvalid = false;
        this.countryInvalid = false;
        this.editingAddressId = null;
        this.isEditing = false;
        this.onCountryChange();
    }

    closeModal(): void {
        const modalElement = document.getElementById('addressModal');
        if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
        }
    }

    // ==================== Country Autocomplete ====================

    onCountryChange(): void {
        this.availableCities = this.cityService.getCities(this.newAddress.country);
        this.newAddress.city = '';
        this.filteredCities = [];
        this.cityInvalid = false;
    }

    onCountryInput(): void {
        const input = this.newAddress.country?.toLowerCase().trim();
        this.countryHighlightedIndex = -1;

        if (!input) {
            this.filteredCountries = [];
            this.showCountrySuggestions = false;
            return;
        }

        this.filteredCountries = this.availableCountries.filter(c =>
            c.toLowerCase().includes(input)
        );
        this.showCountrySuggestions = this.filteredCountries.length > 0;
    }

    selectCountry(country: string): void {
        this.newAddress.country = country;
        this.showCountrySuggestions = false;
        this.countryHighlightedIndex = -1;
        this.countryInvalid = false;
        this.onCountryChange();
    }

    hideCountrySuggestions(): void {
        setTimeout(() => {
            this.showCountrySuggestions = false;
            this.validateCountry();
        }, 200);
    }

    validateCountry(): void {
        if (!this.newAddress.country) {
            this.countryInvalid = false;
            return;
        }
        const isValid = this.availableCountries.some(c => c.toLowerCase() === this.newAddress.country.toLowerCase());
        this.countryInvalid = !isValid;
        if (isValid) {
            this.availableCities = this.cityService.getCities(this.newAddress.country);
        }
    }

    onCountryKeyDown(event: KeyboardEvent): void {
        if (!this.showCountrySuggestions || this.filteredCountries.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.countryHighlightedIndex = (this.countryHighlightedIndex + 1) % this.filteredCountries.length;
            this.scrollToHighlightedCountry();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.countryHighlightedIndex = (this.countryHighlightedIndex - 1 + this.filteredCountries.length) % this.filteredCountries.length;
            this.scrollToHighlightedCountry();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (this.countryHighlightedIndex >= 0) {
                this.selectCountry(this.filteredCountries[this.countryHighlightedIndex]);
            }
        } else if (event.key === 'Escape') {
            this.hideCountrySuggestions();
        }
    }

    scrollToHighlightedCountry(): void {
        setTimeout(() => {
            const container = document.querySelector('.country-suggestions-dropdown');
            const activeItem = container?.children[this.countryHighlightedIndex] as HTMLElement;
            if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
        });
    }

    // ==================== City Autocomplete ====================

    onCityInput(): void {
        const input = this.newAddress.city?.toLowerCase().trim();
        this.highlightedIndex = -1;

        if (!input) {
            this.filteredCities = [];
            this.showCitySuggestions = false;
            return;
        }

        this.filteredCities = this.availableCities.filter(city =>
            city.toLowerCase().includes(input)
        );
        this.showCitySuggestions = this.filteredCities.length > 0;
    }

    selectCity(city: string): void {
        this.newAddress.city = city;
        this.showCitySuggestions = false;
        this.highlightedIndex = -1;
        this.cityInvalid = false;
    }

    hideCitySuggestions(): void {
        setTimeout(() => {
            this.showCitySuggestions = false;
            this.validateCity();
        }, 200);
    }

    validateCity(): void {
        if (!this.newAddress.city) {
            this.cityInvalid = false;
            return;
        }
        const isValid = this.availableCities.some(
            c => c.toLowerCase() === this.newAddress.city.toLowerCase()
        );
        this.cityInvalid = !isValid;
    }

    onCityKeyDown(event: KeyboardEvent): void {
        if (!this.showCitySuggestions || this.filteredCities.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredCities.length;
            this.scrollToHighlighted();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.highlightedIndex = (this.highlightedIndex - 1 + this.filteredCities.length) % this.filteredCities.length;
            this.scrollToHighlighted();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (this.highlightedIndex >= 0) {
                this.selectCity(this.filteredCities[this.highlightedIndex]);
            }
        } else if (event.key === 'Escape') {
            this.hideCitySuggestions();
        }
    }

    scrollToHighlighted(): void {
        setTimeout(() => {
            const container = document.querySelector('.city-suggestions-dropdown');
            const activeItem = container?.children[this.highlightedIndex] as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // ==================== Private Helpers ====================

    private sortAddresses(addresses: AddressSummaryDto[]): AddressSummaryDto[] {
        return addresses.sort((a, b) => {
            if (a.isDefault) return -1;
            if (b.isDefault) return 1;
            return 0;
        });
    }
}

