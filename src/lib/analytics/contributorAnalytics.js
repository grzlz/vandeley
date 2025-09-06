export function analyzeContributors(commits) {
	const contributorStats = {};

	commits.forEach((commit) => {
		const author = commit.author;

		if (!contributorStats[author]) {
			contributorStats[author] = {
				name: author,
				email: commit.email,
				totalCommits: 0,
				totalInsertions: 0,
				totalDeletions: 0,
				filesModified: new Set(),
				firstCommit: commit.timestamp,
				lastCommit: commit.timestamp,
				commitsByDay: {},
				hourlyPattern: Array(24).fill(0),
				favoriteFiles: {}
			};
		}

		const stats = contributorStats[author];
		stats.totalCommits++;
		stats.totalInsertions += commit.insertions;
		stats.totalDeletions += commit.deletions;

		commit.filesChanged.forEach((file) => {
			stats.filesModified.add(file.filename);
			stats.favoriteFiles[file.filename] = (stats.favoriteFiles[file.filename] || 0) + 1;
		});

		if (commit.timestamp < stats.firstCommit) stats.firstCommit = commit.timestamp;
		if (commit.timestamp > stats.lastCommit) stats.lastCommit = commit.timestamp;

		const dayKey = new Date(commit.timestamp).toISOString().split('T')[0];
		stats.commitsByDay[dayKey] = (stats.commitsByDay[dayKey] || 0) + 1;

		const hour = new Date(commit.timestamp).getHours();
		stats.hourlyPattern[hour]++;
	});

	Object.values(contributorStats).forEach((stats) => {
		stats.filesModified = stats.filesModified.size;
		stats.activeDays = Object.keys(stats.commitsByDay).length;
		stats.averageCommitsPerDay = stats.totalCommits / stats.activeDays;
		stats.totalChanges = stats.totalInsertions + stats.totalDeletions;
		stats.averageChangesPerCommit = stats.totalChanges / stats.totalCommits;
		stats.contributionPeriod = stats.lastCommit - stats.firstCommit;

		stats.favoriteFiles = Object.entries(stats.favoriteFiles)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([filename, count]) => ({ filename, commits: count }));

		stats.peakHour = stats.hourlyPattern.indexOf(Math.max(...stats.hourlyPattern));
		stats.isNightOwl =
			stats.hourlyPattern
				.slice(22)
				.concat(stats.hourlyPattern.slice(0, 6))
				.reduce((sum, count) => sum + count, 0) >
			stats.totalCommits * 0.3;
	});

	return Object.values(contributorStats);
}

export function getCollaborationMatrix(commits) {
	const fileAuthors = {};
	const collaborationPairs = {};

	commits.forEach((commit) => {
		commit.filesChanged.forEach((file) => {
			if (!fileAuthors[file.filename]) {
				fileAuthors[file.filename] = new Set();
			}
			fileAuthors[file.filename].add(commit.author);
		});
	});

	Object.values(fileAuthors).forEach((authors) => {
		const authorList = Array.from(authors);
		if (authorList.length > 1) {
			for (let i = 0; i < authorList.length; i++) {
				for (let j = i + 1; j < authorList.length; j++) {
					const pair = [authorList[i], authorList[j]].sort().join(' & ');
					collaborationPairs[pair] = (collaborationPairs[pair] || 0) + 1;
				}
			}
		}
	});

	const sharedFiles = Object.entries(fileAuthors)
		.filter(([, authors]) => authors.size > 1)
		.map(([filename, authors]) => ({
			filename,
			authors: Array.from(authors),
			authorCount: authors.size
		}))
		.sort((a, b) => b.authorCount - a.authorCount);

	return {
		collaborationPairs,
		sharedFiles,
		totalSharedFiles: sharedFiles.length
	};
}
