/** A crisp vector hub: no wireframe intersections or continuously rendered canvas. */
export default function TechCore() {
  return <div className="reactor-hub" aria-hidden="true">
    <svg className="reactor-dial" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="104" stroke="#F5F7FA" strokeOpacity=".08" />
      <g className="reactor-index">
        {Array.from({ length: 40 }, (_, i) => <path key={i} d={i % 5 === 0 ? "M120 13v9" : "M120 14v4"} transform={`rotate(${i * 9} 120 120)`} stroke={i % 5 === 0 ? "#00E5F0" : "#F5F7FA"} strokeOpacity={i % 5 === 0 ? ".65" : ".18"} strokeWidth="1" />)}
      </g>
      <circle cx="120" cy="120" r="88" fill="#080D10" stroke="#00E5F0" strokeOpacity=".25" />
      <circle cx="120" cy="120" r="82" stroke="#F5F7FA" strokeOpacity=".06" />
      <g className="reactor-arcs" strokeWidth="2" strokeLinecap="round">
        <path d="M32 120a88 88 0 0 1 88-88" stroke="#00E5F0" />
        <path d="M208 120a88 88 0 0 1-88 88" stroke="#00E5F0" strokeOpacity=".65" />
      </g>
      <path d="M116 32h8" stroke="#F5F7FA" strokeWidth="2" />
      <circle cx="120" cy="208" r="3" fill="#F20519" />
    </svg>
    <span className="reactor-status"><i /> SYSTEM CORE</span>
  </div>;
}
