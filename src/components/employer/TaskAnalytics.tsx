import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const completionData = [
  { name: 'Completed', value: 85 },
  { name: 'Cancelled', value: 15 },
];
const COLORS = ['hsl(var(--trust-excellent))', 'hsl(var(--destructive))'];

const costData = [
  { category: 'Cleaning', cost: 12000, fair: 11500 },
  { category: 'Care', cost: 8500, fair: 9000 },
  { category: 'Tailoring', cost: 6000, fair: 5800 },
];

const TaskAnalytics = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Task Analytics</h1>
        <p className="text-muted-foreground">Insights into your hiring patterns</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Completion Rate</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {completionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {completionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm">{d.name}: {d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Cost vs Fair Wage</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" width={70} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px' }} />
                <Bar dataKey="cost" fill="hsl(var(--primary))" radius={4} />
                <Bar dataKey="fair" fill="hsl(var(--trust-excellent))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskAnalytics;
