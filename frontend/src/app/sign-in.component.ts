import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { stringify } from 'flatted';
import jwtDecode from 'jwt-decode';
import { catchError, Subscription, throwError } from 'rxjs';

import { TOKEN_KEY, USER_KEY } from './constants/keys';
import { AuthService } from './services/auth.service';
import ISignInBody from './types/sign-in-body.interface';
import IUser from './types/user.interface';

@Component({
  selector: 'app-sign-in',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div class="flex justify-center screen-margin pb-4">
      <mat-card class="form-container">
        <mat-card-content>
          <form
            class="flex column"
            [formGroup]="form"
            (ngSubmit)="handleSubmit()"
          >
            <mat-form-field class="mb-1">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Ex. pat@example.com"
              />
              <mat-error
                *ngIf="email.errors?.['email'] && !email.errors?.['required']"
              >
                Please enter a valid <strong>email address</strong>
              </mat-error>
              <mat-error *ngIf="email.errors?.['required']">
                Email is <strong>required</strong>
              </mat-error>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
              <mat-error
                *ngIf="password.errors?.['minlength'] && !password.errors?.['required']"
              >
                The minimum length for the password is <strong>6</strong>
              </mat-error>
              <mat-error *ngIf="password.errors?.['required']">
                Password is <strong>required</strong>
              </mat-error>
            </mat-form-field>
            <mat-checkbox color="primary" formControlName="isRemember"
              >Remember me</mat-checkbox
            >
            <div class="flex justify-center">
              <mat-error *ngIf="error">
                {{ error }}
              </mat-error>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            [disabled]="form.invalid || isLoading"
            mat-raised-button
            color="primary"
            type="submit"
            (click)="handleSubmit()"
          >
            Sign in
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [``],
})
export class SignInComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private title = inject(Title);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isRemember: false,
  });
  isLoading = false;
  error = '';
  signInSub: Subscription | null = null;

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  constructor() {
    this.title.setTitle('Sign in');
  }

  handleSubmit() {
    const { isRemember, ...values } = this.form.value;
    this.signInSub?.unsubscribe();
    this.error = '';
    this.isLoading = true;
    this.signInSub = this.authService
      .signIn(values as ISignInBody)
      .pipe(
        catchError((e) => {
          this.error = e.error.data;
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        const user = jwtDecode(res.data) as IUser;
        const storage = isRemember ? localStorage : sessionStorage;
        this.authService.token.set(res.data);
        this.authService.user.set(user);
        this.isLoading = false;
        storage.setItem(TOKEN_KEY, res.data);
        storage.setItem(USER_KEY, stringify(user));
        this.authService.getFriends().subscribe((res) => {
          if (res.success) {
            this.authService.friends.set(res.data);
          }
        });
        this.authService.getRequests().subscribe((res) => {
          if (res.success) {
            this.authService.requests.set(res.data);
          }
        });
        this.authService.getSentRequests().subscribe((res) => {
          if (res.success) {
            this.authService.sentRequests.set(res.data);
          }
        });
        this.router.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.signInSub?.unsubscribe();
  }
}
