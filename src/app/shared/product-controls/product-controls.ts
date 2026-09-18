import {
  Component,
  computed,
  output,
  signal
} from '@angular/core';


export interface ProductFilters {

  category: string;

  minPrice: number | null;

  maxPrice: number | null;

  sort: string;

}


@Component({
  selector: 'app-product-controls',
  imports: [],
  templateUrl: './product-controls.html',
  styleUrl: './product-controls.css'
})
export class ProductControlsComponent {


  // Send all filter values to parent

  filtersChange =
    output<ProductFilters>();


  // Tell parent to clear URL filters

  clearFilters =
    output<void>();


  // Local filter values

  selectedCategory =
    signal('');

  minPrice =
    signal<number | null>(null);

  maxPrice =
    signal<number | null>(null);

  sort =
    signal('');


  // Price validation errors

  minPriceError = '';

  maxPriceError = '';


  // Active filter pills

  activeFilters =
    computed(() => {

      const filters: {
        key: string;
        label: string;
      }[] = [];


      // Category

      if (this.selectedCategory()) {

        filters.push({

          key: 'category',

          label:
            this.selectedCategory()

        });

      }


      // Price

      if (
        this.minPrice() !== null ||
        this.maxPrice() !== null
      ) {

        let label = '';


        if (
          this.minPrice() !== null &&
          this.maxPrice() !== null
        ) {

          label =
            `₹${this.minPrice()} - ₹${this.maxPrice()}`;

        }

        else if (
          this.minPrice() !== null
        ) {

          label =
            `Min ₹${this.minPrice()}`;

        }

        else {

          label =
            `Max ₹${this.maxPrice()}`;

        }


        filters.push({

          key: 'price',

          label

        });

      }


      return filters;

    });


  // Category

  setCategory(category: string): void {

    this.selectedCategory.set(
      category
    );

    this.emitFilters();

  }


  // Minimum price

  setMinPrice(value: string): void {

    const price =
      Number(value);


    if (value === '') {

      this.minPriceError = '';

      this.minPrice.set(null);

    }

    else if (isNaN(price)) {

      this.minPriceError =
        'Enter a valid price.';

      this.minPrice.set(null);

    }

    else if (price < 0) {

      this.minPriceError =
        'Price cannot be negative.';

      this.minPrice.set(null);

    }

    else {

      this.minPriceError = '';

      this.minPrice.set(price);

    }


    this.emitFilters();

  }


  // Maximum price

  setMaxPrice(value: string): void {

    const price =
      Number(value);


    if (value === '') {

      this.maxPriceError = '';

      this.maxPrice.set(null);

    }

    else if (isNaN(price)) {

      this.maxPriceError =
        'Enter a valid price.';

      this.maxPrice.set(null);

    }

    else if (price < 0) {

      this.maxPriceError =
        'Price cannot be negative.';

      this.maxPrice.set(null);

    }

    else {

      this.maxPriceError = '';

      this.maxPrice.set(price);

    }


    this.emitFilters();

  }


  // Sort

  setSort(value: string): void {

    this.sort.set(value);

    this.emitFilters();

  }


  // Remove filter

  removeFilterByKey(key: string): void {

    if (key === 'category') {

      this.selectedCategory.set('');

    }


    if (key === 'price') {

      this.minPrice.set(null);

      this.maxPrice.set(null);

      this.minPriceError = '';

      this.maxPriceError = '';

    }


    this.emitFilters();

  }


  // Clear all filters

  clearAllFilters(): void {

    this.selectedCategory.set('');

    this.minPrice.set(null);

    this.maxPrice.set(null);

    this.sort.set('');

    this.minPriceError = '';

    this.maxPriceError = '';


    this.clearFilters.emit();

    this.emitFilters();

  }


  // Send current filters

  private emitFilters(): void {

    this.filtersChange.emit({

      category:
        this.selectedCategory(),

      minPrice:
        this.minPrice(),

      maxPrice:
        this.maxPrice(),

      sort:
        this.sort()

    });

  }

}