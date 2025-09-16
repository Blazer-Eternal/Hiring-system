import * as Sequelize from "sequelize";

// Admin Dashboard
export interface InputAdminDashboardInterface {
  // No input fields needed (read-only dashboard)
}

export interface AdminDashboardInterface extends InputAdminDashboardInterface {
  totalUsers: number;
  activeJobPositions: number;
  totalApplications: number;
  upcomingInterviews: number;
  recentHires: number;
}

export interface AdminDashboardModelInterface
  extends Sequelize.Model<AdminDashboardInterface, Partial<InputAdminDashboardInterface>>,
    AdminDashboardInterface {}

// User Dashboard
export interface InputUserDashboardInterface {
  // No input fields needed (read-only dashboard)
}

export interface UserDashboardInterface extends InputUserDashboardInterface {
  myApplications: number;
  myUpcomingInterviews: number;
  applicationStatus: {
    APPLIED: number;
    UNDER_REVIEW: number;
    INTERVIEWED: number;
    HIRED: number;
    REJECTED: number;
  };
}

export interface UserDashboardModelInterface
  extends Sequelize.Model<UserDashboardInterface, Partial<InputUserDashboardInterface>>,
    UserDashboardInterface {}