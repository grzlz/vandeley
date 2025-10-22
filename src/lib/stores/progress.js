import { browser } from '$app/environment';

// Progress state using Svelte 5 runes pattern
let completedChapters = $state([]);
let exploredTools = $state([]);

// Initialize from localStorage
if (browser) {
	const savedChapters = localStorage.getItem('architecture-completed-chapters');
	const savedTools = localStorage.getItem('architecture-explored-tools');

	if (savedChapters) {
		try {
			completedChapters = JSON.parse(savedChapters);
		} catch (e) {
			console.error('Failed to parse completed chapters:', e);
			completedChapters = [];
		}
	}

	if (savedTools) {
		try {
			exploredTools = JSON.parse(savedTools);
		} catch (e) {
			console.error('Failed to parse explored tools:', e);
			exploredTools = [];
		}
	}
}

// Mark a chapter as complete
export function markChapterComplete(chapterId) {
	if (!completedChapters.includes(chapterId)) {
		completedChapters = [...completedChapters, chapterId];
		if (browser) {
			localStorage.setItem('architecture-completed-chapters', JSON.stringify(completedChapters));
		}
	}
}

// Check if a chapter is complete
export function isChapterComplete(chapterId) {
	return completedChapters.includes(chapterId);
}

// Mark a tool as explored
export function markToolExplored(toolId) {
	if (!exploredTools.includes(toolId)) {
		exploredTools = [...exploredTools, toolId];
		if (browser) {
			localStorage.setItem('architecture-explored-tools', JSON.stringify(exploredTools));
		}
	}
}

// Check if a tool has been explored
export function isToolExplored(toolId) {
	return exploredTools.includes(toolId);
}

// Get overall progress stats
export function getProgress() {
	const totalChapters = 4; // Update this as chapters are added
	const totalTools = 3; // diagrams, git analytics, playground (coming soon)

	return {
		completedChapters: completedChapters.length,
		totalChapters,
		exploredTools: exploredTools.length,
		totalTools,
		percentComplete: Math.round((completedChapters.length / totalChapters) * 100)
	};
}

// Get completed chapters list
export function getCompletedChapters() {
	return [...completedChapters];
}

// Get explored tools list
export function getExploredTools() {
	return [...exploredTools];
}

// Reset all progress (for testing/debugging)
export function resetProgress() {
	completedChapters = [];
	exploredTools = [];
	if (browser) {
		localStorage.removeItem('architecture-completed-chapters');
		localStorage.removeItem('architecture-explored-tools');
	}
}
