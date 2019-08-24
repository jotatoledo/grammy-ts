import { ProductionRule, EMPTY } from 'grammy-ts';

describe('Rule', () => {
  it('throws on falsy input terminal', () => {
    expect(() => new ProductionRule('', ['a'])).toThrow();
  });

  it('throws if any replacement token is false', () => {
    expect(() => new ProductionRule('S', ['a', ''])).toThrow();
  });

  it('throws if replacement tokens is null', () => {
    expect(() => new ProductionRule('S', null)).toThrow();
  });

  it('throws if replacement tokens is empty', () => {
    expect(() => new ProductionRule('S', [])).toThrow();
  });

  it('throws if a non-empty replacement rule contains the empty character', () => {
    expect(() => new ProductionRule('S', ['a', EMPTY])).toThrow();
  });
});
