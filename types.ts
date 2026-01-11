
export enum UserRole {
  DOCTOR = 'DOCTOR',
  DIRECTOR = 'DIRECTOR',
  MINISTRY = 'MINISTRY',
  ADMIN = 'ADMIN',
  CITIZEN = 'CITIZEN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  facility?: string;
  region?: string;
  cin?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  facility: string;
}

export interface Feedback {
  id: string;
  citizenName: string;
  facility: string;
  rating: number;
  comment: string;
  date: string;
}
