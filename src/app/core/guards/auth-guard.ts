import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const userName = localStorage.getItem('userName');

  if (userName) {
    return true;
  }

  return router.createUrlTree(['/login']);
};