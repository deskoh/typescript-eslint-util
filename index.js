const generate = require('./generator')
const validate = require('./validator')

// generate('./config/eslint-recommended.eslintrc.js', {
//   /* disableEslintRulesCheckedByTypescript: true, */
// })

console.log('Validating ./config/custom.eslintrc...')
let desiredRules = generate('./config/airbnb-base.eslintrc.js', {
  extendsTypescriptEslintRecommended: true,
  replaceTypescriptEslintEquivalents: false,
})

validate(desiredRules, './config/custom.eslintrc')

console.log('Validating ./config/custom-react.eslintrc...')
desiredRules = generate('./config/airbnb.eslintrc.js', {
  extendsTypescriptEslintRecommended: true,
  replaceTypescriptEslintEquivalents: false,
})

validate(desiredRules, './config/custom-react.eslintrc')

console.log('Validating airbnb-typescript/base against airbnb-base...')
desiredRules = generate('./config/airbnb-base.eslintrc.js', {
  extendsTypescriptEslintRecommended: false,
  replaceTypescriptEslintEquivalents: true,
  disableEslintRulesCheckedByTypescript: false,
})

validate(desiredRules, './config/airbnb-typescript-base.eslintrc.js')
