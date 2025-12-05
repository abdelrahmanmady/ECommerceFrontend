import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// DTOs and Models
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  status: string;
  total: number;
  address: Address;
  orderItems: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersListComponent implements OnInit {
  // Mock Data
  orders: Order[] = [
    {
      id: "ORD-2024-001",
      userId: "USR-2024-123",
      userName: "John Doe",
      status: "delivered",
      total: 459.97,
      address: {
        id: "ADDR-001",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        {
          id: "ITEM-001",
          orderId: "ORD-2024-001",
          product: {
            id: "PROD-001",
            name: "Premium Wireless Headphones",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
          },
          quantity: 1,
          price: 299.99,
          createdAt: new Date("2024-12-01T10:30:00"),
          updatedAt: new Date("2024-12-01T10:30:00")
        },
        {
          id: "ITEM-002",
          orderId: "ORD-2024-001",
          product: {
            id: "PROD-002",
            name: "Leather Wallet",
            imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200"
          },
          quantity: 2,
          price: 79.99,
          createdAt: new Date("2024-12-01T10:30:00"),
          updatedAt: new Date("2024-12-01T10:30:00")
        }
      ],
      createdAt: new Date("2024-12-01T10:30:00"),
      updatedAt: new Date("2024-12-03T14:15:00")
    },
    {
      id: "ORD-2024-002",
      userId: "USR-2024-124",
      userName: "Jane Smith",
      status: "processing",
      total: 189.50,
      address: {
        id: "ADDR-002",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "USA"
      },
      orderItems: [
        {
          id: "ITEM-003",
          orderId: "ORD-2024-002",
          product: {
            id: "PROD-003",
            name: "Designer Handbag",
            imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200"
          },
          quantity: 1,
          price: 189.50,
          createdAt: new Date("2024-12-02T15:20:00"),
          updatedAt: new Date("2024-12-02T15:20:00")
        }
      ],
      createdAt: new Date("2024-12-02T15:20:00"),
      updatedAt: new Date("2024-12-04T09:45:00")
    },
    {
      id: "ORD-2024-003",
      userId: "USR-2024-125",
      userName: "Mike Johnson",
      status: "shipped",
      total: 549.99,
      address: {
        id: "ADDR-003",
        street: "789 Pine Road",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA"
      },
      orderItems: [
        {
          id: "ITEM-004",
          orderId: "ORD-2024-003",
          product: {
            id: "PROD-004",
            name: "Smartwatch Pro",
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
          },
          quantity: 1,
          price: 549.99,
          createdAt: new Date("2024-12-03T11:00:00"),
          updatedAt: new Date("2024-12-03T11:00:00")
        }
      ],
      createdAt: new Date("2024-12-03T11:00:00"),
      updatedAt: new Date("2024-12-05T08:30:00")
    },
    {
      id: "ORD-2024-004",
      userId: "USR-2024-126",
      userName: "Sarah Williams",
      status: "pending",
      total: 129.99,
      address: {
        id: "ADDR-004",
        street: "321 Elm Street",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        country: "USA"
      },
      orderItems: [
        {
          id: "ITEM-005",
          orderId: "ORD-2024-004",
          product: {
            id: "PROD-005",
            name: "Running Shoes",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
          },
          quantity: 1,
          price: 129.99,
          createdAt: new Date("2024-12-04T16:45:00"),
          updatedAt: new Date("2024-12-04T16:45:00")
        }
      ],
      createdAt: new Date("2024-12-04T16:45:00"),
      updatedAt: new Date("2024-12-04T16:45:00")
    },
    {
      id: "ORD-2024-005",
      userId: "USR-2024-127",
      userName: "David Brown",
      status: "cancelled",
      total: 89.99,
      address: {
        id: "ADDR-005",
        street: "555 Maple Drive",
        city: "Phoenix",
        state: "AZ",
        zipCode: "85001",
        country: "USA"
      },
      orderItems: [
        {
          id: "ITEM-006",
          orderId: "ORD-2024-005",
          product: {
            id: "PROD-006",
            name: "Bluetooth Speaker",
            imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200"
          },
          quantity: 1,
          price: 89.99,
          createdAt: new Date("2024-11-28T09:15:00"),
          updatedAt: new Date("2024-11-28T09:15:00")
        }
      ],
      createdAt: new Date("2024-11-28T09:15:00"),
      updatedAt: new Date("2024-11-30T10:00:00")
    }
  ];

  filteredOrders: Order[] = [];

  // Filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  sortBy: string = 'newest';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
    this.calculatePagination();
  }

  /**
   * Filter orders based on search term and status
   */
  filterOrders(): void {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(search) ||
        order.userName.toLowerCase().includes(search) ||
        order.userId.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    this.filteredOrders = filtered;
    this.sortOrders();
    this.calculatePagination();
  }

  /**
   * Sort orders based on selected criteria
   */
  sortOrders(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredOrders.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case 'oldest':
        this.filteredOrders.sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        break;
      case 'highest':
        this.filteredOrders.sort((a, b) => b.total - a.total);
        break;
      case 'lowest':
        this.filteredOrders.sort((a, b) => a.total - b.total);
        break;
    }
  }

  /**
   * Delete order with confirmation
   */
  deleteOrder(orderId: string): void {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const index = this.orders.findIndex(o => o.id === orderId);
      if (index > -1) {
        this.orders.splice(index, 1);
        this.filterOrders();
        alert('Order deleted successfully!');
      }
    }
  }

  /**
   * Calculate pagination
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
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