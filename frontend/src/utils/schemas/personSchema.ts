/**
 * Person Schema (schema.org) Utilities
 * Creates structured data for team members, authors, and founders
 *
 * @see https://schema.org/Person
 */

interface Person {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  company?: string;
  socialLinks?: string[];
  image?: string;
}

/**
 * Creates a Person schema for an individual
 *
 * @param person - Person information
 * @returns Person schema object
 */
export function createPersonSchema(person: Person) {
  const schema: Record<string, any> = {
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role,
  };

  // Add optional contact information
  if (person.email) {
    schema.email = person.email;
  }

  if (person.phone) {
    schema.telephone = person.phone;
  }

  // Add organization affiliation if provided
  if (person.company) {
    schema.worksFor = {
      '@type': 'Organization',
      name: person.company,
    };
  }

  // Add social media profiles if provided
  if (person.socialLinks && person.socialLinks.length > 0) {
    schema.sameAs = person.socialLinks;
  }

  // Add profile image if provided
  if (person.image) {
    schema.image = person.image;
  }

  return schema;
}

/**
 * Creates an array of Person schemas for a team page
 *
 * @param team - Array of team members
 * @returns Array of Person schema objects
 */
export function createTeamMembersSchema(team: Person[]) {
  return team.map(person => createPersonSchema(person));
}

/**
 * Type exports for external use
 */
export type { Person };
