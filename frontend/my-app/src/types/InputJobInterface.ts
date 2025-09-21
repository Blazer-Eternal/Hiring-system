export type JobStatusEnum = "OPEN" | "CLOSED" | "DRAFT";

export interface InputJobInterface {
  title: string;
  description: string;
  requirements: string;
  department: string;
  location: string;
  salaryRange: string;
  status?: JobStatusEnum;
}
