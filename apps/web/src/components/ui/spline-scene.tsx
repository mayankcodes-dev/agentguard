"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Spline must be dynamically imported — it's browser-only (no SSR)
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500/40 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  ),
});

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

export function SplineScene({
  // The scene URL for the AgentGuard community file
  scene = "https://prod.spline.design/90033889-0a5c-460e-bacb-d45ab428466d/scene.splinecode",
  className = "",
}: SplineSceneProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Suspense fallback={
        <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-2xl" />
      }>
        <Spline
          scene={scene}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        />
      </Suspense>
    </div>
  );
}
