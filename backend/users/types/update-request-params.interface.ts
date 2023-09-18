import IRequestParams from "./request-params.interface";

export default interface IUpdateRequestParams extends IRequestParams {
  requestId: string;
}
