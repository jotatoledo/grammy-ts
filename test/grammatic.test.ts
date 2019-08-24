import { Grammatic, ProductionRule, EMPTY } from 'grammy-ts';

import { GrammaticData } from './grammatic.data';

describe('Grammatic', () => {
  it('should handle empty rules', () => {
    const sut = createSut([]);

    expect(sut).toBeTruthy();
    expect(sut.terminals).toBeTruthy();
    expect(sut.nonTerminals).toBeTruthy();
    expect(sut.firstSets).toBeTruthy();
    expect(sut.followSets).toBeTruthy();
  });

  describe('Non-Terminals', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, nonTerminals }) => {
      const sut = createSut(rules);

      expect(sut.nonTerminals).toEqual(nonTerminals);
    });
  });

  describe('Terminals', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, terminals }) => {
      const sut = createSut(rules);

      expect(sut.terminals).toEqual(terminals);
    });
  });

  describe('First-Sets', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, firstSets }) => {
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
    test.each(GrammaticData)('it calculates correctly', ({ rules, followSets }) => {
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
