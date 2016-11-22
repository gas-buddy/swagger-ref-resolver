#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import jsonResolver from './index';

const sourceFile = process.argv[2];

jsonResolver(sourceFile)
  .then((doc) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(doc, null, '\t'));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack);
    process.exit(-1);
  });
