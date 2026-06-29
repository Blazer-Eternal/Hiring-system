import {
  AdminDashboardInterface,
  UserDashboardInterface,
  RecruiterDashboardInterface,
  MonthlyTrend,
  TopRecruiter,
  RecentHire,
  JobPerformance,
  RecentApplication,
  UpcomingInterview,
  CandidateApplicationDetail,
  CandidateUpcomingInterview,
  CandidateActivityItem,
} from "../interfaces/dashboardInterface";
import { Op, fn, col, literal } from "sequelize";
import Models from "../models";

// Helpers

function monthLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function last6MonthsRange(): Date[] {
  const months: Date[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    d.setHours(0, 0, 0, 0);
    months.push(d);
  }
  return months;
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

function safeRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10; // one decimal %
}

//  Admin Dashboard

export class DashboardServices {
  public async getAdminStats(): Promise<AdminDashboardInterface> {
    // Overview
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      activeJobs,
      closedJobs,
      totalApplications,
      totalInterviews,
      totalHires,
    ] = await Promise.all([
      Models.Users.count(),
      Models.Candidates.count(),
      Models.Recruiters.count({ where: { isVerified: true } }),
      Models.JobPositions.count({ where: { status: "open" } }),
      Models.JobPositions.count({ where: { status: "closed" } }),
      Models.Applications.count(),
      Models.Interviews.count(),
      Models.Applications.count({ where: { status: "hired" } }),
    ]);

    //Hiring Funnel
    const [applied, underReview, interview, hired, rejected] = await Promise.all([
      Models.Applications.count({ where: { status: "applied" } }),
      Models.Applications.count({ where: { status: "under_review" } }),
      Models.Applications.count({ where: { status: "interview" } }),
      Models.Applications.count({ where: { status: "hired" } }),
      Models.Applications.count({ where: { status: "rejected" } }),
    ]);

    const hiringFunnel = {
      applied,
      underReview,
      interview,
      hired,
      rejected,
      offerAcceptanceRate: safeRate(hired, hired + rejected),
      applicationToInterviewRate: safeRate(interview, applied),
      interviewToHireRate: safeRate(hired, interview),
    };

    //Time Metrics
    const hiredApps = await Models.Applications.findAll({
      where: { status: "hired" },
      attributes: ["createdAt", "updatedAt"],
    });

    const avgTimeToHireDays =
      hiredApps.length > 0
        ? Math.round(
            hiredApps.reduce((sum: number, a: any) => {
              return sum + daysBetween(new Date(a.createdAt), new Date(a.updatedAt));
            }, 0) / hiredApps.length
          )
        : 0;

    const reviewedApps = await Models.Applications.findAll({
      where: { status: { [Op.ne]: "applied" } },
      attributes: ["createdAt", "updatedAt"],
    });

    const avgTimeToFirstActionDays =
      reviewedApps.length > 0
        ? Math.round(
            reviewedApps.reduce((sum: number, a: any) => {
              return sum + daysBetween(new Date(a.createdAt), new Date(a.updatedAt));
            }, 0) / reviewedApps.length
          )
        : 0;

    const avgDurationResult = await Models.Interviews.findOne({
      attributes: [[fn("AVG", col("duration")), "avgDuration"]],
    });
    const avgInterviewDurationMinutes = Math.round(
      parseFloat((avgDurationResult as any)?.get("avgDuration") || "0")
    );

    // Monthly Trends (last 6 months)
    const months = last6MonthsRange();
    const applicationTrend: MonthlyTrend[] = [];
    const hireTrend: MonthlyTrend[] = [];

    for (let i = 0; i < months.length; i++) {
      const start = months[i];
      const end = i + 1 < months.length ? months[i + 1] : new Date();

      const [appCount, hireCount] = await Promise.all([
        Models.Applications.count({ where: { createdAt: { [Op.gte]: start, [Op.lt]: end } } }),
        Models.Applications.count({
          where: { status: "hired", updatedAt: { [Op.gte]: start, [Op.lt]: end } },
        }),
      ]);

      applicationTrend.push({ month: monthLabel(start), count: appCount });
      hireTrend.push({ month: monthLabel(start), count: hireCount });
    }

