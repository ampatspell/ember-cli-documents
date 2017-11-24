/* eslint-env node */
const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions'
];

const { CI, EMBER_ENV } = process.env;

if(!!CI || EMBER_ENV === 'production') {
  browsers.push('ie 9');
}

module.exports = {
  browsers
};
