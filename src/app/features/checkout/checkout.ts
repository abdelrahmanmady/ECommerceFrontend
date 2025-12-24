import { Component, inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CityService } from '../../core/services/city.service';
import { AddressService } from '../../core/services/address.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Address, AddressRequest, CheckoutPreviewResponse, CartItem, PlaceOrderRequest } from '../../core/models';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, AfterViewInit {
  private addressService = inject(AddressService);
  private cityService = inject(CityService);
  private checkoutService = inject(CheckoutService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);

  addresses: Address[] = [];
  availableCities: string[] = [];
  filteredCities: string[] = [];
  showCitySuggestions = false;
  highlightedIndex = -1;
  cityInvalid = false;

  availableCountries: string[] = [];
  filteredCountries: string[] = [];
  showCountrySuggestions = false;
  countryHighlightedIndex = -1;
  countryInvalid = false;

  currentAddress: Address | null = null;
  tempSelectedAddress: Address | null = null;

  selectedPaymentMethod = 'Stripe';
  checkoutItems: CartItem[] = [];
  subtotal = 0;
  shippingFees = 0;
  taxes = 0;
  orderTotal = 0;
  shippingMethod = 'standard';
  estimatedDeliveryStart = '';
  estimatedDeliveryEnd = '';
  termsAgreed = false;

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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shippingMethod = params['shippingMethod'] || 'standard';
      this.loadCheckoutPreview();
    });

    this.loadAddresses();
    this.availableCountries = this.cityService.getCountries();
    this.onCountryChange();
  }

  loadCheckoutPreview() {
    this.checkoutService.getCheckoutPreview(this.shippingMethod).subscribe({
      next: (res: CheckoutPreviewResponse) => {
        this.checkoutItems = res.items;
        this.subtotal = res.subtotal;
        this.shippingFees = res.shippingFees;
        this.taxes = res.taxes;
        this.orderTotal = res.total;
        this.estimatedDeliveryStart = this.formatDeliveryDate(res.estimatedDeliveryDateStart);
        this.estimatedDeliveryEnd = this.formatDeliveryDate(res.estimatedDeliveryDateEnd);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading checkout preview', err);
        this.toastr.error('Failed to load checkout details');
      }
    });
  }

  formatDeliveryDate(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  onCountryChange() {
    this.availableCities = this.cityService.getCities(this.newAddress.country);
    this.newAddress.city = '';
    this.filteredCities = [];
    this.cityInvalid = false;
  }

  onCityInput() {
    const input = this.newAddress.city.toLowerCase().trim();
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

  onKeyDown(event: KeyboardEvent) {
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

  scrollToHighlighted() {
    setTimeout(() => {
      const container = document.querySelector('.city-suggestions-dropdown');
      const activeItem = container?.children[this.highlightedIndex] as HTMLElement;

      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  selectCity(city: string) {
    this.newAddress.city = city;
    this.showCitySuggestions = false;
    this.highlightedIndex = -1;
    this.cityInvalid = false;
  }

  hideCitySuggestions() {
    setTimeout(() => {
      this.showCitySuggestions = false;
      this.validateCity();
    }, 200);
  }

  validateCity() {
    if (!this.newAddress.city) {
      this.cityInvalid = false;
      return;
    }
    const isValid = this.availableCities.some(
      c => c.toLowerCase() === this.newAddress.city.toLowerCase()
    );
    this.cityInvalid = !isValid;
  }

  onCountryInput() {
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

  selectCountry(country: string) {
    this.newAddress.country = country;
    this.showCountrySuggestions = false;
    this.countryHighlightedIndex = -1;
    this.countryInvalid = false;
    this.onCountryChange();
  }

  hideCountrySuggestions() {
    setTimeout(() => {
      this.showCountrySuggestions = false;
      this.validateCountry();
    }, 200);
  }

  validateCountry() {
    if (!this.newAddress.country) {
      this.countryInvalid = false;
      return;
    }
    const isValid = this.availableCountries.some(c => c.toLowerCase() === this.newAddress.country.toLowerCase());
    this.countryInvalid = !isValid;
    if (isValid) {
      // Update cities if changed
      this.availableCities = this.cityService.getCities(this.newAddress.country);
    }
  }

  onCountryKeyDown(event: KeyboardEvent) {
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

  scrollToHighlightedCountry() {
    setTimeout(() => {
      const container = document.querySelector('.country-suggestions-dropdown'); // Will add class to HTML
      const activeItem = container?.children[this.countryHighlightedIndex] as HTMLElement;
      if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
    });
  }

  ngAfterViewInit() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

    // Fix aria-hidden focus issue: blur active element before modal hides
    const addressModal = document.getElementById('addressModal');
    if (addressModal) {
      addressModal.addEventListener('hide.bs.modal', () => {
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  loadAddresses() {
    this.addressService.getUserAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
        const defaultAddr = this.addresses.find(a => a.isDefault);
        if (defaultAddr) {
          this.currentAddress = defaultAddr;
          this.tempSelectedAddress = defaultAddr;
        } else if (this.addresses.length > 0) {
          // Fallback to first address if no default
          this.currentAddress = this.addresses[0];
          this.tempSelectedAddress = this.addresses[0];
        }
        // Manually trigger change detection to ensure template updates
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load addresses', err);
      }
    });
  }

  formatAddressText(address: Address): string {
    const parts = [
      address.street,
      address.building,
      address.district,
      address.city,
      address.governorate,
      address.country
    ].filter(part => part && part.trim() !== '');
    return parts.join(', ');
  }

  selectAddress(address: Address) {
    this.tempSelectedAddress = address;
  }

  saveSelectedAddress() {
    if (this.tempSelectedAddress) {
      this.currentAddress = this.tempSelectedAddress;
    }

    const collapseElement = document.getElementById('otherAddressesContainer');
    if (collapseElement) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        new bootstrap.Collapse(collapseElement).hide();
      }
    }
  }

  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  saveNewAddress(form: NgForm) {
    this.validateCity();
    this.validateCountry();

    if (form.valid && !this.cityInvalid && !this.countryInvalid) {
      const payload: AddressRequest = {
        fullName: this.newAddress.fullName,
        mobileNumber: this.newAddress.mobileNumber,
        street: this.newAddress.street,
        building: this.newAddress.building,
        city: this.newAddress.city,
        country: this.newAddress.country
      };

      if (this.newAddress.label?.trim()) payload.label = this.newAddress.label;
      if (this.newAddress.district?.trim()) payload.district = this.newAddress.district;
      if (this.newAddress.governorate?.trim()) payload.governorate = this.newAddress.governorate;
      if (this.newAddress.zipCode?.trim()) payload.zipCode = this.newAddress.zipCode;
      if (this.newAddress.hints?.trim()) payload.hints = this.newAddress.hints;

      this.addressService.addAddress(payload).subscribe({
        next: (res: Address) => {
          const newAddress = { ...res, label: res.label || 'No Label' };
          this.addresses = [...this.addresses, newAddress];

          if (newAddress.isDefault) {
            this.currentAddress = newAddress;
            this.tempSelectedAddress = newAddress;
          }

          this.cdr.detectChanges();
          this.toastr.success('Address added successfully');

          const modalElement = document.getElementById('addressModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }

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
          form.resetForm();
          this.newAddress.country = 'Egypt';
        },
        error: (err) => {
          console.error('Error adding address', err);
          this.toastr.error('Failed to add address');
        }
      });
    } else {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
    }
  }

  placeOrder() {
    if (!this.currentAddress || !this.selectedPaymentMethod || !this.termsAgreed) {
      return;
    }

    const request: PlaceOrderRequest = {
      shippingAddressId: this.currentAddress.id,
      shippingMethod: this.shippingMethod as 'standard' | 'express',
      paymentMethod: this.selectedPaymentMethod as 'CashOnDelivery' | 'Stripe' | 'Paymob'
    };

    this.checkoutService.placeOrder(request).subscribe({
      next: (response) => {
        this.toastr.success('Order placed successfully!');
        console.log('Order response:', response);
      },
      error: (err) => {
        console.error('Error placing order', err);
        this.toastr.error('Failed to place order');
      }
    });
  }
}