    //Top Recruiters
    const allRecruiters = await Models.Recruiters.findAll({ where: { isVerified: true } });
    const topRecruitersRaw: TopRecruiter[] = await Promise.all(
      allRecruiters.map(async (r: any) => {
        const jobs = await Models.JobPositions.findAll({ where: { recruiterId: r.id } });
        const jobIds = jobs.map((j: any) => j.id);
        const [totalApplications, totalHiresR, activeJobsR, avgRatingResult] = await Promise.all([
          jobIds.length > 0 ? Models.Applications.count({ where: { jobId: jobIds } }) : Promise.resolve(0),
          jobIds.length > 0 ? Models.Applications.count({ where: { jobId: jobIds, status: "hired" } }) : Promise.resolve(0),
          Models.JobPositions.count({ where: { recruiterId: r.id, status: "open" } }),
          Models.Interviews.findOne({
            where: { recruiterId: r.id, rating: { [Op.ne]: null } } as any,
            attributes: [[fn("AVG", col("rating")), "avgRating"]],
          }),
        ]);
        const avgRating = avgRatingResult
          ? parseFloat((avgRatingResult as any).get("avgRating") || "0") || null
          : null;
        return {
          recruiterId: r.id,
          company: `${r.firstName} ${r.lastName}`,
          totalHires: totalHiresR,
          activeJobs: activeJobsR,
          totalApplications,
          avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        };
      })
    );
    const topRecruiters = topRecruitersRaw
      .sort((a, b) => b.totalHires - a.totalHires)
      .slice(0, 5);

