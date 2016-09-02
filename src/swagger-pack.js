#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import jsonResolver from './index';

const sourceFile = process.argv[2];

const swaggerSource = JSON.parse(fs.readFileSync(sourceFile));
const baseDir = path.dirname(sourceFile);

jsonResolver(swaggerSource, baseDir)
  .then((doc) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(doc, null, '\t'));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack);
    process.exit(-1);
  });
