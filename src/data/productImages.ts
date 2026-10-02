/**
 * NEXORA Luxury Minimalist Product Visual Assets
 * Deterministic, zero-dependency, ultra-crisp SVG data URIs tailored to the NEXORA palette:
 * - Deep Emerald: #123C35
 * - Champagne Gold: #B89B5E
 * - Champagne Soft: #EDE4D2
 * - Graphite: #171A19
 * - Warm Ivory: #F7F5F0
 * - Pure White: #FFFFFF
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const productImages = {
  arcHeadphones: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <!-- Soft Studio Shadow -->
        <ellipse cx="300" cy="420" rx="180" ry="24" fill="#171A19" opacity="0.08"/>
        <ellipse cx="300" cy="415" rx="140" ry="16" fill="#123C35" opacity="0.06"/>
        <!-- Headband Arc -->
        <path d="M 170 320 C 150 140, 450 140, 430 320" fill="none" stroke="#171A19" stroke-width="28" stroke-linecap="round"/>
        <path d="M 180 300 C 165 160, 435 160, 420 300" fill="none" stroke="#123C35" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
        <!-- Headband Cushion -->
        <path d="M 220 185 C 260 168, 340 168, 380 185" fill="none" stroke="#232726" stroke-width="20" stroke-linecap="round"/>
        <!-- Left Stem & Ear Cup -->
        <rect x="156" y="270" width="16" height="50" rx="8" fill="#B89B5E"/>
        <ellipse cx="164" cy="340" rx="46" ry="68" fill="#171A19"/>
        <ellipse cx="164" cy="340" rx="36" ry="56" fill="#123C35"/>
        <ellipse cx="164" cy="340" rx="20" ry="32" fill="#0D302A"/>
        <circle cx="164" cy="340" r="8" fill="#B89B5E" opacity="0.9"/>
        <!-- Right Stem & Ear Cup -->
        <rect x="428" y="270" width="16" height="50" rx="8" fill="#B89B5E"/>
        <ellipse cx="436" cy="340" rx="46" ry="68" fill="#171A19"/>
        <ellipse cx="436" cy="340" rx="36" ry="56" fill="#123C35"/>
        <ellipse cx="436" cy="340" rx="20" ry="32" fill="#0D302A"/>
        <circle cx="436" cy="340" r="8" fill="#B89B5E" opacity="0.9"/>
      </svg>
    `),
    side: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="425" rx="140" ry="20" fill="#171A19" opacity="0.08"/>
        <!-- Profile View -->
        <path d="M 290 120 C 330 120, 360 220, 310 320" fill="none" stroke="#171A19" stroke-width="24" stroke-linecap="round"/>
        <rect x="295" y="260" width="14" height="45" rx="7" fill="#B89B5E"/>
        <ellipse cx="300" cy="335" rx="72" ry="72" fill="#171A19"/>
        <ellipse cx="300" cy="335" rx="58" ry="58" fill="#123C35"/>
        <circle cx="300" cy="335" r="22" fill="#0D302A"/>
        <circle cx="300" cy="335" r="7" fill="#B89B5E"/>
      </svg>
    `),
    case: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="400" rx="160" ry="26" fill="#171A19" opacity="0.09"/>
        <!-- Hard Shell Case -->
        <rect x="180" y="160" width="240" height="230" rx="48" fill="#171A19"/>
        <rect x="195" y="175" width="210" height="200" rx="38" fill="#1E2321"/>
        <line x1="180" y1="275" x2="420" y2="275" stroke="#B89B5E" stroke-width="3" stroke-dasharray="6,4"/>
        <circle cx="300" cy="275" r="10" fill="#B89B5E"/>
      </svg>
    `)
  },

  edgeKeyboard: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="360" rx="220" ry="28" fill="#171A19" opacity="0.08"/>
        <!-- Keyboard Chassis -->
        <rect x="110" y="190" width="380" height="150" rx="14" fill="#202523" stroke="#E4E1DA" stroke-width="2"/>
        <rect x="120" y="200" width="360" height="130" rx="10" fill="#171A19"/>
        <!-- Keys Row 1 -->
        <g fill="#2B312E" stroke="#123C35" stroke-width="1">
          <rect x="130" y="210" width="22" height="18" rx="4"/>
          <rect x="156" y="210" width="22" height="18" rx="4"/>
          <rect x="182" y="210" width="22" height="18" rx="4"/>
          <rect x="208" y="210" width="22" height="18" rx="4"/>
          <rect x="234" y="210" width="22" height="18" rx="4"/>
          <rect x="260" y="210" width="22" height="18" rx="4"/>
          <rect x="286" y="210" width="22" height="18" rx="4"/>
          <rect x="312" y="210" width="22" height="18" rx="4"/>
          <rect x="338" y="210" width="22" height="18" rx="4"/>
          <rect x="364" y="210" width="22" height="18" rx="4"/>
          <rect x="390" y="210" width="22" height="18" rx="4"/>
          <rect x="416" y="210" width="48" height="18" rx="4" fill="#123C35"/>
        </g>
        <!-- Keys Row 2 -->
        <g fill="#2B312E">
          <rect x="130" y="234" width="32" height="18" rx="4" fill="#123C35"/>
          <rect x="166" y="234" width="22" height="18" rx="4"/>
          <rect x="192" y="234" width="22" height="18" rx="4"/>
          <rect x="218" y="234" width="22" height="18" rx="4"/>
          <rect x="244" y="234" width="22" height="18" rx="4"/>
          <rect x="270" y="234" width="22" height="18" rx="4"/>
          <rect x="296" y="234" width="22" height="18" rx="4"/>
          <rect x="322" y="234" width="22" height="18" rx="4"/>
          <rect x="348" y="234" width="22" height="18" rx="4"/>
          <rect x="374" y="234" width="22" height="18" rx="4"/>
          <rect x="400" y="234" width="64" height="18" rx="4"/>
        </g>
        <!-- Keys Row 3 -->
        <g fill="#2B312E">
          <rect x="130" y="258" width="40" height="18" rx="4"/>
          <rect x="174" y="258" width="22" height="18" rx="4"/>
          <rect x="200" y="258" width="22" height="18" rx="4"/>
          <rect x="226" y="258" width="22" height="18" rx="4"/>
          <rect x="252" y="258" width="22" height="18" rx="4"/>
          <rect x="278" y="258" width="22" height="18" rx="4"/>
          <rect x="304" y="258" width="22" height="18" rx="4"/>
          <rect x="330" y="258" width="22" height="18" rx="4"/>
          <rect x="356" y="258" width="22" height="18" rx="4"/>
          <rect x="382" y="258" width="82" height="18" rx="4" fill="#B89B5E"/>
        </g>
        <!-- Spacebar Row -->
        <g fill="#2B312E">
          <rect x="130" y="282" width="30" height="20" rx="4"/>
          <rect x="164" y="282" width="26" height="20" rx="4"/>
          <rect x="194" y="282" width="28" height="20" rx="4"/>
          <rect x="226" y="282" width="144" height="20" rx="4" fill="#123C35"/>
          <rect x="374" y="282" width="26" height="20" rx="4"/>
          <rect x="404" y="282" width="26" height="20" rx="4"/>
          <rect x="434" y="282" width="30" height="20" rx="4"/>
        </g>
        <!-- Rotary Dial -->
        <circle cx="472" cy="184" r="14" fill="#B89B5E"/>
        <circle cx="472" cy="184" r="10" fill="#171A19"/>
      </svg>
    `),
    detail: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <rect x="180" y="140" width="240" height="220" rx="16" fill="#171A19"/>
        <!-- Exploded Keycap & Switch -->
        <rect x="230" y="180" width="140" height="40" rx="8" fill="#123C35" stroke="#B89B5E" stroke-width="2"/>
        <rect x="270" y="240" width="60" height="50" rx="6" fill="#B89B5E"/>
        <path d="M 290 290 L 290 320" stroke="#EDE4D2" stroke-width="4"/>
        <path d="M 310 290 L 310 320" stroke="#EDE4D2" stroke-width="4"/>
      </svg>
    `)
  },

  pulseSmartwatch: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="430" rx="100" ry="18" fill="#171A19" opacity="0.08"/>
        <!-- Strap -->
        <rect x="260" y="60" width="80" height="380" rx="20" fill="#202523"/>
        <rect x="270" y="70" width="60" height="60" rx="8" fill="#171A19"/>
        <!-- Titanium Watch Body -->
        <rect x="230" y="170" width="140" height="160" rx="42" fill="#2F3532" stroke="#E4E1DA" stroke-width="2"/>
        <!-- Bezel -->
        <rect x="242" y="182" width="116" height="136" rx="34" fill="#0D1110"/>
        <!-- OLED Face -->
        <text x="300" y="238" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#F7F5F0" text-anchor="middle">10:42</text>
        <text x="300" y="262" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#B89B5E" text-anchor="middle">WED 14 OCT</text>
        <!-- Activity Ring -->
        <circle cx="300" cy="286" r="16" fill="none" stroke="#123C35" stroke-width="4"/>
        <circle cx="300" cy="286" r="16" fill="none" stroke="#B89B5E" stroke-width="4" stroke-dasharray="70,30"/>
        <!-- Crown Button -->
        <rect x="370" y="226" width="10" height="30" rx="4" fill="#B89B5E"/>
      </svg>
    `)
  },

  coreHub: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="380" rx="170" ry="24" fill="#171A19" opacity="0.08"/>
        <!-- Braided Cable -->
        <path d="M 180 250 C 140 250, 110 200, 130 140" fill="none" stroke="#2B312E" stroke-width="12" stroke-linecap="round"/>
        <rect x="120" y="110" width="22" height="34" rx="6" fill="#B89B5E"/>
        <!-- Aluminum Enclosure -->
        <rect x="180" y="200" width="260" height="100" rx="14" fill="#2A302D" stroke="#E4E1DA" stroke-width="2"/>
        <rect x="186" y="206" width="248" height="88" rx="10" fill="#1D2220"/>
        <!-- Ports -->
        <rect x="220" y="235" width="26" height="8" rx="2" fill="#123C35"/>
        <rect x="260" y="235" width="26" height="8" rx="2" fill="#123C35"/>
        <rect x="300" y="232" width="34" height="14" rx="3" fill="#0D302A"/>
        <rect x="350" y="232" width="34" height="14" rx="3" fill="#0D302A"/>
        <circle cx="405" cy="239" r="4" fill="#B89B5E"/>
        <text x="310" y="275" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" letter-spacing="3" fill="#EDE4D2" text-anchor="middle">NEXORA CORE</text>
      </svg>
    `)
  },

  flowMouse: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="400" rx="120" ry="22" fill="#171A19" opacity="0.08"/>
        <!-- Mouse Ergonomic Body -->
        <path d="M 230 360 C 210 250, 230 150, 300 150 C 370 150, 390 250, 370 360 C 360 410, 240 410, 230 360 Z" fill="#171A19"/>
        <!-- Thumb Rest & Ergonomic Curve -->
        <path d="M 235 340 C 205 320, 205 270, 235 240" fill="#123C35" opacity="0.8"/>
        <!-- Split Button Seam -->
        <line x1="300" y1="150" x2="300" y2="250" stroke="#2B312E" stroke-width="2"/>
        <!-- Champagne Metal Scroll Wheel -->
        <rect x="293" y="180" width="14" height="40" rx="7" fill="#B89B5E"/>
        <line x1="293" y1="195" x2="307" y2="195" stroke="#171A19" stroke-width="2"/>
        <line x1="293" y1="205" x2="307" y2="205" stroke="#171A19" stroke-width="2"/>
        <!-- Soft LED Indicator -->
        <circle cx="300" cy="290" r="3" fill="#B89B5E" opacity="0.8"/>
      </svg>
    `)
  },

  beamLamp: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="440" rx="140" ry="18" fill="#171A19" opacity="0.08"/>
        <!-- Circular Heavy Base -->
        <ellipse cx="300" cy="410" rx="90" ry="24" fill="#202523"/>
        <ellipse cx="300" cy="406" rx="80" ry="20" fill="#171A19"/>
        <circle cx="300" cy="406" r="8" fill="#B89B5E"/>
        <!-- Vertical Stem -->
        <rect x="296" y="140" width="8" height="268" rx="4" fill="#171A19"/>
        <circle cx="300" cy="140" r="10" fill="#B89B5E"/>
        <!-- Horizontal Light Bar -->
        <rect x="180" y="128" width="240" height="16" rx="6" fill="#123C35"/>
        <rect x="200" y="142" width="200" height="4" rx="2" fill="#EDE4D2"/>
        <!-- Ambient Warm Cone -->
        <polygon points="200,146 140,380 460,380 400,146" fill="#EDE4D2" opacity="0.18"/>
      </svg>
    `)
  },

  slateStand: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="410" rx="180" ry="24" fill="#171A19" opacity="0.08"/>
        <!-- Precision Aluminum Stand -->
        <polygon points="160,370 440,370 410,340 190,340" fill="#252A28"/>
        <!-- Angled Riser Legs -->
        <polygon points="190,340 230,190 260,190 215,340" fill="#171A19"/>
        <polygon points="410,340 370,190 340,190 385,340" fill="#171A19"/>
        <!-- Laptop Shelf with Silicone Cushions -->
        <polygon points="180,210 420,210 450,250 150,250" fill="#123C35"/>
        <rect x="160" y="245" width="40" height="12" rx="4" fill="#B89B5E"/>
        <rect x="400" y="245" width="40" height="12" rx="4" fill="#B89B5E"/>
        <line x1="200" y1="230" x2="400" y2="230" stroke="#2F3633" stroke-width="4"/>
      </svg>
    `)
  },

  axisBackpack: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="440" rx="130" ry="20" fill="#171A19" opacity="0.08"/>
        <!-- Backpack Outer Silhouette -->
        <path d="M 210 410 C 190 280, 220 120, 300 120 C 380 120, 410 280, 390 410 Z" fill="#171A19"/>
        <!-- Weatherproof Coated Front Panel -->
        <path d="M 230 400 C 215 290, 240 160, 300 160 C 360 160, 385 290, 370 400 Z" fill="#1F2523"/>
        <!-- Waterproof Seam & Gold Pull -->
        <line x1="300" y1="180" x2="300" y2="360" stroke="#123C35" stroke-width="4"/>
        <circle cx="300" cy="240" r="6" fill="#B89B5E"/>
        <!-- Top Handle -->
        <path d="M 270 120 C 270 95, 330 95, 330 120" fill="none" stroke="#2E3532" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `)
  },

  apexMonitors: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="220" cy="420" rx="90" ry="18" fill="#171A19" opacity="0.08"/>
        <ellipse cx="380" cy="420" rx="90" ry="18" fill="#171A19" opacity="0.08"/>
        <!-- Left Speaker Cabinet -->
        <rect x="150" y="160" width="140" height="240" rx="12" fill="#171A19"/>
        <rect x="160" y="170" width="120" height="220" rx="8" fill="#1F2422"/>
        <!-- Tweeter -->
        <circle cx="220" cy="220" r="22" fill="#123C35" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="220" cy="220" r="8" fill="#0D302A"/>
        <!-- Woofer -->
        <circle cx="220" cy="320" r="45" fill="#123C35" stroke="#2A312E" stroke-width="3"/>
        <circle cx="220" cy="320" r="18" fill="#B89B5E" opacity="0.8"/>
        <!-- Right Speaker Cabinet -->
        <rect x="310" y="160" width="140" height="240" rx="12" fill="#171A19"/>
        <rect x="320" y="170" width="120" height="220" rx="8" fill="#1F2422"/>
        <!-- Tweeter -->
        <circle cx="380" cy="220" r="22" fill="#123C35" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="380" cy="220" r="8" fill="#0D302A"/>
        <!-- Woofer -->
        <circle cx="380" cy="320" r="45" fill="#123C35" stroke="#2A312E" stroke-width="3"/>
        <circle cx="380" cy="320" r="18" fill="#B89B5E" opacity="0.8"/>
      </svg>
    `)
  },

  horizonArm: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="430" rx="140" ry="20" fill="#171A19" opacity="0.08"/>
        <!-- Heavy Desk Clamp Base -->
        <rect x="260" y="360" width="80" height="50" rx="8" fill="#171A19"/>
        <circle cx="300" cy="385" r="14" fill="#B89B5E"/>
        <!-- Lower Articulated Arm -->
        <polygon points="290,360 310,360 370,240 350,240" fill="#242B28"/>
        <circle cx="360" cy="240" r="16" fill="#123C35" stroke="#B89B5E" stroke-width="2"/>
        <!-- Upper Gas-Spring Arm -->
        <polygon points="350,240 370,240 250,140 230,140" fill="#171A19"/>
        <circle cx="240" cy="140" r="14" fill="#123C35"/>
        <!-- VESA Bracket Mount -->
        <rect x="210" y="100" width="20" height="80" rx="4" fill="#B89B5E"/>
        <rect x="180" y="125" width="30" height="30" rx="4" fill="#171A19"/>
      </svg>
    `)
  },

  elementNumpad: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="390" rx="140" ry="20" fill="#171A19" opacity="0.08"/>
        <!-- Aluminum Numpad Base -->
        <rect x="200" y="150" width="200" height="220" rx="14" fill="#202523" stroke="#E4E1DA" stroke-width="2"/>
        <rect x="210" y="160" width="180" height="200" rx="10" fill="#171A19"/>
        <!-- Key Grid (4x5) -->
        <g fill="#2C3330">
          <!-- Row 1 -->
          <rect x="222" y="172" width="34" height="26" rx="4" fill="#123C35"/>
          <rect x="262" y="172" width="34" height="26" rx="4"/>
          <rect x="302" y="172" width="34" height="26" rx="4"/>
          <rect x="342" y="172" width="36" height="26" rx="4" fill="#B89B5E"/>
          <!-- Row 2 -->
          <rect x="222" y="206" width="34" height="26" rx="4"/>
          <rect x="262" y="206" width="34" height="26" rx="4"/>
          <rect x="302" y="206" width="34" height="26" rx="4"/>
          <rect x="342" y="206" width="36" height="60" rx="4" fill="#123C35"/>
          <!-- Row 3 -->
          <rect x="222" y="240" width="34" height="26" rx="4"/>
          <rect x="262" y="240" width="34" height="26" rx="4"/>
          <rect x="302" y="240" width="34" height="26" rx="4"/>
          <!-- Row 4 -->
          <rect x="222" y="274" width="34" height="26" rx="4"/>
          <rect x="262" y="274" width="34" height="26" rx="4"/>
          <rect x="302" y="274" width="34" height="26" rx="4"/>
          <rect x="342" y="274" width="36" height="60" rx="4" fill="#B89B5E"/>
          <!-- Row 5 (Zero Key) -->
          <rect x="222" y="308" width="74" height="26" rx="4"/>
          <rect x="302" y="308" width="34" height="26" rx="4"/>
        </g>
      </svg>
    `)
  },

  sphereCharger: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="400" rx="120" ry="20" fill="#171A19" opacity="0.08"/>
        <!-- Solid Walnut / Titanium Stand -->
        <circle cx="300" cy="270" r="110" fill="#171A19"/>
        <circle cx="300" cy="270" r="95" fill="#123C35"/>
        <!-- MagSafe Ring Indicator -->
        <circle cx="300" cy="270" r="50" fill="none" stroke="#B89B5E" stroke-width="4" stroke-dasharray="18,6"/>
        <circle cx="300" cy="270" r="14" fill="#EDE4D2"/>
        <!-- Base Ring -->
        <ellipse cx="300" cy="380" rx="70" ry="14" fill="#2C3330"/>
        <rect x="296" y="340" width="8" height="40" fill="#B89B5E"/>
      </svg>
    `)
  },

  vaultSleeve: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="420" rx="180" ry="24" fill="#171A19" opacity="0.08"/>
        <!-- Full-Grain Vegetable Tanned Leather Envelope -->
        <rect x="140" y="160" width="320" height="230" rx="14" fill="#2E241E" stroke="#B89B5E" stroke-width="1.5"/>
        <rect x="148" y="168" width="304" height="214" rx="10" fill="#221B17"/>
        <!-- Flap Contour -->
        <polygon points="148,168 300,280 452,168" fill="#382C24"/>
        <!-- Magnetic Champagne Clasp -->
        <circle cx="300" cy="280" r="12" fill="#B89B5E"/>
        <circle cx="300" cy="280" r="6" fill="#171A19"/>
        <!-- Perimeter Stitches -->
        <rect x="156" y="176" width="288" height="198" rx="8" fill="none" stroke="#B89B5E" stroke-width="1" stroke-dasharray="6,4" opacity="0.7"/>
      </svg>
    `)
  },

  driftMat: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="380" rx="230" ry="30" fill="#171A19" opacity="0.08"/>
        <!-- Merino Wool Desk Mat -->
        <rect x="80" y="180" width="440" height="180" rx="12" fill="#262C29" stroke="#E4E1DA" stroke-width="2"/>
        <rect x="90" y="190" width="420" height="160" rx="8" fill="#1A1F1D"/>
        <!-- Vegan Leather Accent Strip -->
        <rect x="420" y="190" width="90" height="160" rx="4" fill="#123C35"/>
        <circle cx="465" cy="270" r="8" fill="#B89B5E"/>
        <!-- Subtle Texture Lines -->
        <line x1="120" y1="230" x2="390" y2="230" stroke="#313A35" stroke-width="1"/>
        <line x1="120" y1="270" x2="390" y2="270" stroke="#313A35" stroke-width="1"/>
        <line x1="120" y1="310" x2="390" y2="310" stroke="#313A35" stroke-width="1"/>
      </svg>
    `)
  },

  aeroMug: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="430" rx="90" ry="18" fill="#171A19" opacity="0.08"/>
        <!-- Thermal Ceramic Tumbler -->
        <path d="M 240 180 L 255 400 C 255 415, 345 415, 345 400 L 360 180 Z" fill="#171A19"/>
        <!-- Emerald Powder Coat Body -->
        <path d="M 243 210 L 254 395 C 255 406, 345 406, 346 395 L 357 210 Z" fill="#123C35"/>
        <!-- Champagne Insulated Lid & Rim -->
        <rect x="235" y="165" width="130" height="25" rx="6" fill="#B89B5E"/>
        <rect x="245" y="150" width="110" height="18" rx="4" fill="#171A19"/>
        <!-- Brand Mark -->
        <text x="300" y="310" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" letter-spacing="4" fill="#EDE4D2" text-anchor="middle">NEXORA</text>
      </svg>
    `)
  },

  clarityEarbuds: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="420" rx="140" ry="22" fill="#171A19" opacity="0.08"/>
        <!-- Pebble Charging Case -->
        <ellipse cx="300" cy="310" rx="120" ry="90" fill="#171A19"/>
        <ellipse cx="300" cy="305" rx="112" ry="82" fill="#1C2220"/>
        <ellipse cx="300" cy="270" rx="90" ry="35" fill="#123C35"/>
        <!-- Left Bud -->
        <circle cx="260" cy="265" r="22" fill="#171A19" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="260" cy="265" r="8" fill="#EDE4D2"/>
        <!-- Right Bud -->
        <circle cx="340" cy="265" r="22" fill="#171A19" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="340" cy="265" r="8" fill="#EDE4D2"/>
        <!-- Status Indicator LED -->
        <circle cx="300" cy="360" r="3" fill="#B89B5E"/>
      </svg>
    `)
  },

  shadowController: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="410" rx="160" ry="24" fill="#171A19" opacity="0.08"/>
        <!-- Ergonomic Controller Shell -->
        <path d="M 180 370 C 160 270, 200 170, 300 170 C 400 170, 440 270, 420 370 C 410 400, 370 370, 340 320 L 260 320 C 230 370, 190 400, 180 370 Z" fill="#171A19"/>
        <!-- Grip Accents -->
        <path d="M 180 340 C 185 280, 215 220, 245 220" fill="none" stroke="#123C35" stroke-width="12" stroke-linecap="round"/>
        <path d="M 420 340 C 415 280, 385 220, 355 220" fill="none" stroke="#123C35" stroke-width="12" stroke-linecap="round"/>
        <!-- Analog Sticks -->
        <circle cx="240" cy="260" r="26" fill="#242B28" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="240" cy="260" r="12" fill="#171A19"/>
        <circle cx="330" cy="290" r="26" fill="#242B28" stroke="#B89B5E" stroke-width="2"/>
        <circle cx="330" cy="290" r="12" fill="#171A19"/>
        <!-- D-Pad -->
        <rect x="220" y="215" width="12" height="34" rx="3" fill="#B89B5E"/>
        <rect x="209" y="226" width="34" height="12" rx="3" fill="#B89B5E"/>
        <!-- Action Buttons -->
        <circle cx="360" cy="230" r="8" fill="#B89B5E"/>
        <circle cx="380" cy="250" r="8" fill="#123C35"/>
        <circle cx="340" cy="250" r="8" fill="#123C35"/>
        <circle cx="360" cy="270" r="8" fill="#EDE4D2"/>
      </svg>
    `)
  },

  glideSkates: {
    main: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
        <rect width="600" height="500" fill="#F7F5F0"/>
        <ellipse cx="300" cy="400" rx="200" ry="28" fill="#171A19" opacity="0.08"/>
        <!-- Tempered Glass Surface Pad -->
        <rect x="120" y="160" width="360" height="220" rx="16" fill="#123C35" stroke="#E4E1DA" stroke-width="2"/>
        <rect x="130" y="170" width="340" height="200" rx="12" fill="#0D302A"/>
        <!-- Reflective Chamfer Angle -->
        <line x1="130" y1="170" x2="470" y2="170" stroke="#EDE4D2" stroke-width="2" opacity="0.7"/>
        <circle cx="430" cy="330" r="14" fill="#B89B5E" opacity="0.8"/>
        <text x="300" y="275" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" letter-spacing="5" fill="#EDE4D2" text-anchor="middle">NEXORA GLIDE</text>
      </svg>
    `)
  }
};