    // Recent Hires
    const recentHireApps = await Models.Applications.findAll({
      where: { status: "hired" },
      order: [["updatedAt", "DESC"]],
      limit: 10,
      include: [
        { model: Models.Candidates, as: "Candidate", attributes: ["name"] },
        {
          model: Models.JobPositions,
          as: "Job",
          attributes: ["title"],
          include: [{ model: Models.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] }],
        },
      ],
    });

    const recentHires: RecentHire[] = recentHireApps.map((a: any) => ({
      candidateName: a.Candidate?.name ?? "Unknown",
      jobTitle: a.Job?.title ?? "Unknown",
      company: a.Job?.Recruiter
        ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}`
        : "Unknown",
      hiredAt: a.updatedAt,
    }));

    return {
      overview: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        activeJobs,
        closedJobs,
        totalApplications,
        totalInterviews,
        totalHires,
      },
      hiringFunnel,
      timeMetrics: {
        avgTimeToHireDays,
        avgTimeToFirstActionDays,
        avgInterviewDurationMinutes,
      },
      applicationTrend,
      hireTrend,
      topRecruiters,
      recentHires,
    };
  }

  // Recruiter Dashboard

  public async getRecruiterStats(recruiterId: number): Promise<RecruiterDashboardInterface> {
    const recruiterJobs = await Models.JobPositions.findAll({ where: { recruiterId } });
    const jobIds = recruiterJobs.map((j: any) => j.id);

    //Overview
    const [
      totalApplicationsReceived,
      scheduledInterviews,
      completedInterviews,
      totalHires,
      candidatesInPipeline,
    ] = await Promise.all([
      jobIds.length > 0 ? Models.Applications.count({ where: { jobId: jobIds } }) : Promise.resolve(0),
      Models.Interviews.count({ where: { recruiterId, status: "scheduled" } }),
      Models.Interviews.count({ where: { recruiterId, status: "completed" } }),
      jobIds.length > 0 ? Models.Applications.count({ where: { jobId: jobIds, status: "hired" } }) : Promise.resolve(0),
      jobIds.length > 0
        ? Models.Applications.count({
            where: { jobId: jobIds, status: { [Op.in]: ["applied", "under_review", "interview"] } },
          })
        : Promise.resolve(0),
    ]);

    const activeJobs = recruiterJobs.filter((j: any) => j.status === "open").length;
    const closedJobs = recruiterJobs.filter((j: any) => j.status === "closed").length;

    //Hiring Funnel
    const [fApplied, fUnderReview, fInterview, fHired, fRejected] = await Promise.all(
      jobIds.length > 0
        ? [
            Models.Applications.count({ where: { jobId: jobIds, status: "applied" } }),
            Models.Applications.count({ where: { jobId: jobIds, status: "under_review" } }),
            Models.Applications.count({ where: { jobId: jobIds, status: "interview" } }),
            Models.Applications.count({ where: { jobId: jobIds, status: "hired" } }),
            Models.Applications.count({ where: { jobId: jobIds, status: "rejected" } }),
          ]
        : [Promise.resolve(0), Promise.resolve(0), Promise.resolve(0), Promise.resolve(0), Promise.resolve(0)]
    );

    const hiringFunnel = {
      applied: fApplied,
      underReview: fUnderReview,
      interview: fInterview,
      hired: fHired,
      rejected: fRejected,
      applicantToInterviewRate: safeRate(fInterview, fApplied),
      interviewToOfferRate: safeRate(fHired, fInterview),
      offerAcceptanceRate: safeRate(fHired, fHired + fRejected),
    };

    //Time Metrics
    let avgTimeToFirstReviewDays = 0;
    let avgTimeToHireDays = 0;

    if (jobIds.length > 0) {
      const reviewedApps = await Models.Applications.findAll({
        where: { jobId: jobIds, status: { [Op.ne]: "applied" } },
        attributes: ["createdAt", "updatedAt"],
      });
      if (reviewedApps.length > 0) {
        avgTimeToFirstReviewDays = Math.round(
          reviewedApps.reduce((s: number, a: any) => s + daysBetween(new Date(a.createdAt), new Date(a.updatedAt)), 0) /
            reviewedApps.length
        );
      }

      const hiredApps = await Models.Applications.findAll({
        where: { jobId: jobIds, status: "hired" },
        attributes: ["createdAt", "updatedAt"],
      });
      if (hiredApps.length > 0) {
        avgTimeToHireDays = Math.round(
          hiredApps.reduce((s: number, a: any) => s + daysBetween(new Date(a.createdAt), new Date(a.updatedAt)), 0) /
            hiredApps.length
        );
      }
    }

    const avgRatingResult = await Models.Interviews.findOne({
      where: { recruiterId, rating: { [Op.ne]: null } } as any,
      attributes: [[fn("AVG", col("rating")), "avgRating"]],
    });
    const avgInterviewRating = avgRatingResult
      ? Math.round(parseFloat((avgRatingResult as any).get("avgRating") || "0") * 10) / 10 || null
      : null;

    // Per-Job Performance
    const jobPerformance: JobPerformance[] = await Promise.all(
      recruiterJobs.map(async (job: any) => {
        const [appCount, inPipeline, interviews, hires, avgJobRatingResult] = await Promise.all([
          Models.Applications.count({ where: { jobId: job.id } }),
          Models.Applications.count({
            where: { jobId: job.id, status: { [Op.in]: ["applied", "under_review", "interview"] } },
          }),
          Models.Interviews.count({ where: { recruiterId, applicationId: job.id } }),
          Models.Applications.count({ where: { jobId: job.id, status: "hired" } }),
          Models.Interviews.findOne({
            where: { recruiterId, rating: { [Op.ne]: null } } as any,
            attributes: [[fn("AVG", col("rating")), "avgRating"]],
          }),
        ]);
        const daysOpen = daysBetween(new Date(job.createdAt ?? new Date()), new Date());
        const avgJobRating = avgJobRatingResult
          ? Math.round(parseFloat((avgJobRatingResult as any).get("avgRating") || "0") * 10) / 10 || null
          : null;
        return {
          jobId: job.id,
          title: job.title,
          status: job.status,
          totalApplications: appCount,
          inPipeline,
          interviews,
          hires,
          daysOpen,
          avgRating: avgJobRating,
        };
      })
    );

    // Recent Applications
    const recentApps: RecentApplication[] = [];
    if (jobIds.length > 0) {
      const rawApps = await Models.Applications.findAll({
        where: { jobId: jobIds },
        order: [["createdAt", "DESC"]],
        limit: 10,
        include: [
          { model: Models.Candidates, as: "Candidate", attributes: ["name"] },
          { model: Models.JobPositions, as: "Job", attributes: ["title"] },
        ],
      });
      rawApps.forEach((a: any) => {
        recentApps.push({
          applicationId: a.id,
          candidateName: a.Candidate?.name ?? "Unknown",
          jobTitle: a.Job?.title ?? "Unknown",
          status: a.status,
          appliedAt: a.createdAt,
        });
      });
    }

    // Upcoming Interviews
    const rawInterviews = await Models.Interviews.findAll({
      where: {
        recruiterId,
        status: "scheduled",
        scheduleDate: { [Op.gte]: new Date() },
      },
      order: [["scheduleDate", "ASC"]],
      limit: 10,
      include: [
        { model: Models.Candidates, as: "Candidate", attributes: ["name"] },
      ],
    });

    const upcomingInterviews: UpcomingInterview[] = await Promise.all(
      rawInterviews.map(async (iv: any) => {
        const app = await Models.Applications.findByPk(iv.applicationId, {
          include: [{ model: Models.JobPositions, as: "Job", attributes: ["title"] }],
        });
        return {
          interviewId: iv.id,
          candidateName: iv.Candidate?.name ?? "Unknown",
          jobTitle: (app as any)?.Job?.title ?? "Unknown",
          scheduleDate: iv.scheduleDate,
          duration: iv.duration,
          status: iv.status,
        };
      })
    );

    // Monthly Application Trend
    const months = last6MonthsRange();
    const applicationTrend: MonthlyTrend[] = [];
    for (let i = 0; i < months.length; i++) {
      const start = months[i];
      const end = i + 1 < months.length ? months[i + 1] : new Date();
      const count =
        jobIds.length > 0
          ? await Models.Applications.count({
              where: { jobId: jobIds, createdAt: { [Op.gte]: start, [Op.lt]: end } },
            })
          : 0;
      applicationTrend.push({ month: monthLabel(start), count });
    }

    return {
      overview: {
        totalJobsPosted: recruiterJobs.length,
        activeJobs,
        closedJobs,
        totalApplicationsReceived,
        candidatesInPipeline,
        scheduledInterviews,
        completedInterviews,
        totalHires,
      },
      hiringFunnel,
      timeMetrics: {
        avgTimeToFirstReviewDays,
        avgTimeToHireDays,
        avgInterviewRating,
      },
      jobPerformance,
      recentApplications: recentApps,
      upcomingInterviews,
      applicationTrend,
    };
  }

  // Candidate (User) Dashboard

  public async getUserStats(candidateId: number): Promise<UserDashboardInterface> {
    // Overview
    const [totalApplications, upcomingInterviews, totalHires] = await Promise.all([
      Models.Applications.count({ where: { candidateId } }),
      Models.Interviews.count({
        where: { candidateId, status: "scheduled", scheduleDate: { [Op.gte]: new Date() } },
      }),
      Models.Applications.count({ where: { candidateId, status: "hired" } }),
    ]);

    const activeApplications = await Models.Applications.count({
      where: { candidateId, status: { [Op.in]: ["applied", "under_review", "interview"] } },
    });

    // Status Breakdown
    const [sApplied, sUnderReview, sInterview, sHired, sRejected] = await Promise.all([
      Models.Applications.count({ where: { candidateId, status: "applied" } }),
      Models.Applications.count({ where: { candidateId, status: "under_review" } }),
      Models.Applications.count({ where: { candidateId, status: "interview" } }),
      Models.Applications.count({ where: { candidateId, status: "hired" } }),
      Models.Applications.count({ where: { candidateId, status: "rejected" } }),
    ]);

    //Recent Applications
    const rawApps = await Models.Applications.findAll({
      where: { candidateId },
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [
        {
          model: Models.JobPositions,
          as: "Job",
          attributes: ["title", "location"],
          include: [{ model: Models.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] }],
        },
      ],
    });

    const recentApplications: CandidateApplicationDetail[] = rawApps.map((a: any) => ({
      applicationId: a.id,
      jobTitle: a.Job?.title ?? "Unknown",
      company: a.Job?.Recruiter
        ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}`
        : "Unknown",
      location: a.Job?.location ?? "Unknown",
      status: a.status,
      appliedAt: a.createdAt,
      lastUpdated: a.updatedAt,
    }));

    // Upcoming Interviews
    const rawInterviews = await Models.Interviews.findAll({
      where: {
        candidateId,
        scheduleDate: { [Op.gte]: new Date() },
      },
      order: [["scheduleDate", "ASC"]],
      limit: 5,
      include: [
        { model: Models.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] },
      ],
    });

    const upcomingInterviewDetails: CandidateUpcomingInterview[] = await Promise.all(
      rawInterviews.map(async (iv: any) => {
        const app = await Models.Applications.findByPk(iv.applicationId, {
          include: [{ model: Models.JobPositions, as: "Job", attributes: ["title"] }],
        });
        return {
          interviewId: iv.id,
          jobTitle: (app as any)?.Job?.title ?? "Unknown",
          company: iv.Recruiter
            ? `${iv.Recruiter.firstName} ${iv.Recruiter.lastName}`
            : "Unknown",
          scheduleDate: iv.scheduleDate,
          duration: iv.duration,
          status: iv.status,
          feedback: iv.feedback ?? undefined,
          rating: iv.rating ?? undefined,
        };
      })
    );

    //  Activity Feed
    const activityFeed: CandidateActivityItem[] = [];

    // Last 5 applications
    rawApps.slice(0, 5).forEach((a: any) => {
      activityFeed.push({
        type: "applied",
        message: `You applied for "${a.Job?.title ?? "a job"}" at ${a.Job?.Recruiter ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}` : "a company"}`,
        date: a.createdAt,
      });
      if (a.status !== "applied") {
        activityFeed.push({
          type: "status_change",
          message: `Your application for "${a.Job?.title ?? "a job"}" moved to ${a.status.replace("_", " ")}`,
          date: a.updatedAt,
        });
      }
    });

    // Scheduled interviews
    rawInterviews.forEach((iv: any) => {
      activityFeed.push({
        type: "interview_scheduled",
        message: `Interview scheduled with ${iv.Recruiter ? `${iv.Recruiter.firstName} ${iv.Recruiter.lastName}` : "a recruiter"} on ${new Date(iv.scheduleDate).toLocaleDateString()}`,
        date: iv.createdAt,
      });
      if (iv.feedback) {
        activityFeed.push({
          type: "feedback_received",
          message: `Feedback received: "${iv.feedback}"`,
          date: iv.updatedAt,
        });
      }
    });

    // Sort by date desc, take top 10
    activityFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      overview: {
        totalApplications,
        activeApplications,
        upcomingInterviews,
        totalHires,
      },
      applicationStatus: {
        applied: sApplied,
        underReview: sUnderReview,
        interview: sInterview,
        hired: sHired,
        rejected: sRejected,
      },
      recentApplications,
      upcomingInterviews: upcomingInterviewDetails,
      activityFeed: activityFeed.slice(0, 10),
    };
  }
}
