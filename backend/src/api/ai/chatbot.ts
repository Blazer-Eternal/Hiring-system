/**
 * Basic FAQ Chatbot
 * Uses Jaccard similarity to match user questions to known answers
 * No external API needed — fully self-contained
 */

// ── FAQ Knowledge Base ───────────────────────────────────────────────────────

interface FAQEntry {
  id: string;
  questions: string[];   // multiple phrasings
  answer: string;
  category: 'application' | 'interview' | 'profile' | 'jobs' | 'account' | 'general';
}

const FAQ_KB: FAQEntry[] = [
  // Application
  {
    id: 'how_apply',
    questions: ['how do i apply for a job', 'how to apply', 'apply for position', 'submit application'],
    answer: 'To apply for a job: 1) Create your candidate profile at POST /api/v1/can, 2) Browse open jobs at GET /api/v1/job, 3) Submit your application at POST /api/v1/app with the jobId. Make sure your CV URL is uploaded in your profile.',
    category: 'application',
  },
  {
    id: 'track_application',
    questions: ['track my application', 'check application status', 'where is my application', 'application progress'],
    answer: 'You can track all your applications at GET /api/v1/app/my. Each application shows its current status: Applied → Under Review → Interview → Hired/Rejected.',
    category: 'application',
  },
  {
    id: 'duplicate_application',
    questions: ['apply twice', 'apply same job again', 'reapply', 'duplicate application'],
    answer: 'You can only apply once per job. If you have already applied, your existing application will be shown when you check GET /api/v1/app/my.',
    category: 'application',
  },
  {
    id: 'withdraw_application',
    questions: ['withdraw application', 'cancel application', 'remove application'],
    answer: 'Currently, applications cannot be withdrawn once submitted. Please contact the recruiter directly if you need to withdraw.',
    category: 'application',
  },
  // Interview
  {
    id: 'interview_schedule',
    questions: ['when is my interview', 'interview schedule', 'interview date', 'interview time'],
    answer: 'View your upcoming interviews at GET /api/v1/inter. Each interview shows the scheduled date, duration, status, and feedback from the recruiter.',
    category: 'interview',
  },
  {
    id: 'interview_prepare',
    questions: ['how to prepare for interview', 'interview tips', 'prepare interview', 'interview advice'],
    answer: 'Tips for your interview: 1) Review the job description carefully, 2) Research the company, 3) Prepare examples of your past work, 4) Be on time, 5) Check your interview details at GET /api/v1/inter.',
    category: 'interview',
  },
  {
    id: 'interview_feedback',
    questions: ['interview feedback', 'recruiter feedback', 'interview result', 'interview rating'],
    answer: 'After your interview is completed, the recruiter will add feedback and a rating (1-5). You can view this at GET /api/v1/inter/:id.',
    category: 'interview',
  },
  // Profile
  {
    id: 'create_profile',
    questions: ['create profile', 'set up profile', 'register candidate', 'how to create account'],
    answer: 'Create your candidate profile at POST /api/v1/can with your name, email, phone number, addresses, and CV URL. You must be registered as a user (role: user) first.',
    category: 'profile',
  },
  {
    id: 'update_profile',
    questions: ['update profile', 'edit profile', 'change my information', 'update cv'],
    answer: 'Update your profile at PUT /api/v1/can/:id. You can update your name, phone number, addresses, and CV URL.',
    category: 'profile',
  },
  {
    id: 'cv_upload',
    questions: ['upload cv', 'upload resume', 'add cv', 'cv url', 'resume link'],
    answer: 'Add your CV as a URL in your candidate profile (cvUrl field). Host your CV on Google Drive, Dropbox, or any public URL and paste the link when creating/updating your profile.',
    category: 'profile',
  },
  // Jobs
  {
    id: 'browse_jobs',
    questions: ['find jobs', 'browse jobs', 'see available jobs', 'job listings', 'open positions'],
    answer: 'Browse all open jobs at GET /api/v1/job. You can filter by status (open/closed) or recruiterId. No login required to view jobs.',
    category: 'jobs',
  },
  {
    id: 'job_requirements',
    questions: ['job requirements', 'what skills needed', 'job description', 'job details'],
    answer: 'View full job details including requirements, department, location, and salary range at GET /api/v1/job/:id.',
    category: 'jobs',
  },
  // Account
  {
    id: 'forgot_password',
    questions: ['forgot password', 'reset password', 'change password', 'lost password'],
    answer: 'Password reset is not yet available through the API. Please contact the system administrator for assistance.',
    category: 'account',
  },
  {
    id: 'login_issue',
    questions: ['cannot login', 'login failed', 'invalid credentials', 'login problem'],
    answer: 'If you cannot login: 1) Check your email and password are correct, 2) Ensure you are using the right role, 3) Your token expires after 1 hour — please login again.',
    category: 'account',
  },
  // General
  {
    id: 'hiring_process',
    questions: ['hiring process', 'recruitment process', 'how does hiring work', 'steps to get hired'],
    answer: 'Our hiring process: 1) Apply for a job, 2) Recruiter reviews your application, 3) If shortlisted, an interview is scheduled, 4) After the interview, the recruiter provides feedback, 5) Final decision: Hired or Rejected.',
    category: 'general',
  },
  {
    id: 'contact_recruiter',
    questions: ['contact recruiter', 'reach recruiter', 'recruiter email', 'talk to recruiter'],
    answer: 'Recruiter contact details are available when your application is in the Interview or Hired stage. Check your application details at GET /api/v1/app/my.',
    category: 'general',
  },
];

// Simple TF-IDF matching for chatbot

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
}

function similarity(queryTokens: string[], docTokens: string[]): number {
  const querySet = new Set(queryTokens);
  const docSet = new Set(docTokens);
  const intersection = [...querySet].filter(t => docSet.has(t)).length;
  const union = new Set([...querySet, ...docSet]).size;
  return union === 0 ? 0 : intersection / union; // Jaccard similarity
}
// Public API
export interface ChatbotResponse {
  answer: string;
  category: string;
  confidence: number;   // 0–100
  suggestions: string[];
}

export function askChatbot(question: string): ChatbotResponse {
  const queryTokens = tokenize(question);

  let bestScore = 0;
  let bestEntry: FAQEntry | null = null;

  for (const entry of FAQ_KB) {
    for (const q of entry.questions) {
      const score = similarity(queryTokens, tokenize(q));
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }
  }

  const confidence = Math.round(bestScore * 100);

  if (!bestEntry || confidence < 15) {
    return {
      answer: "I'm sorry, I couldn't find an answer to your question. Please contact support or browse our FAQ categories: application, interview, profile, jobs, account.",
      category: 'general',
      confidence: 0,
      suggestions: [
        'How do I apply for a job?',
        'How do I track my application?',
        'When is my interview?',
        'How do I create my profile?',
      ],
    };
  }

  // Suggest related questions from same category
  const suggestions = FAQ_KB
    .filter(e => e.category === bestEntry!.category && e.id !== bestEntry!.id)
    .slice(0, 3)
    .map(e => e.questions[0]);

  return {
    answer: bestEntry.answer,
    category: bestEntry.category,
    confidence,
    suggestions,
  };
}

export function getFAQCategories(): Record<string, string[]> {
  const categories: Record<string, string[]> = {};
  for (const entry of FAQ_KB) {
    if (!categories[entry.category]) categories[entry.category] = [];
    categories[entry.category].push(entry.questions[0]);
  }
  return categories;
}
