import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const platformID = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(platformID)) {
    
    // const token = localStorage.getItem('token'); //-> en contexto de navegador
    const token = authService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
  }

  return next(req);
};
