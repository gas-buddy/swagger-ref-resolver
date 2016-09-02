import deref from '../src/index';
import tap from 'tap';
import testSwagger from './sample';

tap.test('ref resolution', async (t) => {
  const resolved = await deref(testSwagger, __dirname);
  t.ok(resolved.paths['/hello/world'], 'Should have a /hello/world path');
  t.ok(resolved.paths['/goodbye'], 'Should have a /goodbye path');
  t.end();
});
