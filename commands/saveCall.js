const Command = require('./command')
const { MessageEmbed } = require('discord.js')
var request = require("request")

module.exports = class SaveCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-s") || message.content.startsWith("-save")
    }

    static action (message) {
        let args = message.content.split(' ')
        var call_to_save
		var call_getted =false;
		
		args.shift()
		
        if (args[0]) {
			var options = { method: 'GET',
				url: process.env.DB_URI + '/' + args[0],
                headers: {
					'cache-control': 'no-cache',
					'x-apikey': process.env.API_KEY
					}
			};
			
			request(options, function (error, response, body) {
				if (error) throw new Error(error)
				var result = JSON.parse(body)
				call_to_save = result
				if (body.includes("error")) {
					call_getted = true
				}
			});
				
			setTimeout(function() {
			}, 1000);
						
			if (call_getted) {	
				var options = { method: 'POST',
					url: process.env.DB_URI_2,
					headers: {
						'cache-control': 'no-cache',
						'x-apikey': process.env.API_KEY,
						'content-type': 'application/json' },
					body: {
						ticket_number: call_to_save['ticket_number'],
						sender: call_to_save['sender'],
						phone_number: call_to_save['phone_number'],
						content: call_to_save['content']
						},
					json: true
				};
                
				request(options, function (error, response, body) {
					if (error) throw new Error(error);
					const embed = new MessageEmbed()
						.setTitle('Chamada feita Guardada')
						.setColor(0x15c534)
						.setDescription('A chamada feita foi corretamente guardada na base de dados');
					message.channel.send(embed);
				});
			} else {
				message.channel.send("Nao ha tickets com essas informaçoes")
			}
        }
    }
}