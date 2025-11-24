import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { EnhancedLandingPage } from './EnhancedLandingPage';

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('EnhancedLandingPage metadata', () => {
  it('sets canonical and og:url to financeflo.ai', () => {
    render(
      <BrowserRouter>
        <EnhancedLandingPage />
      </BrowserRouter>
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta).not.toBeNull();
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://financeflo.ai/');
  });
});
