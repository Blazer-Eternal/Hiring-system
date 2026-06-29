"use strict";
/**
 * Smart Notifications
 * Generates context-aware notification messages based on application/interview events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyApplicationReceived = notifyApplicationReceived;
exports.notifyStatusChanged = notifyStatusChanged;
exports.notifyInterviewScheduled = notifyInterviewScheduled;
exports.notifyInterviewReminder = notifyInterviewReminder;
exports.notifyJobMatch = notifyJobMatch;
exports.notifyProfileIncomplete = notifyProfileIncomplete;
exports.notifyInterviewCompleted = notifyInterviewCompleted;
const applicationStatusEnum_1 = require("../../enums/applicationStatusEnum");
// ── Notification Generators ──────────────────────────────────────────────────
function notifyApplicationReceived(params) {
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
function notifyStatusChanged(params) {
    const statusMessages = {
        [applicationStatusEnum_1.ApplicationStatusEnum.UNDER_REVIEW]: `Your application for "${params.jobTitle}" is now under review. The recruiter is evaluating your profile.`,
        [applicationStatusEnum_1.ApplicationStatusEnum.INTERVIEW]: `Great news! You've been shortlisted for an interview for "${params.jobTitle}". Check your interview schedule.`,
        [applicationStatusEnum_1.ApplicationStatusEnum.HIRED]: `Congratulations! You have been selected for "${params.jobTitle}". The recruiter will contact you with next steps.`,
        [applicationStatusEnum_1.ApplicationStatusEnum.REJECTED]: `Thank you for applying to "${params.jobTitle}". Unfortunately, you were not selected at this time. Keep applying!`,
        [applicationStatusEnum_1.ApplicationStatusEnum.APPLIED]: `Your application for "${params.jobTitle}" has been received.`,
    };
    return {
        type: params.newStatus === applicationStatusEnum_1.ApplicationStatusEnum.HIRED ? 'hired'
            : params.newStatus === applicationStatusEnum_1.ApplicationStatusEnum.REJECTED ? 'rejected'
                : 'status_changed',
        recipientRole: 'user',
        title: params.newStatus === applicationStatusEnum_1.ApplicationStatusEnum.HIRED ? '🎉 Job Offer!'
            : params.newStatus === applicationStatusEnum_1.ApplicationStatusEnum.REJECTED ? 'Application Update'
                : 'Application Status Update',
        message: statusMessages[params.newStatus],
        metadata: { jobTitle: params.jobTitle, status: params.newStatus },
        createdAt: new Date(),
    };
}
function notifyInterviewScheduled(params) {
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
function notifyInterviewReminder(params) {
    return {
        type: 'interview_reminder',
        recipientRole: 'user',
        title: '⏰ Interview Reminder',
        message: `Reminder: Your interview for "${params.jobTitle}" is in ${params.hoursUntil} hour(s). Make sure you're prepared!`,
        metadata: { jobTitle: params.jobTitle, scheduleDate: params.scheduleDate },
        createdAt: new Date(),
    };
}
function notifyJobMatch(params) {
    return {
        type: 'job_match',
        recipientRole: 'user',
        title: '✨ Job Match Found',
        message: `We found a job that matches your profile: "${params.jobTitle}" (${params.matchScore}% match). Apply now!`,
        metadata: { jobTitle: params.jobTitle, matchScore: params.matchScore, matchedTerms: params.matchedTerms },
        createdAt: new Date(),
    };
}
function notifyProfileIncomplete(missingFields) {
    return {
        type: 'profile_incomplete',
        recipientRole: 'user',
        title: '📝 Complete Your Profile',
        message: `Your profile is incomplete. Add ${missingFields.join(', ')} to improve your job match score and visibility to recruiters.`,
        metadata: { missingFields },
        createdAt: new Date(),
    };
}
function notifyInterviewCompleted(params) {
    return {
        type: 'interview_completed',
        recipientRole: 'recruiter',
        title: 'Interview Completed',
        message: `Interview with ${params.candidateName} for "${params.jobTitle}" is marked as completed.${params.rating ? ` Rating: ${params.rating}/5.` : ' Add feedback to proceed.'}`,
        metadata: { candidateName: params.candidateName, jobTitle: params.jobTitle, rating: params.rating },
        createdAt: new Date(),
    };
}
