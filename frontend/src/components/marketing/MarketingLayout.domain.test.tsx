import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { MarketingLayout } from './MarketingLayout';

const resetDocument = () => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
};

describe('MarketingLayout domain configuration', () => {
  beforeEach(() => {
    resetDocument();
  });

  it('exposes organization structured data for financeflo.ai', () => {
    render(
      <BrowserRouter>
        <MarketingLayout>
          <div>Test content</div>
        </MarketingLayout>
      </BrowserRouter>
    );

    const schemaScript = document.getElementById('organization-schema');
    expect(schemaScript).not.toBeNull();

    const payload = schemaScript?.textContent ? JSON.parse(schemaScript.textContent) : null;
    expect(payload).not.toBeNull();
    expect(payload?.url).toBe('https://financeflo.ai');
    expect(payload?.logo).toContain('financeflo.ai');
    expect(payload?.name).toBe('FinanceFlo');
  });
});
