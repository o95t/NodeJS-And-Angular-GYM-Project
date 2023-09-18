import IUser from './user.interface';

export default interface IAcceptFriendRequestBody extends IUser {
  isAccepted: boolean;
}
