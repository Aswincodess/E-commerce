import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({

      next: (users) => {

        console.log('USERS RECEIVED:', users);

        this.users = users;
        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('USERS ERROR:', error);

        this.error = 'Failed to load users';
        this.loading = false;

        this.cdr.detectChanges();

      }

    });
  }

  toggleUserStatus(user: User): void {

    if (!user.id) {
      return;
    }

    const newStatus = !user.active;

    this.userService.updateUser(user.id, {
      active: newStatus
    }).subscribe({

      next: (updatedUser) => {

        user.active = updatedUser.active;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to update user:', error);

        this.error = 'Failed to update user status';

        this.cdr.detectChanges();

      }

    });
  }
}