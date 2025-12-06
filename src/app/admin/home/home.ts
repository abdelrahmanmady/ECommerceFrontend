import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Recent Order interface
interface RecentOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
}

// Recent User interface
interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class AdminDashboard implements OnInit {
  // Current Date
  currentDate: Date = new Date();

  // Statistics - Main Cards
  totalOrders: number = 247;
  totalProducts: number = 156;
  totalUsers: number = 1849;
  totalRevenue: number = 48920.50;

  // Navigation Cards Stats
  pendingOrders: number = 12;
  processingOrders: number = 8;
  inStockProducts: number = 142;
  lowStockProducts: number = 14;
  totalSellers: number = 28;
  totalCustomers: number = 1820;
  totalCategories: number = 15;
  activeCategories: number = 12;

  // Recent Activity - Orders
  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-2024-247',
      customerName: 'Sarah Anderson',
      total: 459.99,
      status: 'pending'
    },
    {
      id: 'ORD-2024-246',
      customerName: 'Mike Johnson',
      total: 299.50,
      status: 'processing'
    },
    {
      id: 'ORD-2024-245',
      customerName: 'Emily Davis',
      total: 189.99,
      status: 'delivered'
    },
    {
      id: 'ORD-2024-244',
      customerName: 'James Wilson',
      total: 549.00,
      status: 'processing'
    }
  ];

  // Recent Activity - Users
  recentUsers: RecentUser[] = [
    {
      id: 'USR-2024-1849',
      name: 'Lisa Martinez',
      email: 'lisa.martinez@example.com',
      role: 'Customer'
    },
    {
      id: 'USR-2024-1848',
      name: 'John Thompson',
      email: 'john.thompson@example.com',
      role: 'Seller'
    },
    {
      id: 'USR-2024-1847',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'Customer'
    },
    {
      id: 'USR-2024-1846',
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      role: 'Customer'
    }
  ];

  ngOnInit(): void {
    // Component initialization
    // In production, you would fetch real data from API here
    console.log('Admin Dashboard loaded');
  }

  /**
   * Navigate to specific section
   * Already handled by routerLink in template
   */
}