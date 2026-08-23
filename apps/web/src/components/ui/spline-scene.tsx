"use client";

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

/**
 * Embeds a Spline 3D scene via iframe — avoids all webpack/WASM issues
 * with @splinetool/react-spline v4.x + Next.js 14.
 * The embed URL follows the standard Spline viewer pattern:
 * https://my.spline.design/{scene-id}/
 */
export function SplineScene({
  scene = "https://my.spline.design/90033889-0a5c-460e-bacb-d45ab428466d/",
  className = "",
}: SplineSceneProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src={scene}
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "transparent",
          pointerEvents: "auto",
        }}
        title="AgentGuard 3D Scene"
      />
    </div>
  );
}
