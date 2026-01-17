import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import JobMatchCard from "./JobMatchCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

const JobFeed = () => {
  const { currentWorker, jobs, calculateMatchScore } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'match' | 'wage' | 'distance'>('match');

  if (!currentWorker) return null;

  const matchedJobs = jobs
    .filter(job => job.status === 'open')
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map(job => ({
      ...job,
      matchScore: calculateMatchScore(currentWorker.id, job.id),
    }))
    .sort((a, b) => {
      switch (sortBy) {
        case 'wage':
          return b.wage - a.wage;
        case 'distance':
          return a.distance - b.distance;
        default:
          return (b.matchScore || 0) - (a.matchScore || 0);
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-2"
        >
          Job Opportunities
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          AI-matched jobs based on your skills and preferences
        </motion.p>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-border/50 bg-background/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'match' ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
              onClick={() => setSortBy('match')}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Best Match
            </Button>
            <Button
              variant={sortBy === 'wage' ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
              onClick={() => setSortBy('wage')}
            >
              Highest Pay
            </Button>
            <Button
              variant={sortBy === 'distance' ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
              onClick={() => setSortBy('distance')}
            >
              Nearest
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full">
          {matchedJobs.length} jobs found
        </Badge>
        {currentWorker.isAvailable && (
          <Badge className="bg-trust-excellent/20 text-trust-excellent border-trust-excellent/30 rounded-full">
            Actively Matching
          </Badge>
        )}
      </div>

      {/* Job Grid */}
      {matchedJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedJobs.map((job, index) => (
            <JobMatchCard key={job.id} job={job} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 glass-card rounded-2xl"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or check back later
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobFeed;
