import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

    const router = inject(Router);
    const userService = inject(UserService);

    const userId = localStorage.getItem('userId');

    if (!userId) {
        return router.createUrlTree(['/login']);
    }

    return userService.getUserById(userId).pipe(

        map(user => {

            if (user.active) {
                return true;
            }

            localStorage.removeItem('userId');
            localStorage.removeItem('userName');

            return router.createUrlTree(['/login']);
        }),

        catchError(() => {

            localStorage.removeItem('userId');
            localStorage.removeItem('userName');

            return of(router.createUrlTree(['/login']));
        })

    );
};