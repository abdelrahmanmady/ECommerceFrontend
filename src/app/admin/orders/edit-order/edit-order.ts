import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// DTOs matching your provided structure
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

// Update Order DTO - matches your provided DTO
interface UpdateOrderDto {
  addressId: string;
  status: string; // OrderStatus enum: pending, processing, shipped, delivered, cancelled
}

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-order.html',
  styleUrls: ['../orders.css']
})
export class OrderEditComponent implements OnInit {
  updateOrderForm!: FormGroup;
  currentOrder: Order | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  orderId: string = '';

  // Mock Data - same as list component
  private mockOrders: Order[] = [
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Get order ID from route parameters
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrder();
    });
  }

  /**
   * Initialize the update order form with validators
   * Matches UpdateOrderDto structure
   */
  private initializeForm(): void {
    this.updateOrderForm = this.fb.group({
      addressId: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  /**
   * Load order data from mock data - IMMEDIATE LOAD
   * In production, this would be an API call
   */
  private loadOrder(): void {
    // Find order immediately - NO DELAY
    this.currentOrder = this.mockOrders.find(o => o.id === this.orderId) || null;

    if (this.currentOrder) {
      // Populate form with current values
      this.updateOrderForm.patchValue({
        addressId: this.currentOrder.address.id,
        status: this.currentOrder.status
      });
      this.isLoading = false;
    } else {
      this.isLoading = false;
      alert('Order not found!');
      this.router.navigate(['/admin/orders']);
    }
  }

  /**
   * Handle form submission
   * Updates order based on UpdateOrderDto
   */
  onSubmit(): void {
    if (this.updateOrderForm.invalid) {
      this.updateOrderForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Get form values matching UpdateOrderDto
    const updateDto: UpdateOrderDto = {
      addressId: this.updateOrderForm.get('addressId')?.value,
      status: this.updateOrderForm.get('status')?.value
    };

    // Simulate API call with timeout
    setTimeout(() => {
      // Update order in mock data
      const orderIndex = this.mockOrders.findIndex(o => o.id === this.orderId);
      if (orderIndex > -1) {
        this.mockOrders[orderIndex].status = updateDto.status;
        this.mockOrders[orderIndex].address.id = updateDto.addressId;
        this.mockOrders[orderIndex].updatedAt = new Date();
      }

      this.isSubmitting = false;
      alert('Order updated successfully!');
      this.router.navigate(['/admin/orders']);
    }, 1000);
  }

  /**
   * Get form control for template
   */
  getControl(controlName: string) {
    return this.updateOrderForm.get(controlName);
  }
}