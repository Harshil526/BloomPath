import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
  { month: 'Jul', workers: 8500, employers: 2100 },
  { month: 'Aug', workers: 9200, employers: 2400 },
  { month: 'Sep', workers: 10100, employers: 2700 },
  { month: 'Oct', workers: 11000, employers: 2950 },
  { month: 'Nov', workers: 12000, employers: 3200 },
  { month: 'Dec', workers: 12847, employers: 3421 },
];

const PlatformStats = () => {
  const { platformStats } = useAppStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Platform Statistics</h1>
        <p className="text-muted-foreground">Growth and performance metrics</p>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorWorkers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="workers" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorWorkers)" />
              <Area type="monotone" dataKey="employers" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorEmployers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary" /><span className="text-sm">Workers</span></div>
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-chart-2" /><span className="text-sm">Employers</span></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlatformStats;
