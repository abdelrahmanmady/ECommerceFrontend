import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, Input, input, OnInit, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService, CategoryService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgClass, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit {
  productData = input.required<any>();
  viewType = input.required<string>();
  
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  router = inject(Router);
  toastr = inject(ToastrService);

  categoryName = signal<string>('');

  constructor() {
  }

  ngOnInit(): void {
    this.categoryName.set(this.productData().categoryName);
  }
  addToCart(){
    
    productId: this.productData().id,
    this.cartService.AddCartItem(this.productData().id).subscribe({
      next:(res)=>{
        console.log(res);
        this.toastr.success('Product added to cart');
        // this.router.navigate(['/cart']);
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error);
      }
    })

  }
}
