/**
 * AI Features — high-level AI built on top of algorithms
 * May accept business-domain objects, does NOT touch DB directly
 *
 * chatbot.ts         → FAQ chatbot (TF-IDF intent matching)
 * resumeParser.ts    → CV text → structured candidate fields
 * notifications.ts   → Smart context-aware notification builder
 * personalization.ts → Job recommendations + profile scoring
 */

export { askChatbot, getFAQCategories }                                from './chatbot';
export { parseResume, buildCandidateProfileText }                      from './resumeParser';
export type { ParsedResume }                                           from './resumeParser';
export {
  notifyApplicationReceived,
  notifyStatusChanged,
  notifyInterviewScheduled,
  notifyInterviewReminder,
  notifyInterviewCompleted,
  notifyJobMatch,
  notifyProfileIncomplete,
}                                                                      from './notifications';
export type { Notification, NotificationType }                         from './notifications';
export {
  getPersonalizedRecommendations,
  checkProfileCompleteness,
  updatePreferences,
}                                                                      from './personalization';
export type {
  CandidatePreferences,
  PersonalizedRecommendation,
  ProfileCompletenessResult,
}                                                                      from './personalization';
