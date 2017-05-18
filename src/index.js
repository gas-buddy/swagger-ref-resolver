import fs from 'fs';
import path from 'path';
import util from 'util';
import request from 'superagent';
import yaml from 'js-yaml';

// A simple tree walker that replaces $ref's with file or URL paths
// with the content of their targets
function dig(obj, keys) {
  if (!keys || keys.length === 0) {
    return obj;
  }
  const [key, ...rest] = Array.isArray(keys) ? keys : keys.split('/');
  return dig(obj[key], rest);
}

async function loadFileDependency(p) {
  return (new Promise((accept, reject) => {
    fs.readFile(p, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      let objValue;
      const ext = (path.extname(p) || '').toLowerCase();
      if (['.yml', '.yaml'].includes(ext)) {
        try {
          objValue = yaml.safeLoad(data.toString());
        } catch (parseError) {
          reject(parseError);
          return;
        }
      } else {
        try {
          objValue = JSON.parse(data.toString());
        } catch (jsonError) {
          reject(jsonError);
          return;
        }
      }
      accept(objValue);
    });
  }));
}

async function resolve(value, basePath, cache, traverseFn) {
  // This is non-standard. It will merge the results of multiple references.
  if (Array.isArray(value)) {
    const valuePromises = value.map(e =>
      resolve(e, basePath, cache)
        .then(s => traverseFn(s, basePath, cache)));
    const values = await Promise.all(valuePromises);
    values.unshift({});
    const merged = Object.assign.apply(null, values);
    return merged;
  }

  const hashIx = value.indexOf('#');
  let pointer = value.substring(0, hashIx >= 0 ? hashIx : undefined);
  const hash = hashIx >= 0 ? value.substring(hashIx + 1) : undefined;
  if (cache[pointer]) {
    return dig(cache[pointer], hash);
  }
  let content;
  if (pointer.startsWith('http://') || pointer.startsWith('https://')) {
    const f = new Promise((accept, reject) => {
      request
        .get(pointer)
        .set('Accept', 'application/json')
        .end((e, d) => (e ? reject(e) : accept(d)));
    });
    content = await f;
  } else {
    // Assume it's a file
    pointer = path.resolve(basePath, pointer);
    content = await loadFileDependency(pointer);
  }
  if (content === null || content === undefined) {
    throw new Error(`Swagger resolver should return content for ${pointer}`);
  }
  cache[pointer] = content;
  return dig(content, hash);
}

/**
 * @param {object} specOrString The root swagger spec JSON or a filename to read it from
 * @param {string} basePath The base directory for any relative paths in the specification
 * @param {object} cache optional argument with filename/URL keys and
 *  swagger specs/JSON fragment values
 */
export default async function traverse(specOrString, basePath, cache) {
  let spec = specOrString;
  let inferredBasePath = basePath;
  if (typeof spec === 'string') {
    spec = await loadFileDependency(specOrString);
    if (!inferredBasePath) {
      inferredBasePath = path.dirname(path.resolve(specOrString));
    }
  }
  if (spec.$ref) {
    if (spec.$ref[0] !== '#') {
      return resolve(spec.$ref, inferredBasePath, cache || {}, traverse);
    }
  }
  for (const [key, value] of Object.entries(spec)) {
    if (util.isObject(value)) {
      // eslint-disable-next-line no-await-in-loop
      spec[key] = await traverse(value, inferredBasePath, cache);
    }
  }
  return spec;
}
