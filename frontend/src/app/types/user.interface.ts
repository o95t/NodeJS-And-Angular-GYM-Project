import IGym from '../gyms/types/gym.interface';

export default interface IUser {
  _id: string;
  userId?: string;
  fullName: string;
  email: string;
  gyms: IGym[];
  avatar?: string;
  sentRequests: IUser[];
}
