module.exports = { // eslint-disable-line no-undef
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
    'plugin:vue/essential',
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
    '@typescript-eslint',
  ],
  'rules': {
    // --- Your existing rules ---
    'camelcase': 'off',
    'eqeqeq': ['error', 'always'],
    'max-len': 'off',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'indent': ['error', 2],
    'require-jsdoc': 'off',
    'no-throw-literal': 'error',
    'no-extra-semi': 'error',

    // Disabled entries from eslint:recommended
    'object-curly-spacing': ['error', 'never'],

    // --- Added for consistency based on our previous discussion ---
    'linebreak-style': ['error', 'unix'],

    // --- Disabled entries from eslint:recommended ---
    'no-inner-declarations': 'off',
    'no-case-declarations': 'off',
    'no-redeclare': 'off', // If we stopped using namespaces, this could be enabled.
    'no-prototype-builtins': 'off', // This could be enabled actually; just fix uses of 'hasOwnProperty'
    'valid-jsdoc': 'off', // precise valid jsdoc is in the way of taking advantage of partial jsdoc. A case of the perfecct being the enemy of the good.

    // --- Typescript and Vue specific rules ---
    '@typescript-eslint/prefer-for-of': 'error',

    '@typescript-eslint/no-non-null-assertion': 'error',
    // Old modules prior to the linting rule being enabled
    // Avoid adding tags to this list
    // Help remove tags from this list
    // https://eslint.vuejs.org/rules/multi-word-component-names.html
    'vue/multi-word-component-names': ['error', {
      'ignores': [
        'Award',
        'Awards',
        'agenda',
        'board',
        'bonus',
        'colony',
        'Milestone',
        'Milestones',
        'party',
        'Party',
        'sidebar',
        'Tag',
        'turmoil',
        'Card',
        'Button',
        'Help',
      ],
    }],
    'vue/no-reserved-component-names': 'warn',
  },

  // --- NEW SECTION FOR JSON FILES ---
  'overrides': [
    {
      // Rules in here will only apply to JSON files
      'files': ['*.json', '*.jsonc', '*.json5'],
      'parser': 'jsonc-eslint-parser',
      'extends': [
        'plugin:jsonc/recommended-with-jsonc',
      ],
      'rules': {
        // This rule fixes multiple empty lines down to a single one,
        // while leaving single empty lines untouched.
        'no-multiple-empty-lines': ['error', { 'max': 1 }],

        // Optional: This prevents auto-formatting from messing with your manual line breaks
        'jsonc/object-curly-newline': 'off',
      },
    },
  ],
};
