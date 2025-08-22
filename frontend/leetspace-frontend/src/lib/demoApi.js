import { demoProblems } from "./demoData";
import { getNextRevision, getTodaysRevisions } from "./spacedRepetition";

const copy = (obj) => JSON.parse(JSON.stringify(obj));

export const demoApi = {
	getProblems: async ({ sort_by = "date_solved", order = "desc" } = {}) => {
		const sorted = [...demoProblems].sort((a, b) => {
			if (sort_by === "date_solved") {
				return order === "desc"
					? (a.date_solved < b.date_solved ? 1 : -1)
					: (a.date_solved > b.date_solved ? 1 : -1);
			}
			return 0;
		});
		return { data: { count: sorted.length, problems: copy(sorted) } };
	},

	getProblem: async (id) => {
		const found = demoProblems.find((p) => p.id === id);
		if (!found) throw new Error("Not found");
		return { data: copy(found) };
	},

	getDashboard: async () => {
		const problems = demoProblems;
		
		// Enhanced basic stats with educational context
		const total_problems = problems.length;
		const retry_count = problems.filter((p) => p.retry_later === "Yes").length;
		const uniqueDates = new Set(problems.map((p) => p.date_solved));
		const total_active_days = uniqueDates.size;
		
		// Difficulty breakdown based on feature importance
		const diffCounts = { easy: 0, medium: 0, hard: 0 };
		for (const p of problems) {
			if (p.difficulty === "Easy") diffCounts.easy += 1;
			if (p.difficulty === "Medium") diffCounts.medium += 1;
			if (p.difficulty === "Hard") diffCounts.hard += 1;
		}
		
		// Educational tags that show learning focus
		const tags = {};
		for (const p of problems) {
			for (const t of p.tags || []) tags[t] = (tags[t] || 0) + 1;
		}
		const most_used_tags = Object.entries(tags)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([tag, count]) => ({ tag, count }));

		// Educational weaknesses - concepts that need more practice
		const perTag = {};
		for (const p of problems) {
			for (const t of p.tags || []) {
				perTag[t] = perTag[t] || { total: 0, retry: 0 };
				perTag[t].total += 1;
				if (p.retry_later === "Yes") perTag[t].retry += 1;
			}
		}
		const weaknesses = Object.entries(perTag)
			.filter(([, v]) => v.total >= 2 && v.retry / v.total > 0.2)
			.map(([tag, v]) => ({ 
				tag, 
				retry_rate: Math.round((v.retry / v.total) * 100), 
				total_problems: v.total, 
				retry_count: v.retry 
			}))
			.sort((a, b) => b.retry_rate - a.retry_rate);

		// Today's revision using spaced repetition system
		const today = new Date("2025-02-15");
		let todays_revision = null;

		// Add some demo spaced repetition data to problems
		const problemsWithSR = problems.map(p => {
			// Simulate some problems having been reviewed before
			if (p.id === "demo3" || p.id === "demo4") {
				return {
					...p,
					spaced_repetition: {
						repetitions: p.id === "demo3" ? 2 : 1,
						interval: p.id === "demo3" ? 6 : 1,
						easiness: 2.5,
						next_review: p.id === "demo3" ? "2025-02-15" : "2025-02-16",
						last_reviewed: p.id === "demo3" ? "2025-02-09" : "2025-02-15",
						review_history: []
					}
				};
			}
			return p;
		});

		// Get today's revision using the spaced repetition system
		todays_revision = getNextRevision(problemsWithSR);

		// If no revision from SR system, fall back to old logic
		if (!todays_revision) {
			const retry = problems.filter((p) => p.retry_later === "Yes");
			if (retry.length) {
				const withPriority = retry.map((p) => {
					const [y, m, d] = p.date_solved.split("-").map(Number);
					const solved = new Date(y, m - 1, d);
					const days_since = Math.floor((today - solved) / (1000 * 60 * 60 * 24));
					// Higher difficulty and tutorial problems get priority
					const difficultyBonus = p.difficulty === "Hard" ? 3 : p.difficulty === "Medium" ? 2 : 1;
					const tutorialBonus = p.tags.includes("tutorial") ? 2 : 1;
					return { p, score: days_since * difficultyBonus * tutorialBonus, days_since };
				}).sort((a, b) => b.score - a.score);
				todays_revision = {
					id: withPriority[0].p.id,
					title: withPriority[0].p.id,
					difficulty: withPriority[0].p.difficulty,
					tags: withPriority[0].p.tags || [],
					days_since_solved: withPriority[0].days_since,
				};
			}
		}

		// Add days_since_solved if not present
		if (todays_revision && !todays_revision.days_since_solved) {
			const today = new Date("2025-02-15");
			const [y, m, d] = todays_revision.date_solved.split("-").map(Number);
			const solved = new Date(y, m - 1, d);
			todays_revision.days_since_solved = Math.floor((today - solved) / (1000 * 60 * 60 * 24));
		}

		// Educational activity heatmap - shows consistent learning
		const datesCount = {};
		for (const p of problems) datesCount[p.date_solved] = (datesCount[p.date_solved] || 0) + 1;
		const heatmap = [];
		const start = new Date("2024-02-16");
		for (let i = 0; i <= 365; i++) {
			const dt = new Date(start.getTime() + i * 86400000);
			const ds = dt.toISOString().slice(0, 10);
			const count = datesCount[ds] || 0;
			// Show realistic learning pattern
			const level = Math.min(count, 4);
			heatmap.push({ date: ds, count, level });
		}

		// Recent activity - educational progress
		const recent = [...problems]
			.sort((a, b) => (a.date_solved < b.date_solved ? 1 : -1))
			.slice(0, 5)
			.map((p) => ({
				id: p.id,
				title: p.title,
				difficulty: p.difficulty,
				tags: (p.tags || []).slice(0, 3),
				time_ago: "Recently"
			}));

		return {
			data: {
				basic_stats: {
					total_problems,
					retry_count,
					total_active_days,
					difficulty_breakdown: diffCounts,
					most_used_tags,
				},
				weaknesses,
				todays_revision,
				activity_heatmap: heatmap,
				recent_activity: recent,
			},
		};
	},
};