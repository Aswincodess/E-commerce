import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/users';

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users =>
        users.filter(
          user =>
            user.email === email &&
            user.password === password
        )
      )
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}