import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Input, input, Signal } from '@angular/core';
import { IProduct } from '../../../features/shop/shop/shop';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<IProduct>();
  viewType = input.required<string>();


}
