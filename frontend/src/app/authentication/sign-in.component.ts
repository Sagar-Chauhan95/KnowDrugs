import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

import { IUser } from '../types/user.types';
import { AuthenticationService } from './authentication.service';
import { IState } from '../types/state.types';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="container">
      <div class="title">SignIn</div>
      <form class="example-form" [formGroup]="form" (ngSubmit)="signIn()" >
        <mat-form-field class="example-full-width">
          <mat-label>Email</mat-label>
          <input
            type="email"
            matInput
            formControlName="email"
            placeholder="Enter your email"
          />
          <br />
          @if(email.invalid && email.touched && email.dirty ){
             @if(email.errors?.['email']) {
          <mat-error>Please enter a valid email address</mat-error>
          } @if (email.errors?.['required']) {
          <mat-error>Email is <strong>required</strong></mat-error>
          } }
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <input
            type="password"
            matInput
            formControlName="password"
            placeholder="Enter your password"
          />
          @if (password.errors?.['required']) {
          <mat-error>Password is <strong>required</strong></mat-error>
          }
         
        </mat-form-field>
        <br />

        <button type="submit" [disabled]="form.invalid">SignIn</button>
      </form>

      <div class="bottom">
        <p>------OR------</p>
        <span>Create an Account ? &nbsp; </span>
        <a [routerLink]="['', 'signup']">Sign Up</a>
      </div>
    </div>
  `,
  styleUrl: './signin.css',
})
export class SignInComponent {
  readonly #authService = inject(AuthenticationService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  signIn() {
    this.#authService
      .signIn(this.form.value as { email: string; password: string; })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const decoded_token: IState = jwtDecode(response.data);
            this.#authService.$state.set({
              _id: decoded_token._id,
              fullname: decoded_token.fullname,
              email: decoded_token.email,
              jwt: response.data,
            });

            this.#router.navigate([ '', 'medicines' ]);
          }
        },

        error: (error) => {
          this.#toastr.error('Invalid Useername or Password');
        },
      });
  }
}
