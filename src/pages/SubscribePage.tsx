import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Clock,
  CreditCard,
  Zap,
  Shield,
  Bell,
  Briefcase,
  Check,
} from "lucide-react";

const SubscribePage = () => {
  const trialActive = true;
  const trialDaysLeft = 2;

  const features = [
    { icon: Briefcase, text: "Unlimited job applications" },
    { icon: Bell, text: "Priority job alerts" },
    { icon: Zap, text: "Fast-track your applications" },
    { icon: Shield, text: "Verified seeker badge" },
  ];

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Trial Status */}
        {trialActive && (
          <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Clock className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Free Trial Active</h4>
              <p className="text-sm text-muted-foreground">{trialDaysLeft} days remaining. Subscribe to continue applying.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unlock Unlimited Applications</h1>
          <p className="text-muted-foreground">Get the job you deserve with JobFolio Premium</p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium mb-4">Most Popular</span>
            <h2 className="text-4xl font-bold">
              ₦3,000
              <span className="text-lg font-normal opacity-80">/month</span>
            </h2>
            <p className="opacity-80 mb-6">Cancel anytime</p>

            <div className="border-t border-primary-foreground/20 my-6"></div>

            <ul className="space-y-3 text-left">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button className="btn btn-secondary w-full mt-6 gap-2">
              <CreditCard className="w-5 h-5" />
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Secure payment with</p>
          <div className="flex justify-center gap-3">
            <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">Paystack</span>
            <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">Flutterwave</span>
            <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">Bank Transfer</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="bg-card rounded-xl border border-border">
              <details className="group">
                <summary className="p-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
                  Why do I need to pay to apply?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  <p>JobFolio is free to browse. The subscription helps us verify jobs, prevent scams, and maintain a high-quality platform for serious job seekers.</p>
                </div>
              </details>
            </div>
            <div className="bg-card rounded-xl border border-border">
              <details className="group">
                <summary className="p-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
                  Can I cancel anytime?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                </div>
              </details>
            </div>
            <div className="bg-card rounded-xl border border-border">
              <details className="group">
                <summary className="p-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
                  What happens after my trial ends?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  <p>You can still browse jobs freely, but you'll need to subscribe to apply for positions.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscribePage;