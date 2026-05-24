export function HeartIcon({ filled }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center text-current">
      {filled ? '♥' : '♡'}
    </span>
  );
}

export function BookmarkIcon({ filled }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center text-current">
      {filled ? '🔖' : '📑'}
    </span>
  );
}
