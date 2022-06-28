export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface UserInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
}
