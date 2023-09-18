import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { GymsService } from './services/gyms.service';
import ILog from './types/log.interface';

@Component({
  selector: 'app-add-log',
  template: `
    <form
      class="flex column max-width-450"
      [formGroup]="form"
      (ngSubmit)="handleSubmit()"
    >
      <div class="flex">
        <app-user-avatar class="p-1 mr-2" [user]="authService.user()!" />
        <mat-form-field>
          <textarea
            matInput
            type="text"
            placeholder="Write your log here"
            formControlName="comment"
          ></textarea>
        </mat-form-field>
      </div>
      <div class="flex justify-end">
        <button
          mat-raised-button
          type="submit"
          color="primary"
          [disabled]="form.invalid"
        >
          Log
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class AddLogComponent implements OnDestroy {
  @Input({ required: true }) workoutId!: string;
  @Input({ required: true }) gymId!: string;
  private gymsService = inject(GymsService);
  authService = inject(AuthService);
  form = inject(FormBuilder).nonNullable.group({
    comment: ['', [Validators.required]],
  });
  addLogSub: Subscription | null = null;

  get comment() {
    return this.form.controls.comment;
  }

  handleSubmit() {
    this.addLogSub?.unsubscribe();
    this.addLogSub = this.gymsService
      .addLog(this.gymId, this.workoutId, this.comment.value)
      .subscribe((res) => {
        if (res.success) {
          const temp = [...this.gymsService.activeWorkoutLogs()];
          temp.push({
            _id: res.data,
            comment: this.comment.value,
            createdBy: {
              ...this.authService.user()!,
              userId: this.authService.user()!._id,
            },
          });
          this.comment.setValue('');
          this.gymsService.activeWorkoutLogs.set(temp);
        }
      });
  }

  ngOnDestroy() {
    this.addLogSub?.unsubscribe();
  }
}
