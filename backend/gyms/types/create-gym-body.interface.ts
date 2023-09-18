import IRequestBody from "../../types/request-body.interface";

export default interface ICreateGymBody extends IRequestBody {
  name: string;
}
