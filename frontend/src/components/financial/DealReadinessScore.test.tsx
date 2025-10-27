/**
 * Tests for DealReadinessScore Component - DEV-010 Phase 2.4
 * TDD: Write tests first, then implement component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DealReadinessScore } from './DealReadinessScore';

describe('DealReadinessScore Component', () => {
  const mockScore = {
    score: 82.5,
    dataQualityScore: 22.0,
    financialHealthScore: 35.0,
    growthTrajectoryScore: 18.5,
    riskAssessmentScore: 7.0,
  };

  it('should render the overall score prominently', () => {
    render(<DealReadinessScore {...mockScore} />);

    // Should show the score in large text
    expect(screen.getByText(/82\.5/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument(); // Out of 100
  });

  it('should display green background for high scores (76-100)', () => {
    render(<DealReadinessScore {...mockScore} />);

    const scoreDisplay = screen.getByText(/82\.5/).closest('.score-display');
    expect(scoreDisplay).toHaveClass(/green|success/i);
  });

  it('should display yellow background for medium scores (50-75)', () => {
    const mediumScore = { ...mockScore, score: 65 };
    render(<DealReadinessScore {...mediumScore} />);

    const scoreDisplay = screen.getByText(/65/).closest('.score-display');
    expect(scoreDisplay).toHaveClass(/yellow|warning/i);
  });

  it('should display red background for low scores (0-49)', () => {
    const lowScore = { ...mockScore, score: 42 };
    render(<DealReadinessScore {...lowScore} />);

    const scoreDisplay = screen.getByText(/42/).closest('.score-display');
    expect(scoreDisplay).toHaveClass(/red|danger|error/i);
  });

  it('should show breakdown of score components', () => {
    render(<DealReadinessScore {...mockScore} />);

    expect(screen.getByText(/data quality/i)).toBeInTheDocument();
    expect(screen.getByText(/22\.0/)).toBeInTheDocument();

    expect(screen.getByText(/financial health/i)).toBeInTheDocument();
    expect(screen.getByText(/35\.0/)).toBeInTheDocument();

    expect(screen.getByText(/growth trajectory/i)).toBeInTheDocument();
    expect(screen.getByText(/18\.5/)).toBeInTheDocument();

    expect(screen.getByText(/risk assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/7\.0/)).toBeInTheDocument();
  });

  it('should display component scores with max values', () => {
    render(<DealReadinessScore {...mockScore} />);

    // Data Quality: 22/25
    expect(screen.getByText(/22\.0/)).toBeInTheDocument();
    expect(screen.getByText(/25/)).toBeInTheDocument();

    // Financial Health: 35/40
    expect(screen.getByText(/35\.0/)).toBeInTheDocument();
    expect(screen.getByText(/40/)).toBeInTheDocument();

    // Growth: 18.5/20
    expect(screen.getByText(/18\.5/)).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument();

    // Risk: 7/15
    expect(screen.getByText(/7\.0/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should render circular gauge visualization', () => {
    render(<DealReadinessScore {...mockScore} />);

    // Check for gauge or circular progress element
    const gauge = document.querySelector('.score-gauge, .circular-progress, svg');
    expect(gauge).toBeTruthy();
  });

  it('should handle score of 100 (perfect score)', () => {
    const perfectScore = {
      score: 100,
      dataQualityScore: 25,
      financialHealthScore: 40,
      growthTrajectoryScore: 20,
      riskAssessmentScore: 15,
    };

    render(<DealReadinessScore {...perfectScore} />);

    expect(screen.getByText('100.0')).toBeInTheDocument();
    const scoreDisplay = screen.getByText('100.0').closest('.score-display');
    expect(scoreDisplay).toHaveClass(/green|success/i);
  });
});
