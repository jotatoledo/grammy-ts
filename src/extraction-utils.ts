import { Maybe } from 'monet';

const nonTerminalsRegex = /^(.*)\s?->/gm;
const terminalsRegex = /.*->\s?(.*)$/gm;

export function extractVocabulary(rules: string | string[]): { terminals: Set<string>; nonTerminals: Set<string> } {
  const _rules = Array.isArray(rules) ? rules.join('\n') : rules;
  const nonTerminals = extractNonTerminals(_rules);
  const terminals = extractTerminals(_rules, nonTerminals);
  return { terminals, nonTerminals };
}

export function extractNonTerminals(rules: string | null): Set<string> {
  return Maybe.fromFalsy(rules)
    .flatMap(vals => Maybe.fromNull(nonTerminalsRegex.exec(vals)))
    .map(matches => matches.map(match => match[1]))
    .map(matches => new Set(matches))
    .getOrElse(new Set());
}

export function extractTerminals(rules: string | null, nonTerminals: Set<string>): Set<string> {
  const extract: (vals: string[]) => string[] = vals => vals.filter(val => !nonTerminals.has(val));
  return Maybe.fromFalsy(rules)
    .flatMap(vals => Maybe.fromNull(terminalsRegex.exec(vals)))
    .map(matches => matches.map(match => match[1]))
    .map(matches => matches.map(match => [...match]))
    .map(matches => matches.map(extract))
    .map(matches => matches.reduce((acc, curr) => acc, new Array<string>()))
    .map(matches => new Set<string>(matches))
    .getOrElse(new Set<string>());
}
