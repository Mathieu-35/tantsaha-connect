// IDENTITÉ VISUELLE du site : logo, bande de losanges, rayures de lamba, paysage.
// Mêmes dessins que l'application mobile (mobile/src/components/Motifs.js et Logo.js).
// Les motifs sont des interprétations simples de l'artisanat malagasy : à faire valider.

const LAMBA = [
  [3, '#2A7C13'],
  [1, '#FFF8CF'],
  [2, '#E0A526'],
  [1, '#1F2A17'],
  [3, '#76C457'],
  [1, '#FFF8CF'],
  [2, '#2E6A8E'],
];

export function Logo({ size = 48, bg = '#2A7C13', leaf = '#FFF8CF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Tantsaha Connect">
      <rect width="120" height="120" rx="30" fill={bg} />
      <circle cx="84" cy="36" r="13" fill="#E0A526" />
      <g transform="translate(52 78)" fill={leaf}>
        {[-62, -30, 0, 30, 62].map((a) => (
          <path key={a} d="M0 0C-5-14-5-30 0-44C5-30 5-14 0 0z" transform={`rotate(${a})`} />
        ))}
      </g>
      <path d="M52 78v22" stroke={leaf} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// Bande de losanges (esprit des sculptures zafimaniry). `id` unique par bande affichée.
export function ZafiBand({ id = 'zafi', height = 26, bg = '#2A7C13', line = '#FFF8CF', fill = '#E0A526' }) {
  const m = height / 2;
  return (
    <svg width="100%" height={height} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <pattern id={id} width={height} height={height} patternUnits="userSpaceOnUse">
          <path d={`M${m} 2L${height - 2} ${m}L${m} ${height - 2}L2 ${m}z`} fill="none" stroke={line} strokeWidth="2" />
          {fill && <path d={`M${m} ${m - 5}L${m + 5} ${m}L${m} ${m + 5}L${m - 5} ${m}z`} fill={fill} />}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={bg} />
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

// Rayures de lamba (tissu traditionnel)
export function LambaStripe({ height = 10 }) {
  return (
    <div style={{ display: 'flex', height }} aria-hidden="true">
      {LAMBA.map(([flex, color], i) => (
        <div key={i} style={{ flex, background: color }} />
      ))}
    </div>
  );
}

// Courbes de niveau des rizières en terrasses : fond d'une carte (position absolue)
export function Terraces({ color = '#76C457', opacity = 0.55 }) {
  return (
    <svg className="terraces" viewBox="0 0 360 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 120C80 100 160 126 240 110S330 100 360 110" fill="none" stroke={color} strokeWidth="3" opacity={opacity} />
      <path d="M0 140C90 120 170 146 250 130S340 120 360 130" fill="none" stroke={color} strokeWidth="3" opacity={opacity} />
      <path d="M0 160C90 140 170 166 250 150S340 140 360 150" fill="none" stroke={color} strokeWidth="3" opacity={opacity} />
    </svg>
  );
}

// Paysage : ciel, soleil, collines, terrasses, ravenala
export function Landscape({ viewBox = '0 0 390 228' }) {
  return (
    <svg className="landscape" viewBox={viewBox} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <rect width="390" height="228" fill="#FFE7A0" />
      <circle cx="300" cy="70" r="30" fill="#E0A526" />
      <path d="M0 136C60 106 110 116 170 131S300 116 390 134V228H0z" fill="#A9D68F" />
      <path d="M0 160C70 138 140 150 200 158S330 146 390 160V228H0z" fill="#76C457" />
      <path d="M0 172C80 158 150 168 210 172S320 162 390 174" fill="none" stroke="#2A7C13" strokeWidth="2.5" opacity=".55" />
      <g transform="translate(330 130)" fill="#1E5A0E">
        <path d="M0 0V38" stroke="#1E5A0E" strokeWidth="5" strokeLinecap="round" />
        {[-62, -40, -20, 0, 20, 40, 62].map((a) => (
          <path key={a} d="M0 0C-4-10-4-24 0-34C4-24 4-10 0 0z" transform={`rotate(${a})`} />
        ))}
      </g>
      <path d="M0 192C90 178 170 190 240 194S340 184 390 196V228H0z" fill="#2A7C13" />
      <path d="M0 206C90 194 170 204 240 208S340 200 390 210" fill="none" stroke="#76C457" strokeWidth="2.5" opacity=".7" />
    </svg>
  );
}

// Frise des 12 mois (cases pleines = mois de la période)
export function MonthsBar({ start, end, color = '#2A7C13' }) {
  const inRange = (m) => (start <= end ? m >= start && m <= end : m >= start || m <= end);
  return (
    <div className="months" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} style={inRange(i + 1) ? { background: color } : undefined} />
      ))}
    </div>
  );
}
