module.exports = {
  'extends': 'airbnb',
  'rules': {
    'no-underscore-dangle': ['error', {'allow': ['_id']}],
    'max-len': [1, 120, 2, {ignoreComments: true}],
    'no-param-reassign': ['warn'],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'new-cap': ['warn']
  },
  'env': {
      "browser": true,
      "node": true,
  }
};