import IUser from 'src/app/types/user.interface';
import ICreatedBy from './created-by.interface';
import IWorkout from './workout.interface';

export default interface IGym {
  _id: string;
  name: string;
  image: string;
  createdBy?: ICreatedBy;
  members: IUser[];
  activeWorkout?: IWorkout;
  workouts: IWorkout[];
}
