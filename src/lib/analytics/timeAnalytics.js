export function analyzeCommitTiming(commits) {
	const hourlyActivity = Array(24).fill(0);
	const dailyActivity = {};
	const monthlyActivity = {};
	const weeklyPattern = Array(7).fill(0);

	commits.forEach((commit) => {
		const date = new Date(commit.timestamp);
		const hour = date.getHours();
		const dayKey = date.toISOString().split('T')[0];
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const dayOfWeek = date.getDay();

		hourlyActivity[hour]++;
		dailyActivity[dayKey] = (dailyActivity[dayKey] || 0) + 1;
		monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;
		weeklyPattern[dayOfWeek]++;
	});

	const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
	const mostActiveDay = Object.keys(dailyActivity).reduce((a, b) =>
		dailyActivity[a] > dailyActivity[b] ? a : b
	);

	const workingHours = hourlyActivity.slice(9, 18).reduce((sum, count) => sum + count, 0);
	const afterHours = hourlyActivity
		.slice(18)
		.concat(hourlyActivity.slice(0, 9))
		.reduce((sum, count) => sum + count, 0);

	return {
		hourlyActivity,
		dailyActivity,
		monthlyActivity,
		weeklyPattern,
		peakHour,
		mostActiveDay,
		workingHoursCommits: workingHours,
		afterHoursCommits: afterHours,
		workLifeBalance: workingHours / (workingHours + afterHours)
	};
}

export function analyzeCommitVelocity(commits) {
	const sortedCommits = commits.sort((a, b) => a.timestamp - b.timestamp);
	const velocityData = [];

	for (let i = 1; i < sortedCommits.length; i++) {
		const timeDiff = sortedCommits[i].timestamp - sortedCommits[i - 1].timestamp;
		const hoursDiff = timeDiff / (1000 * 60 * 60);

		velocityData.push({
			date: new Date(sortedCommits[i].timestamp),
			timeBetweenCommits: hoursDiff,
			codeChanges: sortedCommits[i].insertions + sortedCommits[i].deletions,
			filesChanged: sortedCommits[i].filesChanged.length
		});
	}

	const averageTimeBetweenCommits =
		velocityData.reduce((sum, data) => sum + data.timeBetweenCommits, 0) / velocityData.length;

	const averageChangesPerCommit =
		commits.reduce((sum, commit) => sum + commit.insertions + commit.deletions, 0) / commits.length;

	return {
		velocityData,
		averageTimeBetweenCommits,
		averageChangesPerCommit,
		totalCommitDays: new Set(commits.map((c) => new Date(c.timestamp).toISOString().split('T')[0]))
			.size
	};
}
