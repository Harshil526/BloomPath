import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const taskData = [
  { month: 'Oct', completed: 12, posted: 15 },
  { month: 'Nov', completed: 18, posted: 20 },
  { month: 'Dec', completed: 15, posted: 17 },
];

const EmployerHome = () => {
  const { jobs, workers } = useAppStore();
  const navigate = useNavigate();
  const openJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks and workers</p>
        </div>
        <Button className="gradient-coral text-primary-foreground rounded-xl" onClick={() => navigate('/employer/post')}>
          <PlusCircle className="h-4 w-4 mr-2" />Post Task
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Tasks", value: openJobs, icon: CheckCircle2, color: "text-primary" },
          { label: "Total Spent", value: "₹125K", icon: DollarSign, color: "text-trust-excellent" },
          { label: "Workers Hired", value: 42, icon: Users, color: "text-chart-2" },
          { label: "Avg Rating Given", value: "4.7", icon: TrendingUp, color: "text-chart-3" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 rounded-2xl">
            <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Task Completion Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="posted" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployerHome;
