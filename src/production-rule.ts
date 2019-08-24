import { EMPTY } from './special-chars';

const ruleRegex = /^(.*)\s?->\s?(.*)$/gm;

function validateSymbols(vals: string[]) {
  if (vals.some(val => !val)) {
    throw new Error('Falsy values are not allowed');
  }
}

export class ProductionRule {
  constructor(public readonly nonTerminal: string, public readonly replacement: string[]) {
    if(!nonTerminal){
      throw new Error("nonTerminal cannot be falsy");
    }
    if(!replacement){
      throw new Error("replacement cannot be null");
    }

    switch (replacement.length) {
      case 0:
        throw new Error('replacement can not be empty');
      case 1:
        validateSymbols(replacement);
        break;
      default:
        validateSymbols(replacement);
        if (replacement.some(val => val == EMPTY)) {
          throw new Error('Non-terminals and terminals can not be acompanied with the empty symbol');
        }
    }
  }
}
