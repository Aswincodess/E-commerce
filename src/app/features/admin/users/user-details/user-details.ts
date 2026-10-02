import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user.model';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetailsComponent {

  private route = inject(ActivatedRoute);

  private userService = inject(UserService);

  private cdr = inject(ChangeDetectorRef);

  private toastService = inject(ToastService);


  user: User | null = null;

  loading = true;

  error = '';


  ngOnInit(): void {

    this.loadUser();

  }


  loadUser(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.error =
        'User ID not found';

      this.loading = false;

      this.cdr.detectChanges();

      return;

    }


    this.userService
      .getUserById(id)
      .subscribe({

        next: (user) => {

          console.log(
            'USER DETAILS:',
            user
          );

          this.user = user;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'USER DETAILS ERROR:',
            error
          );

          this.error =
            'Failed to load user details';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ACTIVATE / DEACTIVATE

  toggleUserStatus(user: User): void {

    if (!user.id) {

      return;

    }


    // Admin accounts cannot be deactivated

    if (user.role === 'admin') {

      this.toastService.error(
        'Admin accounts cannot be deactivated.'
      );

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