-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'business', 'admin');

-- Create enum for education level
CREATE TYPE public.education_level AS ENUM ('basic', 'intermediate', 'advanced');

-- Create enum for job location type
CREATE TYPE public.job_location_type AS ENUM ('remote', 'onsite', 'hybrid');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('open', 'closed', 'paused');

-- Create enum for work log status
CREATE TYPE public.work_log_status AS ENUM ('in_progress', 'completed', 'verified');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  role user_role NOT NULL DEFAULT 'user',
  education_level education_level DEFAULT 'basic',
  skills TEXT[] DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  aadhar_url TEXT,
  aadhar_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location_type job_location_type NOT NULL DEFAULT 'remote',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  required_skills TEXT[] DEFAULT '{}',
  pay_per_unit NUMERIC NOT NULL DEFAULT 0,
  task_duration_hours INTEGER DEFAULT 1,
  status job_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create work_logs table
CREATE TABLE public.work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status work_log_status NOT NULL DEFAULT 'in_progress',
  duration_minutes INTEGER DEFAULT 0,
  task_output_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on work_logs
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for RBAC (separate from profile role for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'user')
  );
  
  -- Also insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'user')
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business users can view verified user profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'business') 
    AND is_verified = TRUE 
    AND role = 'user'
  );

-- RLS Policies for jobs
CREATE POLICY "Anyone can view open jobs"
  ON public.jobs FOR SELECT
  USING (status = 'open');

CREATE POLICY "Business users can manage their own jobs"
  ON public.jobs FOR ALL
  USING (employer_id = auth.uid());

CREATE POLICY "Admins can manage all jobs"
  ON public.jobs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for work_logs
CREATE POLICY "Users can view their own work logs"
  ON public.work_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own work logs"
  ON public.work_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own work logs"
  ON public.work_logs FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all work logs"
  ON public.work_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business users can view work logs for their jobs"
  ON public.work_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = work_logs.job_id 
      AND jobs.employer_id = auth.uid()
    )
  );

-- RLS Policies for user_roles (only admins can view/modify)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for Aadhar documents
INSERT INTO storage.buckets (id, name, public) VALUES ('aadhar-documents', 'aadhar-documents', false);

-- Storage policies for aadhar-documents
CREATE POLICY "Users can upload their own Aadhar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'aadhar-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own Aadhar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'aadhar-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all Aadhar documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'aadhar-documents' AND public.has_role(auth.uid(), 'admin'));