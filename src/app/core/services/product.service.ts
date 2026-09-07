import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { products } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/products';

  getProducts(): Observable<products[]> {
    return this.http.get<products[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<products> {
    return this.http.get<products>(`${this.apiUrl}/${id}`);
  }
}