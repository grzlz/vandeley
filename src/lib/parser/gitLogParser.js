export function parseGitLog(gitLogText) {
	const commits = [];
	const lines = gitLogText.split('\n');
	let currentCommit = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (line.startsWith('commit ')) {
			if (currentCommit) {
				commits.push(currentCommit);
			}
			currentCommit = {
				hash: line.substring(7).split(' ')[0],
				author: null,
				email: null,
				date: null,
				timestamp: null,
				message: '',
				filesChanged: [],
				insertions: 0,
				deletions: 0
			};
		} else if (line.startsWith('Author: ') && currentCommit) {
			const authorMatch = line.match(/Author: (.+) <(.+)>/);
			if (authorMatch) {
				currentCommit.author = authorMatch[1];
				currentCommit.email = authorMatch[2];
			}
		} else if (line.startsWith('Date: ') && currentCommit) {
			const dateStr = line.substring(6).trim();
			currentCommit.date = dateStr;
			currentCommit.timestamp = new Date(dateStr).getTime();
		} else if (
			line &&
			!line.startsWith('commit ') &&
			!line.startsWith('Author: ') &&
			!line.startsWith('Date: ') &&
			currentCommit
		) {
			if (line.includes('|') && (line.includes('+') || line.includes('-'))) {
				const fileMatch = line.match(/(.+?)\s*\|\s*(\d+)\s*([\+\-]*)/);
				if (fileMatch) {
					const filename = fileMatch[1].trim();
					const changesCount = parseInt(fileMatch[2]);
					const changes = fileMatch[3] || '';
					const additions = (changes.match(/\+/g) || []).length;
					const deletions = (changes.match(/-/g) || []).length;

					currentCommit.filesChanged.push({
						filename,
						changes: changesCount,
						additions,
						deletions
					});
					currentCommit.insertions += additions;
					currentCommit.deletions += deletions;
				}
			} else if (line.match(/^\d+ files? changed/)) {
				const statsMatch = line.match(
					/(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/
				);
				if (statsMatch) {
					currentCommit.insertions = parseInt(statsMatch[2]) || 0;
					currentCommit.deletions = parseInt(statsMatch[3]) || 0;
				}
			} else if (currentCommit.message === '') {
				currentCommit.message = line;
			}
		}
	}

	if (currentCommit) {
		commits.push(currentCommit);
	}

	return commits.filter((commit) => commit.hash && commit.author && commit.timestamp);
}

export function getCommitStats(commits) {
	const totalCommits = commits.length;
	const totalFiles = new Set();
	const contributors = new Set();
	let totalInsertions = 0;
	let totalDeletions = 0;

	commits.forEach((commit) => {
		contributors.add(commit.author);
		totalInsertions += commit.insertions;
		totalDeletions += commit.deletions;
		commit.filesChanged.forEach((file) => totalFiles.add(file.filename));
	});

	const dateRange =
		commits.length > 0
			? {
					start: new Date(Math.min(...commits.map((c) => c.timestamp))),
					end: new Date(Math.max(...commits.map((c) => c.timestamp)))
				}
			: null;

	return {
		totalCommits,
		totalFiles: totalFiles.size,
		totalContributors: contributors.size,
		totalInsertions,
		totalDeletions,
		dateRange,
		contributors: Array.from(contributors)
	};
}
