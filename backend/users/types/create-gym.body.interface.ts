import { IGym } from "../../models/gym.model";
import IRequestBody from "../../types/request-body.interface";

export default interface ICreateGymBody extends IGym, IRequestBody {}
