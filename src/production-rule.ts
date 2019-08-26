import { EMPTY } from './special-chars';

function validateSymbols(vals: string[]): void {
  if (vals.some(val => !val)) {
    throw new Error('Falsy values are not allowed');
  }
}

export class ProductionRule {
  constructor(public readonly nonTerminal: string, public readonly replacementSymbols: string[]) {
    if (!nonTerminal) {
      throw new Error('nonTerminal cannot be falsy');
    }
    if (!replacementSymbols) {
      throw new Error('replacement cannot be null');
    }

    switch (replacementSymbols.length) {
      case 0:
        throw new Error('replacement can not be empty');
      case 1:
        validateSymbols(replacementSymbols);
        break;
      default:
        validateSymbols(replacementSymbols);
        if (replacementSymbols.some(val => val === EMPTY)) {
          throw new Error('Non-terminals and terminals can not be acompanied with the empty symbol');
        }
    }
  }

  get replacementSentence(): string {
    return this.replacementSymbols.join(' ');
  }
}
