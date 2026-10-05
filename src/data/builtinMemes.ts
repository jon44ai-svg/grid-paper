// Preset sticker / meme face SVG data URLs so users have classic memes instantly available
// without needing external CDN or network requests!

export interface BuiltinSticker {
  id: string
  name: string
  svgDataUrl: string
}

function createSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const PEPE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#2d3748"/>
  <!-- Pepe Head -->
  <path d="M 20 60 C 15 35, 30 15, 60 15 C 80 15, 90 30, 85 55 C 80 75, 40 85, 20 60 Z" fill="#6ba543" stroke="#223315" stroke-width="3"/>
  <!-- Eyes -->
  <ellipse cx="42" cy="38" rx="12" ry="10" fill="#ffffff" stroke="#112200" stroke-width="2.5"/>
  <ellipse cx="68" cy="36" rx="11" ry="9" fill="#ffffff" stroke="#112200" stroke-width="2.5"/>
  <!-- Heavy eyelids / sad -->
  <path d="M 30 36 C 38 28, 50 34, 54 39" fill="none" stroke="#223315" stroke-width="3"/>
  <path d="M 58 35 C 66 26, 76 32, 79 37" fill="none" stroke="#223315" stroke-width="3"/>
  <!-- Pupils -->
  <circle cx="44" cy="40" r="4.5" fill="#111111"/>
  <circle cx="70" cy="38" r="4.5" fill="#111111"/>
  <!-- Sad/Smug Pepe Lips -->
  <path d="M 28 66 C 45 68, 65 60, 82 58 C 76 72, 45 78, 28 66 Z" fill="#b94a48" stroke="#5c1918" stroke-width="2.5"/>
</svg>`

const WOJAK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#1f2937"/>
  <!-- Wojak Head -->
  <ellipse cx="50" cy="52" rx="36" ry="40" fill="#f6d7b0" stroke="#000" stroke-width="2.5"/>
  <!-- Bald head wrinkles -->
  <path d="M 32 26 C 45 22, 58 22, 68 25" fill="none" stroke="#6b5b4b" stroke-width="1.5"/>
  <path d="M 35 32 C 46 29, 56 29, 65 31" fill="none" stroke="#6b5b4b" stroke-width="1.5"/>
  <!-- Eyes - despair -->
  <path d="M 30 46 Q 40 40 46 48" fill="none" stroke="#000" stroke-width="2"/>
  <circle cx="39" cy="48" r="2.5" fill="#000"/>
  <path d="M 58 48 Q 64 40 74 46" fill="none" stroke="#000" stroke-width="2"/>
  <circle cx="65" cy="48" r="2.5" fill="#000"/>
  <!-- Eye bags / sleepless nights -->
  <path d="M 31 54 Q 40 58 47 53" fill="none" stroke="#a38970" stroke-width="1.5"/>
  <path d="M 57 53 Q 64 58 73 54" fill="none" stroke="#a38970" stroke-width="1.5"/>
  <!-- Nose -->
  <path d="M 50 48 L 47 62 L 53 62" fill="none" stroke="#000" stroke-width="2"/>
  <!-- Sad trembling mouth -->
  <path d="M 36 74 Q 50 68 64 74" fill="none" stroke="#000" stroke-width="2.5"/>
</svg>`

const CRYING_CAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#1e293b"/>
  <!-- Cat Ears -->
  <polygon points="20,40 12,12 42,26" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <polygon points="22,36 17,18 36,27" fill="#fda4af"/>
  <polygon points="80,40 88,12 58,26" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <polygon points="78,36 83,18 64,27" fill="#fda4af"/>
  <!-- Cat Face -->
  <circle cx="50" cy="55" r="36" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <!-- Glassy Crying Eyes -->
  <ellipse cx="36" cy="48" rx="10" ry="11" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <circle cx="34" cy="44" r="3.5" fill="#fff"/>
  <circle cx="39" cy="51" r="2" fill="#fff"/>
  <ellipse cx="64" cy="48" rx="10" ry="11" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <circle cx="62" cy="44" r="3.5" fill="#fff"/>
  <circle cx="67" cy="51" r="2" fill="#fff"/>
  <!-- Big tear drop -->
  <path d="M 33 60 C 30 65, 36 72, 33 76 C 30 72, 36 65, 33 60 Z" fill="#0284c7"/>
  <path d="M 67 60 C 64 65, 70 72, 67 76 C 64 72, 70 65, 67 60 Z" fill="#0284c7"/>
  <!-- Nose & Mouth -->
  <polygon points="50,60 46,56 54,56" fill="#f43f5e"/>
  <path d="M 43 65 Q 50 62 57 65" fill="none" stroke="#334155" stroke-width="2"/>
</svg>`

const CLOWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#312e81"/>
  <!-- Clown Hair -->
  <circle cx="22" cy="44" r="14" fill="#3b82f6"/>
  <circle cx="78" cy="44" r="14" fill="#3b82f6"/>
  <!-- Face -->
  <circle cx="50" cy="54" r="32" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <!-- Eyes -->
  <ellipse cx="38" cy="46" rx="5" ry="8" fill="#1e1b4b"/>
  <ellipse cx="62" cy="46" rx="5" ry="8" fill="#1e1b4b"/>
  <!-- Red Nose -->
  <circle cx="50" cy="58" r="9" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Clown Smile with lipstick -->
  <path d="M 32 68 Q 50 86 68 68" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
</svg>`

const SKULL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <!-- Skull Cranium -->
  <ellipse cx="50" cy="44" rx="30" ry="28" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <!-- Teeth base -->
  <rect x="36" y="66" width="28" height="16" rx="4" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <!-- Eye sockets -->
  <ellipse cx="38" cy="46" rx="9" ry="11" fill="#0f172a"/>
  <ellipse cx="62" cy="46" rx="9" ry="11" fill="#0f172a"/>
  <!-- Nose hole -->
  <polygon points="50,56 46,65 54,65" fill="#0f172a"/>
  <!-- Teeth lines -->
  <line x1="43" y1="67" x2="43" y2="81" stroke="#0f172a" stroke-width="2"/>
  <line x1="50" y1="67" x2="50" y2="81" stroke="#0f172a" stroke-width="2"/>
  <line x1="57" y1="67" x2="57" y2="81" stroke="#0f172a" stroke-width="2"/>
</svg>`

export const BUILTIN_MEMES: BuiltinSticker[] = [
  { id: 'pepe', name: 'Pepe FeelsBad', svgDataUrl: createSvgDataUrl(PEPE_SVG) },
  { id: 'wojak', name: 'Wojak Stress', svgDataUrl: createSvgDataUrl(WOJAK_SVG) },
  { id: 'cat', name: 'Crying Cat', svgDataUrl: createSvgDataUrl(CRYING_CAT_SVG) },
  { id: 'clown', name: 'Clown Degree', svgDataUrl: createSvgDataUrl(CLOWN_SVG) },
  { id: 'skull', name: 'Dead Inside', svgDataUrl: createSvgDataUrl(SKULL_SVG) },
]
