const Command = require('./command')
const { MessageEmbed } = require('discord.js')
var request = require("request")

module.exports = class ListCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-l") || message.content.startsWith("-list")
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        
        var options = { method: 'GET',
            url: process.env.DB_URI,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': process.env.API_KEY
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error)

            if (body.includes("error")) {
                const embed = new MessageEmbed()
                    .setTitle('Erro')
                    .setColor(0xff0000)
                    .setDescription('Um erro ocorreu na recuperaçao dos dados');
                return message.channel.send(embed);
            }
            
            var prank_call_list = JSON.parse(body)
                    
            for (var i = 0; i < prank_call_list.length; i++) {
                const embed = new MessageEmbed()
                    .setTitle('Chamada de '+ prank_call_list[i]['sender'] + ', ticket numero : ' + prank_call_list[i]['ticket_number'])
                    .setColor(0x99aab5)
                    .setDescription('Chamada ID : ' + prank_call_list[i]['_id'] + '\n' +
                        'Numero de ticket : ' + prank_call_list[i]['ticket_number'] + '\n' +
                        'Pessoa que mandou : ' + prank_call_list[i]['sender'] + '\n' +
                        'Subscritor : ' + prank_call_list[i]['is_sub'] + '\n' +
                        'Numero de telefone : ' + prank_call_list[i]['phone_number'] + '\n' +
                        'Mensagem : ' + prank_call_list[i]['content'] + '\n'
                    )
                message.channel.send(embed)
            }

            if (prank_call_list.length == 0) {
                message.channel.send("Nao ha tickets disponivel")
            }

        });
    }

}
