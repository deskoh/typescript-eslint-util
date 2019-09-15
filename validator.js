/**
 * Validate specified ESLint config with desired rules.
 */

const util = require('util')
const isEqual = require('lodash.isequal')

const { loadRulesForFile } = require('./loader')

function validate(desiredRules, eslintConfig) {
  const customRules = loadRulesForFile(eslintConfig, 'test.js')

  const desiredRulenames = Object.keys(desiredRules).sort()
  const rulenames = Object.keys(customRules).sort()
  
  console.log('Missing rules: ')
  desiredRulenames.forEach(rule => {
    if (customRules[rule] === undefined) {
      console.log(' ', rule)
    }
  })
  
  console.log('Extraneous rules: ')
  rulenames.forEach(rule => {
    if (desiredRules[rule] === undefined && (
      // Ignore extraneous @typescript-eslint rules that has equivalent eslint rules turned off
      !isEqual(desiredRules[rule.substring(rule.indexOf('/'))], ['off'])
    )) {
      console.log(' ', rule)
    }
  })
  
  console.log('Different rules:')
  rulenames.forEach(rule => {
    if (desiredRules[rule] && (
      !isEqual(desiredRules[rule], customRules[rule])
      // Check for @typescript-eslint equivalent rules
      && !isEqual(desiredRules[rule], customRules[`@typescript-eslint/${rule}`])
    )) {
      // Due to eslint extends, some rules could be 'off', but with parameters
      if (desiredRules[rule].includes('off') && customRules[rule].includes('off')) return
      console.log(' ', rule)
      console.log('    Expected:\n     ', util.inspect(desiredRules[rule], { colors: true }))
      console.log('    Actual:\n     ', util.inspect(customRules[rule], { colors: true }))
    }
  })
  
 }

 module.exports = validate
