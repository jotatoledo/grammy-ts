import { EMPTY, EOI } from './special-chars';
import { ProductionRule } from './production-rule';

function extractVocabulary(rules: ProductionRule[]): { terminals: Set<string>; nonTerminals: Set<string> } {
  const nonTerminals = new Set(rules.map(rule => rule.nonTerminal));
  const extract: (vals: string[]) => string[] = vals => vals.filter(val => val != 'ε' && !nonTerminals.has(val));
  const terminals = new Set(
    rules
      .map(rule => rule.replacement)
      .map(extract)
      .reduce((acc, curr) => acc.concat(curr), new Array<string>())
  );
  return { terminals, nonTerminals };
}

export class Grammatic {
  private _firstSets: Map<string, Set<string>>;
  private _predictionSets: Map<number, Set<string>>;
  private _followSets: Map<string, Set<string>>;
  private readonly _terminals: Set<string>;
  private readonly _nonTerminals: Set<string>;
  private readonly _rules: ProductionRule[];

  constructor(rules: ProductionRule[]) {
    const { nonTerminals, terminals } = extractVocabulary(rules);
    this._nonTerminals = nonTerminals;
    this._terminals = terminals;
    this._rules = [...rules];
    this._firstSets = this.setFirstSets();
    this._followSets = this.setFollowSets();
    this._predictionSets = this.setPredictionSets();
  }

  get terminals(): Set<string> {
    return new Set(this._terminals);
  }

  get nonTerminals(): Set<string> {
    return new Set(this._nonTerminals);
  }

  get firstSets(): Map<string, Set<string>> {
    return new Map([...this._firstSets!].map(([x, set]) => [x, new Set(set)]));
  }

  get followSets(): Map<string, Set<string>> {
    return new Map([...this._followSets!].map(([x, set]) => [x, new Set(set)]));
  }

  getPredictionSets(): Map<number, Set<string>> {
    return new Map([...this._predictionSets!].map(([x, set]) => [x, new Set(set)]));
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

  private setPredictionSets(): Map<number, Set<string>> {
    this._predictionSets = new Map<number, Set<string>>();
    for (let ruleIndex = 0; ruleIndex < this._rules.length; ruleIndex++) {
      this._predictionSets.set(ruleIndex, this.calcPredictSet(this._rules[ruleIndex]));
    }
    return this._predictionSets;
  }

  private setFirstSets(): Map<string, Set<string>> {
    this._firstSets = this.generateEmptySetsForNonTerminals();
    let change: boolean;

    do {
      change = false;
      for (const { nonTerminal: inputNonTerminal, replacement: replacementSymbols } of this._rules) {
        const ruleNonTerminal = inputNonTerminal;
        const activeFirstSet = this._firstSets.get(ruleNonTerminal)!;
        const originalSize = activeFirstSet.size;

        for (const terminal of this.fiPrime(replacementSymbols)) {
          activeFirstSet.add(terminal);
        }
        if (originalSize != activeFirstSet.size) {
          change = true;
        }
      }
    } while (change);
    return this._firstSets;
  }

  private setFollowSets(): Map<string, Set<string>> {
    this._followSets = this.generateEmptySetsForNonTerminals();
    let change: boolean;
    if (!!this._rules.length) {
      const startNonTerminal = this._rules[0].nonTerminal;
      this._followSets.get(startNonTerminal)!.add(EOI);
    }

    do {
      change = false;
      for (const rule of this._rules) {
        const Aj = rule.nonTerminal;

        for (let index = 0; index < rule.replacement.length; index++) {
          const Ai = rule.replacement[index];
          if (!this.isNonTerminal(Ai)) {
            continue;
          }
          const followSetAi = this._followSets.get!(Ai)!;
          const originalSetSize = followSetAi.size;
          const rightSideRest =
            index + 1 >= rule.replacement.length ? [EMPTY] : rule.replacement.slice(index + 1);
          const fiPrimeRightSideRest = this.fiPrime(rightSideRest);

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
    return this._followSets;
  }

  private generateEmptySetsForNonTerminals(): Map<string, Set<string>> {
    return new Map([...this.nonTerminals].map(val => [val, new Set<string>()]));
  }

  private calcPredictSet({ nonTerminal: inputNonTerminal, replacement: replacementSymbols }: ProductionRule): Set<string> {
    let predictSet = this.first(replacementSymbols);
    if (predictSet.has(EMPTY)) {
      predictSet = new Set([...this._followSets.get(inputNonTerminal), ...predictSet]);
      predictSet.delete(EMPTY);
    }
    return predictSet;
  }

  private first([head, ...rest]: string[]): Set<string> {
    let set: string[];
    if (this.isTerminal(head)) {
      set = [head];
    } else if (this.isNonTerminal(head)) {
      set = [...this._firstSets.get(head)];
    } else if (this.isEmpty(head)) {
      set = [EMPTY];
    } else {
      set = [];
    }
    if (set.includes(EMPTY)) {
      set = set.filter(val => this.isEmpty(val)).concat([...this.first(rest)]);
    }
    return new Set(set);
  }

  /**
   *
   * @param replacement the replacement defined by a production rule
   */
  private fiPrime(replacement: string[]): Set<string> {
    let fiPrimeSet = new Set<string>();
    const [a, ...β] = replacement;

    if (this.isTerminal(a)) {
      // Fi'(aβ) = {a}, a is terminal
      fiPrimeSet.add(a);
    } else if (this.isNonTerminal(a)) {
      const aFirstSet = this._firstSets.get(a)!;
      // Fi'(aβ) += Fi(a)\{ε}, a is non-terminal
      fiPrimeSet = new Set([...fiPrimeSet, ...aFirstSet]);
      fiPrimeSet.delete(EMPTY);
      if (aFirstSet.has(EMPTY)) {
        // Fi'(aβ) + = Fi'(β)
        fiPrimeSet = new Set([...fiPrimeSet, ...this.fiPrime(β)]);
      }
    } else {
      // Fi'(aβ) = {ε}, aβ = ε
      fiPrimeSet.add(EMPTY);
    }
    return fiPrimeSet;
  }
}
