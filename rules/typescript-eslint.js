const plugin = require('@typescript-eslint/eslint-plugin')

/**
 * Normalize rule of type string to array of string (e.g. 'off' => ['off'])
 */
function normalizeConfig(rules) {
  Object.keys(rules).forEach(ruleName => {
    const rule = rules[ruleName]
    if (typeof rule === 'string') rules[ruleName] = [rule]
  })
  return rules
}

const { rules: allRules } = plugin
const recRules = normalizeConfig(plugin.configs['recommended'].rules)
const recTypeCheckRules = normalizeConfig(plugin.configs['recommended-requiring-type-checking'].rules)

// Ruleset that disables rules from eslint:recommended which are already handled by TypeScript.
const eslintRecRules = normalizeConfig(plugin.configs['eslint-recommended'].overrides[0].rules)

module.exports = {
  allRules,
  recommended: recRules,
  'recommended-requiring-type-checking': recTypeCheckRules,
  // Ruleset that disables rules from eslint:recommended which are already handled by TypeScript.
  'eslint-recommended': eslintRecRules,
}
