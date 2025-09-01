export function detectWorkSessions(commits, sessionGapMinutes = 120) {
    const sortedCommits = commits.sort((a, b) => a.timestamp - b.timestamp);
    const sessions = [];
    let currentSession = null;
    
    sortedCommits.forEach(commit => {
        if (!currentSession || 
            (commit.timestamp - currentSession.endTime) > (sessionGapMinutes * 60 * 1000)) {
            
            if (currentSession) {
                sessions.push(currentSession);
            }
            
            currentSession = {
                id: sessions.length,
                startTime: commit.timestamp,
                endTime: commit.timestamp,
                commits: [commit],
                author: commit.author,
                duration: 0,
                totalInsertions: commit.insertions,
                totalDeletions: commit.deletions,
                filesModified: new Set(commit.filesChanged.map(f => f.filename))
            };
        } else {
            currentSession.commits.push(commit);
            currentSession.endTime = commit.timestamp;
            currentSession.totalInsertions += commit.insertions;
            currentSession.totalDeletions += commit.deletions;
            commit.filesChanged.forEach(f => currentSession.filesModified.add(f.filename));
        }
    });
    
    if (currentSession) {
        sessions.push(currentSession);
    }
    
    sessions.forEach(session => {
        session.duration = session.endTime - session.startTime;
        session.filesModified = Array.from(session.filesModified);
        session.estimatedHours = Math.max(0.5, session.duration / (1000 * 60 * 60));
        session.productivity = (session.totalInsertions + session.totalDeletions) / session.commits.length;
        
        const startHour = new Date(session.startTime).getHours();
        session.timeOfDay = getTimeOfDayCategory(startHour);
        session.dayOfWeek = new Date(session.startTime).getDay();
        session.isWeekend = session.dayOfWeek === 0 || session.dayOfWeek === 6;
    });
    
    return sessions;
}

function getTimeOfDayCategory(hour) {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
}

export function getSessionStats(sessions) {
    const totalSessions = sessions.length;
    const totalEstimatedHours = sessions.reduce((sum, session) => sum + session.estimatedHours, 0);
    const averageSessionLength = totalSessions > 0 ? totalEstimatedHours / totalSessions : 0;
    
    const timeOfDayBreakdown = {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0
    };
    
    const dayOfWeekBreakdown = Array(7).fill(0);
    let weekendSessions = 0;
    
    sessions.forEach(session => {
        timeOfDayBreakdown[session.timeOfDay]++;
        dayOfWeekBreakdown[session.dayOfWeek]++;
        if (session.isWeekend) weekendSessions++;
    });
    
    const mostProductiveTimeOfDay = Object.keys(timeOfDayBreakdown).reduce((a, b) => 
        timeOfDayBreakdown[a] > timeOfDayBreakdown[b] ? a : b
    );
    
    const longestSession = sessions.reduce((longest, session) => 
        session.estimatedHours > longest.estimatedHours ? session : longest, 
        sessions[0] || { estimatedHours: 0 }
    );
    
    return {
        totalSessions,
        totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
        averageSessionLength: Math.round(averageSessionLength * 10) / 10,
        timeOfDayBreakdown,
        dayOfWeekBreakdown,
        weekendSessions,
        weekdaySessions: totalSessions - weekendSessions,
        mostProductiveTimeOfDay,
        longestSession
    };
}