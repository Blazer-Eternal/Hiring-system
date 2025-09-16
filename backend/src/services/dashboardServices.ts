import { AdminDashboardInterface, UserDashboardInterface } from "../interfaces/dashboardInterface";
import { Op, fn, col } from "sequelize";
import Models from "../models";

export class DashboardServices {
  // Get overall admin statistics
  public async getAdminStats(): Promise<AdminDashboardInterface> {
    const totalUsers = await Models.Users.count();
    const activeJobPositions = await Models.JobPositions.count({
      where: { status: 'open' }
    });
    const totalApplications = await Models.Applications.count();
    const upcomingInterviews = await Models.Interviews.count({
      where: { status: 'scheduled' }
    });
    const recentHires = await Models.Applications.count({
      where: {
        status: 'hired',
        createdAt: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) }
      }
    });

    return {
      totalUsers,
      activeJobPositions,
      totalApplications,
      upcomingInterviews,
      recentHires
    };
  }

  // Get statistics for a specific user
  public async getUserStats(userId: number): Promise<UserDashboardInterface> {
    // Total applications by user
    const myApplications = await Models.Applications.count({
      where: { candidateId: userId }
    });

    // Total upcoming interviews by user
    const myUpcomingInterviews = await Models.Interviews.count({
      where: { status: 'scheduled' },
      include: [{
        model: Models.Applications,
        as: 'Application',
        attributes: [],
        where: { candidateId: userId }
      }]
    });

    // Count applications by status
    const statusCounts = await Models.Applications.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { candidateId: userId },
      group: ['status']
    });

    // Define valid statuses and type for safety
    const validStatuses = ['APPLIED', 'UNDER_REVIEW', 'INTERVIEWED', 'HIRED', 'REJECTED'] as const;
    type StatusKey = (typeof validStatuses)[number];

    // Initialize status map
    const applicationStatus: Record<StatusKey, number> = {
      APPLIED: 0,
      UNDER_REVIEW: 0,
      INTERVIEWED: 0,
      HIRED: 0,
      REJECTED: 0
    };

// Populate counts safely
statusCounts.forEach((row: any) => {
  const statusKey = row.status.toUpperCase() as StatusKey;  
  if (validStatuses.includes(statusKey)) {
    applicationStatus[statusKey] = parseInt(row.get('count'));
  } else {
    console.warn(`Unexpected status value: ${row.status}`);
  }
});

    return {
      myApplications,
      myUpcomingInterviews,
      applicationStatus
    };
  }
}
