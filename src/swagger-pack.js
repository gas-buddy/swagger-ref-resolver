#!/usr/bin/env node
import validator from 'swagger-parser';
import jsonResolver, { resolveAllParameters } from './index';

const sourceFile = process.argv[2];
const fixParams = process.argv.includes('--deref-params');

function pretty(obj) {
  return JSON.stringify(obj, null, '  ');
}

jsonResolver(sourceFile)
  .then(async (doc) => {
    const validatorPlayground = JSON.parse(JSON.stringify(doc));
    if (process.argv[3] === '--validate') {
      await validator.validate(validatorPlayground);
      if (doc && (!doc.consumes || !doc.consumes.length)) {
        throw new Error('Swagger spec is missing "consumes" setting. You should set this to application/json generally.');
      }
    }
    return doc;
  })
  .then((doc) => {
    const spec = fixParams ? resolveAllParameters(doc) : doc;
    // eslint-disable-next-line no-console
    console.log(pretty(spec));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack);
    process.exit(-1);
  });
