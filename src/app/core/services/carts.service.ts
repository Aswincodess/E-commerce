import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class carts {

  private http=inject(HttpClient);
  private apiUrl = 'http://localhost:3000/carts';


  getCart(userId:number): Observable<Cart[]>{
    return this.http.get<Cart[]>(
      `${this.apiUrl}?userId=${userId}`
    )
  }


  createCart(cart: Omit<Cart,'id'>):Observable<Cart>{
    return this.http.post<Cart>(
      this.apiUrl,cart
    )
  }


  updateCart(
    cartId: number,
    items: Cart['items']
  ): Observable<Cart> {

    return this.http.patch<Cart>(
      `${this.apiUrl}/${cartId}`,
      { items }
    );
  }
}
