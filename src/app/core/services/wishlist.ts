import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Wishlist {
  id: string;
  userId: string;
  productIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/wishlists';

  getWishlist(userId: string): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(
      `${this.apiUrl}?userId=${userId}`
    );
  }

  createWishlist(userId: string): Observable<Wishlist> {
    return this.http.post<Wishlist>(
      this.apiUrl,
      {
        userId,
        productIds: []
      }
    );
  }

  updateWishlist(
    wishlistId: string,
    productIds: number[]
  ): Observable<Wishlist> {
    return this.http.patch<Wishlist>(
      `${this.apiUrl}/${wishlistId}`,
      {
        productIds
      }
    );
  }
}