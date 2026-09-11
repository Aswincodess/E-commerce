import { Component,inject } from '@angular/core';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class Toast {
  protected toastservice = inject(ToastService);
}
