// ─── Shared ────────────────────────────────────────────────────────────────

export interface PipelineFunnelStage {
  stage: string;
  count: number;
  conversionRate: number; // % from previous stage
}

export interface MonthlyTrend {
  month: string; // "Jan 2026"
  count: number;
}

// ─── Admin Dashboard ────────────────────────────────────────────────────────

export interface AdminOverviewStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  totalInterviews: number;
  totalHires: number;
}

export interface AdminHiringFunnel {
  applied: number;
  underReview: number;
  interview: number;
  hired: number;
  rejected: number;
  offerAcceptanceRate: number;   // hired / (hired + rejected) %
  applicationToInterviewRate: number; // interview / applied %
  interviewToHireRate: number;   // hired / interview %
}

export interface AdminTimeMetrics {
  avgTimeToHireDays: number;     // avg days from application to hired
  avgTimeToFirstActionDays: number; // avg days from applied to under_review
  avgInterviewDurationMinutes: number;
}

export interface TopRecruiter {
  recruiterId: number;
  company: string;
  totalHires: number;
  activeJobs: number;
  totalApplications: number;
  avgRating: number | null;
}

export interface AdminDashboardInterface {
  overview: AdminOverviewStats;
  hiringFunnel: AdminHiringFunnel;
  timeMetrics: AdminTimeMetrics;
  applicationTrend: MonthlyTrend[];   // last 6 months
  hireTrend: MonthlyTrend[];          // last 6 months
  topRecruiters: TopRecruiter[];
  recentHires: RecentHire[];
}

export interface RecentHire {
  candidateName: string;
  jobTitle: string;
  company: string;
  hiredAt: Date;
}

// ─── Recruiter Dashboard ─────────────────────────────────────────────────────

export interface RecruiterOverviewStats {
  totalJobsPosted: number;
  activeJobs: number;
  closedJobs: number;
  totalApplicationsReceived: number;
  candidatesInPipeline: number;
  scheduledInterviews: number;
  completedInterviews: number;
  totalHires: number;
}

export interface RecruiterHiringFunnel {
  applied: number;
  underReview: number;
  interview: number;
  hired: number;
  rejected: number;
  applicantToInterviewRate: number;  // interview / applied %
  interviewToOfferRate: number;      // hired / interview %
  offerAcceptanceRate: number;       // hired / (hired + rejected) %
}

export interface JobPerformance {
  jobId: number;
  title: string;
  status: string;
  totalApplications: number;
  inPipeline: number;
  interviews: number;
  hires: number;
  daysOpen: number;
  avgRating: number | null;
}

export interface RecentApplication {
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  status: string;
  appliedAt: Date;
}

export interface UpcomingInterview {
  interviewId: number;
  candidateName: string;
  jobTitle: string;
  scheduleDate: Date;
  duration: number;
  status: string;
}

export interface RecruiterTimeMetrics {
  avgTimeToFirstReviewDays: number;
  avgTimeToHireDays: number;
  avgInterviewRating: number | null;
}

export interface RecruiterDashboardInterface {
  overview: RecruiterOverviewStats;
  hiringFunnel: RecruiterHiringFunnel;
  timeMetrics: RecruiterTimeMetrics;
  jobPerformance: JobPerformance[];
  recentApplications: RecentApplication[];
  upcomingInterviews: UpcomingInterview[];
  applicationTrend: MonthlyTrend[];  // last 6 months for this recruiter
}

// ─── Candidate (User) Dashboard ──────────────────────────────────────────────

export interface CandidateApplicationStatus {
  applied: number;
  underReview: number;
  interview: number;
  hired: number;
  rejected: number;
}

export interface CandidateApplicationDetail {
  applicationId: number;
  jobTitle: string;
  company: string;
  location: string;
  status: string;
  appliedAt: Date;
  lastUpdated: Date;
}

export interface CandidateUpcomingInterview {
  interviewId: number;
  jobTitle: string;
  company: string;
  scheduleDate: Date;
  duration: number;
  status: string;
  feedback?: string;
  rating?: number;
}

export interface CandidateActivityItem {
  type: 'applied' | 'status_change' | 'interview_scheduled' | 'feedback_received';
  message: string;
  date: Date;
}

export interface UserDashboardInterface {
  overview: {
    totalApplications: number;
    activeApplications: number;
    upcomingInterviews: number;
    totalHires: number;
  };
  applicationStatus: CandidateApplicationStatus;
  recentApplications: CandidateApplicationDetail[];
  upcomingInterviews: CandidateUpcomingInterview[];
  activityFeed: CandidateActivityItem[];
}
