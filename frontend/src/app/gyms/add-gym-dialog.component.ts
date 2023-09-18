import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';

import { GymsService } from './services/gyms.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-gym-dialog',
  template: `
    <form
      class="relative width-300"
      [formGroup]="form"
      (ngSubmit)="handleSubmit()"
    >
      <div class="fixed width-300" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate" />
      </div>
      <h2 mat-dialog-title>Add Gym</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="name" />
          <mat-error *ngIf="name.errors?.['required']">
            Name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <div class="mb-1">
          <label>Image</label>
          <div class="mt-1">
            <button
              mat-raised-button
              type="button"
              color="primary"
              (click)="fileInput.click()"
              (blur)="handleImageBlur()"
            >
              Choose File
            </button>
          </div>
          <label class="mt-1 one-line" *ngIf="image">{{ image }}</label>
          <mat-error class="mt-1" *ngIf="error">
            {{ error }}
          </mat-error>
          <input
            hidden
            #fileInput
            type="file"
            accept="image/*"
            (change)="handleImageChange($event)"
          />
        </div>
      </mat-dialog-content>
      <mat-divider />
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || isLoading"
        >
          Add
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      mat-dialog-content,
      mat-progress-bar {
        max-width: 300px;
      }
    `,
  ],
})
export class AddGymDialogComponent implements OnDestroy {
  private dialog = inject(MatDialogRef);
  private gymsService = inject(GymsService);
  private authService = inject(AuthService);
  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
  });
  isLoading = false;
  error = '';
  image = '';
  imageSource: File | null = null;
  addGymSub: Subscription | null = null;

  get name() {
    return this.form.controls.name;
  }

  handleImageBlur() {
    if (this.imageSource === null) {
      this.error = 'Image is required!';
    }
  }

  handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.image = target.files[0].name;
      this.imageSource = target.files[0];
      this.error = '';
    }
  }

  handleSubmit() {
    this.error = '';
    const formData = new FormData();
    formData.append('name', this.form.controls.name.value);
    formData.append('image', this.imageSource!, this.image);
    this.addGymSub?.unsubscribe();
    this.addGymSub = this.gymsService
      .addGym(formData)
      .pipe(
        catchError((e) => {
          this.error = e.error.data;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          const temp = [...this.gymsService.gyms()];
          temp.push(res.data);
          this.gymsService.gyms.set(temp);
          this.dialog.close();
          const userGyms = [...this.authService.user()!.gyms];
          userGyms.push(res.data);
          this.authService.user.set({
            ...this.authService.user()!,
            gyms: userGyms,
          });
          this.authService.saveUser();
        }
      });
  }

  ngOnDestroy() {
    this.addGymSub?.unsubscribe();
  }
}
