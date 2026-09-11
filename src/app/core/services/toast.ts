import { Injectable,signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<Toast | null>(null);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success') {

    this.toast.set({
      message,
      type
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.toast.set(null);
    }, 2000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  clear() {
    this.toast.set(null);
  }
}
