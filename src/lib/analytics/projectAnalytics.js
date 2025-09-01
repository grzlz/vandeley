export function analyzeProjectEvolution(commits) {
    const sortedCommits = commits.sort((a, b) => a.timestamp - b.timestamp);
    const fileHistory = {};
    const evolutionTimeline = [];
    const codebaseGrowth = [];
    
    let cumulativeInsertions = 0;
    let cumulativeDeletions = 0;
    let totalFiles = new Set();
    
    sortedCommits.forEach((commit, index) => {
        cumulativeInsertions += commit.insertions;
        cumulativeDeletions += commit.deletions;
        
        commit.filesChanged.forEach(file => {
            totalFiles.add(file.filename);
            
            if (!fileHistory[file.filename]) {
                fileHistory[file.filename] = {
                    filename: file.filename,
                    firstModified: commit.timestamp,
                    lastModified: commit.timestamp,
                    totalModifications: 0,
                    totalInsertions: 0,
                    totalDeletions: 0,
                    authors: new Set()
                };
            }
            
            const fileStats = fileHistory[file.filename];
            fileStats.lastModified = commit.timestamp;
            fileStats.totalModifications++;
            fileStats.totalInsertions += file.additions;
            fileStats.totalDeletions += file.deletions;
            fileStats.authors.add(commit.author);
        });
        
        codebaseGrowth.push({
            commitIndex: index,
            date: new Date(commit.timestamp),
            cumulativeInsertions,
            cumulativeDeletions,
            netLines: cumulativeInsertions - cumulativeDeletions,
            totalFiles: totalFiles.size,
            author: commit.author
        });
        
        if (index % Math.ceil(sortedCommits.length / 20) === 0) {
            evolutionTimeline.push({
                phase: Math.floor(index / Math.ceil(sortedCommits.length / 20)),
                date: new Date(commit.timestamp),
                commitCount: index + 1,
                fileCount: totalFiles.size,
                netLines: cumulativeInsertions - cumulativeDeletions,
                dominantAuthor: getMostActiveAuthorInPeriod(sortedCommits.slice(Math.max(0, index - 50), index + 1))
            });
        }
    });
    
    Object.values(fileHistory).forEach(fileStats => {
        fileStats.authors = fileStats.authors.size;
        fileStats.lifespan = fileStats.lastModified - fileStats.firstModified;
    });
    
    const hotspots = Object.values(fileHistory)
        .sort((a, b) => b.totalModifications - a.totalModifications)
        .slice(0, 10);
    
    const fileExtensions = {};
    Object.keys(fileHistory).forEach(filename => {
        const ext = filename.split('.').pop() || 'no-extension';
        fileExtensions[ext] = (fileExtensions[ext] || 0) + 1;
    });
    
    return {
        fileHistory: Object.values(fileHistory),
        evolutionTimeline,
        codebaseGrowth,
        hotspots,
        fileExtensions,
        totalFilesEverTouched: Object.keys(fileHistory).length,
        projectAge: sortedCommits.length > 0 ? 
            sortedCommits[sortedCommits.length - 1].timestamp - sortedCommits[0].timestamp : 0
    };
}

function getMostActiveAuthorInPeriod(commits) {
    const authorCounts = {};
    commits.forEach(commit => {
        authorCounts[commit.author] = (authorCounts[commit.author] || 0) + 1;
    });
    
    return Object.keys(authorCounts).reduce((a, b) => 
        authorCounts[a] > authorCounts[b] ? a : b, 'Unknown'
    );
}

export function calculateProjectMetrics(commits, sessions) {
    const totalCommits = commits.length;
    const totalFiles = new Set();
    const totalContributors = new Set();
    
    commits.forEach(commit => {
        totalContributors.add(commit.author);
        commit.filesChanged.forEach(file => totalFiles.add(file.filename));
    });
    
    const projectDuration = commits.length > 0 ? 
        Math.max(...commits.map(c => c.timestamp)) - Math.min(...commits.map(c => c.timestamp)) : 0;
    
    const totalEstimatedHours = sessions.reduce((sum, session) => sum + session.estimatedHours, 0);
    
    const commitsPerDay = totalCommits / (projectDuration / (1000 * 60 * 60 * 24));
    const hoursPerWeek = totalEstimatedHours / (projectDuration / (1000 * 60 * 60 * 24 * 7));
    
    return {
        totalCommits,
        totalFiles: totalFiles.size,
        totalContributors: totalContributors.size,
        projectDurationDays: Math.ceil(projectDuration / (1000 * 60 * 60 * 24)),
        totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
        commitsPerDay: Math.round(commitsPerDay * 10) / 10,
        hoursPerWeek: Math.round(hoursPerWeek * 10) / 10,
        averageCommitsPerSession: Math.round((totalCommits / sessions.length) * 10) / 10
    };
}