//Angular Imports
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
//Services
import { DashboardService } from '../../../core/services';
//Models
import { AdminDashboardStatsResponse } from '../../../core/models';
//Environment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class AdminDashboard implements OnInit {
  //Services
  private dashboardService = inject(DashboardService);

  //State
  dashboardStats = signal<AdminDashboardStatsResponse | null>(null);
  isLoading = signal<boolean>(false);

  //Properties
  currentDate: Date = new Date();
  backendUrl = environment.url;

  //Computed Properties
  ordersAttention = computed(() => {
    const stats = this.dashboardStats();
    if (!stats) return 0;
    return (
      (stats.ordersDistribution['pending'] || 0) + (stats.ordersDistribution['processing'] || 0)
    );
  });

  lowStockCount = computed(() => this.dashboardStats()?.productsDistribution['lowStock'] || 0);
  outOfStockCount = computed(() => this.dashboardStats()?.productsDistribution['outOfStock'] || 0);

  //Trend Bars Computed
  ordersTrendBars = computed(() => this.calculateTrendBars(this.dashboardStats()?.ordersTrend));
  productsTrendBars = computed(() => this.calculateTrendBars(this.dashboardStats()?.productsTrend));
  usersTrendBars = computed(() => this.calculateTrendBars(this.dashboardStats()?.usersTrend));
  revenueTrendBars = computed(() => this.calculateTrendBars(this.dashboardStats()?.revenuesTrend));

  //Greeting Computed
  greeting = computed(() => {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  greetingIcon = computed(() => {
    const hour = this.currentDate.getHours();
    if (hour < 6) return 'bi-moon-stars';
    if (hour < 12) return 'bi-sun';
    if (hour < 17) return 'bi-brightness-high';
    if (hour < 20) return 'bi-sunset';
    return 'bi-moon-stars';
  });

  // ==================== Lifecycle ====================

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  // ==================== Data Loading ====================

  private loadDashboardStats(): void {
    this.isLoading.set(true);
    this.dashboardService
      .getAdminDashboardStats()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (data: AdminDashboardStatsResponse) => {
          this.dashboardStats.set(data);
        },
        error: (error: any) => {
          console.error('Error fetching admin dashboard stats:', error);
        },
      });
  }

  // ==================== Helpers ====================

  private calculateTrendBars(trend: number[] | undefined): number[] {
    if (!trend?.length) return [];

    const max = Math.max(...trend);
    if (max === 0) return trend.map(() => 4); // Minimum visible height

    return trend.map((val) => {
      if (val === 0) return 4;
      return Math.max(4, Math.round((val / max) * 100));
    });
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date();
    let past: Date;

    if (typeof date === 'string' && !date.includes('Z') && !date.includes('+')) {
      past = new Date(date + 'Z');
    } else {
      past = new Date(date);
    }

    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 0 ? 'Just now' : `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
