const chalk = require('chalk');

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
	return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}
const LogZ = (text, color) => {
	return !color ? chalk.red('[ SYSTEM ] ') + chalk.yellow(text) : chalk.red('[ SYSTEM ] ') + chalk.keyword(color)(text)
}
module.exports = {
	color,
	bgcolor,
    LogZ
}
