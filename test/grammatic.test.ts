import { Grammatic, ProductionRule } from 'grammy-ts';

import { GrammaticData } from './grammatic.data';

function createSut(rules: ProductionRule[]): Grammatic {
  return new Grammatic(rules);
}

describe('Grammatic', () => {
  it('should handle empty rules', () => {
    const sut = createSut([]);

    expect(sut).toBeTruthy();
    expect(sut.getTerminals()).toBeTruthy();
    expect(sut.getNonTerminals()).toBeTruthy();
    expect(sut.getFirstSets()).toBeTruthy();
    expect(sut.getFollowSets()).toBeTruthy();
    expect(sut.getPredictionSets()).toBeTruthy();
  });

  it('throws when given null rules', () => {
    expect(() => createSut(null)).toThrow();
  });

  describe('Non-Terminals', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, nonTerminals }) => {
      const sut = createSut(rules);

      expect(sut.getNonTerminals()).toEqual(nonTerminals);
    });
  });

  describe('Terminals', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, terminals }) => {
      const sut = createSut(rules);

      expect(sut.getTerminals()).toEqual(terminals);
    });
  });

  describe('Prediction-Sets', () => {
    it('should return a new reference for every access', () => {
      const sut = createSut([new ProductionRule('S', ['a'])]);

      const first = sut.getPredictionSets();
      const second = sut.getPredictionSets();

      expect(first).not.toBe(second);
    });

    test.each(GrammaticData)('it calculates correctly', ({ rules, predictionSets }) => {
      const sut = createSut(rules);

      const result = sut.getPredictionSets();

      expect(result).toEqual(predictionSets);
    });
  });

  describe('First-Sets', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, firstSets }) => {
      const sut = createSut(rules);

      const result = sut.getFirstSets();

      expect(result).toBeTruthy();
      expect(result).toEqual(firstSets);
    });

    it('should return a new reference for every access', () => {
      const sut = createSut([new ProductionRule('S', ['a'])]);

      const first = sut.getFirstSets();
      const second = sut.getFirstSets();

      expect(first).not.toBe(second);
    });
  });

  describe('Follow-Sets', () => {
    test.each(GrammaticData)('it calculates correctly', ({ rules, followSets }) => {
      const sut = createSut(rules);

      const result = sut.getFollowSets();

      expect(result).toBeTruthy();
      expect(result).toEqual(followSets);
    });

    it('should return a new reference for every access', () => {
      const sut = createSut([new ProductionRule('S', ['a'])]);

      const first = sut.getFollowSets();
      const second = sut.getFollowSets();

      expect(first).not.toBe(second);
    });
  });
});
