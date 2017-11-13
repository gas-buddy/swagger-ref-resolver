#!/usr/bin/env node
import { inspect } from 'util';
import validator from 'swagger-parser';
import jsonResolver from './index';

const sourceFile = process.argv[2];

function pretty(obj) {
  return inspect(obj, null, 5);
}

jsonResolver(sourceFile)
  .then((doc) => {
    if (process.argv[3] === '--validate') {
      return validator.validate(doc);
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
