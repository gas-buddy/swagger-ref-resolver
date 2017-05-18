import tap from 'tap';
import path from 'path';
import testSwagger from './sample.json';
import deref from '../src/index';

tap.test('ref resolution', async (t) => {
  const resolved = await deref(testSwagger, __dirname);
  t.ok(resolved.paths['/hello/world'], 'Should have a /hello/world path');
  t.ok(resolved.paths['/goodbye'], 'Should have a /goodbye path');
  t.ok(resolved.definitions.FooBar, 'Should resolve recursively');
  t.end();
});

tap.test('ref with file resolution', async (t) => {
  const resolved = await deref(path.join(__dirname, 'part2.yaml'), __dirname);
  t.ok(resolved.paths['/hello/world'], 'Should have a /hello/world path');
  t.end();
});
