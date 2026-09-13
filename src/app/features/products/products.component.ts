import { Component, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  take
} from 'rxjs';

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
  private elementRef = inject(ElementRef);

  //loading and error

  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

//url filter

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
  // Active Filter Pills
  // --------------------------------

  activeFilters$ = combineLatest([
    this.selectedCategory$,
    this.minPrice$,
    this.maxPrice$
  ]).pipe(
    map(([category, minPrice, maxPrice]) => {

      const filters: { key: string; label: string }[] = [];

      if (category) {
        filters.push({ key: 'category', label: category });
      }

      if (minPrice !== null || maxPrice !== null) {
        const label =
          minPrice !== null && maxPrice !== null
            ? `₹${minPrice} - ₹${maxPrice}`
            : minPrice !== null
              ? `Min ₹${minPrice}`
              : `Max ₹${maxPrice}`;

        filters.push({ key: 'price', label });
      }

      return filters;
    })
  );


  // --------------------------------
  // Pagination
  // --------------------------------

  currentPage$ = new BehaviorSubject<number>(1);

  itemsPerPage = 8;


  // --------------------------------
  // Filtered & Sorted Products
  // --------------------------------

  filteredProducts$ = combineLatest([
    this.store.select(selectAllProducts),
    this.category$,
    this.search$,
    this.selectedCategory$,
    this.minPrice$,
    this.maxPrice$,
    this.sort$
  ]).pipe(

    map(([
      products,
      category,
      search,
      selectedCategory,
      minPrice,
      maxPrice,
      sort
    ]) => {

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


      // Return all filtered + sorted products
      return filteredProducts;
    })
  );


  // --------------------------------
  // Total Pages
  // --------------------------------

  totalPages$ = this.filteredProducts$.pipe(

    map(products =>
      Math.ceil(
        products.length / this.itemsPerPage
      )
    )

  );

  // --------------------------------
  // Page Numbers
  // --------------------------------

  pages$ = this.totalPages$.pipe(
    map(totalPages =>
      Array.from(
        { length: totalPages },
        (_, index) => index + 1
      )
    )
  );


  // --------------------------------
  // Paginated Products
  // --------------------------------

  products$ = combineLatest([
    this.filteredProducts$,
    this.currentPage$
  ]).pipe(

    map(([products, currentPage]) => {

      const startIndex =
        (currentPage - 1) * this.itemsPerPage;

      return products.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );

    })
  );


  // --------------------------------
  // Filter Methods
  // --------------------------------

  setCategory(category: string) {

    this.selectedCategory$.next(category);

    // Start from page 1 after filtering
    this.currentPage$.next(1);
  }


  setMinPrice(value: string) {

    const price = Number(value);

    this.minPrice$.next(
      value === '' || isNaN(price)
        ? null
        : price
    );

    // Start from page 1 after filtering
    this.currentPage$.next(1);
  }


  setMaxPrice(value: string) {

    const price = Number(value);

    this.maxPrice$.next(
      value === '' || isNaN(price)
        ? null
        : price
    );

    // Start from page 1 after filtering
    this.currentPage$.next(1);
  }


  setSort(value: string) {

    this.sort$.next(value);

    // Start from page 1 after sorting
    this.currentPage$.next(1);
  }


  // --------------------------------
  // Remove Single Filter
  // --------------------------------

  removeFilter(key: string) {

    if (key === 'category') {
      this.selectedCategory$.next('');
    }

    if (key === 'price') {
      this.minPrice$.next(null);
      this.maxPrice$.next(null);
    }

    this.currentPage$.next(1);
  }


  // --------------------------------
  // Pagination Methods
  // --------------------------------

  setPage(page: number) {

    this.currentPage$.next(page);
    this.scrollToProducts();

  }

  scrollToProducts() {
    setTimeout(() => {
      document.getElementById('products-grid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }


  nextPage() {

    combineLatest([
      this.currentPage$,
      this.totalPages$
    ])
      .pipe(take(1))
      .subscribe(([currentPage, totalPages]) => {

        if (currentPage < totalPages) {

          this.currentPage$.next(
            currentPage + 1
          );
          this.scrollToProducts();

        }

      });
  }


  previousPage() {

    this.currentPage$
      .pipe(take(1))
      .subscribe(currentPage => {

        if (currentPage > 1) {

          this.currentPage$.next(
            currentPage - 1
          );
          this.scrollToProducts();

        }

      });
  }


  // --------------------------------
  // Clear Filters
  // --------------------------------

  clearFilters() {

    this.selectedCategory$.next('');
    this.minPrice$.next(null);
    this.maxPrice$.next(null);
    this.sort$.next('');

    // Go back to first page
    this.currentPage$.next(1);
  }

}