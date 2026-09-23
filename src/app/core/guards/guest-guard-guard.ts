import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {

  const router = inject(Router);

  const userId = localStorage.getItem('userId');

  if (userId) {
    return router.createUrlTree(['/home']);
  }

  return true;
};