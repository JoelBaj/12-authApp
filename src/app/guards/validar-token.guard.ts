import {  CanActivate, CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) { 

  }
  
  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarToken()
      .pipe(
        tap(valid => {
          if (!valid) {
            this.router.navigateByUrl('/auth')
          }
        })
      );
  }
  canLoad(): Observable<boolean> | boolean {
    return this.authService.validarToken()
    .pipe(
        tap(valid => {
          if (!valid) {
            this.router.navigateByUrl('/auth')
          }
        })
      );
  }
}
