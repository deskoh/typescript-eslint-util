const assert = require('assert')
const chalk = require('chalk')
const isEqual = require('lodash.isequal')
const cloneDeep = require('lodash.clonedeep');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const { loadConfigForFile } = require('./loader')

/**
 * Upgrade ESLint rules to include @typescript-eslint if possible.
 * Optionally extends @typescript-eslint/recommended and @typescript-eslint/recommended-requiring-type-checking
 */
function generate(eslintConfig, options) {
  const mergedOptions = {
    extendsTypescriptEslintRecommended: false,
    replaceTypescriptEslintEquivalents: true,
    disableEslintRulesCheckedByTypescript: false,
    ...options,
  }

  const { rules: eslintRules } = loadConfigForFile(eslintConfig, 'test.js')

  const desiredRules = cloneDeep(eslintRules)

  if (mergedOptions.extendsTypescriptEslintRecommended) {
    extendsTypescriptEslintRecommended(eslintRules, desiredRules)
  }

  if (mergedOptions.replaceTypescriptEslintEquivalents) {
    replaceTypescriptEslintEquivalents(desiredRules)
  }

  if (mergedOptions.disableEslintRulesCheckedByTypescript) {
    disableEslintRulesCheckedByTypescript(eslintRules, desiredRules)
  }

  return desiredRules
}

function extendsTypescriptEslintRecommended(eslintRules, desiredRules) {
  const tsEslintConfig = require('./rules/typescript-eslint')
  const rules = { ...tsEslintConfig['recommended'], ...tsEslintConfig['recommended-requiring-type-checking'] }
  const rulenames = [].concat(Object.keys(rules)).sort()
  // Find airbnb rules that needs to be restored.
  console.log(chalk.gray('Overriding @typescript-eslint rules to original ESLint equivalent'))
  rulenames.forEach(rulename => {
    const eslintRulename = rulename.substring(rulename.indexOf('/') + 1)
    if (eslintRules[eslintRulename]) {
      if (rules[`@typescript-eslint/${rulename}`]) {
        // Turn off ESLint rule with @typescript-eslint equivalent
        desiredRules[eslintRulename] = ['off']
      }
      else {
        // @typescript-eslint rule
        if (!isEqual(eslintRules[eslintRulename], rules[rulename])) {
          console.log('  ', chalk.gray(rulename))
        }
        desiredRules[rulename] = eslintRules[eslintRulename]
      }
    }
    else {
      // @typescript-eslint rule without ESLint equivalent
      desiredRules[rulename] = rules[rulename]
    }
  })
}

function replaceTypescriptEslintEquivalents(desiredRules) {
  console.log(chalk.gray('Following ESLint rules has @typescript-eslint equivalent:'))
  const { rules: tsRulesConfig } = tsEslintPlugin
  Object.keys(desiredRules).sort()
    .filter(rulename => !rulename.startsWith('@typescript-eslint'))
    .forEach(rulename => {
      if (tsRulesConfig[rulename] && !desiredRules[rulename].includes('off')) {
        console.info(' ', chalk.gray(rulename))
        desiredRules[`@typescript-eslint/${rulename}`] = desiredRules[rulename]
        desiredRules[rulename] = ['off']
      }
    })
}

function disableEslintRulesCheckedByTypescript(eslintRules, desiredRules) {
  console.log(chalk.gray('Following ESLint rules can be turned off as they are checked by TypeScript:'))
  const tsEslintConfig = require('./rules/typescript-eslint')

  // TODO(deskoh): Get rules checked by TypeScript from @typescript-eslint/eslint-recommended for now.
  const rules = { ...tsEslintConfig['eslint-recommended'] }
  
  Object.keys(rules).sort()
    .forEach(rulename => {
      if (eslintRules[rulename] && !eslintRules[rulename].includes('off')) {
        console.info(' ', chalk.gray(rulename))
        desiredRules[rulename] = ['off']

        // Should not have @typescript-eslint equivalent for ESLint rules turned off
        if (eslintRules[`@typescript-eslint/${rulename}`]) {
          console.info(' ', chalk.red(`@typescript-eslint/${rulename}`))
          desiredRules[`@typescript-eslint/${rulename}`] = ['off']
          assert(false)
        }
      }
    })
}

module.exports = generate
