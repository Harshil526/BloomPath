import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

const UserAnalytics = () => {
  const { workers } = useAppStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">User Analytics</h1>
        <p className="text-muted-foreground">Trust scores and performance metrics</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium text-sm">
          <span>Worker</span><span>Trust Score</span><span>Tasks</span><span>Rating</span><span>Trend</span>
        </div>
        {workers.map((worker, i) => (
          <motion.div key={worker.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="grid grid-cols-5 gap-4 p-4 items-center border-t border-border hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarImage src={worker.avatar} /><AvatarFallback>{worker.name[0]}</AvatarFallback></Avatar>
              <span className="font-medium">{worker.name}</span>
            </div>
            <Badge className={`w-fit rounded-full ${worker.trustScore >= 90 ? 'bg-trust-excellent/20 text-trust-excellent' : worker.trustScore >= 75 ? 'bg-trust-good/20 text-trust-good' : 'bg-chart-3/20 text-chart-3'}`}>{worker.trustScore}</Badge>
            <span>{worker.completedTasks}</span>
            <div className="flex items-center gap-1"><Star className="h-4 w-4 text-chart-3 fill-chart-3" />{worker.rating}</div>
            <div className="flex items-center gap-1">{Math.random() > 0.3 ? <><TrendingUp className="h-4 w-4 text-trust-excellent" /><span className="text-trust-excellent text-sm">+5%</span></> : <><TrendingDown className="h-4 w-4 text-destructive" /><span className="text-destructive text-sm">-2%</span></>}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserAnalytics;
