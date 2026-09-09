import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {

  const router = inject(Router);

  const user = localStorage.getItem('user');

  if (user) {
    return router.createUrlTree(['/home']);
  }

  return true;
};