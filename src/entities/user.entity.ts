export class User {
  id: string;
  username: string;
  password: string; // hash
  role: 'teacher' | 'student';
  cnic: string; // Add CNIC as a unique identifier
}
