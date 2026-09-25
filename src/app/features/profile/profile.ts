import {
  Component,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { Store } from '@ngrx/store';

import { Auth } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast';

import { selectCartCount } from '../../store/carts/cart.selectors';
import { selectWishlistCount } from '../../store/wishlists/wishlists.selectors';


@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    AsyncPipe
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {

  private auth = inject(Auth);

  private userService = inject(UserService);

  private router = inject(Router);

  private store = inject(Store);

  private toastService = inject(ToastService);


  user = this.auth.currentUser;


  cartCount$ =
    this.store.select(selectCartCount);


  wishlistCount$ =
    this.store.select(selectWishlistCount);


  isEditing = signal(false);

  loading = signal(false);


  editName = '';

  editPhone = '';


  startEditing(): void {

    const currentUser = this.user();

    if (!currentUser) {
      return;
    }


    this.editName =
      currentUser.name;

    this.editPhone =
      currentUser.phone;


    this.isEditing.set(true);

  }


  cancelEditing(): void {

    this.isEditing.set(false);

  }


  saveProfile(): void {

    const currentUser =
      this.user();


    if (!currentUser?.id) {

      return;

    }


    const name =
      this.editName.trim();

    const phone =
      this.editPhone.trim();


    if (!name) {

      this.toastService.error(
        'Name is required.'
      );

      return;

    }


    if (!phone) {

      this.toastService.error(
        'Phone number is required.'
      );

      return;

    }


    this.loading.set(true);


    this.userService
      .updateUser(
        currentUser.id,
        {
          name,
          phone
        }
      )
      .subscribe({

        next: (updatedUser) => {

          this.auth.currentUser.set(
            updatedUser
          );

          this.isEditing.set(false);

          this.loading.set(false);


          this.toastService.success(
            'Profile updated successfully.'
          );

        },

        error: () => {

          this.loading.set(false);

          this.toastService.error(
            'Failed to update profile.'
          );

        }

      });

  }


  goToOrders(): void {

    this.router.navigate([
      '/orders'
    ]);

  }


  goToWishlist(): void {

    this.router.navigate([
      '/wishlist'
    ]);

  }


  goToCart(): void {

    this.router.navigate([
      '/cart'
    ]);

  }

}