import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { UserService } from '../../../core/services/user/user.service';

import { User } from '../../../core/models/user.model';

import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../core/services/toast/toast';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  private userService = inject(UserService);

  private cdr = inject(ChangeDetectorRef);

  private toastService = inject(ToastService);


  users: User[] = [];

  loading = true;

  error = '';


  // Search

  searchTerm = '';


  // Status filter

  statusFilter: 'all' | 'active' | 'inactive' = 'all';


  // Pagination

  currentPage = 1;

  itemsPerPage = 5;


  ngOnInit(): void {

    this.loadUsers();

  }


  loadUsers(): void {

    this.loading = true;

    this.error = '';

    this.userService.getUsers().subscribe({

      next: (users) => {

        this.users = users;

        this.loading = false;

        this.currentPage = 1;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'USERS ERROR:',
          error
        );

        this.error = 'Failed to load users';

        this.loading = false;

        this.toastService.error(
          'Failed to load users.'
        );

        this.cdr.detectChanges();

      }

    });

  }


  // FILTERED USERS

  get filteredUsers(): User[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.users.filter(user => {

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search) ||

        user.email
          .toLowerCase()
          .includes(search);


      const matchesStatus =
        this.statusFilter === 'all' ||

        (
          this.statusFilter === 'active' &&
          user.active
        ) ||

        (
          this.statusFilter === 'inactive' &&
          !user.active
        );


      return matchesSearch && matchesStatus;

    });

  }


  // PAGINATED USERS

  get paginatedUsers(): User[] {

    const start =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    return this.filteredUsers.slice(
      start,
      end
    );

  }


  // TOTAL PAGES

  get totalPages(): number {

    return Math.ceil(
      this.filteredUsers.length /
      this.itemsPerPage
    );

  }


  // PAGE NUMBERS

  get pageNumbers(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }


  // SEARCH

  onSearch(): void {

    this.currentPage = 1;

  }


  // STATUS FILTER

  onStatusFilterChange(): void {

    this.currentPage = 1;

  }


  // CHANGE PAGE

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }

    this.currentPage = page;

  }


  // PREVIOUS PAGE

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }


  // NEXT PAGE

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // ACTIVATE / DEACTIVATE

  toggleUserStatus(user: User): void {

    if (!user.id) {

      return;

    }


    const newStatus =
      !user.active;


    this.userService
      .updateUser(
        user.id,
        {
          active: newStatus
        }
      )
      .subscribe({

        next: (updatedUser) => {

          user.active =
            updatedUser.active;


          if (updatedUser.active) {

            this.toastService.success(
              'User activated successfully.'
            );

          } else {

            this.toastService.success(
              'User deactivated successfully.'
            );

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update user:',
            error
          );

          this.error =
            'Failed to update user status';


          this.toastService.error(
            'Failed to update user status.'
          );


          this.cdr.detectChanges();

        }

      });

  }

}