interface MatchScoreBadgeProps {
  score: number;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ score }) => {
  const roundedScore = Math.round(score);

  const getConfidence = (score: number): string => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const getColorClass = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const confidence = getConfidence(roundedScore);
  const colorClass = getColorClass(roundedScore);

  return (
    <div
      data-testid="score-badge"
      className={`${colorClass} text-white rounded-full px-3 py-1 text-sm font-semibold inline-flex items-center space-x-2`}
    >
      <span>{roundedScore}%</span>
      <span className="text-xs opacity-90">{confidence}</span>
    </div>
  );
};
