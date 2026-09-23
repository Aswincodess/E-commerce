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
    data: Partial<Order>//We don't have to provide the complete Order object.
  ): Observable<Order> { // We can provide only the fields we want to change.

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
        status: 'cancelled'  //we dont delete here we update only th status
      }
    );
  }

  getAllOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(
      this.apiUrl
    )
  }
}