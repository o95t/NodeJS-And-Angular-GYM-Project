import IRequestParams from "./request-params.interface";

export default interface IDeleteGymParams extends IRequestParams {
  gymId: string;
}
