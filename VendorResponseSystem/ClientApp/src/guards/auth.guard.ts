import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Check if the user is logged in

    if (isLoggedIn) {
      return true; // User is authenticated
    } else {
      this.router.navigate(['/login']); // Redirect to the login page
      return false;
    }
  }
}
