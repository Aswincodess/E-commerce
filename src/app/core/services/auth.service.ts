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


  // ==========================================
  // CURRENT USER
  // ==========================================

  currentUser =
    signal<User | null>(null);


  // ==========================================
  // AUTHENTICATED
  // ==========================================

  isAuthenticated =
    computed(() => this.currentUser() !== null);


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    const userName =
      localStorage.getItem('userName');

    if (userName) {

      this.restoreUser(userName);

    }

  }


  // ==========================================
  // REGISTER
  // ==========================================

  register(user: User): Observable<User> {

    return this.http.post<User>(
      this.apiUrl,
      user
    );

  }


  // ==========================================
  // LOGIN
  // ==========================================

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


  // ==========================================
  // SET USER
  // ==========================================

  setUser(user: User): void {

   


    // Save ONLY name
    localStorage.setItem(
      'userName',
      user.name
    );


    // Set signal
    this.currentUser.set(user);


    


    // Load user's cart and wishlist
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


  // ==========================================
  // RESTORE USER
  // ==========================================

  private restoreUser(name: string): void {

   


    this.http
      .get<User[]>(
        `${this.apiUrl}?name=${encodeURIComponent(name)}`
      )
      .subscribe({

        next: (users) => {

        

          if (users.length === 0) {

            

            localStorage.removeItem(
              'userName'
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


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      'userName'
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