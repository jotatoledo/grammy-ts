import { EMPTY } from './special-chars';

const ruleRegex = /^(.*)\s?->\s?(.*)$/gm;

function validateSymbols(vals: string[]) {
  if (vals.some(val => !val)) {
    throw new Error('Falsy values are not allowed');
  }
}

export class ProductionRule {
  constructor(public readonly inputNonTerminal: string, public readonly replacementSymbols: string[]) {
    if(!inputNonTerminal){
      throw new Error("inputNonTerminal cannot be falsy");
    }
    if(!replacementSymbols){
      throw new Error("replacementSymbols cannot be null");
    }

    switch (replacementSymbols.length) {
      case 0:
        throw new Error('Replacement tokens can not be empty');
      case 1:
        validateSymbols(replacementSymbols);
        break;
      default:
        validateSymbols(replacementSymbols);
        if (replacementSymbols.some(val => val == EMPTY)) {
          throw new Error('Non-terminals and terminals can not be acompanied with the empty symbol');
        }
    }
  }
}
