import IUser from 'src/app/types/user.interface';

export default interface ILog {
  _id: string;
  comment: string;
  createdBy: IUser;
}
