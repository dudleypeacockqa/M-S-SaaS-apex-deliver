import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';
import { CookiePolicy } from './CookiePolicy';

const resetDom = () => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
};

describe('Legal page metadata', () => {
  beforeEach(() => {
    resetDom();
  });

  it('Terms of Service canonical and og:url', () => {
    render(
      <BrowserRouter>
        <TermsOfService />
      </BrowserRouter>
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://100daysandbeyond.com/legal/terms');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://100daysandbeyond.com/legal/terms');
  });

  it('Privacy Policy canonical and og:url', () => {
    resetDom();
    render(
      <BrowserRouter>
        <PrivacyPolicy />
      </BrowserRouter>
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://100daysandbeyond.com/legal/privacy');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://100daysandbeyond.com/legal/privacy');
  });

  it('Cookie Policy canonical and og:url', () => {
    resetDom();
    render(
      <BrowserRouter>
        <CookiePolicy />
      </BrowserRouter>
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://100daysandbeyond.com/legal/cookies');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://100daysandbeyond.com/legal/cookies');
  });
});
