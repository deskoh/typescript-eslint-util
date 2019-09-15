# `typescript-eslint-util`

Script to help migrate existing for ESLint rules to `@typescript-eslint` equivalent.

```js
// index.js
const generate = require('./generator')
generate('./config/eslint-recommended.eslintrc.js')

// Output:
// Following ESLint rules has @typescript-eslint equivalent:
//   no-unused-vars

generate('./config/eslint-recommended.eslintrc.js', {
  disableEslintRulesCheckedByTypescript: true,
})

// Output:
// Following ESLint rules has @typescript-eslint equivalent:
//   no-unused-vars
// Following ESLint rules can be turned off as they are checked by TypeScript:
//   getter-return
//   no-const-assign
//   no-dupe-args
//   no-dupe-class-members
//   no-dupe-keys
//   no-new-symbol
//   no-redeclare
//   no-this-before-super
//   no-undef
//   no-unreachable
//   valid-typeof
```

Script can also be used to derive ESLint rules overrides required if the rules also extends from `@typescript-eslint/recommended` and `@typescript-eslint/recommended-requiring-type-checking`.

```js
const desiredRules = generate('./config/airbnb-base.eslintrc.js', {
  extendsTypescriptEslintRecommended: true,
  replaceTypescriptEslintEquivalents: false,
})

// Output:
// Overriding @typescript-eslint rules to original ESLint equivalent
//    @typescript-eslint/camelcase
//    @typescript-eslint/no-empty-function
//    @typescript-eslint/no-unused-vars
//    @typescript-eslint/no-use-before-define
//    @typescript-eslint/require-await
//    prefer-const
```

Finally, the rules derived can be used to validate another `eslintrc` config.

```js
const desiredRules = generate('./config/airbnb-base.eslintrc.js', {
  extendsTypescriptEslintRecommended: true,
  replaceTypescriptEslintEquivalents: false,
})

validate(desiredRules, './config/custom.eslintrc')

// Output:
// ...
// Missing rules:
// Extraneous rules:
// Different rules:
//   import/no-cycle
//     Expected:
//       [ 'error', { maxDepth: null } ]
//     Actual:
//       [ 'error', { maxDepth: Infinity } ]
```
