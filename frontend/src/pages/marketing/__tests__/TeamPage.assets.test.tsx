import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { TeamPage } from '../TeamPage';

const renderTeamPage = () =>
  render(
    <BrowserRouter>
      <TeamPage />
    </BrowserRouter>
  );

describe('TeamPage assets & structured data', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('emits schema.org data with fully-qualified team member images', async () => {
    renderTeamPage();

    await waitFor(() => {
      const structuredData = document.getElementById('team-schema');
      expect(structuredData).not.toBeNull();

      const payload = structuredData?.textContent ? JSON.parse(structuredData.textContent) : null;
      expect(payload).toBeTruthy();
      expect(Array.isArray(payload?.employee)).toBe(true);

      const imageFields = (payload?.employee ?? []).map((person: any) => person.image);
      expect(imageFields.length).toBeGreaterThan(0);
      imageFields.forEach((image?: string) => {
        if (!image) {
          return;
        }
        expect(image.startsWith('https://100daysandbeyond.com/assets/team/')).toBe(true);
      });
    });
  });
});
