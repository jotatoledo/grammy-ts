import { ProductionRule, EMPTY, EOI } from 'grammy-ts';

export class GrammaticInput {
  constructor(
    public readonly rules: ProductionRule[],
    public readonly terminals: Set<string>,
    public readonly nonTerminals: Set<string>,
    public readonly firstSets: Map<string, Set<string>>,
    public readonly followSets: Map<string, Set<string>>
  ) {}
}

export const GrammaticData: GrammaticInput[] = [
  new GrammaticInput(
    [new ProductionRule('S', ['a', 'b', 'A']), new ProductionRule('A', ['b', 'c']), new ProductionRule('A', [EMPTY])],
    new Set(['a', 'b', 'c']),
    new Set(['S', 'A']),
    new Map([['S', new Set(['a'])], ['A', new Set(['b', EMPTY])]]),
    new Map([['S', new Set([EOI])], ['A', new Set([EOI])]])
  ),
  new GrammaticInput(
    [
      new ProductionRule('S', ['F']),
      new ProductionRule('S', ['(', 'S', '+', 'F', ')']),
      new ProductionRule('F', ['a'])
    ],
    new Set(['(', '+', ')', 'a']),
    new Set(['S', 'F']),
    new Map([['S', new Set(['(', 'a'])], ['F', new Set(['a'])]]),
    new Map([['S', new Set([EOI, '+'])], ['F', new Set([EOI, ')', '+'])]])
  )
];
