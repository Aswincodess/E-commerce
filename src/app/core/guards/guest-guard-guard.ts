import {
  CanActivateFn,
  Router
} from '@angular/router';

import { inject } from '@angular/core';

import {
  of,
  catchError,
  map
} from 'rxjs';

import { Auth } from '../services/auth/auth.service';


export const guestGuard: CanActivateFn = () => {

  const router =
    inject(Router);

  const auth =
    inject(Auth);


  const userId =
    localStorage.getItem('userId');


  // No logged-in user
  // Allow login/register

  if (!userId) {

    return true;

  }


  return auth
    .restoreUser(userId)
    .pipe(

      map(user => {

        if (!user) {

          localStorage.removeItem(
            'userId'
          );

          localStorage.removeItem(
            'userName'
          );

          return true;

        }


        // Admin

        if (user.role === 'admin') {

          return router.createUrlTree([
            '/admin/dashboard'
          ]);

        }


        // Normal user

        return router.createUrlTree([
          '/home'
        ]);

      }),


      catchError(() => {

        localStorage.removeItem(
          'userId'
        );

        localStorage.removeItem(
          'userName'
        );

        return of(true);

      })

    );

};