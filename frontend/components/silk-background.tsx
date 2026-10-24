"use client";

import { usePathname } from "next/navigation";
import Silk from "./Silk";

export default function SilkBackground() {
  const pathname = usePathname();
  
  // Routes where we want the Silk background
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isLandingPage = pathname === "/";
  const isVisible = isAuthPage || isLandingPage;
  
  // We keep the component mounted but change its appearance and visibility
  // This prevents WebGL context loss from repeated re-mounting
  const silkProps = isLandingPage 
    ? { color: "#111111", speed: 0.5, noiseIntensity: 0.5 }
    : { color: "#7B7481", speed: 0.8, noiseIntensity: 0.3 };
    
  return (
    <div className={`${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-1000`}>
      <Silk {...silkProps} />
    </div>
  );
}
