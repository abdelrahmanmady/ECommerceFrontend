// Angular Imports
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Libraries
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, timer } from 'rxjs';
// Services
import { UserService } from '../../../core/services/user.service';
// Models
import { AdminUserQueryParams, AdminUserSummaryDto } from '../../../core/models/user.model';
// Environment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersListComponent implements OnInit {
  // ==================== Injected Services ====================
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  // ==================== State ====================
  // Data
  users: AdminUserSummaryDto[] = [];
  totalCount = 0;
  isLoading = false;

  // Filters
  selectedRole: 'all' | 'admin' | 'seller' | 'customer' | undefined = undefined;
  selectedStatus: 'all' | 'active' | 'deleted' | undefined = undefined;
  selectedSort:
    | 'createdAsc'
    | 'createdDesc'
    | 'updatedDesc'
    | 'ordersDesc'
    | 'nameAsc'
    | 'emailAsc'
    | undefined = undefined;

  // Pagination
  pageIndex = 1;
  pageSize = 10;

  // Search
  private searchTerms = new Subject<string>();
  searchTerm = '';

  // ==================== Computed Properties ====================
  get hasActiveFilters(): boolean {
    return !!(this.selectedRole || this.selectedStatus || this.selectedSort || this.searchTerm);
  }

  // ==================== Lifecycle ====================
  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadUsers();
  }

  private setupSearchDebounce(): void {
    this.searchTerms.pipe(debounceTime(500), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm = term;
      this.pageIndex = 1;
      this.loadUsers();
    });
  }

  // ==================== Data Loading ====================
  loadUsers(scrollToTable = false): void {
    this.isLoading = true;
    const params = this.buildQueryParams();

    forkJoin([
      this.userService.getAdminUsers(params),
      timer(300), // Minimum loading time for UX
    ]).subscribe({
      next: ([response]) => {
        this.users = response.items;
        this.totalCount = response.totalCount;
        this.isLoading = false;
        this.cdr.detectChanges();

        if (scrollToTable) {
          this.scrollToTableIfNeeded();
        }
      },
      error: (error) => {
        console.error('Error fetching admin users:', error);
        this.isLoading = false;
      },
    });
  }

  private buildQueryParams(): AdminUserQueryParams {
    const params: AdminUserQueryParams = {};

    if (this.pageIndex > 1) {
      params.pageIndex = this.pageIndex;
    }
    if (this.selectedRole && this.selectedRole !== 'all') {
      params.role = this.selectedRole;
    }
    if (this.selectedStatus && this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    if (this.selectedSort) {
      params.sort = this.selectedSort;
    }
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    return params;
  }

  private scrollToTableIfNeeded(): void {
    setTimeout(() => {
      const anchor = document.getElementById('usersTableAnchor');
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        if (rect.top < 0) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  }

  // ==================== Filter Handlers ====================
  onRoleChange(role: 'all' | 'admin' | 'seller' | 'customer'): void {
    if (this.selectedRole === role) return;
    this.selectedRole = role === 'all' ? 'all' : role;
    this.pageIndex = 1;
    this.loadUsers();
  }

  onStatusChange(status: 'all' | 'active' | 'deleted'): void {
    if (this.selectedStatus === status) return;
    this.selectedStatus = status === 'all' ? 'all' : status;
    this.pageIndex = 1;
    this.loadUsers();
  }

  onSortChange(
    sort: 'createdAsc' | 'createdDesc' | 'updatedDesc' | 'ordersDesc' | 'nameAsc' | 'emailAsc'
  ): void {
    if (this.selectedSort === sort) return;
    this.selectedSort = sort;
    this.pageIndex = 1;
    this.loadUsers();
  }

  onSearch(term: string): void {
    this.isLoading = true;
    this.searchTerms.next(term);
  }

  clearFilters(): void {
    this.selectedRole = undefined;
    this.selectedStatus = undefined;
    this.selectedSort = undefined;
    this.searchTerm = '';
    this.pageIndex = 1;
    this.loadUsers();
  }

  // ==================== Pagination ====================
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadUsers(true);
  }

  // ==================== User Actions ====================
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      // TODO: Implement delete API call
      console.log('Deleting user:', userId);
    }
  }

  restoreUser(userId: string): void {
    if (confirm('Are you sure you want to restore this user?')) {
      // TODO: Implement restore API call
      console.log('Restoring user:', userId);
    }
  }

  // ==================== Template Helpers ====================
  getSortLabel(): string {
    switch (this.selectedSort) {
      case 'createdDesc':
        return 'Newest';
      case 'createdAsc':
        return 'Oldest';
      case 'updatedDesc':
        return 'Last Updated';
      case 'ordersDesc':
        return 'Orders Placed';
      case 'nameAsc':
        return 'Name (A-Z)';
      case 'emailAsc':
        return 'Email (A-Z)';
      default:
        return 'Newest';
    }
  }

  getAvatarUrl(user: AdminUserSummaryDto): string | null {
    return user.avatarUrl ? environment.url + user.avatarUrl : null;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'seller':
        return 'role-seller';
      case 'customer':
      default:
        return 'role-customer';
    }
  }
}
