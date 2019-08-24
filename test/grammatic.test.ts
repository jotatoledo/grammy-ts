import { Grammatic, ProductionRule, EMPTY } from 'grammy-ts';

import { TestData } from './test-data';

describe('Grammatic', () => {
  it('should handle empty rules', () => {
    const sut = createSut([]);

    expect(sut).toBeTruthy();
  });

  describe('Non-Terminals', () => {
    it('should handle production rules with multiple transformations', () => {
      const sut = createSut([
        new ProductionRule('S', ['a', 'B']),
        new ProductionRule('B', ['b']),
        new ProductionRule('B', [EMPTY])
      ]);

      expect(sut.nonTerminals).toEqual(['S', 'B']);
    });
  });

  describe('Terminals', () => {
    it('should handle production rules with multiple transformations', () => {
      const sut = createSut([
        new ProductionRule('S', ['a', 'B']),
        new ProductionRule('B', ['b']),
        new ProductionRule('B', [EMPTY])
      ]);

      expect(sut.terminals).toEqual(['a', 'b']);
    });
  });

  describe('First-Sets', () => {
    test.each(TestData)('it calculates correctly', ({ rules, firstSets }) => {
      const sut = createSut(rules);

      const result = sut.firstSets;

      expect(result).toBeTruthy();
      expect(result).toEqual(firstSets);
    });

    it('should return a new reference for every access', () => {
      const sut = createSut([new ProductionRule('S', ['a'])]);

      const first = sut.firstSets;
      const second = sut.firstSets;

      expect(first).not.toBe(second);
    });
  });

  describe('Follow-Sets', () => {
    test.each(TestData)('it calculates correctly', ({ rules, followSets }) => {
      const sut = createSut(rules);

      const result = sut.followSets;

      expect(result).toBeTruthy();
      expect(result).toEqual(followSets);
    });

    it('should return a new reference for every access', () => {
      const sut = createSut([new ProductionRule('S', ['a'])]);

      const first = sut.followSets;
      const second = sut.followSets;

      expect(first).not.toBe(second);
    });
  });

  function createSut(rules: ProductionRule[]) {
    return new Grammatic(rules);
  }
});
