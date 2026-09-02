export type AcademicYear = {
  id: string;
  name: string;
  starts_on: string;
  ends_on: string;
  status: "active" | "inactive";
};
export type ClassGroup = {
  id: string;
  academic_year_id: string;
  name: string;
  grade_level: number;
};
export type Subject = { id: string; code: string; name: string };
export type Course = {
  id: string;
  name: string;
  status: string;
  academic_year: AcademicYear;
  class_group: ClassGroup;
  subject: Subject;
};

export type QuestionOption = {
  id: string;
  content: string;
  is_correct: boolean;
  position: number;
};
export type Question = {
  id: string;
  course_id: string;
  author_id: string;
  type: "single_choice";
  stem: string;
  default_points: number;
  status: string;
  version: number;
  options: QuestionOption[];
  created_at: string;
  updated_at: string;
};
export type ExamOption = Omit<QuestionOption, "is_correct">;
export type ExamQuestion = {
  id: string;
  source_question_id: string;
  type: "single_choice";
  stem: string;
  position: number;
  points: number;
  options: ExamOption[];
};
export type Exam = {
  id: string;
  course_id: string;
  author_id: string;
  title: string;
  description: string;
  status: "draft" | "published";
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  max_attempts: number;
  allow_back_navigation: boolean;
  result_policy: string;
  published_at: string | null;
  question_count: number;
  participant_count: number;
  participant_ids?: string[];
  total_points: number;
  questions?: ExamQuestion[];
};

export type AvailableExam = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  attempt_status: string | null;
  server_time: string;
};
export type AttemptAnswer = {
  exam_question_id: string;
  selected_option_id: string;
  revision: number;
  saved_at: string;
};
export type Attempt = {
  attempt_id: string;
  status: string;
  started_at: string;
  deadline_at: string;
  server_time: string;
  allow_back_navigation: boolean;
  questions: ExamQuestion[];
  answers: AttemptAnswer[];
  submission_receipt?: string;
  submitted_at?: string;
};
export type Receipt = {
  attempt_id: string;
  status: string;
  receipt: string | null;
  submitted_at: string | null;
};
export type ExamResult = {
  id: string;
  attempt_id: string;
  exam_id: string;
  exam_title: string;
  student_id: string;
  student_name?: string;
  identifier?: string;
  status: string;
  score: number;
  max_score: number;
  percentage: number;
  graded_at: string;
  published_at: string | null;
};
