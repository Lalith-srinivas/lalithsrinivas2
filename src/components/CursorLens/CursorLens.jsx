import * as React from "react";
import { motion, useMotionValue, useSpring, useTime, useTransform } from "motion/react";

export default function CursorLens(props) {
  const {
    baseImage = '/avatar.png',
    revealImage = '/vr.png',
    objectFit = 'cover',
    backgroundColor = '#050505',
    blobOutlineColor = 'rgba(167, 139, 250, 0.4)',
    parallaxStrength = 4,
    showBackground = true,
    bgBlobCount = 15,
    bgBlobSize = 80,
    bgBlobComplexity = 60,
    bgBlobSpeed = 1,
    blobStrokeWidth = 1,
    previewCursor = false,
    blobSize = 150,
    shapeComplexity = 0.8,
    roughness = 0,
    speed = 250,
    viscosity = 1,
    className = ""
  } = props;

  const [isHovering, setIsHovering] = React.useState(false);
  const isActive = isHovering || previewCursor;

  // Reference to the container for coordinate math
  const containerRef = React.useRef(null);

  // --- 1. SETUP BACKGROUND BLOBS ---
  const random = (min, max) => Math.random() * (max - min) + min;

  const backgroundBlobs = React.useMemo(() => {
    return [...Array(bgBlobCount)].map(() => ({
      x: [random(-20, 110) + "%", random(-20, 110) + "%", random(-20, 110) + "%"],
      y: [random(-20, 110) + "%", random(-20, 110) + "%", random(-20, 110) + "%"],
      sizeFactor: random(0.5, 1.5),
      duration: random(25, 50) / bgBlobSpeed
    }));
  }, [bgBlobCount, bgBlobSpeed]);

  const bgFilterId = React.useId();

  // --- 2. MOUSE & PARALLAX PHYSICS ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXRatio = useMotionValue(0);
  const mouseYRatio = useMotionValue(0);

  const smoothOptions = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseXRatio, smoothOptions);
  const smoothY = useSpring(mouseYRatio, smoothOptions);

  const baseX = useTransform(smoothX, [-1, 1], [parallaxStrength, -parallaxStrength]);
  const baseY = useTransform(smoothY, [-1, 1], [parallaxStrength, -parallaxStrength]);
  const revealX = useTransform(smoothX, [-1, 1], [parallaxStrength * 2.5, -parallaxStrength * 2.5]);
  const revealY = useTransform(smoothY, [-1, 1], [parallaxStrength * 2.5, -parallaxStrength * 2.5]);

  // --- 3. GLOBAL TRACKING LOGIC ---
  React.useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Check if the mouse is physically inside this component's area
      const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      setIsHovering(isInside);

      if (isInside) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
        mouseXRatio.set((x / rect.width) * 2 - 1);
        mouseYRatio.set((y / rect.height) * 2 - 1);
      } else {
        mouseXRatio.set(0);
        mouseYRatio.set(0);
      }
    };

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("touchstart", handleGlobalMove);
    window.addEventListener("touchmove", handleGlobalMove);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("touchstart", handleGlobalMove);
      window.removeEventListener("touchmove", handleGlobalMove);
    };
  }, [mouseX, mouseY, mouseXRatio, mouseYRatio]);

  // --- 4. FLUID CURSOR PHYSICS ---
  const time = useTime();

  const createWake = (index) => {
    const stiffness = speed * (1 - index * 0.15);
    const damping = 20 + viscosity * index * 5;
    const mass = 0.1 + index * 0.1;
    return {
      x: useSpring(mouseX, { stiffness, damping, mass }),
      y: useSpring(mouseY, { stiffness, damping, mass })
    };
  };

  const head = createWake(0);
  const body1 = createWake(1);
  const body2 = createWake(2);
  const tail = createWake(4);

  const complexityRadius = blobSize * shapeComplexity * 0.6;
  const sat1X = useTransform(time, t => head.x.get() + Math.sin(t * 0.002) * complexityRadius);
  const sat1Y = useTransform(time, t => head.y.get() + Math.cos(t * 0.002) * complexityRadius);
  const sat2X = useTransform(time, t => head.x.get() + Math.cos(t * 0.004) * (complexityRadius * 0.8));
  const sat2Y = useTransform(time, t => head.y.get() + Math.sin(t * 0.004) * (complexityRadius * 0.8));

  const cursorFilterId = React.useId();
  const maskId = React.useId();

  return (
    <div ref={containerRef} className={className} style={{ ...containerStyle, backgroundColor }}>
      {showBackground && (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id={bgFilterId}>
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={bgBlobComplexity} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
          <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0, overflow: "visible" }}>
            <g filter={`url(#${bgFilterId})`}>
              {backgroundBlobs.map((blob, i) => (
                <motion.circle
                  key={i}
                  initial={{ cx: blob.x[0], cy: blob.y[0] }}
                  animate={{ cx: blob.x, cy: blob.y }}
                  transition={{ duration: blob.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  r={blob.sizeFactor * bgBlobSize}
                  fill="none"
                  stroke={blobOutlineColor}
                  strokeWidth={blobStrokeWidth}
                  strokeOpacity={0.5}
                />
              ))}
            </g>
          </svg>
        </>
      )}

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={cursorFilterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={roughness} xChannelSelector="R" yChannelSelector="G" result="distorted" />
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none", opacity: 0 }}>
        <defs>
          <mask id={maskId}>
            <g filter={`url(#${cursorFilterId})`}>
              <motion.g animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <motion.circle cx={sat1X} cy={sat1Y} r={blobSize * 0.6} fill="white" />
                <motion.circle cx={sat2X} cy={sat2Y} r={blobSize * 0.5} fill="white" />
                <motion.circle cx={head.x} cy={head.y} r={blobSize * 0.7} fill="white" />
                <motion.circle cx={body1.x} cy={body1.y} r={blobSize * 0.6} fill="white" />
                <motion.circle cx={body2.x} cy={body2.y} r={blobSize * 0.5} fill="white" />
                <motion.circle cx={tail.x} cy={tail.y} r={blobSize * 0.3} fill="white" />
              </motion.g>
            </g>
          </mask>
        </defs>
      </svg>

      <div style={{ ...layerContainerStyle, zIndex: 10 }}>
        <motion.div
          style={{
            ...imageStyle,
            backgroundImage: `url(${baseImage})`,
            backgroundSize: objectFit,
            x: baseX,
            y: baseY,
            scale: 1.1
          }}
        />
      </div>

      <motion.div style={{ ...layerContainerStyle, mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})`, zIndex: 20 }}>
        <motion.div
          style={{
            ...imageStyle,
            backgroundImage: `url(${revealImage})`,
            backgroundSize: objectFit,
            x: revealX,
            y: revealY,
            scale: 1.1
          }}
        />
      </motion.div>
    </div>
  );
}

const containerStyle = { position: "relative", width: "100%", height: "100%", overflow: "hidden" };
const layerContainerStyle = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" };
const imageStyle = { width: "100%", height: "100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", willChange: "transform" };
