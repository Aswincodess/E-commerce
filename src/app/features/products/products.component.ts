import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  map
} from 'rxjs';

import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError
} from '../../store/products/products.selectors';

import { ProductCard } from '../../shared/product-card/product-card';

import {
  PaginationComponent
} from '../../shared/pagination/pagination';

import {
  ProductControlsComponent,
  ProductFilters
} from '../../shared/product-controls/product-controls';

import { loadProducts } from '../../store/products/products.actions';

import { products } from '../../core/models/product.model';


@Component({
  selector: 'app-products',
  standalone: true,

  imports: [
    CommonModule,
    ProductCard,
    ProductControlsComponent,
    PaginationComponent
  ],

  templateUrl: './products.component.html',

  styleUrl: './products.component.css'
})
export class Products {

  private store = inject(Store);

  private route = inject(ActivatedRoute);

  private router = inject(Router);


  exploreStarted = signal(false);


  startExplore(): void {

    this.exploreStarted.set(false);

    setTimeout(() => {

      this.exploreStarted.set(true);

    }, 50);

  }


  // Current filter values

  filters$ =
    new BehaviorSubject<ProductFilters>({

      category: '',
      minPrice: null,
      maxPrice: null,
      sort: ''

    });


  // URL category

  category$ =
    this.route.queryParamMap.pipe(

      map(params =>
        params.get('category')
      )

    );


  // URL search

  search$ =
    this.route.queryParamMap.pipe(

      map(params =>
        params.get('search')
      )

    );


  // Loading

  loading$ =
    this.store.select(
      selectProductsLoading
    );


  // Error

  error$ =
    this.store.select(
      selectProductsError
    );


  // Category mapping

  categoryMap: {
    [key: string]: string[]
  } = {
      furniture: [
        'Office Chairs'
      ],

      laptops: [
        'Laptops'
      ],

      monitors: [
        'Monitors'
      ],

      pcs: [
        'High-Performance PCs',
        'Mini PCs'
      ]
    };

  // Filter and sort products

  filteredProducts$ =
    combineLatest([

      this.store.select(
        selectAllProducts
      ),

      this.category$,

      this.search$,

      this.filters$

    ]).pipe(

      map(([
        products,
        urlCategory,
        search,
        filters
      ]) => {

        // Remove deleted products
        // and reverse the existing product order

        let result =
          [...products]
            .filter(
              product =>
                !product.isDeleted
            )
            .reverse();


        // Category from URL

        if (urlCategory) {

          const subcategories =
            this.categoryMap[urlCategory];

          if (subcategories) {

            result =
              result.filter(
                product =>
                  subcategories.includes(
                    product.subcategory
                  )
              );

          }

        }


        // Category selected from controls

        if (
          !urlCategory &&
          filters.category
        ) {

          result =
            result.filter(
              product =>
                product.subcategory ===
                filters.category
            );

        }


        // Search

        if (search) {

          const searchText =
            search
              .toLowerCase()
              .trim();

          result =
            result.filter(
              product =>

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


        // Minimum price

        if (
          filters.minPrice !== null
        ) {

          result =
            result.filter(
              product =>
                product.price >=
                filters.minPrice!
            );

        }


        // Maximum price

        if (
          filters.maxPrice !== null
        ) {

          result =
            result.filter(
              product =>
                product.price <=
                filters.maxPrice!
            );

        }


        // Sort by price: low to high

        if (
          filters.sort === 'low-high'
        ) {

          result.sort(
            (a, b) =>
              a.price - b.price
          );

        }


        // Sort by price: high to low

        if (
          filters.sort === 'high-low'
        ) {

          result.sort(
            (a, b) =>
              b.price - a.price
          );

        }


        return result;

      })

    );


  // Load products

  ngOnInit(): void {

    this.store.dispatch(
      loadProducts()
    );

  }


  // Receive filters from ProductControls

  onFiltersChange(
    filters: ProductFilters
  ): void {

    this.filters$.next(filters);

    if (filters.category) {

      this.router.navigate([], {

        relativeTo: this.route,

        queryParams: {
          category: null
        },

        queryParamsHandling: 'merge'

      });

    }

  }


  // Clear filters

  onClearFilters(): void {

    this.filters$.next({

      category: '',
      minPrice: null,
      maxPrice: null,
      sort: ''

    });


    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {

        category: null,
        search: null

      },

      queryParamsHandling: 'merge'

    });

  }


  // Go to category

  goToCategory(
    category: string
  ): void {

    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {
        category: category
      },

      queryParamsHandling: 'merge'

    });

  }


  // Scroll to products

  scrollToProducts(): void {

    document
      .getElementById('products-grid')
      ?.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      });

  }

}