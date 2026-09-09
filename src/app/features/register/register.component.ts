import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Auth } from '../../core/services/auth.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {

  private auth = inject(Auth);
  private router = inject(Router);


  registerForm = new FormGroup({

    name: new FormControl('', [
      Validators.required
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });


  submit() {

    // Check validation
    if (this.registerForm.invalid) {

      // Show validation messages
      this.registerForm.markAllAsTouched();

      return;
    }


    const user = {

      name: this.registerForm.value.name!,

      email: this.registerForm.value.email!,

      password: this.registerForm.value.password!,

      role: 'user' as const

    };


    this.auth.register(user).subscribe({

      next: () => {

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.log(
          'registration failed',
          error
        );

      }

    });

  }

}