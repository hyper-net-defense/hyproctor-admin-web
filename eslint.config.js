import antfu from '@antfu/eslint-config';

// More customization options available at: https://github.com/antfu/eslint-config
export default antfu(
  {
    // Use external formatters for CSS, HTML, Markdown etc.
    formatters: true,
    // Enable stylistic rules
    stylistic: {
      // Indentation level
      indent: 2,
      // Quote style 'single' | 'double'
      quotes: 'single',
      // Whether to enable semicolons
      semi: true
    },
    // Files to ignore
    ignores: []
  },
  {
    // Rules that apply to all files
    rules: {
      // vue
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/attributes-order': 'off',
      // ts
      'ts/no-use-before-define': 'off',
      // node
      'node/prefer-global/process': 'off',
      // style
      'style/comma-dangle': ['error', 'never'],
      'style/brace-style': ['error', '1tbs'],
      // regexp
      'regexp/no-unused-capturing-group': 'off',
      // other
      'no-console': 'off',
      'no-debugger': 'off',
      'symbol-description': 'off',
      'antfu/if-newline': 'off',
      'unicorn/no-instanceof-builtins': 'off'
    }
  }
);
