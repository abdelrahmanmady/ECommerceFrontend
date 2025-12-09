import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../serices/product-service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {

  activeRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  productData = signal<any>({});
  productId= this.activeRoute.snapshot.paramMap.get('id');
  mainImage = signal<any>({});
  activeImage = signal(0);



  constructor() { 
    this.productService.getProductById(this.productId!).subscribe((res) => {
      res.images.sort((a:any,b:any) => a.position - b.position);
      this.productData.set(res);
      this.mainImage.set(res.images[0]);
      this.activeImage.set(0);
    });
    
  }
  selectImage(index: number) {
  this.mainImage.set(this.productData().images[index]);
  this.activeImage.set(index);
}
prevImage() {
  const index = this.activeImage() > 0 ? this.activeImage() - 1 : this.productData().images.length - 1;
  this.selectImage(index);
}

nextImage() {
  const index = this.activeImage() < this.productData().images.length - 1 ? this.activeImage() + 1 : 0;
  this.selectImage(index);
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
