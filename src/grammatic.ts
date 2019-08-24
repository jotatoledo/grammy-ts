import { EMPTY, EOI } from './special-chars';
import { ProductionRule } from './production-rule';

function extractVocabulary(rules: ProductionRule[]): { terminals: Set<string>; nonTerminals: Set<string> } {
  const nonTerminals = new Set(rules.map(rule => rule.inputNonTerminal));
  const extract: (vals: string[]) => string[] = vals => vals.filter(val => val != 'ε' && !nonTerminals.has(val));
  const terminals = new Set(
    rules
      .map(rule => rule.replacementSymbols)
      .map(extract)
      .reduce((acc, curr) => acc.concat(curr), new Array<string>())
  );
  return { terminals, nonTerminals };
}

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

  get terminals(): Set<string> {
    return new Set(this._terminals);
  }

  get nonTerminals(): Set<string> {
    return new Set(this._nonTerminals);
  }

  private _firstSet: Map<string, Set<string>> | null = null;
  get firstSets(): Map<string, Set<string>> {
    if (!this._firstSet) {
      this.setFirstSet();
    }
    return new Map([...this._firstSet!].map(([x, set]) => [x, new Set(set)]));
  }

  private _followSets: Map<string, Set<string>> | null = null;
  get followSets(): Map<string, Set<string>> {
    if (!this._followSets) {
      this.setFollowSet();
    }
    return new Map([...this._followSets!].map(([x, set]) => [x, new Set(set)]));
  }

  public isTerminal(item: string): boolean {
    return this._terminals.has(item);
  }

  public isNonTerminal(item: string): boolean {
    return this._nonTerminals.has(item);
  }

  public isEmpty(item: string): boolean {
    return item === EMPTY;
  }

  private setFirstSet() {
    this._firstSet = this.generateSets();
    let change: boolean;

    do {
      change = false;
      for (const rule of this._rules) {
        const ruleNonTerminal = rule.inputNonTerminal;
        const targetSet = this._firstSet!.get(ruleNonTerminal)!;
        const originalSize = targetSet.size;

        for (const terminal of this.FiPrime(rule.replacementSymbols)) {
          targetSet.add(terminal);
        }
        if (originalSize != targetSet.size) {
          change = true;
        }
      }
    } while (change);
  }

  private setFollowSet() {
    this._followSets = this.generateSets();
    let change: boolean;
    if (!!this._rules.length) {
      const startNonTerminal = this._rules[0].inputNonTerminal;
      this._followSets.get(startNonTerminal)!.add(EOI);
    }

    do {
      change = false;
      for (const rule of this._rules) {
        const Aj = rule.inputNonTerminal;

        for (let index = 0; index < rule.replacementSymbols.length; index++) {
          const Ai = rule.replacementSymbols[index];
          if (!this.isNonTerminal(Ai)) {
            continue;
          }
          const followSetAi = this._followSets.get(Ai)!;
          const originalSetSize = followSetAi.size;
          const rightSideRest =
            index + 1 >= rule.replacementSymbols.length ? [EMPTY] : rule.replacementSymbols.slice(index + 1);
          const fiPrimeRightSideRest = this.FiPrime(rightSideRest);

          for (const symbol of fiPrimeRightSideRest) {
            if (this.isTerminal(symbol)) {
              // Fo(Ai)+={a}, a ε Terminals ^ a ε Fi'(w')
              followSetAi.add(symbol);
            }
          }

          //  Ai != Aj ^ ε ε F'(w')
          if (Ai != Aj && fiPrimeRightSideRest.has(EMPTY)) {
            for (const symbol of this._followSets.get(Aj)!) {
              // Fo(Ai)+=Fo(Aj)
              followSetAi.add(symbol);
            }
          }
          if (followSetAi.size != originalSetSize) {
            change = true;
          }
        }
      }
    } while (change);
  }

  private generateSets(): Map<string, Set<string>> {
    return new Map([...this.nonTerminals].map(val => [val, new Set<string>()]));
  }

  private FiPrime(items: string[]): Set<string> {
    const fiPrimeSet = new Set<string>();
    const [head, ...rest] = items;

    if (this.isTerminal(head)) {
      // Fi'(aw) = {a}
      fiPrimeSet.add(head);
    } else if (this.isNonTerminal(head)) {
      const headFirstSet = this.firstSets.get(head)!;
      // Fi'(Aw) += Fi(A)\{ε}
      for (const terminal of Array.from(headFirstSet).filter(symbol => !this.isEmpty(symbol))) {
        fiPrimeSet.add(terminal);
      }
      if (headFirstSet.has(EMPTY)) {
        // Fi'(Aw) + = Fi'(w)
        for (const terminal of this.FiPrime(rest)) {
          fiPrimeSet.add(terminal);
        }
      }
    } else {
      // Fi'(ε) = {ε}
      fiPrimeSet.add(EMPTY);
    }
    return fiPrimeSet;
  }
}
