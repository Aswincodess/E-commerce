import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router=inject(Router)
  const user = localStorage.getItem('user');

  if(user){
    return true;
  }

  return router.createUrlTree(['/login'])
  
};
