import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from './authentication.service';
import { IUser } from '../types/user.types';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule ],
  template: `
   <div class="container">
      <div class="title">SignUp</div>
      <form class="example-form" [formGroup]="form"  (ngSubmit)="signUp()">
        <mat-form-field class="example-full-width">
        <input
            type="text"
            matInput
            formControlName="fullname"
            placeholder="Enter your fullname"
          />
          @if(fullname.touched){
            @if(fullname.hasError('required')){
              <mat-error>Fullname is required</mat-error>
          }

          }
          
        </mat-form-field>

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

        <button type="submit" [disabled]="form.invalid">SignUp</button>
      </form>

      <div class="bottom">
        <p>------OR------</p>
        <span>Already have an Account ? &nbsp; </span>
        <a [routerLink]="['', 'signin']">SignIn</a>
      </div>
    </div>
  `,
  styleUrl: './signin.css'
})
export class SignUpComponent {
  readonly #authService = inject(AuthenticationService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    fullname: [ '', Validators.required ],
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ]

  });

  get fullname() {
    return this.form.controls.fullname;
  }

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }

  signUp() {
    this.#authService.signUp(this.form.value as IUser).subscribe(response => {
      if (response.success) {
        this.#toastr.success("SignUp Successfull");
        this.#router.navigate([ 'signin' ]);

      } else {
        this.#toastr.error("SignUp Unsuccessfull");
      }
    });

  }




}
