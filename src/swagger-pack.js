#!/usr/bin/env node
import validator from 'swagger-parser';
import jsonResolver from './index';

const sourceFile = process.argv[2];

function pretty(obj) {
  return JSON.stringify(obj, null, '  ');
}

jsonResolver(sourceFile)
  .then((doc) => {
    if (process.argv[3] === '--validate') {
      validator.validate(doc);
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
