'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Activity, HeartPulse, BrainCircuit, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-6 md:p-24">
      {/* Background Decor - Subtle for Light Mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 rounded-full blur-[130px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto space-y-8 z-10"
      >
        <div className="inline-block">
          <span className="py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide">
            NEXT-GEN HEALTHCARE AI
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 drop-shadow-sm">
          Predict Disease with <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Precision & AI</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Empowering early diagnosis through advanced machine learning algorithms.
          Upload data, analyze patterns, and get instant risk assessments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/predict">
            <Button variant="glow" size="lg" className="group">
              Start Diagnosis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="group gap-2">
              <BarChart3 className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
              View Metrics
            </Button>
          </Link>
          <Link href="/learn-more">
            <Button variant="ghost" size="lg">Learn More</Button>
          </Link>
        </div>
      </motion.div>

      {/* Floating Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
        {[
          { icon: HeartPulse, title: "Cardio Analysis", desc: "Advanced metrics for heart health prediction." },
          { icon: BrainCircuit, title: "Neural Logic", desc: "Deep learning models trained on global datasets." },
          { icon: Activity, title: "Real-time Results", desc: "Instant processing with high accuracy rates." }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (idx * 0.1), duration: 0.6 }}
          >
            <Card className="h-full hover:bg-slate-50 transition-colors border-slate-200 shadow-sm hover:shadow-md group bg-white/60">
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 w-fit group-hover:bg-blue-500/20 transition-colors">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
