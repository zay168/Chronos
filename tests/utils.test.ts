import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageUrl } from '../utils.ts';

test('createPageUrl produces a lower-cased path with leading slash', () => {
  assert.equal(createPageUrl('MyPage'), '/mypage');
});
