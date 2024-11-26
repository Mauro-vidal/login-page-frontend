import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = sessionStorage.getItem('auth-token');

  // Clonar a requisição e adicionar o cabeçalho Authorization
  const clonedReq = authToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
    : req;

  return next(clonedReq);
};
