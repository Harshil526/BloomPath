import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Users, Briefcase, TrendingUp, Shield, DollarSign, Activity } from "lucide-react";

const AdminHome = () => {
  const { platformStats, workers, jobs } = useAppStore();
  const pendingVerifications = workers.flatMap(w => w.skills).filter(s => s.status === 'pending').length;

  const stats = [
    { label: "Total Workers", value: platformStats.totalWorkers.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Total Employers", value: platformStats.totalEmployers.toLocaleString(), icon: Briefcase, color: "text-chart-2" },
    { label: "Tasks Completed", value: platformStats.tasksCompleted.toLocaleString(), icon: TrendingUp, color: "text-trust-excellent" },
    { label: "Active Jobs", value: platformStats.activeJobs, icon: Activity, color: "text-chart-3" },
    { label: "Avg Wage", value: `₹${platformStats.averageWage}`, icon: DollarSign, color: "text-chart-4" },
    { label: "Pending Verifications", value: pendingVerifications, icon: Shield, color: "text-chart-5" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="glass-card p-5 rounded-2xl">
            <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">Fairness Index</h2>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-trust-excellent">{platformStats.fairnessIndex}%</div>
          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${platformStats.fairnessIndex}%` }} transition={{ duration: 1 }} className="h-full bg-trust-excellent rounded-full" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Platform wage fairness compared to market rates</p>
      </div>
    </motion.div>
  );
};

export default AdminHome;
