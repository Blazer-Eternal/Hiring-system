"use strict";
/**
 * AI Features — high-level AI built on top of algorithms
 * May accept business-domain objects, does NOT touch DB directly
 *
 * chatbot.ts         → FAQ chatbot (TF-IDF intent matching)
 * resumeParser.ts    → CV text → structured candidate fields
 * notifications.ts   → Smart context-aware notification builder
 * personalization.ts → Job recommendations + profile scoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferences = exports.checkProfileCompleteness = exports.getPersonalizedRecommendations = exports.notifyProfileIncomplete = exports.notifyJobMatch = exports.notifyInterviewCompleted = exports.notifyInterviewReminder = exports.notifyInterviewScheduled = exports.notifyStatusChanged = exports.notifyApplicationReceived = exports.buildCandidateProfileText = exports.parseResume = exports.getFAQCategories = exports.askChatbot = void 0;
var chatbot_1 = require("./chatbot");
Object.defineProperty(exports, "askChatbot", { enumerable: true, get: function () { return chatbot_1.askChatbot; } });
Object.defineProperty(exports, "getFAQCategories", { enumerable: true, get: function () { return chatbot_1.getFAQCategories; } });
var resumeParser_1 = require("./resumeParser");
Object.defineProperty(exports, "parseResume", { enumerable: true, get: function () { return resumeParser_1.parseResume; } });
Object.defineProperty(exports, "buildCandidateProfileText", { enumerable: true, get: function () { return resumeParser_1.buildCandidateProfileText; } });
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "notifyApplicationReceived", { enumerable: true, get: function () { return notifications_1.notifyApplicationReceived; } });
Object.defineProperty(exports, "notifyStatusChanged", { enumerable: true, get: function () { return notifications_1.notifyStatusChanged; } });
Object.defineProperty(exports, "notifyInterviewScheduled", { enumerable: true, get: function () { return notifications_1.notifyInterviewScheduled; } });
Object.defineProperty(exports, "notifyInterviewReminder", { enumerable: true, get: function () { return notifications_1.notifyInterviewReminder; } });
Object.defineProperty(exports, "notifyInterviewCompleted", { enumerable: true, get: function () { return notifications_1.notifyInterviewCompleted; } });
Object.defineProperty(exports, "notifyJobMatch", { enumerable: true, get: function () { return notifications_1.notifyJobMatch; } });
Object.defineProperty(exports, "notifyProfileIncomplete", { enumerable: true, get: function () { return notifications_1.notifyProfileIncomplete; } });
var personalization_1 = require("./personalization");
Object.defineProperty(exports, "getPersonalizedRecommendations", { enumerable: true, get: function () { return personalization_1.getPersonalizedRecommendations; } });
Object.defineProperty(exports, "checkProfileCompleteness", { enumerable: true, get: function () { return personalization_1.checkProfileCompleteness; } });
Object.defineProperty(exports, "updatePreferences", { enumerable: true, get: function () { return personalization_1.updatePreferences; } });
