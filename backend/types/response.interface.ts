export default interface IResponse<T> {
  success: boolean;
  data: T;
}
