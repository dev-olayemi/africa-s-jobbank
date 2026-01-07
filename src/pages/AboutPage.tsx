import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Globe,
  ChevronRight,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { value: "50,000+", label: "Job Opportunities" },
    { value: "100,000+", label: "Job Seekers" },
    { value: "5,000+", label: "Verified Employers" },
    { value: "12", label: "African Countries" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every job is verified to prevent scams and ensure legitimate opportunities.",
    },
    {
      icon: Users,
      title: "Jobseeker-First",
      description: "Built for job seekers, making it easy to find and apply for opportunities.",
    },
    {
      icon: Briefcase,
      title: "Entry-Level Focus",
      description: "Specializing in entry-level and high-turnover roles where demand is constant.",
    },
    {
      icon: Globe,
      title: "Pan-African Reach",
      description: "Connecting talent with opportunities across the African continent.",
    },
  ];

  const faqs = [
    {
      question: "Why do I need to pay to apply?",
      answer: "JobFolio is free to browse. The subscription model helps us maintain quality, verify all listings, and prevent scams. This creates a trustworthy platform for serious job seekers.",
    },
    {
      question: "How do you verify employers?",
      answer: "We require ID verification for all employer accounts. Companies must provide CAC registration, while agents and businesses submit valid identification documents.",
    },
    {
      question: "What types of jobs are available?",
      answer: "We focus on entry-level, retail, hospitality, logistics, customer service, and other high-demand roles across Africa.",
    },
    {
      question: "Is my data safe?",
      answer: "Yes. We use industry-standard security measures to protect your personal information and CV data.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-content py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Africa's Trusted JobBank
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We're solving Africa's job access problem by creating verified, reliable job infrastructure for millions of job seekers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 bg-base-100 rounded-xl shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-base-content/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Problem/Solution */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="font-semibold text-error mb-3">The Challenge</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-error">-</span>
                    Jobs scattered across WhatsApp groups and notice boards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error">-</span>
                    Entry-level roles rarely posted on structured platforms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error">-</span>
                    Job seekers waste time on fake or outdated listings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error">-</span>
                    No unified infrastructure for verified job information
                  </li>
                </ul>
              </div>
            </div>
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="font-semibold text-success mb-3">Our Solution</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    Aggregating opportunities from multiple sources
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    Verifying all listings before distribution
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    Making jobs searchable and accessible
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    Prioritizing entry-level, high-demand roles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why JobFolio?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="collapse collapse-arrow bg-base-100 shadow-sm">
                <input type="radio" name="faq" />
                <div className="collapse-title font-medium">{faq.question}</div>
                <div className="collapse-content text-sm text-base-content/70">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA for Employers */}
        <div className="card bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/20">
          <div className="card-body items-center text-center">
            <TrendingUp className="w-12 h-12 text-accent mb-2" />
            <h2 className="text-xl font-bold">Are you an employer?</h2>
            <p className="text-base-content/70 max-w-md">
              Post verified job listings and connect with thousands of qualified candidates across Africa.
            </p>
            <div className="card-actions mt-4">
              <Link to="/signup" className="btn btn-primary gap-2">
                Start Posting Jobs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
