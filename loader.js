const { CLIEngine } = require("eslint")

function loadConfigForFile(configFile, file) {
  const cli = new CLIEngine({
    configFile: configFile,
  })

  return cli.getConfigForFile(file)
}

function loadRulesForFile(configFile, file) {
  return loadConfigForFile(configFile, file).rules
}

module.exports = {
  loadConfigForFile,
  loadRulesForFile,
}
