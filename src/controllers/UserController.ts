import { userManager } from '../managers/userManager';

class UserService {
  public static async getUsers() {
    const users = await userManager.getAllUsers();
    return users;
  }
}

export default UserService;
