import { UserRole } from '../auth/user-role.enum';


export class User {
  id: string;
  username: string;
  password: string; // hash
  role: UserRole
  cnic: string; // Add CNIC as a unique identifier
}