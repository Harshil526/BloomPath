-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create businesses table (extends profiles for business role)
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  location TEXT,
  contact_no TEXT,
  description TEXT,
  reg_cert_url TEXT,
  manager_name TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT FALSE, -- specific business verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on businesses
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for businesses
-- Business user can view/update their own business profile
CREATE POLICY "Business users can view their own business profile"
  ON public.businesses FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Business users can update their own business profile"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Business users can insert their own business profile"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view/update all business profiles
CREATE POLICY "Admins can view all businesses"
  ON public.businesses FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all businesses"
  ON public.businesses FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Public/Users might need to see basic business info? (e.g. company name in job listing)
CREATE POLICY "Anyone can view verified business profiles"
  ON public.businesses FOR SELECT
  USING (is_verified = TRUE);

-- RLS Policies for applications
-- Applicant can view their own applications
CREATE POLICY "Applicants can view their own applications"
  ON public.applications FOR SELECT
  USING (applicant_id = auth.uid());

CREATE POLICY "Applicants can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (applicant_id = auth.uid());

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Employers can update status of applications for their jobs
CREATE POLICY "Employers can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage for Business Certificates
INSERT INTO storage.buckets (id, name, public) VALUES ('business-documents', 'business-documents', false);

CREATE POLICY "Businesses can upload their own docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Businesses can view their own docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all business docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-documents' AND public.has_role(auth.uid(), 'admin'));
