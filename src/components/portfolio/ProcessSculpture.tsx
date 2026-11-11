/** Oversized editorial typography with sharply offset extrusion, not illustrative icons. */
export default function ProcessSculpture({ index }: { index: number }) {
  const number = String(index + 1).padStart(2, "0");
  return <span className="process-sculpture" aria-hidden="true">
    <span className="phase-monument">
      <span className="phase-depth depth-back">{number}</span>
      <span className="phase-depth depth-mid">{number}</span>
      <span className="phase-face">{number}</span>
      <span className="phase-registration">+</span>
    </span>
  </span>;
}
