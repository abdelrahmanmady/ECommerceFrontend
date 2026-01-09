import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdDate: string;
  imageUrl: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './getall.html',
  styleUrls: ['../style.css']
})
export class ProductListComponent {
  // Search query signal
  searchQuery = signal<string>('');
  
  // Mock products data
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality noise-cancelling headphones with superior sound quality',
      category: 'Electronics',
      price: 299.99,
      stock: 45,
      status: 'In Stock',
      createdDate: 'Jan 15, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
    },
    {
      id: 2,
      name: 'Designer Leather Bag',
      description: 'Elegant handcrafted leather handbag with premium materials',
      category: 'Fashion',
      price: 189.00,
      stock: 23,
      status: 'In Stock',
      createdDate: 'Feb 10, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200'
    },
    {
      id: 3,
      name: 'Smart Fitness Tracker',
      description: 'Track your health and fitness goals with advanced sensors',
      category: 'Electronics',
      price: 129.99,
      stock: 67,
      status: 'In Stock',
      createdDate: 'Mar 05, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200'
    },
    {
      id: 4,
      name: 'Organic Cotton T-Shirt',
      description: 'Sustainable and comfortable everyday wear made from organic cotton',
      category: 'Clothing',
      price: 45.00,
      stock: 120,
      status: 'In Stock',
      createdDate: 'Apr 12, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
    },
    {
      id: 5,
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated bottle keeps drinks cold for 24 hours',
      category: 'Accessories',
      price: 32.50,
      stock: 89,
      status: 'In Stock',
      createdDate: 'May 20, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200'
    },
    {
      id: 6,
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with customizable keys',
      category: 'Electronics',
      price: 159.99,
      stock: 34,
      status: 'In Stock',
      createdDate: 'Jun 08, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200'
    },
    {
      id: 7,
      name: 'Leather Wallet',
      description: 'Minimalist genuine leather wallet with RFID protection',
      category: 'Accessories',
      price: 68.00,
      stock: 15,
      status: 'Low Stock',
      createdDate: 'Jul 14, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200'
    },
    {
      id: 8,
      name: 'Wireless Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360-degree sound',
      category: 'Electronics',
      price: 89.99,
      stock: 0,
      status: 'Out of Stock',
      createdDate: 'Aug 22, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200'
    },
    {
      id: 9,
      name: 'Running Shoes',
      description: 'Lightweight performance running shoes with cushioning',
      category: 'Footwear',
      price: 135.00,
      stock: 58,
      status: 'In Stock',
      createdDate: 'Sep 18, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'
    },
    {
      id: 10,
      name: 'Ceramic Coffee Mug Set',
      description: 'Set of 4 handmade ceramic mugs with unique patterns',
      category: 'Home & Kitchen',
      price: 52.00,
      stock: 72,
      status: 'In Stock',
      createdDate: 'Oct 03, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200'
    }
  ]);

  // Computed signal for filtered products based on search query
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      return this.products();
    }
    
    return this.products().filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.id.toString().includes(query)
    );
  });

  // Computed signal for product count
  productCount = computed(() => this.filteredProducts().length);

  // Handle search input change
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Clear search query
  clearSearch(): void {
    this.searchQuery.set('');
  }

  // Delete product with confirmation
  deleteProduct(id: number): void {
    const product = this.products().find(p => p.id === id);
    
    if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.products.update(products => products.filter(p => p.id !== id));
    }
  }

  // Get stock badge CSS class based on status
  getStockBadgeClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'stock-in';
      case 'Low Stock':
        return 'stock-low';
      case 'Out of Stock':
        return 'stock-out';
      default:
        return '';
    }
  }
}
