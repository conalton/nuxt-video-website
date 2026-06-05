// Flat ESLint config — extends Nuxt's auto-generated rules and layers Prettier on top.
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier/flat'

export default withNuxt(
  // Project-wide rule overrides
  {
    files: ['**/*.{ts,tsx,vue,js,mjs,cjs}'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off'
    }
  },
  // Disable any stylistic rules that conflict with Prettier (must be LAST)
  prettier
)
