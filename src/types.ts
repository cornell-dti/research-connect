type ID = string;

export type Opportunity = {
  _id: ID;
  title: string;
  labName: string;
  labId: string;
  pi: string;
  supervisor: string;
  projectDescription: string;
  undergradTasks: string;
  opens: string;
  closes: string;
  datePosted: string;
  startYear: string;
  startSeason: string;
  minSemesters: number;
  minHours: number;
  maxHours: number;
  qualifications: string;
  minGPA: number;
  requiredClasses: string[];
  questions: string[];
  yearsAllowed: string[];
  additionalInformation: string;
  spots: number;
  areas: string[];
  compensation: string[];
  starred: boolean;
  prereqsMatch: boolean;
};

export type Professor = {
  _id: ID;
  name: string;
  department: string;
  lab: string;
  photoId: string;
  bio: string;
  researchInterests: string;
  researchDescription: string;
};
