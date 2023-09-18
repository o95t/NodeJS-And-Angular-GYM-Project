import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment.development';

import IResponse from '../types/response.interface';
import IUser from '../types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  getFriends(id: string) {
    return this.http.get<IResponse<IUser[]>>(
      `${env.SERVER_URL}users/${id}/friends`
    );
  }
}
