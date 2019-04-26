const autoprefixer = require('autoprefixer');
const precss = require('precss');

module.exports = {
  plugins: [
    precss(),
    autoprefixer({ browsers: ['> 5%', 'ie >= 11', 'last 2 versions'] }),
  ],
};
