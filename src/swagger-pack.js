#!/usr/bin/env node
import { Readable } from 'stream';
import validator from 'swagger-spec-validator';
import jsonResolver from './index';

const sourceFile = process.argv[2];

function pretty(obj) {
  return JSON.stringify(obj, null, '\t');
}

jsonResolver(sourceFile)
  .then(async (doc) => {
    if (process.argv[3] === '--validate') {
      const r = new Readable();
      r.push(pretty(doc));
      r.push(null);
      const result = await validator.validate(r);
      if (Object.keys(result).length > 0) {
        throw new Error(`Validation Failed!
${pretty(result)}`);
      }
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
