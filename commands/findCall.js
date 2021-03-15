const Command = require('./command')
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
var request = require("request")

module.exports = class FindCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-f") || message.content.startsWith("-find")
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        
        var options = { method: 'GET',
            url: config.db_url,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': config.api_key
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
            
            var prank_call_list = [];
            var result = JSON.parse(body)

            for (var i = 0; i < result.length; i++)
                if (result[i]['sender'].toLowerCase().includes(args[0].toLowerCase()) || result[i]['ticket_number'] == args[0])
                    prank_call_list.push(result[i])
                    
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
        });
    }

}