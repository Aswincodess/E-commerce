import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
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
import { products } from '../../core/models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { loadProducts } from '../../store/products/products.actions';

@Component({
  selector: 'app-products',

  standalone: true,

  imports: [
    CommonModule,
    ProductCard
  ],

  templateUrl: './products.component.html',

  styleUrl: './products.component.css'
})


export class Products {



  // dependencies

  private store = inject(Store);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private productService = inject(ProductService)

  private refreshSubscription?: Subscription;


  ngOnInit(): void {

    this.refreshSubscription =
      interval(3000).subscribe(() => {

        this.store.dispatch(
          loadProducts()
        );

      });
  }


  // loading and error

  loading$ =
    this.store.select(selectProductsLoading);

  error$ =
    this.store.select(selectProductsError);


  // url filters

  category$ =
    this.route.queryParamMap.pipe(

      map(params =>
        params.get('category')
      )

    );


  search$ =
    this.route.queryParamMap.pipe(

      map(params =>
        params.get('search')
      )

    );


  // local filters

  selectedCategory$ =
    new BehaviorSubject<string>('');


  minPrice$ =
    new BehaviorSubject<number | null>(null);


  maxPrice$ =
    new BehaviorSubject<number | null>(null);


  sort$ =
    new BehaviorSubject<string>('');


  // price validation errors

  minPriceError = '';

  maxPriceError = '';


  // category mapping

  categoryMap: { [key: string]: string[] } = {

    chairs: [
      'Office Chairs'
    ],

    desks: [
      'Desks'
    ],

    'laptops-pcs': [
      'Laptops',
      'High-Performance PCs',
      'Mini PCs'
    ],

    monitors: [
      'Monitors'
    ]

  };


