import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export default function Landing() {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [initialized, user, navigate]);

  return (
    <div className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-900/30 dark:to-zinc-900" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              A private coding journal for real interview progress.
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Log what mattered. Track versions and mistakes. Review fast.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/auth" className="cursor-pointer">
                  Start your journal
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/auth" className="cursor-pointer">View sample log</Link>
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">Built for serious interview prep</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <BenefitCard title="Selective logging" desc="Capture only high‑signal problems with tags, notes, time, and difficulty." />
          <BenefitCard title="Multiple solutions" desc="Save Python/JS/Java approaches and record trade‑offs." />
          <BenefitCard title="Intentional review" desc={"Use “retry later” and filters for fast, focused review."} />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <ol className="mt-6 grid md:grid-cols-3 gap-6">
          <Step num="1" title="Log a problem" desc="Add notes, mistakes, and solution versions." />
          <Step num="2" title="Tag + retry" desc="Tag by topic/difficulty and mark “retry later”." />
          <Step num="3" title="Review with intent" desc="Target weak spots using Insights and filters." />
        </ol>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">What you get</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="Problem Log" desc="Title, link, difficulty, tags, time, notes, mistakes, retry flag." />
          <FeatureCard title="Versions" desc="Store multiple approaches per problem with rationale." />
          <FeatureCard title="Insights" desc="Totals, difficulty mix, topic coverage, time invested, mistake patterns." />
          <FeatureCard title="Review Mode" desc={"Filters for tag/difficulty and a “retry later” queue."} />
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Pricing</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-6 bg-white/80 dark:bg-zinc-900/60">
            <h3 className="text-xl font-semibold">Free</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Unlimited logs and tags</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Basic insights</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Up to 10 “retry later” items</li>
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link to="/auth" className="cursor-pointer">Start free</Link>
            </Button>
          </div>
          <div className="border border-indigo-300/60 dark:border-indigo-500/40 rounded-xl p-6 bg-indigo-50/60 dark:bg-indigo-950/30">
            <h3 className="text-xl font-semibold">Pro</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Unlimited retry items</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Advanced insights</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5" />Multi‑version comparison tools</li>
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link to="/auth" className="cursor-pointer">Go Pro</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">FAQ</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
          <Faq q="How is this different from problem banks?" a="LeetSpace is a personal journal for depth and review, not a problem feed." />
          <Faq q="Do you support multiple languages?" a="Yes — save multiple solution versions per problem." />
          <Faq q="Is my data private?" a="Yes — private by default; you control everything." />
        </div>
      </section>

      {/* CTA band */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-8 md:p-10 bg-white/80 dark:bg-zinc-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Ready to practice smarter?</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Start your journal and make every review count.</p>
          </div>
          <Button asChild size="lg">
            <Link to="/auth" className="cursor-pointer">Start your journal</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-6 bg-white/80 dark:bg-zinc-900/60">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <li className="rounded-xl border border-gray-200 dark:border-zinc-700 p-6 bg-white/80 dark:bg-zinc-900/60">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Step {num}</div>
      <div className="mt-1 text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</div>
    </li>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-6 bg-white/80 dark:bg-zinc-900/60">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div>
      <h4 className="font-medium">{q}</h4>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{a}</p>
    </div>
  );
}