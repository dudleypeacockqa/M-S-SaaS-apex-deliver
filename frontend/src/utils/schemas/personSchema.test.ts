/**
 * Tests for Person Schema (schema.org)
 * Used for team members, authors, and founder pages
 */

import { describe, it, expect } from 'vitest';
import { createPersonSchema, createTeamMembersSchema } from './personSchema';

describe('personSchema', () => {
  describe('createPersonSchema', () => {
    it('should create valid Person schema with name and jobTitle', () => {
      const person = {
        name: 'John Smith',
        role: 'CEO & Founder',
        email: 'john@apexdeliver.com',
        company: 'ApexDeliver Ltd',
      };

      const schema = createPersonSchema(person);

      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe('John Smith');
      expect(schema.jobTitle).toBe('CEO & Founder');
      expect(schema.email).toBe('john@apexdeliver.com');
    });

    it('should include organization affiliation', () => {
      const person = {
        name: 'Jane Doe',
        role: 'CTO',
        company: 'ApexDeliver Ltd',
      };

      const schema = createPersonSchema(person);

      expect(schema.worksFor).toMatchObject({
        '@type': 'Organization',
        name: 'ApexDeliver Ltd',
      });
    });

    it('should include social media profiles (sameAs array)', () => {
      const person = {
        name: 'Bob Wilson',
        role: 'VP of Sales',
        socialLinks: [
          'https://linkedin.com/in/bobwilson',
          'https://twitter.com/bobwilson',
        ],
      };

      const schema = createPersonSchema(person);

      expect(schema.sameAs).toEqual([
        'https://linkedin.com/in/bobwilson',
        'https://twitter.com/bobwilson',
      ]);
    });

    it('should include contact information if provided', () => {
      const person = {
        name: 'Alice Johnson',
        role: 'CFO',
        email: 'alice@apexdeliver.com',
        phone: '+44 20 1234 5678',
      };

      const schema = createPersonSchema(person);

      expect(schema.email).toBe('alice@apexdeliver.com');
      expect(schema.telephone).toBe('+44 20 1234 5678');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalPerson = {
        name: 'Test Person',
        role: 'Advisor',
      };

      const schema = createPersonSchema(minimalPerson);

      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe('Test Person');
      expect(schema.jobTitle).toBe('Advisor');
      // Optional fields should be omitted
      expect(schema.email).toBeUndefined();
      expect(schema.telephone).toBeUndefined();
    });

    it('should include image/photo URL if provided', () => {
      const person = {
        name: 'Sarah Chen',
        role: 'Head of Product',
        image: 'https://apexdeliver.com/team/sarah-chen.jpg',
      };

      const schema = createPersonSchema(person);

      expect(schema.image).toBe('https://apexdeliver.com/team/sarah-chen.jpg');
    });
  });

  describe('createTeamMembersSchema', () => {
    it('should create array of Person schemas for team page', () => {
      const team = [
        { name: 'John Smith', role: 'CEO' },
        { name: 'Jane Doe', role: 'CTO' },
        { name: 'Bob Wilson', role: 'VP Sales' },
      ];

      const schemas = createTeamMembersSchema(team);

      expect(schemas).toHaveLength(3);
      expect(schemas[0]['@type']).toBe('Person');
      expect(schemas[0].name).toBe('John Smith');
      expect(schemas[1].name).toBe('Jane Doe');
      expect(schemas[2].name).toBe('Bob Wilson');
    });
  });
});
