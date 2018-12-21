module.exports = {
  'extends': 'airbnb',
  'rules': {
    'no-underscore-dangle': ['error', {'allow': ['_id']}],
    'max-len': [1, 120, 2, {ignoreComments: true}],
  },
  'env': {
      "browser": true,
      "node": true,
  }
};