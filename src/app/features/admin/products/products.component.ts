import {
  Component,
  inject,
  signal,
  computed
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { products } from '../../../core/models/product.model';
import { PaginationComponent } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-products',
  imports: [RouterLink,PaginationComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {

  private productService = inject(ProductService);

  products = signal<products[]>([]);

  loading = false;
  error = '';

  searchTerm = signal('');
  selectedCategory = signal('all');

  deleteMenuId = signal<string | number | null>(null);

  productToDelete = signal<products | null>(null);

  showDeleteModal = signal(false);


  filteredProducts = computed(() => {

    const search = this.searchTerm()
      .toLowerCase()
      .trim();

    const category = this.selectedCategory();

    return this.products().filter(product => {

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.subcategory.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search);

      const matchesCategory =
        category === 'all' ||
        product.category === category;

      return matchesSearch && matchesCategory;

    });

  });


  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts(): void {

    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({

      next: (products) => {

        this.products.set(products);
        this.loading = false;

      },

      error: () => {

        this.error = 'Failed to load products.';
        this.loading = false;

      }

    });

  }


  toggleDeleteMenu(productId: string | number): void {

    if (this.deleteMenuId() === productId) {

      this.deleteMenuId.set(null);

    } else {

      this.deleteMenuId.set(productId);

    }

  }


  softDeleteProduct(product: products): void {

    const updatedProduct: products = {
      ...product,
      isDeleted: true
    };

    this.productService
      .updateProduct(
        String(product.id),
        updatedProduct
      )
      .subscribe({

        next: () => {

          this.deleteMenuId.set(null);
          this.loadProducts();

        },

        error: () => {

          this.error = 'Failed to delete product.';

        }

      });

  }


  restoreProduct(product: products): void {

    const updatedProduct: products = {
      ...product,
      isDeleted: false
    };

    this.productService
      .updateProduct(
        String(product.id),
        updatedProduct
      )
      .subscribe({

        next: () => {

          this.loadProducts();

        },

        error: () => {

          this.error = 'Failed to restore product.';

        }

      });

  }


  openPermanentDeleteModal(product: products): void {

    this.deleteMenuId.set(null);

    this.productToDelete.set(product);

    this.showDeleteModal.set(true);

  }


  closeDeleteModal(): void {

    this.showDeleteModal.set(false);

    this.productToDelete.set(null);

  }


  permanentDeleteProduct(): void {

    const product = this.productToDelete();

    if (!product) {
      return;
    }

    this.productService
      .deleteProduct(String(product.id))
      .subscribe({

        next: () => {

          this.products.update(products =>
            products.filter(p => p.id !== product.id)
          );

          this.closeDeleteModal();

        },

        error: () => {

          this.error = 'Failed to permanently delete product.';

          this.closeDeleteModal();

        }

      });

  }

}