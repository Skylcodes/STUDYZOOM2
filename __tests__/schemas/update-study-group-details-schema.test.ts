import { updateStudyGroupDetailsSchema } from '@/schemas/organization/update-organization-details-schema';

describe('updateStudyGroupDetailsSchema', () => {
  it('should validate valid study group details', () => {
    const validData = {
      name: 'Test Study Group',
      description: 'This is a test study group',
      address: '123 Test St',
      phone: '555-555-5555',
      email: 'test@example.com',
      website: 'https://example.com'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should validate with only required fields', () => {
    const validData = {
      name: 'Test Study Group'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should fail validation with empty name', () => {
    const invalidData = {
      name: '',
      description: 'This is a test study group'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail validation with too long name', () => {
    const invalidData = {
      name: 'A'.repeat(65),
      description: 'This is a test study group'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail validation with invalid email', () => {
    const invalidData = {
      name: 'Test Study Group',
      email: 'not-an-email'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail validation with invalid website URL', () => {
    const invalidData = {
      name: 'Test Study Group',
      website: 'not-a-url'
    };

    const result = updateStudyGroupDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
