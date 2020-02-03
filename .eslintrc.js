module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'rules': {
    'no-underscore-dangle': ['error', {'allow': ['_id']}],
    'max-len': [1, 120, 2, {ignoreComments: true}],
    'no-param-reassign': ['off'],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'new-cap': ['warn'],
    'react/jsx-filename-extension': ['off'],
    'react/jsx-fragments': ['off'],
    'react/destructuring-assignment': ['off']
  },
  'env': {
      "browser": true,
      "node": true,
  }
};