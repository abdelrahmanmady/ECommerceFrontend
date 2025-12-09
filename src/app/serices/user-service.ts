import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string = environment.url + 'api/User/';
  private http = inject(HttpClient);

  getAllUsers():Observable<any> {
    return this.http.get(this.baseUrl);
  }
  getUserById(id:string):Observable<any>{
    return this.http.get(this.baseUrl + id);
  }
}
