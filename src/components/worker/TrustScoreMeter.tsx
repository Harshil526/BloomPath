import { motion } from "framer-motion";

interface TrustScoreMeterProps {
  score: number;
}

const TrustScoreMeter = ({ score }: TrustScoreMeterProps) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 90) return "hsl(var(--trust-excellent))";
    if (score >= 75) return "hsl(var(--trust-good))";
    if (score >= 50) return "hsl(var(--trust-moderate))";
    return "hsl(var(--trust-low))";
  };

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 50) return "Moderate";
    return "Building";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold"
            style={{ color: getScoreColor() }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground">Trust Score</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 px-4 py-2 rounded-full"
        style={{ backgroundColor: `${getScoreColor()}20` }}
      >
        <span style={{ color: getScoreColor() }} className="font-medium">
          {getScoreLabel()}
        </span>
      </motion.div>
    </div>
  );
};

export default TrustScoreMeter;
