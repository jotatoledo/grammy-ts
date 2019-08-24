import { Grammatic, ProductionRule, Terminal, EMPTY } from 'grammy-ts';

describe('Grammatic', () => {
  it('should handle empty rules', () => {
    const sut = createSut([]);

    expect(sut).toBeTruthy();
  });

  describe('Non-Terminals', () => {
    it('should handle production rules with multiple transformations', () => {
      const sut = createSut([new ProductionRule('S', ['a', 'B']), new ProductionRule('B', ['b']), new ProductionRule('B', [EMPTY])]);

      expect(sut.nonTerminals).toEqual(['S', 'B']);
    });
  });

  describe('Terminals', () => {
    it('should handle production rules with multiple transformations', () => {
      const sut = createSut([new ProductionRule('S', ['a', 'B']), new ProductionRule('B', ['b']), new ProductionRule('B', [EMPTY])]);

      expect(sut.terminals).toEqual(['a', 'b']);
    });
  });

  describe('First-Sets', () => {
    it('should correctly calculate', () => {
      const rules: ProductionRule[] = [new ProductionRule('S', ['F']), new ProductionRule('S', ['(', 'S', '+', 'F', ')']), new ProductionRule('F', ['a'])];
      const expectedFirstSets = new Map<string, Set<Terminal>>([
        ['S', new Set<Terminal>(['a', '('])],
        ['F', new Set<Terminal>(['a'])]
      ]);
      const sut = createSut(rules);

      const firstSets = sut.firstSets;

      expect(firstSets).toBeTruthy();
      expect(firstSets).toEqual(expectedFirstSets);
    });
  });

  function createSut(rules: ProductionRule[]) {
    return new Grammatic(rules);
  }
});
