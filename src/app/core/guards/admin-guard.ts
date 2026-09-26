import {
  CanActivateFn,
  Router
} from '@angular/router';

import { inject } from '@angular/core';

import {
  of,
  switchMap,
  catchError
} from 'rxjs';

import { Auth } from '../services/auth/auth.service';


export const adminGuard: CanActivateFn = () => {

  const auth = inject(Auth);
  const router = inject(Router);

  const userId =
    localStorage.getItem('userId');

  console.log('Guard userId:', userId);

  if (!userId) {
    return router.createUrlTree([
      '/login'
    ]);
  }

  return auth.restoreUser(userId).pipe(

    switchMap(user => {

      console.log('Guard restored user:', user);

      if (!user) {
        return of(
          router.createUrlTree([
            '/login'
          ])
        );
      }

      if (user.role !== 'admin') {
        return of(
          router.createUrlTree([
            '/home'
          ])
        );
      }

      return of(true);
    }),

    // ...
  );

};