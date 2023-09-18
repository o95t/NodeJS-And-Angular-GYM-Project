import { Component, Input, inject } from '@angular/core';
import IGym from './types/gym.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gym-card',
  template: `
    <mat-card>
      <mat-card-content>
        <a [routerLink]="['', 'gyms', gym._id]"
          ><img [src]="gym.image" alt="gym" />
        </a>

        <div class="flex align-center justify-between capitalize mt-3">
          <div class="flex column">
            <h3>{{ gym.name | titlecase }}</h3>
            <label class="info">Members ({{ gym.members.length }})</label>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="this.router.navigate(['gyms', gym._id])"
          >
            View
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: 250px;
      }

      img {
        width: 100%;
        height: 150px;
        object-fit: contain;
      }

      @media screen and (max-width: 480px) {
        mat-card {
          width: 100%;
        }
      }
    `,
  ],
})
export class GymCardComponent {
  @Input({ required: true }) gym!: IGym;
  router = inject(Router);
}
