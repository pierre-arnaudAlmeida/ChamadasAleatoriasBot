const Command = require('./command')
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
var request = require("request")

module.exports = class RandomCall extends Command {

    static match (message) {
        return message.content.startsWith("-r") || message.content.startsWith("-random")
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
            if (error) throw new Error(error);
            
            if (body.includes("error")) {
                const embed = new MessageEmbed()
                    .setTitle('Erro')
                    .setColor(0xff0000)
                    .setDescription('Um erro ocorreu na recuperaçao dos dados');
                return message.channel.send(embed);
            }

            var prank_call_sub_list = [];
            var prank_call_list = [];
            var result = JSON.parse(body)
            var get_just_sub = true;

            if (args[0] && args[0].toLowerCase() == "all") {
                get_just_sub = false;
                args.shift()
            }

            for (var i = 0; i < result.length; i++) {
                if (get_just_sub && result[i]['is_sub'].includes("SIM"))
                    prank_call_sub_list.push(result[i])
                else 
                    prank_call_list.push(result[i])
            }
            
            if (prank_call_sub_list.length > 0) {
                var prank = Math.floor(Math.random() * Math.floor(prank_call_sub_list.length))
                const embed = new MessageEmbed()
                    .setTitle('Chamada de '+ prank_call_sub_list[prank]['sender'] + ', ticket numero : ' + prank_call_sub_list[prank]['ticket_number'])
                    .setColor(0x99aab5)
                    .setDescription('Chamada ID : ' + prank_call_sub_list[prank]['_id'] + '\n' +
                        'Numero de ticket : ' + prank_call_sub_list[prank]['ticket_number'] + '\n' +
                        'Pessoa que mandou : ' + prank_call_sub_list[prank]['sender'] + '\n' +
                        'Subscritor : ' + prank_call_sub_list[prank]['is_sub'] + '\n' +
                        'Numero de telefone : ' + prank_call_sub_list[prank]['phone_number'] + '\n' +
                        'Mensagem : ' + prank_call_sub_list[prank]['content'] + '\n'
                    )
                message.channel.send(embed)
            } else {
                var prank = Math.floor(Math.random() * Math.floor(prank_call_list.length))
                const embed = new MessageEmbed()
                    .setTitle('Chamada de '+ prank_call_list[prank]['sender'] + ', ticket numero : ' + prank_call_list[prank]['ticket_number'])
                    .setColor(0x99aab5)
                    .setDescription('Chamada ID : ' + prank_call_list[prank]['_id'] + '\n' +
                        'Numero de ticket : ' + prank_call_list[prank]['ticket_number'] + '\n' +
                        'Pessoa que mandou : ' + prank_call_list[prank]['sender'] + '\n' +
                        'Subscritor : ' + prank_call_list[prank]['is_sub'] + '\n' +
                        'Numero de telefone : ' + prank_call_list[prank]['phone_number'] + '\n' +
                        'Mensagem : ' + prank_call_list[prank]['content'] + '\n'
                    )
                message.channel.send(embed)
            }
        });
    }
}