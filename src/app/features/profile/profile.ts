
import {
  Component,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { Auth } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { ToastService } from '../../core/services/toast/toast';

import { selectCartCount } from '../../store/carts/cart.selectors';
import { selectWishlistCount } from '../../store/wishlists/wishlists.selectors';
import { AsyncPipe } from '@angular/common';

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

  uploadingPhoto = signal(false);
  isAddressEditing = signal(false);

  address = {
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  };


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


    this.userService.updateUser(String(currentUser.id), { name, phone })
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


  changeProfilePhoto(
    event: Event
  ): void {

    const currentUser =
      this.user();

    if (!currentUser?.id) {
      return;
    }


    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file) {
      return;
    }


    if (!file.type.startsWith('image/')) {

      this.toastService.error(
        'Please select an image file.'
      );

      return;

    }


    if (file.size > 2 * 1024 * 1024) {

      this.toastService.error(
        'Image size must be less than 2 MB.'
      );

      return;

    }


    this.uploadingPhoto.set(true);


    const reader =
      new FileReader();


    reader.onload = () => {

      const profileImage =
        reader.result as string;


      this.userService.updateUser(String(currentUser.id), { profileImage })
        .subscribe({

          next: (updatedUser) => {

            this.auth.currentUser.set(
              updatedUser
            );

            this.uploadingPhoto.set(false);


            this.toastService.success(
              'Profile photo updated.'
            );

          },

          error: () => {

            this.uploadingPhoto.set(false);

            this.toastService.error(
              'Failed to update profile photo.'
            );

          }

        });

    };


    reader.onerror = () => {

      this.uploadingPhoto.set(false);

      this.toastService.error(
        'Failed to read image.'
      );

    };


    reader.readAsDataURL(file);

  }


  removeProfilePhoto(): void {

    const currentUser =
      this.user();

    if (!currentUser?.id) {
      return;
    }


    this.uploadingPhoto.set(true);


    this.userService
      .updateUser(
        currentUser.id,
        {
          profileImage: ''
        }
      )
      .subscribe({

        next: (updatedUser) => {

          this.auth.currentUser.set(
            updatedUser
          );

          this.uploadingPhoto.set(false);


          this.toastService.success(
            'Profile photo removed.'
          );

        },

        error: () => {

          this.uploadingPhoto.set(false);

          this.toastService.error(
            'Failed to remove profile photo.'
          );

        }

      });

  }

  
  startAddressEditing(): void {

    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    this.address = {
      house: currentUser.address?.house || '',
      street: currentUser.address?.street || '',
      city: currentUser.address?.city || '',
      state: currentUser.address?.state || '',
      pincode: currentUser.address?.pincode || ''
    };

    this.isAddressEditing.set(true);
  }


  saveAddress(): void {

    const currentUser = this.user();

    if (!currentUser?.id) {
      return;
    }

    const address = {
      house: this.address.house.trim(),
      street: this.address.street.trim(),
      city: this.address.city.trim(),
      state: this.address.state.trim(),
      pincode: this.address.pincode.trim()
    };

    if (
      !address.house ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {

      this.toastService.error(
        'Please fill all address fields.'
      );

      return;
    }

    if (address.pincode.length !== 6) {

      this.toastService.error(
        'Please enter a valid 6-digit pincode.'
      );

      return;
    }

    this.loading.set(true);

    this.userService
      .updateUser(
        String(currentUser.id),
        { address }
      )
      .subscribe({

        next: (updatedUser) => {

          this.auth.currentUser.set(
            updatedUser
          );

          this.isAddressEditing.set(false);

          this.loading.set(false);

          this.toastService.success(
            'Address saved successfully.'
          );

        },

        error: () => {

          this.loading.set(false);

          this.toastService.error(
            'Failed to save address.'
          );

        }

      });
  }


  cancelAddressEditing(): void {

    this.isAddressEditing.set(false);

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

