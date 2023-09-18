import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';

import { GymsService } from './services/gyms.service';
import IGym from './types/gym.interface';

@Component({
  selector: 'app-add-workout-dialog',
  template: `
    <form
      class="relative width-300"
      [formGroup]="form"
      (ngSubmit)="handleSubmit()"
    >
      <div class="fixed width-300" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate" />
      </div>
      <h2 mat-dialog-title>Add Workout</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="name" />
          <mat-error *ngIf="name.errors?.['required']">
            Name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            type="text"
            formControlName="description"
          ></textarea>
          <mat-error *ngIf="description.errors?.['required']">
            Description is <strong>required</strong>
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
          <mat-checkbox class="mt-1" color="primary" formControlName="isActive"
            >Set as active workout</mat-checkbox
          >
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

      textarea {
        height: 100px;
      }
    `,
  ],
})
export class AddWorkoutDialogComponent implements OnDestroy {
  private dialog = inject(MatDialogRef);
  private gymsService = inject(GymsService);
  data: IGym = inject(MAT_DIALOG_DATA);
  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    isActive: false,
  });
  isLoading = false;
  error = '';
  image = '';
  imageSource: File | null = null;
  addWorkoutSub: Subscription | null = null;

  get name() {
    return this.form.controls.name;
  }

  get description() {
    return this.form.controls.description;
  }

  get isActive() {
    return this.form.controls.isActive;
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
    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    formData.append('isActive', this.isActive.value.toString());
    formData.append('image', this.imageSource!, this.image);
    this.addWorkoutSub?.unsubscribe();
    this.addWorkoutSub = this.gymsService
      .addWorkout(this.data._id, formData)
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
          const temp = [...this.data.workouts];
          const workout = {
            _id: res.data._id,
            name: this.name.value,
            description: this.description.value,
            image: res.data.image,
            logs: [],
          };
          temp.push(workout);
          this.data.workouts = temp;
          if (this.isActive.value) {
            this.data.activeWorkout = workout;
          }
          this.dialog.close();
        }
      });
  }

  ngOnDestroy() {
    this.addWorkoutSub?.unsubscribe();
  }
}
