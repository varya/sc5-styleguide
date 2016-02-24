/***
*
* styleguide.js
*
* Parses CSS/LESS/SASS files with KSS notation and generates a styleguide
*
* Heavily influenced by node-kss and gulp-kss projects
*
***/

'use strict';

var generate = require('./modules/generate'),
  applyStyles = require('./modules/apply-styles'),
  server = require('./modules/server');

module.exports = {
  generate: generate,
  applyStyles: applyStyles,
  server: server
}

