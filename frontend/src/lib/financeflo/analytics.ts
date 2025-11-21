// Stub analytics file - replace with your own tracking implementation
export const track = (event: string, params?: any) => {
  console.log('Analytics event:', event, params);
};

export const trackCalculatorView = () => {
  console.log('Calculator viewed');
};

export const Events = {
  HeroBookClick: 'hero_book_click',
  HeroCalcClick: 'hero_calc_click',
  DemoBooked: 'demo_booked',
  CalculatorView: 'calculator_view',
  CalcSubmitted: 'calculator_submit',
  BookRequested: 'book_requested',
} as const;
