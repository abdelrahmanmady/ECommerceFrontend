import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {


  images: string[] = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
  ];
  selectedIndex: number = 0;
  selectedImage: string = this.images[0];

  renderStars(rating: number, elementId: string): void {
    const container = document.getElementById(elementId);

    if (!container) {
      console.error(`Element with id "${elementId}" not found.`);
      return;
    }

    container.innerHTML = "";

    const fullStars: number = Math.floor(rating);
    const hasHalfStar: boolean = rating % 1 >= 0.5;
    const emptyStars: number = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      container.innerHTML += `<i class="bi bi-star-fill text-warning"></i>`;
    }

    if (hasHalfStar) {
      container.innerHTML += `<i class="bi bi-star-half text-warning"></i>`;
    }

    for (let i = 0; i < emptyStars; i++) {
      container.innerHTML += `<i class="bi bi-star text-warning"></i>`;
    }
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderStars(3.5, "ratingStars");
    });
  }

  changeImage(index: number) {
    this.selectedIndex = index;
    this.selectedImage = this.images[index];
  }

  // Go to the next image
  nextImage() {
    this.selectedIndex =
      (this.selectedIndex + 1) % this.images.length;

    this.selectedImage = this.images[this.selectedIndex];
  }

  // Go to the previous image
  prevImage() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.images.length) %
      this.images.length;

    this.selectedImage = this.images[this.selectedIndex];
  }
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
