import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    CommonModule,
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // Registra o interceptor aqui
    ),
    provideAnimationsAsync(),
    importProvidersFrom(
      FormsModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatTableModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule
    ),
  ],
};