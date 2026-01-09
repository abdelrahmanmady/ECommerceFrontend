//Angular Imports
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//RxJS Imports
import { Observable } from 'rxjs';
//Environment
import { environment } from '../../../environments/environment';
//Models
import { AdminDashboardStatsResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  //Dependencies
  private http = inject(HttpClient);

  //Properties
  private apiUrl = `${environment.url}/api/Dashboard`;

  //Methods
  getAdminDashboardStats(): Observable<AdminDashboardStatsResponse> {
    return this.http.get<AdminDashboardStatsResponse>(`${this.apiUrl}/admin`);
  }
}
