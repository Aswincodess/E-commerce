import {
  Component,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class PaginationComponent {

  // Data received from parent
  items = input<any[]>([]);

  itemsPerPage = input<number>(8);


  // Current page
  currentPage = signal(1);


  // Total number of pages
  totalPages = computed(() => {

    return Math.ceil(
      this.items().length / this.itemsPerPage()
    );

  });


  // Page numbers
  pages = computed(() => {

    return Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );

  });


  // Items for current page
  paginatedItems = computed(() => {

    const startIndex =
      (this.currentPage() - 1) *
      this.itemsPerPage();

    return this.items().slice(
      startIndex,
      startIndex + this.itemsPerPage()
    );

  });


  // Tell parent when page changes
  pageChange = output<number>();


  constructor() {

    effect(() => {

      // Whenever filtered items change,
      // start again from page 1.

      this.items();

      this.currentPage.set(1);

    });

  }


  setPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    ) {
      return;
    }

    this.currentPage.set(page);

    this.pageChange.emit(page);

  }


  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages()
    ) {

      this.currentPage.update(
        page => page + 1
      );

      this.pageChange.emit(
        this.currentPage()
      );

    }

  }


  previousPage(): void {

    if (
      this.currentPage() > 1
    ) {

      this.currentPage.update(
        page => page - 1
      );

      this.pageChange.emit(
        this.currentPage()
      );

    }

  }

}