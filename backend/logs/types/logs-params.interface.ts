import IGymParams from "../../gyms/types/gym-params.interface";

export default interface ILogParams extends IGymParams {
  workoutId: string;
  logId: string;
}
