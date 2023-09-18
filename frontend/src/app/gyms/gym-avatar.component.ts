import { Component, Input } from '@angular/core';
import IGym from './types/gym.interface';

@Component({
  selector: 'app-gym-avatar',
  template: `
    <a [routerLink]="['', 'gyms', gym._id]">
      <div class="flex column align-center">
        <img class="mb-1" [src]="gym.image" [alt]="gym.name" />
        <h4>{{ gym.name | titlecase }}</h4>
      </div>
    </a>
  `,
  styles: [
    `
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    `,
  ],
})
export class GymAvatarComponent {
  @Input({ required: true }) gym!: IGym;
}
