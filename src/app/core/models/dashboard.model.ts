import { AdminOrderSummaryDto, OrderStatus } from './order.model';
import { AdminUserSummaryDto } from './user.model';

export interface AdminDashboardStatsResponse {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenue: number;
  ordersChangePercentage?: number;
  recentProductsCount: number;
  recentUsersCount: number;
  revenueChangePercentage?: number;
  ordersTrend: number[];
  productsTrend: number[];
  usersTrend: number[];
  revenuesTrend: number[];
  ordersDistribution: Record<OrderStatus, number>;
  productsDistribution: Record<string, number>;
  usersDistribution: Record<string, number>;
  recentOrders: AdminOrderSummaryDto[];
  recentUsers: AdminUserSummaryDto[];
}
