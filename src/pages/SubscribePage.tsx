import Layout from "@/components/Layout";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Zap,
  Shield,
  Bell,
  Briefcase,
} from "lucide-react";

const SubscribePage = () => {
  const trialActive = true; // Mock
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
          <div className="alert alert-info mb-6">
            <Clock className="w-5 h-5" />
            <div>
              <h4 className="font-medium">Free Trial Active</h4>
              <p className="text-sm">{trialDaysLeft} days remaining. Subscribe to continue applying.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Unlock Unlimited Applications</h1>
          <p className="text-base-content/70">Get the job you deserve with JobFolio Premium</p>
        </div>

        {/* Pricing Card */}
        <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-xl">
          <div className="card-body items-center text-center">
            <span className="badge badge-outline text-primary-content border-primary-content/50">Most Popular</span>
            <h2 className="text-4xl font-bold mt-2">
              ₦3,000
              <span className="text-lg font-normal opacity-80">/month</span>
            </h2>
            <p className="opacity-80">Cancel anytime</p>

            <div className="divider before:bg-primary-content/20 after:bg-primary-content/20"></div>

            <ul className="space-y-3 text-left w-full">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button className="btn btn-secondary btn-block mt-6 gap-2">
              <CreditCard className="w-5 h-5" />
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-sm text-base-content/60 mb-3">Secure payment with</p>
          <div className="flex justify-center gap-4">
            <div className="badge badge-lg badge-ghost">Paystack</div>
            <div className="badge badge-lg badge-ghost">Flutterwave</div>
            <div className="badge badge-lg badge-ghost">Bank Transfer</div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title font-medium">Why do I need to pay to apply?</div>
              <div className="collapse-content text-sm text-base-content/70">
                <p>JobFolio is free to browse. The subscription helps us verify jobs, prevent scams, and maintain a high-quality platform for serious job seekers.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title font-medium">Can I cancel anytime?</div>
              <div className="collapse-content text-sm text-base-content/70">
                <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title font-medium">What happens after my trial ends?</div>
              <div className="collapse-content text-sm text-base-content/70">
                <p>You can still browse jobs freely, but you'll need to subscribe to apply for positions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscribePage;
