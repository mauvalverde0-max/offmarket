export default function Stars({ value = 0, max = 5 }) {
  const filled = Math.round(value);
  const empty = max - filled;

  return (
    <span className="text-lg">
      {Array(filled)
        .fill(0)
        .map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-400">
            ★
          </span>
        ))}
      {Array(empty)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
    </span>
  );
}
