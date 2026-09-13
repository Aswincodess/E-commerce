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
  map
} from 'rxjs';

import { Store } from '@ngrx/store';

import { User } from '../models/user.model';

import {
  clearCart,
  loadCart
} from '../../store/carts/cart.actions';

import {
  clearWishlist,
  loadWishlist
} from '../../store/wishlists/wishlists.actions';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private store = inject(Store);

  private apiUrl =
    'http://localhost:3000/users';


  //current user
  currentUser =
    signal<User | null>(null);

  //authenicated
  isAuthenticated =
    computed(() => this.currentUser() !== null);

  // constructor restoring login after refresh
  constructor() {

    const userId =
      localStorage.getItem('userId');

    if (userId) {
      this.restoreUser(userId);
    }

  }

  //Send a POST request to /users and create a new user.
  register(user: User): Observable<User> {

    return this.http.post<User>(
      this.apiUrl,
      user
    );

  }

  //login implementation using filter
  login(
    email: string,
    password: string
  ): Observable<User[]> {

    return this.http.get<User[]>(
      this.apiUrl
    ).pipe(

      map(users =>
        users.filter(
          user =>
            user.email === email &&
            user.password === password
        )
      )

    );

  }


  setUser(user: User): void {  //Used after a successful login.

    // Save ONLY id
    if (user.id) {
      localStorage.setItem(
        'userId',
        user.id
      );
    }

    // Set signal--updating
    this.currentUser.set(user);

    // Load user's cart and wishlist
    if (user.id) {

      this.store.dispatch(
        loadCart({//“The user has logged in. Load the cart belonging to this user.”
          userId: user.id
        })
      );


      this.store.dispatch(
        loadWishlist({//“The user has logged in. Load the wishlist belonging to this user.”
          userId: user.id
        })
      );

    }

  }

  private restoreUser(userId: string): void {  //Used when the application starts again.

    this.http        //Take the stored user ID, find that user from JSON Server,
      .get<User[]>(  //and restore the login state.
        `${this.apiUrl}?id=${encodeURIComponent(userId)}`  //It safely encodes the value before putting it into the URL.
      )
      .subscribe({

        next: (users) => {



          if (users.length === 0) {



            localStorage.removeItem(
              'userId'
            );

            this.currentUser.set(null);

            return;

          }


          const user = users[0];


          // Set REAL user
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

        },

        error: () => {

          console.error(
            'Failed to restore user.'
          );

        }

      });

  }

  //logout 
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