export default function DecorativeFlower({
  className,
  color = "#b57edc",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ color }}
      aria-hidden="true"
    >
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="50" cy="26" rx="15" ry="22" />
        <ellipse cx="50" cy="26" rx="15" ry="22" transform="rotate(72 50 50)" />
        <ellipse
          cx="50"
          cy="26"
          rx="15"
          ry="22"
          transform="rotate(144 50 50)"
        />
        <ellipse
          cx="50"
          cy="26"
          rx="15"
          ry="22"
          transform="rotate(216 50 50)"
        />
        <ellipse
          cx="50"
          cy="26"
          rx="15"
          ry="22"
          transform="rotate(288 50 50)"
        />
      </g>
      <circle cx="50" cy="50" r="9" fill="white" opacity="0.7" />
    </svg>
  );
}
