import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Input, input, Signal } from '@angular/core';
import { IProduct } from '../../features/shop/shop/shop';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<IProduct>();
  // @Input() viewType!: 'grid' | 'list';
viewType = input.required<string>();
/**
 *
 */
constructor() {
console.log(this.viewType);  
}


    // viewType: string = 'grid';

  // setView(type: string) {
  //   this.viewType = type;
  // }
}
