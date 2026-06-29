/**
 * Smart Notifications
 * Generates context-aware notification messages based on application/interview events
 */

import { ApplicationStatusEnum } from '../../enums/applicationStatusEnum';
import { InterviewStatusEnum } from '../../enums/interviewStatusEnum';

export type NotificationType =
  | 'application_received'
  | 'status_changed'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'interview_completed'
  | 'hired'
  | 'rejected'
  | 'job_match'
  | 'profile_incomplete';

export interface Notification {
  type: NotificationType;
  recipientRole: 'user' | 'recruiter' | 'admin';
  title: string;
  message: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// ── Notification Generators ──────────────────────────────────────────────────

export function notifyApplicationReceived(params: {
  candidateName: string;
  jobTitle: string;
  recruiterName: string;
}): Notification[] {
  return [
    {
      type: 'application_received',
      recipientRole: 'user',
      title: 'Application Submitted',
      message: `Your application for "${params.jobTitle}" has been submitted successfully. We'll keep you updated on the progress.`,
      metadata: { jobTitle: params.jobTitle },
      createdAt: new Date(),
    },
    {
      type: 'application_received',
      recipientRole: 'recruiter',
      title: 'New Application',
      message: `${params.candidateName} has applied for "${params.jobTitle}". Review their profile and CV.`,
      metadata: { candidateName: params.candidateName, jobTitle: params.jobTitle },
      createdAt: new Date(),
    },
  ];
}

export function notifyStatusChanged(params: {
  candidateName: string;
  jobTitle: string;
  newStatus: ApplicationStatusEnum;
}): Notification {
  const statusMessages: Record<ApplicationStatusEnum, string> = {
    [ApplicationStatusEnum.UNDER_REVIEW]: `Your application for "${params.jobTitle}" is now under review. The recruiter is evaluating your profile.`,
    [ApplicationStatusEnum.INTERVIEW]:    `Great news! You've been shortlisted for an interview for "${params.jobTitle}". Check your interview schedule.`,
    [ApplicationStatusEnum.HIRED]:        `Congratulations! You have been selected for "${params.jobTitle}". The recruiter will contact you with next steps.`,
    [ApplicationStatusEnum.REJECTED]:     `Thank you for applying to "${params.jobTitle}". Unfortunately, you were not selected at this time. Keep applying!`,
    [ApplicationStatusEnum.APPLIED]:      `Your application for "${params.jobTitle}" has been received.`,
  };

  return {
    type: params.newStatus === ApplicationStatusEnum.HIRED ? 'hired'
        : params.newStatus === ApplicationStatusEnum.REJECTED ? 'rejected'
        : 'status_changed',
    recipientRole: 'user',
    title: params.newStatus === ApplicationStatusEnum.HIRED ? '🎉 Job Offer!'
         : params.newStatus === ApplicationStatusEnum.REJECTED ? 'Application Update'
         : 'Application Status Update',
    message: statusMessages[params.newStatus],
    metadata: { jobTitle: params.jobTitle, status: params.newStatus },
    createdAt: new Date(),
  };
}

export function notifyInterviewScheduled(params: {
  candidateName: string;
  jobTitle: string;
  scheduleDate: Date;
  duration: number;
  recruiterName: string;
}): Notification[] {
  const dateStr = params.scheduleDate.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return [
    {
      type: 'interview_scheduled',
      recipientRole: 'user',
      title: '📅 Interview Scheduled',
      message: `Your interview for "${params.jobTitle}" has been scheduled on ${dateStr} (${params.duration} minutes). Be prepared!`,
      metadata: { jobTitle: params.jobTitle, scheduleDate: params.scheduleDate, duration: params.duration },
      createdAt: new Date(),
    },
    {
      type: 'interview_scheduled',
      recipientRole: 'recruiter',
      title: 'Interview Confirmed',
      message: `Interview with ${params.candidateName} for "${params.jobTitle}" is set for ${dateStr}.`,
      metadata: { candidateName: params.candidateName, jobTitle: params.jobTitle, scheduleDate: params.scheduleDate },
      createdAt: new Date(),
    },
  ];
}

export function notifyInterviewReminder(params: {
  candidateName: string;
  jobTitle: string;
  scheduleDate: Date;
  hoursUntil: number;
}): Notification {
  return {
    type: 'interview_reminder',
    recipientRole: 'user',
    title: '⏰ Interview Reminder',
    message: `Reminder: Your interview for "${params.jobTitle}" is in ${params.hoursUntil} hour(s). Make sure you're prepared!`,
    metadata: { jobTitle: params.jobTitle, scheduleDate: params.scheduleDate },
    createdAt: new Date(),
  };
}

export function notifyJobMatch(params: {
  jobTitle: string;
  matchScore: number;
  matchedTerms: string[];
}): Notification {
  return {
    type: 'job_match',
    recipientRole: 'user',
    title: '✨ Job Match Found',
    message: `We found a job that matches your profile: "${params.jobTitle}" (${params.matchScore}% match). Apply now!`,
    metadata: { jobTitle: params.jobTitle, matchScore: params.matchScore, matchedTerms: params.matchedTerms },
    createdAt: new Date(),
  };
}

export function notifyProfileIncomplete(missingFields: string[]): Notification {
  return {
    type: 'profile_incomplete',
    recipientRole: 'user',
    title: '📝 Complete Your Profile',
    message: `Your profile is incomplete. Add ${missingFields.join(', ')} to improve your job match score and visibility to recruiters.`,
    metadata: { missingFields },
    createdAt: new Date(),
  };
}

export function notifyInterviewCompleted(params: {
  candidateName: string;
  jobTitle: string;
  rating?: number;
}): Notification {
  return {
    type: 'interview_completed',
    recipientRole: 'recruiter',
    title: 'Interview Completed',
    message: `Interview with ${params.candidateName} for "${params.jobTitle}" is marked as completed.${params.rating ? ` Rating: ${params.rating}/5.` : ' Add feedback to proceed.'}`,
    metadata: { candidateName: params.candidateName, jobTitle: params.jobTitle, rating: params.rating },
    createdAt: new Date(),
  };
}
