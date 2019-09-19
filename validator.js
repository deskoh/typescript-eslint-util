/**
 * Validate specified ESLint config with desired rules.
 */

const util = require('util')
const isEqual = require('lodash.isequal')

const { loadRulesForFile } = require('./loader')

function validate(expectedRules, actualEslintConfig) {
  const actualRules = loadRulesForFile(actualEslintConfig, 'test.js')

  const desiredRulenames = Object.keys(expectedRules).sort()
  const rulenames = Object.keys(actualRules).sort()
  
  console.log('Missing rules: ')
  desiredRulenames.forEach(rule => {
    if (actualRules[rule] === undefined) {
      console.log(' ', rule)
    }
  })
  
  console.log('Extraneous rules: ')
  rulenames.forEach(rule => {
    if (expectedRules[rule] === undefined && (
      // Ignore extraneous @typescript-eslint rules that has equivalent eslint rules turned off
      !isEqual(expectedRules[rule.substring(rule.indexOf('/'))], ['off'])
    )) {
      console.log(' ', rule)
    }
  })
  
  console.log('Different rules:')
  rulenames.forEach(rule => {
    if (expectedRules[rule] && (
      !isEqual(expectedRules[rule], actualRules[rule])
      // Check for @typescript-eslint equivalent rules
      && !isEqual(expectedRules[rule], actualRules[`@typescript-eslint/${rule}`])
    )) {
      // Due to eslint extends, some rules could be 'off', but with parameters
      if (expectedRules[rule].includes('off') && actualRules[rule].includes('off')) return
      console.log(' ', rule)
      console.log('    Expected:\n     ', util.inspect(expectedRules[rule], { colors: true }))
      console.log('    Actual:\n     ', util.inspect(actualRules[rule], { colors: true }))
    }
  })
  
 }

 module.exports = validate
