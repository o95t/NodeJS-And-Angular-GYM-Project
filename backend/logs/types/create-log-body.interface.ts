import IRequestBody from "../../types/request-body.interface";

export default interface ICreateLogBody extends IRequestBody {
  comment: string;
}
