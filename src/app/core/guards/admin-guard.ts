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


  if (!userId) {

    return router.createUrlTree([
      '/login'
    ]);

  }


  return auth.restoreUser(userId).pipe(

    switchMap(user => {

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

    catchError(() => {

      localStorage.removeItem('userId');
      localStorage.removeItem('userName');

      return of(
        router.createUrlTree([
          '/login'
        ])
      );

    })

  );

};