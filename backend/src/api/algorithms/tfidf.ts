/**
 * TF-IDF + Keyword Matching Engine
 *
 * Scoring based on raw matched word count with defined thresholds:
 *   0 matches        → 0–5%
 *   50–60 matches    → 45–50%
 *   300 matches      → 65–70%
 *   400+ matches     → 80–90%
 *
 * Address/location words are excluded from matching (low priority noise).
 */

// ── Location/Address noise words to exclude from matching ────────────────────
// These words appear in addresses and should NOT affect match score

const LOCATION_NOISE = new Set([
  // Nepal cities and places
  'kathmandu', 'tilottama', 'pokhara', 'lalitpur', 'bhaktapur', 'butwal',
  'biratnagar', 'birgunj', 'dharan', 'hetauda', 'itahari', 'nepalgunj',
  'bharatpur', 'janakpur', 'dhangadhi', 'tulsipur', 'lahan', 'ghorahi',
  'nepal', 'narayanghat', 'siddharthanagar', 'rupandehi', 'chitwan',
  // Generic location words
  'street', 'road', 'avenue', 'lane', 'block', 'sector', 'ward', 'zone',
  'district', 'province', 'city', 'town', 'village', 'municipality',
  'metropolitan', 'sub', 'north', 'south', 'east', 'west', 'central',
  'pvt', 'ltd', 'company', 'pvtltd',
]);

// ── Stopwords ─────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'shall','can','need','must','am','it','its','this','that','these','those',
  'i','we','you','he','she','they','my','our','your','his','her','their',
  'what','which','who','whom','when','where','why','how','all','each',
  'every','both','few','more','most','other','some','such','no','not',
  'only','same','so','than','too','very','just','as','up','out','if',
  'also','about','into','over','after','above','below','between','through',
  'during','before','since','without','within','along','following','across',
  'behind','beyond','plus','except','around','down','off','while','then',
  'than','there','here','where','when','who','whom','whose','which','that',
]);

// ── Tokenizer ─────────────────────────────────────────────────────────────────

export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\+\#\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(t =>
      t.length > 1 &&
      !STOPWORDS.has(t) &&
      !LOCATION_NOISE.has(t)   // exclude address/location noise
    );
}

// ── Score from unique skill keyword matches ───────────────────────────────────
// Max meaningful unique skill matches = 20
// Score = (matched unique skills / 20) × 100
// This gives a fair 0–100 scale based on skill coverage

function matchCountToScore(uniqueMatchCount: number): number {
  if (uniqueMatchCount === 0) return 0;
  // Cap at 20 for 100% — beyond 20 unique matches is still 100%
  const capped = Math.min(uniqueMatchCount, 20);
  return Math.round((capped / 20) * 100);
}

// ── TF helpers ────────────────────────────────────────────────────────────────

function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
  for (const [term, count] of tf) tf.set(term, count / tokens.length);
  return tf;
}

function computeIDF(documents: string[][]): Map<string, number> {
  const docCount = documents.length;
  const df = new Map<string, number>();
  for (const tokens of documents) {
    for (const term of new Set(tokens)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log((docCount + 1) / (count + 1)) + 1);
  }
  return idf;
}

function buildVector(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = computeTF(tokens);
  const vec = new Map<string, number>();
  for (const [term, tfVal] of tf) vec.set(term, tfVal * (idf.get(term) ?? 1));
  return vec;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, normA = 0, normB = 0;
  for (const [t, v] of a) { dot += v * (b.get(t) ?? 0); normA += v * v; }
  for (const [, v] of b) normB += v * v;
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Main Matching Function ────────────────────────────────────────────────────

export interface MatchResult {
  matchScore: number;
  matchedKeywords: string[];
  breakdown: {
    matchCount: number;
    keywordScore: number;
    tfidfScore: number;
  };
}

export function computeMatch(cvText: string, jobText: string): MatchResult {
  if (!cvText?.trim() || !jobText?.trim()) {
    return { matchScore: 0, matchedKeywords: [], breakdown: { matchCount: 0, keywordScore: 0, tfidfScore: 0 } };
  }

  const cvTokens  = tokenize(cvText);
  const jobTokens = tokenize(jobText);

  if (cvTokens.length === 0 || jobTokens.length === 0) {
    return { matchScore: 0, matchedKeywords: [], breakdown: { matchCount: 0, keywordScore: 0, tfidfScore: 0 } };
  }

  // ── Step 1: Unique skill keyword matches (primary score driver) ──────────
  // Count unique job keywords that appear in the CV (not raw occurrences)
  const cvSet = new Set(cvTokens);
  const uniqueJobTokens = [...new Set(jobTokens)];
  const matchedUniqueKeywords = uniqueJobTokens.filter(t => cvSet.has(t));
  const uniqueMatchCount = matchedUniqueKeywords.length;

  // ── Step 2: Convert unique match count to score (max 20 = 100%) ──────────
  const keywordScore = matchCountToScore(uniqueMatchCount);

  // ── Step 3: TF-IDF cosine as a secondary refinement ──────────────────────
  const allDocs = [cvTokens, jobTokens];
  const idf = computeIDF(allDocs);
  const cvVec  = buildVector(cvTokens, idf);
  const jobVec = buildVector(jobTokens, idf);
  const tfidfScore = Math.round(cosineSimilarity(cvVec, jobVec) * 100);

  // ── Step 4: Blend — keyword count score is primary (85%), TF-IDF refines (15%)
  const finalScore = Math.min(95, Math.round(keywordScore * 0.85 + tfidfScore * 0.15));

  // ── Step 5: Matched keywords — unique skill words in both (exclude noise) ─
  const matchedKeywords = matchedUniqueKeywords
    .filter(t => !LOCATION_NOISE.has(t))
    .slice(0, 15);

  return {
    matchScore: finalScore,
    matchedKeywords,
    breakdown: {
      matchCount: uniqueMatchCount,
      keywordScore,
      tfidfScore,
    },
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface JobMatchResult {
  jobId: number;
  title: string;
  score: number;
  matchedTerms: string[];
  breakdown?: { matchCount: number; keywordScore: number; tfidfScore: number };
}

export interface CandidateMatchResult {
  candidateId: number;
  name: string;
  email: string;
  cvUrl?: string;
  score: number;
  matchedTerms: string[];
  breakdown?: { matchCount: number; keywordScore: number; tfidfScore: number };
}

export function rankJobsForCandidate(
  candidateText: string,
  jobs: Array<{ id: number; title: string; description: string; requirements: string }>
): JobMatchResult[] {
  if (!candidateText?.trim() || jobs.length === 0) return [];

  return jobs
    .map(job => {
      const jobText = `${job.title} ${job.description} ${job.requirements}`;
      const result = computeMatch(candidateText, jobText);
      return {
        jobId: job.id,
        title: job.title,
        score: result.matchScore,
        matchedTerms: result.matchedKeywords,
        breakdown: result.breakdown,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankCandidatesForJob(
  job: { description: string; requirements: string; title: string },
  candidates: Array<{ id: number; name: string; email: string; cvUrl?: string; profileText: string }>
): CandidateMatchResult[] {
  if (candidates.length === 0) return [];

  const jobText = `${job.title} ${job.description} ${job.requirements}`;

  return candidates
    .map(candidate => {
      const result = computeMatch(candidate.profileText, jobText);
      return {
        candidateId: candidate.id,
        name: candidate.name,
        email: candidate.email,
        cvUrl: candidate.cvUrl,
        score: result.matchScore,
        matchedTerms: result.matchedKeywords,
        breakdown: result.breakdown,
      };
    })
    .sort((a, b) => b.score - a.score);
}
