import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {

  increaseQty(): void {
    const qtyInput = document.getElementById('quantity') as HTMLInputElement | null;

    if (qtyInput) {
      qtyInput.value = (parseInt(qtyInput.value, 10) + 1).toString();
    }
  }

  decreaseQty(): void {
    const qtyInput = document.getElementById('quantity') as HTMLInputElement | null;

    if (qtyInput) {
      const currentVal = parseInt(qtyInput.value, 10);

      if (currentVal > 1) {
        qtyInput.value = (currentVal - 1).toString();
      }
    }
  }

}
