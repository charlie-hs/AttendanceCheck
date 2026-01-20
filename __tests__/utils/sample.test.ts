/**
 * Sample Test File
 *
 * This file verifies that Jest is configured correctly.
 * Delete this file once you have real tests.
 */

describe('Jest Setup', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async tests', async () => {
    const result = await Promise.resolve('hello');
    expect(result).toBe('hello');
  });

  it('should have access to global test utilities', () => {
    expect(global.testUtils).toBeDefined();
    expect(global.testUtils.mockApiResponse).toBeDefined();
  });

  describe('TypeScript support', () => {
    interface User {
      id: string;
      name: string;
    }

    it('should work with TypeScript interfaces', () => {
      const user: User = { id: '1', name: 'Test User' };
      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
    });
  });
});
