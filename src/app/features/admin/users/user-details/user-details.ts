import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

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

  user: User | null = null;

  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'User ID not found';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.userService.getUserById(id).subscribe({

      next: (user) => {

        console.log('USER DETAILS:', user);

        this.user = user;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'USER DETAILS ERROR:',
          error
        );

        this.error = 'Failed to load user details';
        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }

  toggleUserStatus(): void {

    if (!this.user?.id) {
      return;
    }

    const newStatus = !this.user.active;

    this.userService
      .updateUser(this.user.id, {
        active: newStatus
      })
      .subscribe({

        next: (updatedUser) => {

          this.user = updatedUser;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'FAILED TO UPDATE USER:',
            error
          );

          this.error =
            'Failed to update user status';

          this.cdr.detectChanges();
        }

      });
  }

}