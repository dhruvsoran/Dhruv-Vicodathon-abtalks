export type DayStatus = "done" | "repaired" | "missed" | "today" | "upcoming";

export type ChallengeDay = {
  day: number;
  title: string;
  focus: string;
  difficulty: string;
  minutes: number;
  xp: number;
  tag: string;
};

export type DayDetail = {
  why: string;
  build: string[];
  acceptance: string[];
  stretch: string;
  resources: { label: string; href: string }[];
};

export type Week = { n: number; range: string; theme: string; blurb: string };

export type Cohort = {
  id: string;
  name: string;
  track: string;
  totalDays: number;
  startedOn: string;
  timezone: string;
  cutoffLabel: string;
  studentsEnrolled: number;
  collegesRepresented: number;
};

export type Student = {
  name: string;
  handle: string;
  initials: string;
  college: string;
  year: string;
  track: string;
  joinedOn: string;
  bio: string;
  github: string;
  linkedin: string;
  profileFields: Record<string, boolean>;
};

export type Badge = { id: string; name: string; earnedOnDay: number; note: string };

export type Submission = { day: number; at: string; repo: string; post: string };

export type Persona = {
  id: string;
  label: string;
  hint: string;
  student: Student;
  currentDay: number;
  completedDays: number[];
  missedDays: number[];
  repairedDays: number[];
  shields: { available: number; earnedEvery: number; used: number };
  todaySubmission: Submission | null;
  rank: { position: number; of: number; percentile: number; movement: number } | null;
  badges: Badge[];
  nextBadge: { name: string; onDay: number; note: string };
  recentSubmissions: Submission[];
};
