module.exports = {
  'extends': ['airbnb', 'react-app'],
  'rules': {
    'camelcase': ['off'], // Allow usage of token_id
    'no-alert': ['off'], // Too common
    'no-underscore-dangle': ['off'], // Allow interaction with mongodb.
    'class-methods-use-this': ['off'],
    'import/extensions': ['off'], // to allow ts
    // TODO: turn these a11y problems into error again when we have time to fix them. Right now there are too many of them :(
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/aria-role': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'],
    'jsx-a11y/no-static-element-interactions': ['off'],
    'max-classes-per-file': ['off'],
    'max-len': ['error', 120, 2, {ignoreComments: true}],
    'no-param-reassign': ['off'],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-use-before-define': ['off'],
    'new-cap': ['off'],
    'react/state-in-constructor': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/jsx-fragments': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/no-unused-state': ['warn'], // TODO: turn it into error when problems are fixed.
    'react/sort-comp': ['off'],
  },
  'env': {
      "browser": true,
      "node": true,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.mjs', '.js', '.json', '.ts', '.tsx'],
        'paths': ['src']
      }
    }
  },
};