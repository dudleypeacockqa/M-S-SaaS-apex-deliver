import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

import { MarketingLayout } from './MarketingLayout';

const resetDocument = () => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
};

describe('MarketingLayout domain configuration', () => {
  beforeEach(() => {
    resetDocument();
  });

  it('exposes organization structured data for 100daysandbeyond.com', () => {
    render(
      <MarketingLayout>
        <div>Test content</div>
      </MarketingLayout>
    );

    const schemaScript = document.getElementById('organization-schema');
    expect(schemaScript).not.toBeNull();

    const payload = schemaScript?.textContent ? JSON.parse(schemaScript.textContent) : null;
    expect(payload).not.toBeNull();
    expect(payload?.url).toBe('https://100daysandbeyond.com');
    expect(payload?.logo).toBe('https://100daysandbeyond.com/assets/brand/apexdeliver-wordmark.svg');
  });
});
