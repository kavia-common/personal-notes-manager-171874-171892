/**
 * HttpErrorInterceptor
 * Catches backend errors and maps them to readable messages.
 */
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotesStore } from '../state/notes.store';

// PUBLIC_INTERFACE
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(NotesStore);

  return next(req).pipe({
    error: (err: unknown) => {
      let message = 'An unexpected error occurred.';
      if (err instanceof HttpErrorResponse) {
        if (err.error?.message) {
          message = err.error.message;
        } else if (typeof err.error === 'string') {
          message = err.error;
        } else if (err.status) {
          message = `Request failed (${err.status})`;
        }
      }
      // Avoid global timers for SSR/lint; schedule microtask via Promise
      Promise.resolve().then(() => store.setError(message));
      throw err;
    }
  } as any);
};
