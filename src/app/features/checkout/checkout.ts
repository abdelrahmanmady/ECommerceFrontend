import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

export interface Address {
  id: number;
  label: string;
  name: string;
  text: string;
  phone: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements AfterViewInit {

  addresses: Address[] = [
    {
      id: 1,
      label: 'Home',
      name: 'Sarah Anderson',
      text: '123 Main Street, Apt 4B, New York, NY 10001, Egypt',
      phone: '+20 1012 345 678',
      isDefault: true
    },
    {
      id: 2,
      label: 'Office',
      name: 'Sarah Anderson',
      text: '456 Business Ave, Suite 200, Cairo, Giza 12345, Egypt',
      phone: '+20 1098 765 432',
      isDefault: false
    },
    {
      id: 3,
      label: 'Parents House',
      name: 'Sarah Anderson',
      text: '789 Family Lane, Building 12, Alexandria, 21500, Egypt',
      phone: '+20 1234 567 890',
      isDefault: false
    }
  ];

  // The address currently active/confirmed for the order
  currentAddress: Address = this.addresses[0];

  // The address currently selected in the "Change Address" list (before saving)
  tempSelectedAddress: Address = this.addresses[0];

  selectedPaymentMethod: string = 'stripe';

  ngAfterViewInit() {
    // Initialize tooltips if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }

  selectAddress(address: Address) {
    this.tempSelectedAddress = address;
  }

  saveSelectedAddress() {
    this.currentAddress = this.tempSelectedAddress;

    // Logic to close the collapse would go here, or we let the user close it
    // For now, we update the main view.
    // Optional: Collapse the section programmatically
    const collapseElement = document.getElementById('otherAddressesContainer');
    if (collapseElement) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        // Fallback if instance not found but it should be there
        new bootstrap.Collapse(collapseElement).hide();
      }
    }
  }

  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }
}
