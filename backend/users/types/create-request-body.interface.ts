import { IUser } from "../../models/user.model";
import IRequestBody from "../../types/request-body.interface";

export default interface ICreateRequestBody extends IUser, IRequestBody {}
