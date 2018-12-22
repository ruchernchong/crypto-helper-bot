module.exports = {
  parseCommand: message => {
    const tokens = message.split(' ')
    if (!tokens[0].match(/^\//)) {
      return null
    }

    const arrayCommands = []
    const command = tokens.shift()
    const match = command.match(/\/(\w*)/)

    if (match.length > 0) {
      arrayCommands[match[1]] = tokens
    }

    return arrayCommands
  }
}
