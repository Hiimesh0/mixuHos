import React from 'react';
import styles from './WorldMapBackground.module.css';

/**
 * WorldMapBackground component
 * Renders an optimized, high-fidelity dark-navy healthcare technology canvas
 * featuring a subtle world map silhouette, geodesic interconnect arcs,
 * glowing data points, and ambient cyan/teal lighting.
 */
export const WorldMapBackground: React.FC = () => {
  return (
    <div className={styles.mapContainer} aria-hidden="true">
      {/* Radial ambient lighting gradients */}
      <div className={styles.ambientTopGlow} />
      <div className={styles.ambientCenterGlow} />

      {/* Optimized Geodesic & World Map SVG */}
      <svg
        className={styles.mapSvg}
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="arcGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="arcGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="glowPoint" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          <pattern id="dotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#38bdf8" fillOpacity="0.12" />
          </pattern>
        </defs>

        {/* Global Coordinate Grid (Subtle latitude & longitude curves) */}
        <path d="M 0 180 Q 720 220 1440 180" stroke="#0ea5e9" strokeWidth="0.75" strokeOpacity="0.12" fill="none" />
        <path d="M 0 340 Q 720 380 1440 340" stroke="#0ea5e9" strokeWidth="0.75" strokeOpacity="0.15" fill="none" />
        <path d="M 0 500 Q 720 540 1440 500" stroke="#0ea5e9" strokeWidth="0.75" strokeOpacity="0.12" fill="none" />
        <path d="M 280 0 Q 300 340 330 680" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.1" fill="none" />
        <path d="M 540 0 Q 560 340 580 680" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.12" fill="none" />
        <path d="M 780 0 Q 800 340 810 680" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.14" fill="none" />
        <path d="M 1040 0 Q 1060 340 1070 680" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.12" fill="none" />

        {/* Continental Contour Silhouettes (Stylized vector continents) */}
        {/* North America */}
        <path
          d="M 180 140 C 220 110 320 120 360 170 C 400 210 380 270 340 300 C 310 320 260 310 240 360 C 210 330 190 280 160 260 C 140 220 150 170 180 140 Z"
          fill="#1e293b"
          fillOpacity="0.32"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeOpacity="0.22"
        />

        {/* South America */}
        <path
          d="M 290 380 C 340 390 380 430 370 480 C 360 540 320 600 290 620 C 270 610 260 550 260 480 C 260 440 270 400 290 380 Z"
          fill="#1e293b"
          fillOpacity="0.3"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeOpacity="0.2"
        />

        {/* Europe */}
        <path
          d="M 640 130 C 690 120 740 140 760 180 C 740 220 700 240 660 230 C 630 210 620 160 640 130 Z"
          fill="#1e293b"
          fillOpacity="0.35"
          stroke="#14b8a6"
          strokeWidth="1"
          strokeOpacity="0.24"
        />

        {/* Africa */}
        <path
          d="M 650 250 C 720 240 780 270 790 340 C 800 420 760 500 710 530 C 670 510 650 450 630 380 C 620 310 630 270 650 250 Z"
          fill="#1e293b"
          fillOpacity="0.32"
          stroke="#14b8a6"
          strokeWidth="1"
          strokeOpacity="0.22"
        />

        {/* Asia */}
        <path
          d="M 780 120 C 860 90 980 110 1060 170 C 1120 220 1110 320 1060 360 C 1000 390 940 350 910 380 C 860 360 820 300 800 240 C 780 180 760 150 780 120 Z"
          fill="#1e293b"
          fillOpacity="0.34"
          stroke="#06b6d4"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* India / South Asia Focus Hub */}
        <path
          d="M 860 270 C 890 280 920 310 900 360 C 880 390 860 410 850 420 C 840 400 830 360 830 320 C 840 290 850 280 860 270 Z"
          fill="#0f2b3c"
          fillOpacity="0.45"
          stroke="#14b8a6"
          strokeWidth="1.25"
          strokeOpacity="0.4"
        />

        {/* Australia */}
        <path
          d="M 1080 430 C 1150 420 1200 450 1210 500 C 1190 550 1130 560 1080 540 C 1050 510 1050 460 1080 430 Z"
          fill="#1e293b"
          fillOpacity="0.28"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeOpacity="0.2"
        />

        {/* Geodesic Interconnecting Arcs (Flight / Data transmission paths) */}
        {/* US East to UK/Europe */}
        <path d="M 340 210 Q 500 90 670 170" stroke="url(#arcGrad1)" strokeWidth="1.75" fill="none" strokeDasharray="6 4" />
        {/* Europe to India Hub */}
        <path d="M 680 180 Q 770 160 860 320" stroke="url(#arcGrad1)" strokeWidth="2" fill="none" />
        {/* India Hub to East Asia */}
        <path d="M 870 325 Q 980 230 1070 240" stroke="url(#arcGrad2)" strokeWidth="1.75" fill="none" strokeDasharray="5 3" />
        {/* India Hub to Middle East & Africa */}
        <path d="M 860 325 Q 780 350 710 320" stroke="url(#arcGrad2)" strokeWidth="1.5" fill="none" />
        {/* India to Australia */}
        <path d="M 870 340 Q 990 440 1110 470" stroke="url(#arcGrad1)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />

        {/* Connected Healthcare Node Points */}
        {/* North America Node */}
        <circle cx="340" cy="210" r="5" fill="#38bdf8" />
        <circle cx="340" cy="210" r="11" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" className={styles.pingNode} />

        {/* London/Europe Node */}
        <circle cx="670" cy="170" r="5" fill="#14b8a6" />
        <circle cx="670" cy="170" r="12" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.5" className={styles.pingNode} />

        {/* India / Regional Primary Hub */}
        <circle cx="865" cy="325" r="7" fill="#06b6d4" />
        <circle cx="865" cy="325" r="16" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.7" className={styles.pingNode} />
        <circle cx="865" cy="325" r="26" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.3" className={styles.pingNodeSlow} />

        {/* Singapore / SE Asia Node */}
        <circle cx="980" cy="380" r="4" fill="#38bdf8" />
        <circle cx="980" cy="380" r="10" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

        {/* Tokyo / East Asia Node */}
        <circle cx="1120" cy="230" r="5" fill="#14b8a6" />
        <circle cx="1120" cy="230" r="11" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.5" className={styles.pingNode} />

        {/* Sydney Node */}
        <circle cx="1170" cy="510" r="4.5" fill="#38bdf8" />
        <circle cx="1170" cy="510" r="10" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

        {/* Middle East Node */}
        <circle cx="780" cy="275" r="4.5" fill="#06b6d4" />
        <circle cx="780" cy="275" r="10" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />
      </svg>

      {/* Soft gradient mask for clean text contrast */}
      <div className={styles.vignetteOverlay} />
    </div>
  );
};

export default WorldMapBackground;
