import { EMPTY } from './special-chars';
import { ProductionRule } from './production-rule';

function extractVocabulary(rules: ProductionRule[]): { terminals: Set<string>; nonTerminals: Set<string> } {
  const nonTerminals = new Set(rules.map(rule => rule.inputNonTerminal));
  const extract: (vals: string[]) => string[] = vals => vals.filter(val => val != 'ε' && !nonTerminals.has(val));
  const terminals = new Set(rules.map(rule => rule.replacementSymbols)
    .map(extract)
    .reduce((acc, curr) => acc.concat(curr), new Array<string>()));
  return { terminals, nonTerminals };
}

export type Terminal = string | null;

export class Grammatic {
  private readonly _terminals: Set<string>;
  private readonly _nonTerminals: Set<string>;
  private readonly _rules: ProductionRule[];

  constructor(rules: ProductionRule[]) {
    const { nonTerminals, terminals } = extractVocabulary(rules);
    this._nonTerminals = nonTerminals;
    this._terminals = terminals;
    this._rules = [...rules];
  }

  get terminals(): string[] {
    return Array.from(this._terminals);
  }

  get nonTerminals(): string[] {
    return Array.from(this._nonTerminals);
  }

  private _firstSet: Map<string, Set<Terminal>> | null = null;
  get firstSets(): Map<string, Set<Terminal>> {
    if (!this._firstSet) {
      this._SetFirstSet();
    }
    return this._firstSet!;
  }

  private _followSet: Map<string, Set<Terminal>> | null = null;
  get followSet(): Map<string, Set<Terminal>> {
    if (!this._followSet) {
      this._SetFollowSet();
    }
    return this._followSet!;
  }

  public isTerminal(item: string): boolean {
    return this._terminals.has(item);
  }

  public isNonTerminal(item: string): boolean {
    return this._nonTerminals.has(item);
  }

  private _SetFirstSet() {
    this._firstSet = this.generateSets();
    let change: boolean;

    do {
      change = false;
      this._rules.forEach(rule => {
        const ruleNonTerminal = rule.inputNonTerminal;
        const targetSet = this._firstSet!.get(ruleNonTerminal)!;
        const originalSize = targetSet.size;

        for (const terminal of this.FiPrime(rule.replacementSymbols || [])) {
          targetSet.add(terminal);
        }
        if (originalSize != targetSet.size) {
          change = true;
        }
      });
    } while (change);
  }

  private _SetFollowSet(): Map<string, Set<Terminal>> {
    throw Error();
  }

  private generateSets(): Map<string, Set<Terminal>> {
    return new Map(this.nonTerminals.map(val => [val, new Set<Terminal>()]));
  }

  private FiPrime(items: string[]): Set<Terminal> {
    const fiPrimeSet = new Set<Terminal>();
    if (items.length) {
      const [head, ...rest] = items;

      if (this.isTerminal(head)) {
        fiPrimeSet.add(head);
      } else {
        const headSet = this.firstSets.get(head)!;
        for (const terminal of Array.from(headSet).filter(Boolean)) {
          fiPrimeSet.add(terminal);
        }
        if (headSet.has(EMPTY)) {
          for (const terminal of this.FiPrime(rest)) {
            fiPrimeSet.add(terminal);
          }
        }
      }
    } else {
      fiPrimeSet.add(EMPTY);
    }
    return fiPrimeSet;
  }
}
