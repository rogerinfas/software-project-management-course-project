export interface Teacher {
  id: string;
  specialty?: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface Schedule {
  id: string;
  staffId: string;
  course?: { name: string };
}
