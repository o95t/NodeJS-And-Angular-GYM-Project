import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'flatted';
import { environment as env } from 'src/environments/environment.development';

import { USER_KEY } from '../constants/keys';
import IGym from '../gyms/types/gym.interface';
import IResponse from '../types/response.interface';
import ISignInBody from '../types/sign-in-body.interface';
import ISignUpBody from '../types/sign-up-body.interface';
import IUser from '../types/user.interface';
import IAcceptFriendRequestBody from '../types/accept-friend-request-body.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  token = signal<string | null>(null);
  user = signal<IUser | null>(null);
  friends = signal<IUser[]>([]);
  requests = signal<IUser[]>([]);
  sentRequests = signal<IUser[]>([]);

  signIn(data: ISignInBody) {
    return this.http.post<IResponse<string>>(
      `${env.SERVER_URL}auth/sign-in`,
      data
    );
  }

  signUp(data: ISignUpBody) {
    return this.http.post<IResponse<string>>(
      `${env.SERVER_URL}auth/sign-up`,
      data
    );
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.token.set(null);
    this.user.set(null);
    this.requests.set([]);
    this.friends.set([]);
    this.router.navigate(['sign-in']);
  }

  saveUser() {
    localStorage.setItem(USER_KEY, stringify(this.user()));
  }

  getRequests() {
    return this.http.get<IResponse<IUser[]>>(
      `${env.SERVER_URL}users/${this.user()?._id}/requests`
    );
  }

  getSentRequests() {
    return this.http.get<IResponse<IUser[]>>(
      `${env.SERVER_URL}users/${this.user()?._id}/sent-requests`
    );
  }

  getFriends() {
    return this.http.get<IResponse<IUser[]>>(
      `${env.SERVER_URL}users/${this.user()?._id}/friends`
    );
  }

  changeAvatar(data: FormData) {
    return this.http.put<IResponse<string>>(
      `${env.SERVER_URL}users/${this.user()?._id}/avatar`,
      data
    );
  }

  sendFriendRequest(user: IUser) {
    return this.http.put<IResponse<unknown>>(
      `${env.SERVER_URL}users/${this.user()?._id}/requests`,
      user
    );
  }

  updateFriendRequest(data: IAcceptFriendRequestBody) {
    return this.http.patch<IResponse<unknown>>(
      `${env.SERVER_URL}users/${this.user()?._id}/requests`,
      data
    );
  }

  joinGym(gym: IGym) {
    return this.http.put<IResponse<unknown>>(
      `${env.SERVER_URL}users/${this.user()?._id}/gyms`,
      gym
    );
  }

  leaveGym(id: string) {
    return this.http.delete<IResponse<unknown>>(
      `${env.SERVER_URL}users/${this.user()?._id}/gyms/${id}`
    );
  }
}
