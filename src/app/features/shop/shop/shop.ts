import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { NgxPaginationModule } from 'ngx-pagination';

export interface IProduct{
  new?:boolean;
  sale?:number;
  image :string;
  category:string;
  title:string;
  rating:number;
  price:number;
  delPrice?:number;

}
@Component({
  selector: 'app-shop',
  imports: [
    FormsModule,
     CommonModule,
     ProductCard,
     NgxPaginationModule
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  minValue: number = 0;
  maxValue: number = 500;

  minPercent: number = 0;
  maxPercent: number = 50;
  // Track which slider should be on top
  minZIndex: number = 3;
  maxZIndex: number = 4;

  viewType = signal<'grid' | 'list'>('grid');

  allProducts : IProduct[]=[
    {new:true,
      image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      category:"Electronics",
      title:"Wireless Headphones",
      rating:24,
      price:299.00
    },
    {
      sale:-25,
      image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      category:"Electronics",
      title:"Smart Watch Pro",
      rating:38,
      price:225.00,
      delPrice:300.00

    },
    {
      image:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      category:"Fashion",
      title:"Designer Sunglasses",
      rating:16,
      price:89.00

    },
    {
      new:true,
      image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      category:"Sports",
      title:"Running Shoes Elite",
      rating:52,
      price:159.00
    },
    {
      image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
      category:"Fashion",
      title:"Leather Handbag",
      rating:31,
      price:189.00
    },
    {
      sale:-30,
      image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      category:"Fashion",
      title:"Travel Backpack",
      rating:44,
      price:69.00,
      delPrice:99.00
    },
    {
      image:"https://images.unsplash.com/photo-1756483510820-4b9302a27556?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category:"Fashion",
      title:"Elegant Dress",
      rating:29,
      price:75.00
    },
    {
      new:true,
      image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      category:"Fashion",
      title:"Gold Earrings",
      rating:67,
      price:129.00
    },
    {
      image:"https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400",
      category:"Fashion",
      title:"Crossbody Bag",
      rating:22,
      price:95.00
    }
  ]
  products: IProduct[] = [...this.allProducts];
  page=1;


  setView(type: 'grid'|'list') {
    this.viewType.set(type);
  }

  updateSlider() {
    if (this.minValue > this.maxValue) {
      this.minValue = this.maxValue;
    }
    // Convert values to %
    this.minPercent = (this.minValue / 1000) * 100;
    this.maxPercent = (this.maxValue / 1000) * 100;

    if (Math.abs(this.maxValue - this.minValue) < 50) {
      this.minZIndex = 4;
      this.maxZIndex = 3;
    } else {
      this.minZIndex = 3;
      this.maxZIndex = 4;
    }
    console.log("Filter Price:", this.minValue, this.maxValue);
  }
  onMinFocus() {
    this.minZIndex = 5;
    this.maxZIndex = 4;
  }

  onMaxFocus() {
    this.minZIndex = 4;
    this.maxZIndex = 5;
  }

  sortProducts(event:any){
    const value =event.target.value;
  
     if (value === 'asc') {
    this.products = [...this.products].sort((a, b) => a.price - b.price);
  }

  if (value === 'dsc') {
    this.products = [...this.products].sort((a, b) => b.price - a.price);
  }
  }

 priceFilter() {
  this.products = this.allProducts.filter(p => 
    Number(p.price) >= this.minValue && Number(p.price) <= this.maxValue
  );
}

}
