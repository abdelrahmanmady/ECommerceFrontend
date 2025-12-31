//Angular Imports
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//Libraries
import { Observable, tap } from 'rxjs';
//Environment
import { environment } from '../../../environments/environment';
//Models
import { WishlistItemSummaryDto } from '../models/wishlist.model';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    //Angular
    private readonly http = inject(HttpClient);

    //Config
    private readonly baseUrl = `${environment.url}/api/Wishlist`;

    //State
    wishlistIds = signal<number[]>([]);

    // ==================== Wishlist Methods ====================

    getWishlistIds(): Observable<number[]> {
        return this.http.get<number[]>(`${this.baseUrl}/ids`).pipe(
            tap((ids) => this.wishlistIds.set(ids))
        );
    }

    getWishlistItems(): Observable<WishlistItemSummaryDto[]> {
        return this.http.get<WishlistItemSummaryDto[]>(this.baseUrl);
    }

    addToWishlist(productId: number): Observable<number> {
        return this.http.post<number>(`${this.baseUrl}/${productId}`, {}).pipe(
            tap((id) => this.wishlistIds.update(ids => [...ids, id]))
        );
    }

    removeFromWishlist(productId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${productId}`).pipe(
            tap(() => this.wishlistIds.update(ids => ids.filter(id => id !== productId)))
        );
    }
}
