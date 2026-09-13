import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getActiveHeadingId} from '../src/theme/TOCItems/activeHeading.mjs';

const headings = [
  {id: 'dziwna-jaskinia', top: 100, bottom: 134},
  {id: 'nowi-ludzie-do-obozu', top: 229, bottom: 263},
  {id: 'gdzie-jest-rabod', top: 466, bottom: 500},
  {id: 'hej-szmaciarzu', top: 649, bottom: 683},
  {id: 'tona-zlota', top: 859, bottom: 893},
];
const bottom = {scrollTop: 3000, scrollHeight: 4200, viewportHeight: 1200, topOffset: 80};

test('MT chapter II: last section wins at the real bottom, despite five visible headings', () => {
  assert.equal(getActiveHeadingId(headings, bottom), 'tona-zlota');
  assert.equal(getActiveHeadingId(headings, {...bottom, scrollTop: 2999.5}), 'tona-zlota');
});

test('scrolling up restores the normal reading position; end highlighting does not stick', () => {
  assert.equal(getActiveHeadingId(headings, {...bottom, scrollTop: 2960}), 'dziwna-jaskinia');
});

test('a short page that fits entirely on screen does not start at the final heading', () => {
  assert.equal(getActiveHeadingId(headings, {...bottom, scrollTop: 0, scrollHeight: 1200}), 'dziwna-jaskinia');
});

test('a heading below the reading area keeps the previous section active', () => {
  const sections = [{id: 'long-quest', top: -800, bottom: -766}, {id: 'next-quest', top: 900, bottom: 934}];
  assert.equal(getActiveHeadingId(sections, {...bottom, scrollTop: 1500}), 'long-quest');
});

test('intro, empty TOC and the final long section remain valid', () => {
  assert.equal(getActiveHeadingId([{id: 'first', top: 1300, bottom: 1334}], {...bottom, scrollTop: 0}), null);
  assert.equal(getActiveHeadingId([], bottom), null);
  assert.equal(getActiveHeadingId([{id: 'last', top: -300, bottom: -266}], {...bottom, scrollTop: 2000}), 'last');
});
