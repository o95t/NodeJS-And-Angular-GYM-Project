import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import IUser from 'src/app/types/user.interface';
import { environment as env } from 'src/environments/environment.development';

import IResponse from '../../types/response.interface';
import IGym from '../types/gym.interface';
import ILog from '../types/log.interface';
import IWorkout from '../types/workout.interface';

@Injectable({
  providedIn: 'root',
})
export class GymsService {
  private http = inject(HttpClient);
  gyms = signal<IGym[]>([]);
  activeWorkoutLogs = signal<ILog[]>([]);

  addGym(data: FormData) {
    return this.http.post<IResponse<IGym>>(`${env.SERVER_URL}gyms`, data);
  }

  addWorkout(id: string, data: FormData) {
    return this.http.post<IResponse<{ _id: string; image: string }>>(
      `${env.SERVER_URL}gyms/${id}/workouts`,
      data
    );
  }

  getGyms() {
    return this.http.get<IResponse<IGym[]>>(`${env.SERVER_URL}gyms`);
  }

  getGym(id: string) {
    return this.http.get<IResponse<IGym>>(`${env.SERVER_URL}gyms/${id}`);
  }

  getMembers(id: string) {
    return this.http.get<IResponse<IUser[]>>(`${env.SERVER_URL}/${id}/members`);
  }

  getWorkouts(id: string) {
    return this.http.get<IResponse<IWorkout[]>>(
      `${env.SERVER_URL}/${id}/workouts`
    );
  }

  getActiveWorkout(id: string) {
    return this.http.get<IResponse<IWorkout | null>>(
      `${env.SERVER_URL}gyms/${id}/active-workout`
    );
  }

  addLog(gymId: string, workoutId: string, comment: string) {
    return this.http.post<IResponse<string>>(
      `${env.SERVER_URL}gyms/${gymId}/workouts/${workoutId}/logs`,
      { comment }
    );
  }

  deleteLog(gymId: string, workoutId: string, logId: string) {
    return this.http.delete<IResponse<unknown>>(
      `${env.SERVER_URL}gyms/${gymId}/workouts/${workoutId}/logs/${logId}`
    );
  }

  setActiveWorkout(gymId: string, workoutId: string) {
    return this.http.put<IResponse<unknown>>(`${env.SERVER_URL}gyms/${gymId}`, {
      _id: workoutId,
    });
  }

  deleteGym(id: string) {
    return this.http.delete<IResponse<unknown>>(`${env.SERVER_URL}gyms/${id}`);
  }
}
