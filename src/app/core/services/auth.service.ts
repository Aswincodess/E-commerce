import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/users';

  // Current logged-in user
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Observable for components like Navbar
  currentUser$ = this.currentUserSubject.asObservable();

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

  setUser(user: User): void {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');

    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}