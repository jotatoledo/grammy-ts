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
  ),
  new GrammaticInput(
    [
      new ProductionRule('E', ['T', "E'"]),
      new ProductionRule("E'", ['+', 'T', "E'"]),
      new ProductionRule("E'", [EMPTY]),
      new ProductionRule('T', ['F', "T'"]),
      new ProductionRule("T'", ['*', 'F', "T'"]),
      new ProductionRule("T'", [EMPTY]),
      new ProductionRule('F', ['(', 'E', ')']),
      new ProductionRule('F', ['id'])
    ],
    new Set(['+', '*', '(', ')', 'id']),
    new Set(['E', "E'", 'T', "T'", 'F']),
    new Map([
      ['E', new Set(['(', 'id'])],
      ["E'", new Set(['+', EMPTY])],
      ['T', new Set(['(', 'id'])],
      ["T'", new Set(['*', EMPTY])],
      ['F', new Set(['(', 'id'])]
    ]),
    new Map([
      ['E', new Set([EOI, ')'])],
      ["E'", new Set([EOI, ')'])],
      ['T', new Set(['+', EOI, ')'])],
      ["T'", new Set(['+', EOI, ')'])],
      ['F', new Set(['*', '+', EOI, ')'])]
    ])
  )
];