  // filtered products

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
      urlCategory,
      search,
      selectedCategory,
      minPrice,
      maxPrice,
      sort
    ]) => {

      // copy products

      let filteredProducts =
        products.filter(product => !product.isDeleted);


      // category from url

      if (urlCategory) {

        const subcategories =
          this.categoryMap[urlCategory];

        if (subcategories) {

          filteredProducts =
            filteredProducts.filter(product =>

              subcategories.includes(
                product.subcategory
              )

            );

        }

      }


      // category filter

      if (
        !urlCategory &&
        selectedCategory
      ) {

        filteredProducts =
          filteredProducts.filter(product =>

            product.subcategory ===
            selectedCategory

          );

      }


      // search filter

      if (search) {

        const searchText =
          search.toLowerCase().trim();

        filteredProducts =
          filteredProducts.filter(product =>

            product.name
              .toLowerCase()
              .includes(searchText)

            ||

            product.category
              .toLowerCase()
              .includes(searchText)

            ||

            product.subcategory
              .toLowerCase()
              .includes(searchText)

            ||

            product.brand
              .toLowerCase()
              .includes(searchText)

          );

      }


      // minimum price

      if (minPrice !== null) {

        filteredProducts =
          filteredProducts.filter(product =>

            product.price >= minPrice

          );

      }


      // maximum price

      if (maxPrice !== null) {

        filteredProducts =
          filteredProducts.filter(product =>

            product.price <= maxPrice

          );

      }


      // sorting

      if (sort === 'low-high') {

        filteredProducts.sort(
          (a, b) =>
            a.price - b.price
        );

      }


      if (sort === 'high-low') {

        filteredProducts.sort(
          (a, b) =>
            b.price - a.price
        );

      }


      return filteredProducts;

    })

  );


  // pagination

  currentPage$ =
    new BehaviorSubject<number>(1);


  itemsPerPage = 8;


  // total pages

  totalPages$ =
    this.filteredProducts$.pipe(

      map(products =>

        Math.ceil(
          products.length /
          this.itemsPerPage
        )

      )

    );


  // page numbers

  pages$ =
    this.totalPages$.pipe(

      map(totalPages =>

        Array.from(
          { length: totalPages },
          (_, index) =>
            index + 1
        )

      )

    );


  // products for current page

  products$ =
    combineLatest([

      this.filteredProducts$,

      this.currentPage$

    ]).pipe(

      map(([products, currentPage]) => {

        const startIndex =
          (currentPage - 1) *
          this.itemsPerPage;

        return products.slice(

          startIndex,

          startIndex +
          this.itemsPerPage

        );

      })

    );


  // filter methods

  setCategory(category: string) {

    this.selectedCategory$.next(
      category
    );


    // remove category from url

    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {
        category: null
      },

      queryParamsHandling: 'merge'

    });


    // go to first page

    this.currentPage$.next(1);

  }


  // minimum price validation

  setMinPrice(value: string) {

    const price =
      Number(value);


    if (value === '') {

      this.minPriceError = '';

      this.minPrice$.next(null);

    }


    else if (isNaN(price)) {

      this.minPriceError =
        'Enter a valid price.';

      this.minPrice$.next(null);

    }


    else if (price < 0) {

      this.minPriceError =
        'Price cannot be negative.';

      this.minPrice$.next(null);

    }


    else {

      this.minPriceError = '';

      this.minPrice$.next(price);

    }


    // go to first page

    this.currentPage$.next(1);

  }


  // maximum price validation

  setMaxPrice(value: string) {

    const price =
      Number(value);


    if (value === '') {

      this.maxPriceError = '';

      this.maxPrice$.next(null);

    }


    else if (isNaN(price)) {

      this.maxPriceError =
        'Enter a valid price.';

      this.maxPrice$.next(null);

    }


    else if (price < 0) {

      this.maxPriceError =
        'Price cannot be negative.';

      this.maxPrice$.next(null);

    }


    else {

      this.maxPriceError = '';

      this.maxPrice$.next(price);

    }


    // go to first page

    this.currentPage$.next(1);

  }


  setSort(value: string) {

    this.sort$.next(value);


    // go to first page

    this.currentPage$.next(1);

  }


  // active filter pills

  activeFilters$ =
    combineLatest([

      this.selectedCategory$,

      this.minPrice$,

      this.maxPrice$

    ]).pipe(

      map(([

        category,
        minPrice,
        maxPrice

      ]) => {

        const filters:
          {
            key: string;
            label: string;
          }[] = [];


        // category pill

        if (category) {

          filters.push({

            key: 'category',

            label: category

          });

        }


        // price pill

        if (
          minPrice !== null ||
          maxPrice !== null
        ) {

          let label = '';


          if (
            minPrice !== null &&
            maxPrice !== null
          ) {

            label =
              `₹${minPrice} - ₹${maxPrice}`;

          }


          else if (
            minPrice !== null
          ) {

            label =
              `Min ₹${minPrice}`;

          }


          else {

            label =
              `Max ₹${maxPrice}`;

          }


          filters.push({

            key: 'price',

            label

          });

        }


        return filters;

      })

    );


  // remove filter

  removeFilter(key: string) {

    if (key === 'category') {

      this.selectedCategory$.next('');

    }


    if (key === 'price') {

      this.minPrice$.next(null);

      this.maxPrice$.next(null);

      this.minPriceError = '';

      this.maxPriceError = '';

    }


    // go to first page

    this.currentPage$.next(1);

  }


  // pagination methods

  setPage(page: number) {

    this.currentPage$.next(page);

    this.scrollToProducts();

  }


  nextPage() {

    combineLatest([

      this.currentPage$,

      this.totalPages$

    ])

      .pipe(take(1))

      .subscribe(
        ([currentPage, totalPages]) => {

          if (
            currentPage <
            totalPages
          ) {

            this.currentPage$.next(
              currentPage + 1
            );

            this.scrollToProducts();

          }

        }

      );

  }


  previousPage() {

    this.currentPage$

      .pipe(take(1))

      .subscribe(
        currentPage => {

          if (currentPage > 1) {

            this.currentPage$.next(
              currentPage - 1
            );

            this.scrollToProducts();

          }

        }

      );

  }


  // scroll to products

  scrollToProducts() {

    document
      .getElementById(
        'products-grid'
      )
      ?.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      });

  }


  // clear filters

  clearFilters() {

    this.selectedCategory$.next('');

    this.minPrice$.next(null);

    this.maxPrice$.next(null);

    this.sort$.next('');


    // clear price validation errors

    this.minPriceError = '';

    this.maxPriceError = '';


    // remove url filters

    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {

        category: null,

        search: null

      },

      queryParamsHandling: 'merge'

    });


    // go to first page

    this.currentPage$.next(1);

  }


}