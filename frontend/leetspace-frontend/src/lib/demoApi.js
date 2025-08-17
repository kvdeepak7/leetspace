import { demoProblems } from "./demoData";

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
		// basic stats
		const total_problems = problems.length;
		const retry_count = problems.filter((p) => p.retry_later === "Yes").length;
		const uniqueDates = new Set(problems.map((p) => p.date_solved));
		const total_active_days = uniqueDates.size;
		const diffCounts = { easy: 0, medium: 0, hard: 0 };
		for (const p of problems) {
			if (p.difficulty === "Easy") diffCounts.easy += 1;
			if (p.difficulty === "Medium") diffCounts.medium += 1;
			if (p.difficulty === "Hard") diffCounts.hard += 1;
		}
		const tags = {};
		for (const p of problems) {
			for (const t of p.tags || []) tags[t] = (tags[t] || 0) + 1;
		}
		const most_used_tags = Object.entries(tags)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([tag, count]) => ({ tag, count }));

		// weaknesses (retry rate > 30% with >=3 problems)
		const perTag = {};
		for (const p of problems) {
			for (const t of p.tags || []) {
				perTag[t] = perTag[t] || { total: 0, retry: 0 };
				perTag[t].total += 1;
				if (p.retry_later === "Yes") perTag[t].retry += 1;
			}
		}
		const weaknesses = Object.entries(perTag)
			.filter(([, v]) => v.total >= 3 && v.retry / v.total > 0.3)
			.map(([tag, v]) => ({ tag, retry_rate: Math.round((v.retry / v.total) * 100), total_problems: v.total, retry_count: v.retry }))
			.sort((a, b) => b.retry_rate - a.retry_rate);

		// today's revision: pick highest days_since among retry-later
		const today = new Date("2025-02-15");
		const retry = problems.filter((p) => p.retry_later === "Yes");
		let todays_revision = null;
		if (retry.length) {
			const withPriority = retry.map((p) => {
				const [y, m, d] = p.date_solved.split("-").map(Number);
				const solved = new Date(y, m - 1, d);
				const days_since = Math.floor((today - solved) / (1000 * 60 * 60 * 24));
				const bonus = p.difficulty === "Hard" ? 3 : p.difficulty === "Medium" ? 2 : 1;
				return { p, score: days_since * bonus, days_since };
			}).sort((a, b) => b.score - a.score);
			todays_revision = {
				id: withPriority[0].p.id,
				title: withPriority[0].p.title,
				difficulty: withPriority[0].p.difficulty,
				tags: withPriority[0].p.tags || [],
				days_since_solved: withPriority[0].days_since,
			};
		}

		// heatmap last 365 days (sparse synthetic from data dates)
		const datesCount = {};
		for (const p of problems) datesCount[p.date_solved] = (datesCount[p.date_solved] || 0) + 1;
		const heatmap = [];
		const start = new Date("2024-02-16");
		for (let i = 0; i <= 365; i++) {
			const dt = new Date(start.getTime() + i * 86400000);
			const ds = dt.toISOString().slice(0, 10);
			const count = datesCount[ds] || 0;
			heatmap.push({ date: ds, count, level: Math.min(count, 4) });
		}

		// recent activity: 5 most recent
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