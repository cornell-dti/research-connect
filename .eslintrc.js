module.exports = {
  'extends': ['airbnb', 'react-app'],
  'rules': {
    'camelcase': ['off'], // Allow usage of token_id
    'no-underscore-dangle': ['off'], // Allow interaction with mongodb.
    'class-methods-use-this': ['off'],
    // TODO: turn these a11y problems into error again when we have time to fix them. Right now there are too many of them :(
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/aria-role': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'],
    'jsx-a11y/no-static-element-interactions': ['off'],
    'max-classes-per-file': ['off'],
    'max-len': [1, 120, 2, {ignoreComments: true}],
    'no-param-reassign': ['off'],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-use-before-define': ['off'],
    'no-unused-vars': ['warn'], // TODO: turn it into error when problems are fixed.
    'new-cap': ['warn'],
    'react/jsx-filename-extension': ['off'],
    'react/jsx-fragments': ['off'],
    'react/jsx-no-bind': ['off'], // TODO: turn it into error when class-field-properties are introduced.
    'react/destructuring-assignment': ['off'],
    'react/no-array-index-key': ['warn'], // TODO: turn it into error when problems are fixed.
    'react/no-unescaped-entities': ['warn'], // TODO: turn it into error when problems are fixed.
    'react/no-unused-state': ['warn'], // TODO: turn it into error when problems are fixed.
    'react/prop-types': ['off'], // TODO: turn it into error when problems are fixed.
    'react/forbid-prop-types': ['off'], // TODO: turn it into error when problems are fixed.
    'react/require-default-props': ['off'], // TODO: turn it into error when problems are fixed.
    'react/sort-comp': ['off'],
  },
  'env': {
      "browser": true,
      "node": true,
  }
};