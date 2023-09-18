import { IUser } from "../../models/user.model";
import IRequestBody from "../../types/request-body.interface";

export default interface IUpdateRequestBody extends IUser, IRequestBody {
  isAccepted: boolean;
}
