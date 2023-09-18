import { IUser } from "../../models/user.model";
import IRequestBody from "../../types/request-body.interface";

export default interface ICreateMemberBody extends IUser, IRequestBody {}
