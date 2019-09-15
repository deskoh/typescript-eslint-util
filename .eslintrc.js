module.exports = {
  "extends": [
    "eslint:recommended",
  ],
  "env": {
    "node": true,
    "es6": true,
  },
  "parserOptions": {
    "ecmaVersion": 2018,
  },
  "rules": {
    "semi": ["error", "never"],
    // "no-console": ["error", {"allow": ["warn", "error"]}],
    // "comma-dangle": ["error", "always-multiline"],
    // "newline-per-chained-call": ["error"],
  }
}
