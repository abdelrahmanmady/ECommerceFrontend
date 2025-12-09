import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  parentCategory: string | null;
  createdDate: string;
  updatedDate: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrls: ['../style.css']
})
export class List {
  // Mock data using signals
  categories = signal<Category[]>([
    {
      id: 1,
      name: 'Electronics',
      description: 'All electronic devices and gadgets',
      icon: 'fa-laptop',
      parentCategory: null,
      createdDate: 'Jan 10, 2024',
      updatedDate: 'Nov 28, 2024'
    },
    {
      id: 2,
      name: 'Smartphones',
      description: 'Mobile phones and accessories',
      icon: 'fa-mobile-alt',
      parentCategory: 'Electronics',
      createdDate: 'Jan 15, 2024',
      updatedDate: 'Nov 25, 2024'
    },
    {
      id: 3,
      name: 'Fashion',
      description: 'Clothing, shoes, and fashion accessories',
      icon: 'fa-tshirt',
      parentCategory: null,
      createdDate: 'Feb 05, 2024',
      updatedDate: 'Nov 20, 2024'
    },
    {
      id: 4,
      name: "Men's Clothing",
      description: 'Fashion items for men',
      icon: 'fa-user-tie',
      parentCategory: 'Fashion',
      createdDate: 'Feb 08, 2024',
      updatedDate: 'Nov 18, 2024'
    },
    {
      id: 5,
      name: "Women's Clothing",
      description: 'Fashion items for women',
      icon: 'fa-female',
      parentCategory: 'Fashion',
      createdDate: 'Feb 08, 2024',
      updatedDate: 'Nov 18, 2024'
    },
    {
      id: 6,
      name: 'Home & Kitchen',
      description: 'Home decor and kitchen essentials',
      icon: 'fa-home',
      parentCategory: null,
      createdDate: 'Mar 12, 2024',
      updatedDate: 'Nov 15, 2024'
    },
    {
      id: 7,
      name: 'Sports & Fitness',
      description: 'Athletic equipment and sportswear',
      icon: 'fa-running',
      parentCategory: null,
      createdDate: 'Apr 20, 2024',
      updatedDate: 'Nov 10, 2024'
    },
    {
      id: 8,
      name: 'Books & Media',
      description: 'Books, magazines, and digital media',
      icon: 'fa-book',
      parentCategory: null,
      createdDate: 'May 15, 2024',
      updatedDate: 'Nov 05, 2024'
    },
    {
      id: 9,
      name: 'Jewelry & Watches',
      description: 'Luxury accessories and timepieces',
      icon: 'fa-gem',
      parentCategory: 'Fashion',
      createdDate: 'Jun 08, 2024',
      updatedDate: 'Oct 30, 2024'
    },
    {
      id: 10,
      name: 'Beauty & Personal Care',
      description: 'Cosmetics, skincare, and personal hygiene',
      icon: 'fa-spa',
      parentCategory: null,
      createdDate: 'Jul 22, 2024',
      updatedDate: 'Oct 25, 2024'
    },
    {
      id: 11,
      name: 'Gaming',
      description: 'Video games, consoles, and gaming accessories',
      icon: 'fa-gamepad',
      parentCategory: 'Electronics',
      createdDate: 'Aug 10, 2024',
      updatedDate: 'Oct 20, 2024'
    },
    {
      id: 12,
      name: 'Furniture',
      description: 'Indoor and outdoor furniture pieces',
      icon: 'fa-couch',
      parentCategory: 'Home & Kitchen',
      createdDate: 'Sep 05, 2024',
      updatedDate: 'Oct 15, 2024'
    }
  ]);

  searchQuery = signal('');

  // Computed signals for reactive filtering
  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.categories();
    
    return this.categories().filter(cat => 
      cat.name.toLowerCase().includes(query) || 
      cat.description.toLowerCase().includes(query)
    );
  });

  categoryCount = computed(() => this.filteredCategories().length);

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categories.update(cats => cats.filter(cat => cat.id !== id));
    }
  }
}
