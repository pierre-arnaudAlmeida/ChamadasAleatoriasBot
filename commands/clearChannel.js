const Command = require('./command')

module.exports = class ClearChannel extends Command {
    
    static match (message) {
        return message.content.startsWith("-cc") || message.content.startsWith("-clearChannel")
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()

        if(!args[0] || args[0] > 100)
            return message.channel.send("Quantas mensagens queres eliminar FILHO DA PUTA !? \n E nao pode ser mais de 100")

        message.channel.bulkDelete(args[0])
    }
}
