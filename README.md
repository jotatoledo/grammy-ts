# grammy-ts

[![CircleCI](https://circleci.com/gh/jotatoledo/grammy-ts/tree/master.svg?style=shield)](https://circleci.com/gh/jotatoledo/grammy-ts/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/jotatoledo/grammy-ts/badge.svg?branch=master)](https://coveralls.io/github/jotatoledo/grammy-ts?branch=master)

Another _LL(K) grammar_ analyzer.

## Install

```bash
npm i grammy-ts
```

## API

TODO

## Linting

Now that tslint [is on its way to deprecation](https://medium.com/palantir/tslint-in-2019-1a144c2317a9), this project uses _eslint_ to lint `.ts` files as described in [@typescript-eslint docs](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage).

## Notation

**Capital letters** (A...) refer to _non-terminals_, **lower-case letters** (a...) refer to _grammar symbols_ (terminals or non-terminals) and **greek letters** (α...) refer to possibly _empty sequences of grammar symbols_.
