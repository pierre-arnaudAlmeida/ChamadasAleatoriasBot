const Command = require('./command')
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
var request = require("request")

module.exports = class RemoveCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-d") || message.content.startsWith("-delete")
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        
        var options = { method: 'DELETE',
            url: config.db_url + '/' + args[0],
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': config.api_key,
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
    }
}