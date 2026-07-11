export function ButterflyFlight() {
  const flightPath = "M 28 76 C 150 18, 254 104, 386 58 S 640 16, 872 66";

  return (
    <svg
      aria-hidden="true"
      className="hero-butterfly-flight"
      focusable="false"
      viewBox="0 0 900 130"
    >
      <defs>
        <path id="hero-butterfly-path" d={flightPath} />
        <mask
          height="130"
          id="hero-butterfly-trail-mask"
          maskUnits="userSpaceOnUse"
          width="900"
          x="0"
          y="0"
        >
          <path
            className="hero-butterfly-trail-mask"
            d={flightPath}
            pathLength="1"
          >
            <animate
              attributeName="stroke-dashoffset"
              calcMode="linear"
              dur="5.8s"
              repeatCount="indefinite"
              values="0.985;-0.015"
            />
          </path>
        </mask>
      </defs>
      <path
        className="hero-butterfly-guide"
        d={flightPath}
        mask="url(#hero-butterfly-trail-mask)"
      />
      <g className="hero-butterfly-track">
        <animateMotion dur="5.8s" repeatCount="indefinite" rotate="auto">
          <mpath href="#hero-butterfly-path" />
        </animateMotion>
        <g className="hero-butterfly-drift">
          <g className="hero-butterfly-wing hero-butterfly-wing-back">
            <path d="M 5 -4 C -22 -34, -5 -66, 28 -49 C 55 -35, 45 -12, 10 2 Z" />
            <path d="M 6 5 C -21 17, -5 45, 31 30 C 57 19, 42 7, 8 5 Z" />
          </g>
          <g className="hero-butterfly-wing hero-butterfly-wing-front">
            <path d="M 9 -5 C -12 -43, 26 -73, 53 -43 C 73 -20, 47 -5, 12 1 Z" />
            <path d="M 9 6 C -23 21, -1 55, 43 33 C 70 19, 43 7, 10 6 Z" />
          </g>
          <ellipse
            className="hero-butterfly-body-dot"
            cx="16"
            cy="2"
            rx="7"
            ry="8"
            transform="rotate(-18 16 2)"
          />
          <circle className="hero-butterfly-head" cx="29" cy="-2" r="5.4" />
          <path
            className="hero-butterfly-antenna"
            d="M 33 -6 C 40 -11, 46 -10, 49 -6 M 33 -1 C 41 -3, 47 -1, 50 3"
          />
        </g>
      </g>
    </svg>
  );
}
