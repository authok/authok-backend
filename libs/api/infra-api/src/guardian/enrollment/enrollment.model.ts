export interface Enrollment {
  id: string;
  status: string;
  name: string;
  identifier: string;
  phone_number: string;
  enrolled_at: Date;
  last_auth: Date;
}