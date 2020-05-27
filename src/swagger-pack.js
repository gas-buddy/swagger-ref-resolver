#!/usr/bin/env node
import minimist from 'minimist';
import validator from '@apidevtools/swagger-parser';
import jsonResolver, { resolveAllParameters, modifyPaths } from './index';

const argv = minimist(process.argv.slice(2), {
  boolean: ['deref-params', 'validate'],
});

const sourceFile = argv._?.[0];
const fixParams = argv['deref-params'];

function pretty(obj) {
  return JSON.stringify(obj, null, '  ');
}

jsonResolver(sourceFile)
  .then(async (doc) => {
    const validatorPlayground = JSON.parse(JSON.stringify(doc));
    if (argv.validate) {
      await validator.validate(validatorPlayground);
      if (doc && (!doc.consumes || !doc.consumes.length)) {
        throw new Error('Swagger spec is missing "consumes" setting. You should set this to application/json generally.');
      }
    }
    return doc;
  })
  .then((doc) => {
    const opts = { stripPaths: argv.stripPaths?.split(',') };
    const spec = fixParams ? resolveAllParameters(doc, opts) : modifyPaths(doc, opts);
    // eslint-disable-next-line no-console
    console.log(pretty(spec));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack);
    process.exit(-1);
  });
