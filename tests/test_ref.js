import tap from 'tap';
import path from 'path';
import testSwagger from './sample.json';
import deref, { resolveAllParameters } from '../src/index';

tap.test('ref resolution', async (t) => {
  const resolved = await deref(testSwagger, __dirname);
  t.ok(resolved.paths['/hello/world'], 'Should have a /hello/world path');
  t.ok(resolved.paths['/goodbye'], 'Should have a /goodbye path');
  t.ok(resolved.definitions.FooBar, 'Should resolve recursively');
  t.ok(resolved.paths['/hello/world'].parameters.find(p => p.$ref), 'Should have a ref');
  const noParamRefs = resolveAllParameters(resolved);
  t.notOk(noParamRefs.paths['/hello/world'].parameters.find(p => p.$ref), 'Should not have a ref');
  t.end();
});

tap.test('ref with file resolution', async (t) => {
  const resolved = await deref(path.join(__dirname, 'part2.yaml'), __dirname);
  t.ok(resolved.paths['/hello/world'], 'Should have a /hello/world path');
  t.end();
});
