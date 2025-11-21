import { trackMarketingEvent, type AnalyticsEventParams } from './analytics';

export const track = (event: string, params: AnalyticsEventParams = {}) => {
  trackMarketingEvent(event, params);
}

export const trackCalculatorView = () => {
  trackMarketingEvent('calculator_view');
}

