import {
  Injectable,
  inject,
  signal,
  computed
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  map,
  switchMap,
  throwError,
  tap
} from 'rxjs';

import { Store } from '@ngrx/store';

import { User } from '../../models/user.model';

import {
  clearCart,
  loadCart
} from '../../../store/carts/cart.actions';

import {
  clearWishlist,
  loadWishlist
} from '../../../store/wishlists/wishlists.actions';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private store = inject(Store);

  private apiUrl =
    'http://localhost:3000/users';


  // Current user
  currentUser =
    signal<User | null>(null);


  // Authenticated
  isAuthenticated =
    computed(() => this.currentUser() !== null);


  // Constructor restoring login after refresh
  constructor() {

    const userId =
      localStorage.getItem('userId');

    if (userId) {

      this.restoreUser(userId).subscribe();

    }

  }


  // Register
  register(user: User): Observable<User> {

    return this.http
      .get<User[]>(
        `${this.apiUrl}?email=${encodeURIComponent(user.email)}`
      )
      .pipe(

        switchMap(users => {

          // Email already exists
          if (users.length > 0) {

            return throwError(() => ({
              status: 409,
              message: 'Email already exists'
            }));

          }

          // Email does not exist
          return this.http.post<User>(
            this.apiUrl,
            user
          );

        })

      );

  }


  // Login
  login(
    email: string,
    password: string
  ): Observable<User[]> {

    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(

        map(users =>
          users.filter(
            user =>
              user.email === email &&
              user.password === password
          )
        )

      );

  }


  // Set user after successful login
  setUser(user: User): void {

    // Save ONLY ID
    if (user.id) {

      localStorage.setItem(
        'userId',
        user.id
      );

    }


    // Update current user
    this.currentUser.set(user);


    // Load cart + wishlist
    if (user.id) {

      this.store.dispatch(
        loadCart({
          userId: user.id
        })
      );

      this.store.dispatch(
        loadWishlist({
          userId: user.id
        })
      );

    }

  }


  // Restore user after browser refresh
  restoreUser(userId: string): Observable<User | null> {

    return this.http
      .get<User[]>(
        `${this.apiUrl}?id=${encodeURIComponent(userId)}`
      )
      .pipe(

        map(users =>
          users.length > 0
            ? users[0]
            : null
        ),

        tap(user => {

          // Invalid stored user
          if (!user) {

            localStorage.removeItem('userId');

            this.currentUser.set(null);

            return;

          }


          // Restore real user
          this.currentUser.set(user);


          // Restore cart + wishlist
          if (user.id) {

            this.store.dispatch(
              loadCart({
                userId: user.id
              })
            );

            this.store.dispatch(
              loadWishlist({
                userId: user.id
              })
            );

          }

        })

      );

  }


  // Logout
  logout(): void {

    localStorage.removeItem(
      'userId'
    );

    this.currentUser.set(null);

    this.store.dispatch(
      clearCart()
    );

    this.store.dispatch(
      clearWishlist()
    );

  }

}