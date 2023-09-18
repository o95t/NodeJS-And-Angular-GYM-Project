import { Component, Input } from '@angular/core';

import IUser from '../types/user.interface';

@Component({
  selector: 'app-user-avatar',
  template: `
    <div class="flex column align-center">
      <img
        [src]="user.avatar || '/assets/images/user.jpg'"
        [alt]="user.fullName"
      />
      <label *ngIf="!isNameHidden">{{ user.fullName | titlecase }}</label>
    </div>
  `,
  styles: [
    `
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    `,
  ],
})
export class UserAvatarComponent {
  @Input({ required: true }) user!: IUser;
  @Input() isNameHidden = false;
}
