
import { Badge } from "@/components/ui/badge";
import { matchJobs } from "@/lib/matching";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, DollarSign, FileText, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import AvailabilityToggle from "./AvailabilityToggle";
import JobMatchCard from "./JobMatchCard";

const WorkerHome = () => {
  const { currentWorker, setCurrentWorker } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Update store (mapping DB fields to Store fields where necessary)
      // Note: This is a partial map. Ideally we sync types.
      const mappedWorker: any = {
        id: profile.id,
        name: profile.full_name,
        trustScore: 85, // Placeholder/Default
        isAvailable: true,
        skills: (profile.skills || []).map((s: string, i: number) => ({ id: `s${i}`, name: s, status: 'verified' })),
        completedTasks: 0,
        earnings: 0,
        rating: 4.8,
        location: profile.location_name || "Remote",
        joinedAt: new Date(profile.created_at),
        ...profile // spread result to keep other fields
      };
      // Only set if we really need to update the store for other components.
      // For now, we will rely on local state or store if needed.
      setCurrentWorker(mappedWorker);

      // 2. Fetch Jobs for Matching
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*'); // fetching all for matching (should be paginated/filtered in prod)

      if (jobsError) throw jobsError;

      // Map jobs to match store/component expectations
      const mappedJobs = jobs?.map(j => ({
        id: j.id,
        title: j.title,
        description: j.description,
        employer: "EmpowerHer Client", // Placeholder as we didn't join employer name
        location: j.location_name,
        wage: j.pay_per_unit || 0,
        duration: `${j.task_duration_hours || 1} hrs`,
        requiredSkills: j.required_skills || [],
        distance: 2, // Placeholder
        status: j.status,
        deadline: new Date(Date.now() + 86400000 * 7) // Placeholder
      }));

      // Run Matching Logic
      const matches = matchJobs(mappedWorker, mappedJobs || []);
      setRecommendedJobs(matches.slice(0, 3));

      // 3. Fetch Applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`
            *,
            jobs ( title, employer_id )
        `)
        .eq('applicant_id', user.id);

      if (appsError) throw appsError;
      setApplications(apps || []);

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      // toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (!currentWorker && loading) return <div className="p-8">Loading...</div>;
  // If we still don't have currentWorker from store, use a fallback info or return null
  // But we want to show the dashboard. Ideally `fetchData` updates local state used for rendering.
  // For now, we render mixed content.

  const renderStats = () => {
    // Mock stats if not real
    const statsCards = [
      {
        label: "Tasks Completed",
        value: applications.filter(a => a.status === 'accepted').length, // Proxy
        icon: CheckCircle2,
        color: "text-trust-excellent",
        bgColor: "bg-trust-excellent/10",
      },
      {
        label: "Total Earnings",
        value: `₹${0}`, // Placeholder
        icon: DollarSign,
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        label: "Rating",
        value: "N/A",
        icon: TrendingUp,
        color: "text-chart-3",
        bgColor: "bg-chart-3/10",
      },
      {
        label: "Member Since",
        value: new Date().getFullYear(),
        icon: Clock,
        color: "text-chart-2",
        bgColor: "bg-chart-2/10",
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold"
          >
            Welcome! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Job Seeker Dashboard
          </motion.p>
        </div>
        <AvailabilityToggle />
      </div>

      {renderStats()}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Profile Progress & Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl space-y-6"
        >
          <h2 className="text-lg font-semibold">Profile Progress</h2>
          {/* Simple progress bar */}
          <div className="w-full bg-secondary rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-sm text-muted-foreground">Complete your profile to get more matches!</p>


          <h3 className="text-sm font-medium text-muted-foreground">My Skills</h3>
          <div className="flex flex-wrap gap-2">
            {currentWorker?.skills.map((skill: any) => (
              <Badge key={skill.id} variant="secondary">
                {skill.name}
              </Badge>
            ))}
            {(currentWorker?.skills.length === 0) && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
          </div>
        </motion.div>

        {/* Application Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl"
        >
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">You haven't applied to any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.jobs?.title || "Unknown Job"}</h3>
                      <p className="text-xs text-muted-foreground">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                  }>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recommended Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
          <Badge variant="secondary" className="rounded-full">
            AI-Powered Match
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.length > 0 ? recommendedJobs.map((job, index) => (
              <JobMatchCard key={job.id} job={job} index={index} />
            )) : (
              <div className="col-span-full text-center p-8 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">No jobs matches found yet. Verify your skills to get recommendations!</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkerHome;
