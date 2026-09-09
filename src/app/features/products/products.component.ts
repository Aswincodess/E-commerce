import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, BehaviorSubject } from 'rxjs';

import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError
} from '../../store/products/products.selectors';



import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class Products {

  private store = inject(Store);
  private route = inject(ActivatedRoute);

  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  // --------------------------------
  // Load Products
  // --------------------------------



  // --------------------------------
  // URL Filters
  // --------------------------------

  category$ = this.route.queryParamMap.pipe(
    map(params => params.get('category'))
  );

  search$ = this.route.queryParamMap.pipe(
    map(params => params.get('search'))
  );

  // --------------------------------
  // Local Filters
  // --------------------------------

  selectedCategory$ = new BehaviorSubject<string>('');
  minPrice$ = new BehaviorSubject<number | null>(null);
  maxPrice$ = new BehaviorSubject<number | null>(null);
  sort$ = new BehaviorSubject<string>('');

  // --------------------------------
  // Products
  // --------------------------------

  products$ = combineLatest([
    this.store.select(selectAllProducts),
    this.category$,
    this.search$,
    this.selectedCategory$,
    this.minPrice$,
    this.maxPrice$,
    this.sort$
  ]).pipe(

    map(([products, category, search, selectedCategory, minPrice, maxPrice, sort]) => {

      let filteredProducts = [...products];

      // --------------------------------
      // Category from URL
      // --------------------------------

      if (category) {

        if (category === 'chairs') {
          filteredProducts = filteredProducts.filter(
            product => product.subcategory === 'Office Chairs'
          );
        }

        if (category === 'desks') {
          filteredProducts = filteredProducts.filter(
            product => product.subcategory === 'Desks'
          );
        }

        if (category === 'laptops-pcs') {
          filteredProducts = filteredProducts.filter(
            product =>
              product.subcategory === 'Laptops' ||
              product.subcategory === 'High-Performance PCs' ||
              product.subcategory === 'Mini PCs'
          );
        }

        if (category === 'monitors') {
          filteredProducts = filteredProducts.filter(
            product => product.subcategory === 'Monitors'
          );
        }
      }

      // --------------------------------
      // Category Filter
      // --------------------------------

      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          product => product.subcategory === selectedCategory
        );
      }

      // --------------------------------
      // Search Filter
      // --------------------------------

      if (search) {

        const searchText = search.toLowerCase().trim();

        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchText) ||
          product.category.toLowerCase().includes(searchText) ||
          product.subcategory.toLowerCase().includes(searchText) ||
          product.brand.toLowerCase().includes(searchText)
        );
      }

      // --------------------------------
      // Minimum Price
      // --------------------------------

      if (minPrice !== null) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= minPrice
        );
      }

      // --------------------------------
      // Maximum Price
      // --------------------------------

      if (maxPrice !== null) {
        filteredProducts = filteredProducts.filter(
          product => product.price <= maxPrice
        );
      }

      // --------------------------------
      // Sorting
      // --------------------------------

      if (sort === 'low-high') {
        filteredProducts.sort(
          (a, b) => a.price - b.price
        );
      }

      if (sort === 'high-low') {
        filteredProducts.sort(
          (a, b) => b.price - a.price
        );
      }

      return filteredProducts;

    })

  );

  // --------------------------------
  // Filter Methods
  // --------------------------------

  setCategory(category: string) {
    this.selectedCategory$.next(category);
  }

  setMinPrice(value: string) {

    const price = Number(value);

    this.minPrice$.next(
      value === '' || isNaN(price) ? null : price
    );
  }

  setMaxPrice(value: string) {

    const price = Number(value);

    this.maxPrice$.next(
      value === '' || isNaN(price) ? null : price
    );
  }

  setSort(value: string) {
    this.sort$.next(value);
  }

  // --------------------------------
  // Clear Filters
  // --------------------------------

  clearFilters() {

    this.selectedCategory$.next('');
    this.minPrice$.next(null);
    this.maxPrice$.next(null);
    this.sort$.next('');

  }

}