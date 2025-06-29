import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the expected role from the route data
  const expectedRole = route.data['expectedRole'];
  let currentUser = null;

  // Check for user in the service first
  authService.user$.subscribe(user => {
    currentUser = user;
  });

  // If service doesn't have it, try localStorage (e.g., after a page refresh)
  if (!currentUser) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }

  // Check if user exists and has the correct role
  if (currentUser && currentUser.role === expectedRole) {
    return true; // User is authenticated and has the correct role, allow access
  }

  // If not, redirect to login page
  router.navigate(['/login']);
  return false;
};
