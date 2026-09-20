import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { User } from '../models/user.model';
import { products } from '../models/product.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private usersUrl = 'http://localhost:3000/users';
  private productsUrl = 'http://localhost:3000/products';
  private ordersUrl = 'http://localhost:3000/orders';

  getDashboardData(): Observable<{
    users: User[];
    products: products[];
    orders: Order[];
  }> {

    return forkJoin({
      users: this.http.get<User[]>(this.usersUrl),
      products: this.http.get<products[]>(this.productsUrl),
      orders: this.http.get<Order[]>(this.ordersUrl)
    });

  }
}