import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { products } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/products';

  getProducts(): Observable<products[]> {
    return this.http.get<products[]>(this.apiUrl);
  }

  addProduct(product: products) {
    return this.http.post<products>(this.apiUrl, product);
  }

  getProductById(id: string): Observable<products> {
    return this.http.get<products>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, product: products): Observable<products> {
    return this.http.put<products>(
      `${this.apiUrl}/${id}`,
      product
    )
  }


  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    )
  }


}