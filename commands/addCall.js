const Command = require('./command')
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
var request = require("request")

module.exports = class AddCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-a") || message.content.startsWith("-add")
    }

    static action (message) {
        let args = message.content.split('"')
        var ticket;
        var sender;
        var sub;
        var phone;
        var content;

        for (var i = 0; i < args.length; i++) {
            if (args[i].includes("ticket"))
                ticket = args[i+1]
            if (args[i].includes("sender"))
                sender = args[i+1]
            if (args[i].includes("sub"))
                sub = args[i+1].toUpperCase()
            if (args[i].includes("phone"))
                phone = args[i+1]
            if (args[i].includes("content"))
                content = args[i+1]
        }
        
        var options = { method: 'POST',
            url: process.env.DB_URI,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': process.env.API_KEY,
                'content-type': 'application/json' },
                body: {
                    ticket_number: ticket,
                    sender: sender,
                    is_sub: sub,
                    phone_number: phone,
                    content: content
                },
                json: true
            };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            const embed = new MessageEmbed()
                .setTitle('Chamada Guardada')
                .setColor(0x15c534)
                .setDescription('A chamada foi corretamente guardada na base de dados');
            message.channel.send(embed);
        });
    }
}