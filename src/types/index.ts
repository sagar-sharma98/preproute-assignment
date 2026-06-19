export type Difficulty = 'easy' | 'medium' | 'difficult';
export type TestStatus = 'draft' | 'live' | 'unpublished' | 'scheduled' | 'expired' | null;

export interface ApiResponse<T> {
  success?: boolean;
  status?: 'success' | 'error' | string;
  data: T;
  message?: string;
}

export interface User {
  id?: string;
  name?: string;
  userId?: string;
  role?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id?: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id?: string;
}

export interface TestSummary {
  id: string;
  name: string;
  subject?: string | Subject;
  topics?: string[] | Topic[];
  sub_topics?: string[] | SubTopic[];
  status?: TestStatus;
  created_at?: string;
  difficulty?: Difficulty;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  questions?: string[] | Question[];
  type?: string;
}

export interface TestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: TestStatus;
}

export interface Question {
  id?: string;
  type: 'mcq';
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: 'option1' | 'option2' | 'option3' | 'option4';
  explanation?: string;
  difficulty?: Difficulty;
  subject?: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id?: string;
}
