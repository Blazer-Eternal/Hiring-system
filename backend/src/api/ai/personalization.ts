/**
 * Basic Personalization Engine
 * Tracks candidate behavior and generates personalized job recommendations
 * Uses TF-IDF cosine similarity under the hood
 */

import NodeCache from 'node-cache';
import { rankJobsForCandidate, JobMatchResult } from '../algorithms';
import { buildCandidateProfileText } from './resumeParser';

// Cache recommendations for 10 minutes to avoid recomputing on every request
const recommendationCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Candidate Preference Profile 

export interface CandidatePreferences {
  candidateId: number;
  viewedJobIds: number[];
  appliedJobIds: number[];
  preferredLocations: string[];
  preferredDepartments: string[];
  lastActive: Date;
}

// In-memory preference store (would be persisted to DB in production)
const preferenceStore = new Map<number, CandidatePreferences>();

export function updatePreferences(
  candidateId: number,
  update: Partial<Omit<CandidatePreferences, 'candidateId'>>
): void {
  const existing = preferenceStore.get(candidateId) ?? {
    candidateId,
    viewedJobIds: [],
    appliedJobIds: [],
    preferredLocations: [],
    preferredDepartments: [],
    lastActive: new Date(),
  };

  if (update.viewedJobIds) {
    existing.viewedJobIds = [...new Set([...existing.viewedJobIds, ...update.viewedJobIds])];
  }
  if (update.appliedJobIds) {
    existing.appliedJobIds = [...new Set([...existing.appliedJobIds, ...update.appliedJobIds])];
  }
  if (update.preferredLocations) {
    existing.preferredLocations = [...new Set([...existing.preferredLocations, ...update.preferredLocations])];
  }
  if (update.preferredDepartments) {
    existing.preferredDepartments = [...new Set([...existing.preferredDepartments, ...update.preferredDepartments])];
  }
  existing.lastActive = new Date();
  preferenceStore.set(candidateId, existing);

  // Invalidate cache when preferences change
  recommendationCache.del(`rec:${candidateId}`);
}

// ── Personalized Job Recommendations

export interface PersonalizedRecommendation extends JobMatchResult {
  reason: string;
  isNew: boolean;
}

export function getPersonalizedRecommendations(
  candidate: {
    id: number;
    name: string;
    temporaryAddress?: string;
    permanentAddress?: string;
    cvText?: string;
  },
  jobs: Array<{
    id: number;
    title: string;
    description: string;
    requirements: string;
    department: string;
    location: string;
    status: string;
  }>,
  limit: number = 5
): PersonalizedRecommendation[] {
  const cacheKey = `rec:${candidate.id}`;
  const cached = recommendationCache.get<PersonalizedRecommendation[]>(cacheKey);
  if (cached) return cached;

  const prefs = preferenceStore.get(candidate.id);
  const appliedIds = new Set(prefs?.appliedJobIds ?? []);
  const viewedIds = new Set(prefs?.viewedJobIds ?? []);

  // Only recommend open jobs the candidate hasn't applied to
  const eligibleJobs = jobs.filter(j => j.status === 'open' && !appliedIds.has(j.id));

  if (eligibleJobs.length === 0) return [];

  const profileText = buildCandidateProfileText({
    name: candidate.name,
    temporaryAddress: candidate.temporaryAddress,
    permanentAddress: candidate.permanentAddress,
    cvText: candidate.cvText,
  });

  const ranked = rankJobsForCandidate(profileText, eligibleJobs);

  // Apply preference boosts
  const boosted = ranked.map(r => {
    const job = eligibleJobs.find(j => j.id === r.jobId)!;
    let boost = 0;
    let reason = `${r.score}% profile match`;

    if (prefs?.preferredLocations.some(l => job.location.toLowerCase().includes(l.toLowerCase()))) {
      boost += 10;
      reason += ', preferred location';
    }
    if (prefs?.preferredDepartments.some(d => job.department.toLowerCase().includes(d.toLowerCase()))) {
      boost += 10;
      reason += ', preferred department';
    }

    return {
      ...r,
      score: Math.min(100, r.score + boost),
      reason,
      isNew: !viewedIds.has(r.jobId),
    };
  });

  // Sort: new jobs first, then by score
  const result = boosted
    .sort((a, b) => {
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
      return b.score - a.score;
    })
    .slice(0, limit);

  recommendationCache.set(cacheKey, result);
  return result;
}

// ── Profile Completeness

export interface ProfileCompletenessResult {
  score: number;          // 0–100
  missingFields: string[];
  suggestions: string[];
}

export function checkProfileCompleteness(candidate: {
  name?: string;
  email?: string;
  phoneNumber?: string;
  temporaryAddress?: string;
  permanentAddress?: string;
  cvUrl?: string;
}): ProfileCompletenessResult {
  const checks: Array<{ field: string; present: boolean; suggestion: string }> = [
    { field: 'name',             present: !!candidate.name,             suggestion: 'Add your full name' },
    { field: 'email',            present: !!candidate.email,            suggestion: 'Add your email address' },
    { field: 'phoneNumber',      present: !!candidate.phoneNumber,      suggestion: 'Add your phone number for recruiter contact' },
    { field: 'temporaryAddress', present: !!candidate.temporaryAddress, suggestion: 'Add your current address' },
    { field: 'permanentAddress', present: !!candidate.permanentAddress, suggestion: 'Add your permanent address' },
    { field: 'cvUrl',            present: !!candidate.cvUrl,            suggestion: 'Upload your CV — recruiters need this to review your application' },
  ];

  const missing = checks.filter(c => !c.present);
  const score = Math.round(((checks.length - missing.length) / checks.length) * 100);

  return {
    score,
    missingFields: missing.map(c => c.field),
    suggestions: missing.map(c => c.suggestion),
  };
}
