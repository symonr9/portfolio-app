export function PencilFlight() {
  const flightPath = "M 28 76 C 150 18, 254 104, 386 58 S 640 16, 872 66";

  return (
    <svg
      aria-hidden="true"
      className="hero-pencil-flight"
      focusable="false"
      viewBox="0 0 900 130"
    >
      <defs>
        <path id="hero-pencil-path" d={flightPath} />
        <mask
          height="130"
          id="hero-pencil-trail-mask"
          maskUnits="userSpaceOnUse"
          width="900"
          x="0"
          y="0"
        >
          <path
            className="hero-pencil-trail-mask"
            d={flightPath}
            pathLength="1"
          >
            <animate
              attributeName="stroke-dashoffset"
              calcMode="linear"
              dur="5.6s"
              repeatCount="indefinite"
              values="0.985;-0.015"
            />
          </path>
        </mask>
      </defs>
      <path
        className="hero-pencil-guide"
        d={flightPath}
        mask="url(#hero-pencil-trail-mask)"
      />
      <g className="hero-pencil-track">
        <animateMotion dur="5.6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#hero-pencil-path" />
        </animateMotion>
        <g className="hero-pencil">
          <path
            className="hero-pencil-eraser"
            d="M -94 -9 L -78 -9 L -78 9 L -94 9 C -101 9, -101 -9, -94 -9 Z"
          />
          <path className="hero-pencil-ferrule" d="M -78 -9 L -64 -9 L -64 9 L -78 9 Z" />
          <path
            className="hero-pencil-body"
            d="M -64 -10 L -18 -10 C -12 -10, -9 -7, -9 0 C -9 7, -12 10, -18 10 L -64 10 Z"
          />
          <path className="hero-pencil-side" d="M -62 -4 L -18 -4 L -12 0 L -18 4 L -62 4 Z" />
          <path className="hero-pencil-wood" d="M -18 -10 L 0 0 L -18 10 L -12 0 Z" />
          <path className="hero-pencil-point" d="M -7 -4 L 0 0 L -7 4 Z" />
          <path
            className="hero-pencil-contour"
            d="M -77 -5 L -65 -5 M -77 0 L -65 0 M -77 5 L -65 5 M -56 -9 L -50 9 M -39 -9 L -33 9 M -22 -8 L -16 7"
          />
        </g>
      </g>
    </svg>
  );
}
