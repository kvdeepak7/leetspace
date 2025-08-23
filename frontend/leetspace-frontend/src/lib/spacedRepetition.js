// spacedRepetition.js

// SM-2 Algorithm Implementation for Spaced Repetition
// Based on the SuperMemo 2 algorithm

/**
 * Calculate the next review interval using SM-2 algorithm
 * @param {Object} problem - Problem object with spaced_repetition data
 * @param {number} quality - Quality rating (0-5)
 * @returns {Object} Updated problem with new spaced repetition data
 */
export function calculateNextReview(problem, quality) {
  // Initialize spaced repetition data if it doesn't exist
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

  // Update easiness factor based on quality
  sr.easiness = Math.max(1.3, sr.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Calculate new interval
  if (quality >= 3) {
    // Successful recall
    if (sr.repetitions === 0) {
      sr.interval = 1;
    } else if (sr.repetitions === 1) {
      sr.interval = 6;
    } else {
      sr.interval = Math.round(sr.interval * sr.easiness);
    }
    sr.repetitions += 1;
  } else {
    // Failed recall - reset to beginning
    sr.repetitions = 0;
    sr.interval = 1;
  }

  // Calculate next review date
  const nextReview = new Date(today);
  nextReview.setDate(today.getDate() + sr.interval);
  sr.next_review = nextReview.toISOString();
  sr.last_reviewed = today.toISOString();

  // Add to review history
  sr.review_history.push({
    date: today.toISOString(),
    quality: quality,
    interval: sr.interval
  });

  // Keep only last 10 reviews to prevent memory bloat
  if (sr.review_history.length > 10) {
    sr.review_history = sr.review_history.slice(-10);
  }

  return problem;
}

/**
 * Skip today's revision (reschedule for tomorrow)
 * @param {Object} problem - Problem object with spaced repetition data
 * @returns {Object} Updated problem with rescheduled review
 */
export function skipRevision(problem) {
  // Initialize spaced repetition data if it doesn't exist
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

  // Reschedule for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  sr.next_review = tomorrow.toISOString();

  // Add skip action to history
  sr.review_history.push({
    date: today.toISOString(),
    quality: null,
    interval: 1,
    action: 'skipped'
  });

  // Keep only last 10 reviews
  if (sr.review_history.length > 10) {
    sr.review_history = sr.review_history.slice(-10);
  }

  return problem;
}

/**
 * Get the next problem that needs revision today
 * @param {Array} problems - Array of problem objects
 * @returns {Object|null} Problem that needs revision today, or null if none
 */
export function getNextRevision(problems) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Filter problems that need revision today
  const dueProblems = problems.filter(problem => {
    if (!problem.spaced_repetition || !problem.spaced_repetition.next_review) {
      return false;
    }

    const nextReview = new Date(problem.spaced_repetition.next_review);
    const nextReviewStr = nextReview.toISOString().split('T')[0];
    
    return nextReviewStr <= todayStr;
  });

  if (dueProblems.length === 0) {
    return null;
  }

  // Sort by priority: overdue problems first, then by difficulty
  dueProblems.sort((a, b) => {
    const aNext = new Date(a.spaced_repetition.next_review);
    const bNext = new Date(b.spaced_repetition.next_review);
    
    // First priority: overdue problems
    if (aNext < today && bNext >= today) return -1;
    if (aNext >= today && bNext < today) return 1;
    
    // Second priority: difficulty (harder problems first)
    const difficultyOrder = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
    const aDiff = difficultyOrder[a.difficulty] || 1;
    const bDiff = difficultyOrder[b.difficulty] || 1;
    
    if (aDiff !== bDiff) {
      return bDiff - aDiff;
    }
    
    // Third priority: earliest next review
    return aNext - bNext;
  });

  return dueProblems[0];
}

/**
 * Get all problems that need revision today
 * @param {Array} problems - Array of problem objects
 * @returns {Array} Array of problems that need revision today
 */
export function getTodaysRevisions(problems) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return problems.filter(problem => {
    if (!problem.spaced_repetition || !problem.spaced_repetition.next_review) {
      return false;
    }

    const nextReview = new Date(problem.spaced_repetition.next_review);
    const nextReviewStr = nextReview.toISOString().split('T')[0];
    
    return nextReviewStr <= todayStr;
  });
}

/**
 * Calculate review statistics for a problem
 * @param {Object} problem - Problem object with spaced repetition data
 * @returns {Object} Review statistics
 */
export function getReviewStats(problem) {
  if (!problem.spaced_repetition) {
    return {
      totalReviews: 0,
      averageQuality: 0,
      successRate: 0,
      lastReview: null,
      nextReview: null
    };
  }

  const sr = problem.spaced_repetition;
  const reviews = sr.review_history.filter(r => r.quality !== null);
  
  const totalReviews = reviews.length;
  const averageQuality = totalReviews > 0 
    ? reviews.reduce((sum, r) => sum + r.quality, 0) / totalReviews 
    : 0;
  const successRate = totalReviews > 0 
    ? (reviews.filter(r => r.quality >= 3).length / totalReviews) * 100 
    : 0;

  return {
    totalReviews,
    averageQuality: Math.round(averageQuality * 100) / 100,
    successRate: Math.round(successRate * 100) / 100,
    lastReview: sr.last_reviewed,
    nextReview: sr.next_review
  };
}
