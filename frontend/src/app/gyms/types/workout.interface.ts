import ILog from './log.interface';

export default interface IWorkout {
  _id: string;
  name: string;
  description: string;
  image: string;
  logs: ILog[];
}
