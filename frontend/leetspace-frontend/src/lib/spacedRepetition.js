// Spaced Repetition System for LeetSpace
// Implements a simple but effective spaced repetition algorithm

/**
 * Calculate the next review date based on performance
 * @param {Object} problem - Problem object with SR fields
 * @param {number} quality - Review quality (0-5, where 0=fail, 5=perfect)
 * @returns {Object} Updated problem with new SR fields
 */
export const calculateNextReview = (problem, quality) => {
  // Initialize SR fields if they don't exist
  if (!problem.spaced_repetition) {
    problem.spaced_repetition = {
      repetitions: 0,
      interval: 1,
      easiness: 2.5,
      next_review: null,
      last_reviewed: null,
      review_history: []
    };
  }

  const sr = problem.spaced_repetition;
  const today = new Date();

  // Record this review
  sr.last_reviewed = today;
  sr.review_history.push({
    date: today,
    quality: quality,
    interval: sr.interval
  });

  // Calculate next interval based on quality
  if (quality < 3) {
    // Failed review - reset to daily
    sr.repetitions = 0;
    sr.interval = 1;
  } else {
    // Successful review - increase interval
    sr.repetitions += 1;
    
    if (sr.repetitions === 1) {
      sr.interval = 1; // Next day
    } else if (sr.repetitions === 2) {
      sr.interval = 6; // 6 days later
    } else {
      // Exponential growth with easiness factor
      sr.interval = Math.round(sr.interval * sr.easiness);
    }

    // Adjust easiness factor based on performance
    // Higher quality = easier, lower quality = harder
    const easinessChange = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    sr.easiness = Math.max(1.3, sr.easiness + easinessChange);
  }

  // Calculate next review date
  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + sr.interval);
  sr.next_review = nextReview;

  return problem;
};

/**
 * Skip today's revision (moves to tomorrow with penalty)
 * @param {Object} problem - Problem object
 * @returns {Object} Updated problem
 */
export const skipRevision = (problem) => {
  if (!problem.spaced_repetition) {
    problem.spaced_repetition = {
      repetitions: 0,
      interval: 1,
      easiness: 2.5,
      next_review: null,
      last_reviewed: null,
      review_history: []
    };
  }

  const sr = problem.spaced_repetition;
  const today = new Date();

  // Move to tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  sr.next_review = tomorrow;

  // Small penalty for skipping (increase interval slightly)
  sr.interval = Math.min(sr.interval + 1, 30);
  
  // Record the skip
  sr.review_history.push({
    date: today,
    action: 'skipped',
    interval: sr.interval
  });

  return problem;
};

/**
 * Get problems that need revision today
 * @param {Array} problems - Array of problem objects
 * @returns {Array} Problems that need revision today
 */
export const getTodaysRevisions = (problems) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return problems.filter(problem => {
    // If no SR data, check if it's marked for retry
    if (!problem.spaced_repetition) {
      return problem.retry_later === "Yes";
    }

    // Check if next review is due today or overdue
    if (problem.spaced_repetition.next_review) {
      const nextReview = new Date(problem.spaced_repetition.next_review);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= today;
    }

    // Fallback to retry_later flag
    return problem.retry_later === "Yes";
  });
};

/**
 * Get the priority score for a revision problem
 * @param {Object} problem - Problem object
 * @returns {number} Priority score (higher = more urgent)
 */
export const getRevisionPriority = (problem) => {
  let score = 0;

  // Base score from days since last review
  if (problem.spaced_repetition?.last_reviewed) {
    const daysSince = Math.floor((new Date() - new Date(problem.spaced_repetition.last_reviewed)) / (1000 * 60 * 60 * 24));
    score += daysSince * 2;
  }

  // Difficulty bonus
  if (problem.difficulty === "Hard") score += 10;
  else if (problem.difficulty === "Medium") score += 5;
  else score += 2;

  // Tag-based priority
  if (problem.tags?.includes("tutorial")) score += 3;
  if (problem.tags?.includes("fundamental")) score += 2;

  // Retry later bonus
  if (problem.retry_later === "Yes") score += 5;

  return score;
};

/**
 * Sort revision problems by priority
 * @param {Array} problems - Array of problems that need revision
 * @returns {Array} Sorted problems by priority
 */
export const sortRevisionsByPriority = (problems) => {
  return problems
    .map(problem => ({
      ...problem,
      priority: getRevisionPriority(problem)
    }))
    .sort((a, b) => b.priority - a.priority);
};

/**
 * Get the next revision problem for today
 * @param {Array} problems - Array of all problems
 * @returns {Object|null} The next problem to revise, or null if none
 */
export const getNextRevision = (problems) => {
  const todaysRevisions = getTodaysRevisions(problems);
  if (todaysRevisions.length === 0) return null;

  const sortedRevisions = sortRevisionsByPriority(todaysRevisions);
  return sortedRevisions[0];
};
