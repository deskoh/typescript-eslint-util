const generate = require('./generator')
const validate = require('./validator')

// generate('./config/eslint-recommended.eslintrc.js', {
//   disableEslintRulesCheckedByTypescript: true,
// })

const desiredRules = generate('./config/airbnb-base.eslintrc.js', {
  extendsTypescriptEslintRecommended: true,
  replaceTypescriptEslintEquivalents: false,
})

validate(desiredRules, './config/custom.eslintrc')
