import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/orders';


  // Get all orders for a user
  getOrdersByUser(userId: string): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}?userId=${userId}`
    );
  }


  // Get a single order
  getOrderById(orderId: string): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${orderId}`
    );
  }


  // Create order
  createOrder(order: Order): Observable<Order> {

    return this.http.post<Order>(
      this.apiUrl,
      order
    );
  }


  // Update order
  updateOrder(
    orderId: string,
    data: Partial<Order>
  ): Observable<Order> {

    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}`,
      data
    );
  }


  // Cancel order
  cancelOrder(orderId: string): Observable<Order> {

    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}`,
      {
        status: 'cancelled'
      }
    );
  }
}