import UserActivityLogModel from "../models/UserActivityLog";
import { UserActivityLogService } from "../services/UserActivityLogService";

const userActivityLogModel = new UserActivityLogModel();

const userActivityLogService = new UserActivityLogService(userActivityLogModel);

export default userActivityLogService;