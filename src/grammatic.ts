import { EMPTY, EOI } from './special-chars';
import { ProductionRule } from './production-rule';

function extractVocabulary(rules: ProductionRule[]): { terminals: Set<string>; nonTerminals: Set<string> } {
  const nonTerminals = new Set(rules.map(rule => rule.nonTerminal));
  const extract: (vals: string[]) => string[] = vals => vals.filter(val => val !== 'ε' && !nonTerminals.has(val));
  const terminals = new Set(
    rules
      .map(rule => rule.replacementSymbols)
      .map(extract)
      .reduce((acc, curr) => acc.concat(curr), new Array<string>())
  );
  return { terminals, nonTerminals };
}

function safeAccess<T>(val: T | undefined): T {
  if (val === undefined) {
    throw new Error('Value is undefined');
  }
  return val;
}

export class Grammatic {
  private readonly _firstSets: Map<string, Set<string>>;
  private readonly _predictionSets: Map<number, Set<string>>;
  private readonly _followSets: Map<string, Set<string>>;
  private readonly _terminals: Set<string>;
  private readonly _nonTerminals: Set<string>;
  private readonly _rules: ProductionRule[];

  constructor(rules: ProductionRule[]) {
    if (!rules) {
      throw new Error('Rules can not be null');
    }
    this._rules = [...rules];
    const { nonTerminals, terminals } = extractVocabulary(this._rules);
    this._nonTerminals = nonTerminals;
    this._terminals = terminals;

    this._firstSets = this.generateEmptySetsForNonTerminals();
    this.calculateFirstSets();

    this._followSets = this.generateEmptySetsForNonTerminals();
    this.calculateFollowSets();

    this._predictionSets = new Map<number, Set<string>>();
    this.calculatePredictionSets();
  }

  public getTerminals(): Set<string> {
    return new Set(this._terminals);
  }

  public getNonTerminals(): Set<string> {
    return new Set(this._nonTerminals);
  }

  public getFirstSets(): Map<string, Set<string>> {
    return new Map([...this._firstSets].map(([x, set]) => [x, new Set(set)]));
  }

  public getFollowSets(): Map<string, Set<string>> {
    return new Map([...this._followSets].map(([x, set]) => [x, new Set(set)]));
  }

  public getPredictionSets(): Map<number, Set<string>> {
    return new Map([...this._predictionSets].map(([x, set]) => [x, new Set(set)]));
  }

  public isTerminal(item: string): boolean {
    return this._terminals.has(item);
  }

  public isNonTerminal(item: string): boolean {
    return this._nonTerminals.has(item);
  }

  private calculatePredictionSets(): void {
    for (let ruleIndex = 0; ruleIndex < this._rules.length; ruleIndex++) {
      this._predictionSets.set(ruleIndex, this.calculatePredictionSet(this._rules[ruleIndex]));
    }
  }

  private calculateFirstSets(): void {
    let change: boolean;

    do {
      change = false;
      for (const { nonTerminal: ruleNonTerminal, replacementSymbols } of this._rules) {
        const activeFirstSet = safeAccess(this._firstSets.get(ruleNonTerminal));
        const originalSize = activeFirstSet.size;

        for (const terminal of this.calculateFirstSet(replacementSymbols)) {
          activeFirstSet.add(terminal);
        }
        if (originalSize !== activeFirstSet.size) {
          change = true;
        }
      }
    } while (change);
  }

  private calculateFollowSets(): void {
    let change: boolean;
    if (this._rules.length) {
      const startNonTerminal = this._rules[0].nonTerminal;
      safeAccess(this._followSets.get(startNonTerminal)).add(EOI);
    }

    do {
      change = false;
      for (const rule of this._rules) {
        const Aj = rule.nonTerminal;

        for (let index = 0; index < rule.replacementSymbols.length; index++) {
          const Ai = rule.replacementSymbols[index];
          if (!this.isNonTerminal(Ai)) {
            continue;
          }
          const followSetAi = safeAccess(this._followSets.get(Ai));
          const originalSetSize = followSetAi.size;
          const rightSideRest =
            index + 1 >= rule.replacementSymbols.length ? [EMPTY] : rule.replacementSymbols.slice(index + 1);
          const fiPrimeRightSideRest = this.calculateFirstSet(rightSideRest);

          for (const symbol of fiPrimeRightSideRest) {
            if (this.isTerminal(symbol)) {
              // Fo(Ai)+={a}, a ε Terminals ^ a ε Fi'(w')
              followSetAi.add(symbol);
            }
          }

          //  Ai != Aj ^ ε ε F'(w')
          if (Ai !== Aj && fiPrimeRightSideRest.has(EMPTY)) {
            for (const symbol of safeAccess(this._followSets.get(Aj))) {
              // Fo(Ai)+=Fo(Aj)
              followSetAi.add(symbol);
            }
          }
          if (followSetAi.size !== originalSetSize) {
            change = true;
          }
        }
      }
    } while (change);
  }

  private generateEmptySetsForNonTerminals(): Map<string, Set<string>> {
    return new Map([...this._nonTerminals].map(val => [val, new Set<string>()]));
  }

  /**
   * Calculates the prediction set of a production rule
   * @description The prediction set of a rule can be formally defined as:
   *
   * Prediction(A → α):
   * - Fi'(α), ε ∉ Fi'(α)
   * - Fi'(α)\ {ε} ∪ Follow(A), ε ∈ Fi'(α)
   * @param rule the production rule
   */
  private calculatePredictionSet(rule: ProductionRule): Set<string> {
    let predictionSet: Set<string>;
    const { nonTerminal: S, replacementSymbols: α } = rule;
    const αFirst = this.calculateFirstSet(α);
    if (αFirst.has(EMPTY)) {
      αFirst.delete(EMPTY);
      predictionSet = new Set([...safeAccess(this._followSets.get(S)), ...αFirst]);
    } else {
      predictionSet = αFirst;
    }
    return predictionSet;
  }

  /**
   * Calculates the first-set of a given α
   * @description Formally defined as Fi'(α), with:
   *
   * - Fi'(αβ) = { α }, if α is a terminal
   * - Fi'(Aβ) = Fi(A),if ε not in Fi(A)
   * - Fi'(Aβ) = Fi(A) \ { ε } ∪ Fi'(β), if ε in Fi(A)
   * - Fi'(ε) = { ε }
   * @param α a sequence of grammar symbols
   */
  private calculateFirstSet(α: string[]): Set<string> {
    let fiPrimeSet: Set<string>;
    const [a, ...β] = α;

    if (this.isTerminal(a)) {
      // Fi'(aβ) = {a}, a ∈ Terminals
      fiPrimeSet = new Set([a]);
    } else if (this.isNonTerminal(a)) {
      const aFirstSet = safeAccess(this._firstSets.get(a));
      // Fi'(aβ) = Fi(a)\{ε}, a ∈ Non-terminals
      fiPrimeSet = new Set(aFirstSet);
      fiPrimeSet.delete(EMPTY);
      if (aFirstSet.has(EMPTY)) {
        // Fi'(aβ) U= Fi'(β)
        fiPrimeSet = new Set([...fiPrimeSet, ...this.calculateFirstSet(β)]);
      }
    } else {
      // Fi'(aβ) = {ε}, aβ = ε
      fiPrimeSet = new Set([EMPTY]);
    }
    return fiPrimeSet;
  }
}
