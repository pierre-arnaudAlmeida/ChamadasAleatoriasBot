const Command = require('./command')
const { MessageEmbed } = require('discord.js')
var request = require("request")

module.exports = class RemoveCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-d") || message.content.startsWith("-delete")
    }

    static action (message) {
        let args = message.content.split(' ')

        args.shift()

        if (args[0]) {
            var options = { method: 'DELETE',
                url: process.env.DB_URI + '/' + args[0],
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': process.env.API_KEY,
                    'content-type': 'application/json'
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                if (body.includes("error")) {
                    const embed = new MessageEmbed()
                        .setTitle('A Chamada ' + args[0] + ' nao foi encontrada')
                        .setColor(0xff0000)
                        .setDescription('Um erro ocorreu na eliminaçao \n Tente novamente');
                    message.channel.send(embed);
                } else {
                    const embed = new MessageEmbed()
                        .setTitle('Eliminaçao da chamada ' + args[0])
                        .setColor(0x15c534)
                        .setDescription('A chamada foi corretamente eliminada');
                    message.channel.send(embed);
                }
            });
        } else {
			message.channel.send("Tens de por um id para salvar FILHO DA PUTA");
		}
    }
}