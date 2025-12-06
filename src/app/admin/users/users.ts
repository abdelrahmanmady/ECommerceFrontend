import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// DTOs and Models matching your User entity
interface Role {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  role: Role;
  products: Product[];
  orders: any[];
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersListComponent implements OnInit {
  // Mock Data - Users
  users: User[] = [
    {
      id: "USR-2024-001",
      name: "John Admin",
      email: "admin@ecommerce.com",
      phone: "+1-555-0101",
      roleId: "ROLE-001",
      role: { id: "ROLE-001", name: "Admin" },
      products: [],
      orders: [],
      addresses: [
        {
          id: "ADDR-001",
          street: "123 Admin Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-01-15T10:00:00"),
      updatedAt: new Date("2024-12-01T10:00:00")
    },
    {
      id: "USR-2024-002",
      name: "Sarah Seller",
      email: "sarah.seller@example.com",
      phone: "+1-555-0102",
      roleId: "ROLE-002",
      role: { id: "ROLE-002", name: "Seller" },
      products: [
        {
          id: "PROD-001",
          name: "Wireless Headphones",
          price: 299.99,
          stock: 50,
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
        },
        {
          id: "PROD-002",
          name: "Smart Watch",
          price: 399.99,
          stock: 30,
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
        }
      ],
      orders: [],
      addresses: [
        {
          id: "ADDR-002",
          street: "456 Seller Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-02-20T14:30:00"),
      updatedAt: new Date("2024-12-03T16:20:00")
    },
    {
      id: "USR-2024-003",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1-555-0103",
      roleId: "ROLE-003",
      role: { id: "ROLE-003", name: "Customer" },
      products: [],
      orders: [
        { id: "ORD-001", total: 299.99 },
        { id: "ORD-002", total: 149.99 }
      ],
      addresses: [
        {
          id: "ADDR-003",
          street: "789 Customer Blvd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-03-10T09:15:00"),
      updatedAt: new Date("2024-11-28T11:45:00")
    },
    {
      id: "USR-2024-004",
      name: "Emily Merchant",
      email: "emily.merchant@example.com",
      phone: "+1-555-0104",
      roleId: "ROLE-002",
      role: { id: "ROLE-002", name: "Seller" },
      products: [
        {
          id: "PROD-003",
          name: "Leather Wallet",
          price: 79.99,
          stock: 100,
          imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200"
        },
        {
          id: "PROD-004",
          name: "Designer Handbag",
          price: 189.50,
          stock: 25,
          imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200"
        },
        {
          id: "PROD-005",
          name: "Running Shoes",
          price: 129.99,
          stock: 75,
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
        }
      ],
      orders: [],
      addresses: [
        {
          id: "ADDR-004",
          street: "321 Merchant Lane",
          city: "Houston",
          state: "TX",
          zipCode: "77001",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-04-05T13:20:00"),
      updatedAt: new Date("2024-12-05T14:10:00")
    },
    {
      id: "USR-2024-005",
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1-555-0105",
      roleId: "ROLE-003",
      role: { id: "ROLE-003", name: "Customer" },
      products: [],
      orders: [
        { id: "ORD-003", total: 89.99 }
      ],
      addresses: [
        {
          id: "ADDR-005",
          street: "555 Buyer Road",
          city: "Phoenix",
          state: "AZ",
          zipCode: "85001",
          country: "USA"
        },
        {
          id: "ADDR-006",
          street: "999 Second Home St",
          city: "Phoenix",
          state: "AZ",
          zipCode: "85002",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-05-15T16:40:00"),
      updatedAt: new Date("2024-11-30T10:00:00")
    },
    {
      id: "USR-2024-006",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      phone: "+1-555-0106",
      roleId: "ROLE-003",
      role: { id: "ROLE-003", name: "Customer" },
      products: [],
      orders: [
        { id: "ORD-004", total: 549.99 },
        { id: "ORD-005", total: 129.99 },
        { id: "ORD-006", total: 199.99 }
      ],
      addresses: [
        {
          id: "ADDR-007",
          street: "777 Shopping Plaza",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA"
        }
      ],
      createdAt: new Date("2024-06-22T11:30:00"),
      updatedAt: new Date("2024-12-04T09:25:00")
    }
  ];

  filteredUsers: User[] = [];

  // Filter properties
  searchTerm: string = '';
  roleFilter: string = '';
  sortBy: string = 'newest';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
    this.calculatePagination();
  }

  /**
   * Filter users based on search term and role
   */
  filterUsers(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role.name === this.roleFilter);
    }

    this.filteredUsers = filtered;
    this.sortUsers();
    this.calculatePagination();
  }

  /**
   * Sort users based on selected criteria
   */
  sortUsers(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredUsers.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case 'oldest':
        this.filteredUsers.sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        break;
      case 'name':
        this.filteredUsers.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        break;
      case 'email':
        this.filteredUsers.sort((a, b) => 
          a.email.localeCompare(b.email)
        );
        break;
    }
  }

  /**
   * Delete user with confirmation
   */
  deleteUser(userId: string): void {
    const user = this.users.find(u => u.id === userId);

    if (user?.role.name === 'Admin') {
      alert('Cannot delete admin users!');
      return;
    }

    if (confirm(`Are you sure you want to delete user ${user?.name}?`)) {
      const index = this.users.findIndex(u => u.id === userId);
      if (index > -1) {
        this.users.splice(index, 1);
        this.filterUsers();
        alert('User deleted successfully!');
      }
    }
  }

  /**
   * Calculate pagination
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  /**
   * Change page
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}