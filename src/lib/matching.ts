

export const matchJobs = (worker: any, jobs: any[]) => {
    if (!worker || !jobs) return [];

    return jobs.map(job => {
        let score = 0;

        // 1. Skills Match (40%)
        // Assuming worker.skills is an array of strings or objects with name
        const workerSkillNames = worker.skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
        const requiredSkills = job.requiredSkills || [];

        if (requiredSkills.length > 0) {
            const matchedSkills = requiredSkills.filter((s: string) => workerSkillNames.includes(s));
            score += (matchedSkills.length / requiredSkills.length) * 40;
        }

        // 2. Location Match (40%)
        // Simple string match for now, or assume fetches provide coordinates later
        // If locations match exactly or contain each other
        if (worker.location && job.location) {
            if (worker.location.toLowerCase() === job.location.toLowerCase() ||
                worker.location.toLowerCase().includes(job.location.toLowerCase()) ||
                job.location.toLowerCase().includes(worker.location.toLowerCase())) {
                score += 40;
            }
        }

        // 3. Education/Complexity (20%)
        // Prioritize less educated (manual/task oriented) for certain jobs?
        // "Ensures less-educated women are prioritized for task-oriented/manual remote work."
        // We need education field on worker and complexity on job.
        // For now, we'll use a placeholder logic: matches if "entry level" or similar.
        // Let's assume manual jobs (Domestic, Care) get a boost if we don't have education info, 
        // or we just give a flat 20 for now to keep it simple unless we add fields.
        // Let's base it on job category/title keywords for now.
        const manualKeywords = ['cleaning', 'cooking', 'care', 'tailoring'];
        const isManual = manualKeywords.some(k => job.title.toLowerCase().includes(k));

        // If job is manual, give full score (assumption: platform target audience)
        if (isManual) {
            score += 20;
        }

        return {
            ...job,
            matchScore: Math.round(score)
        };
    }).sort((a, b) => b.matchScore - a.matchScore);
};
