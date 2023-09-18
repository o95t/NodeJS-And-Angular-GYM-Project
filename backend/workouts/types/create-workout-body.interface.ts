import IRequestBody from "../../types/request-body.interface";

export default interface ICreateWorkoutBody extends IRequestBody {
  name: string;
  description: string;
  isActive?: boolean;
}
