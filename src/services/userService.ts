import { api } from 'src/services/api';

class UserService {
  async getCurrentUser(): Promise<any> {
    const response = await api.get('/api/users/current');
    return response.data;
  }
}

export const userService = new UserService();
