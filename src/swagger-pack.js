#!/usr/bin/env node
import validator from 'swagger-parser';
import jsonResolver from './index';

const sourceFile = process.argv[2];

function pretty(obj) {
  return JSON.stringify(obj, null, '  ');
}

jsonResolver(sourceFile)
  .then(async (doc) => {
    const validatorPlayground = JSON.parse(JSON.stringify(doc));
    if (process.argv[3] === '--validate') {
      await validator.validate(validatorPlayground);
    }
    return doc;
  })
  .then((doc) => {
    // eslint-disable-next-line no-console
    console.log(pretty(doc));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack);
    process.exit(-1);
  });
