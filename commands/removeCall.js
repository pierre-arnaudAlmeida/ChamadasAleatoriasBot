const Command = require('./command')
const { MessageEmbed } = require('discord.js')
var request = require("request")

module.exports = class RemoveCall extends Command {
    
    static match (message) {
        return message.content.startsWith("-d") || message.content.startsWith("-delete")
    }

    static action (message) {
        let args = message.content.split(' ')
        var save_call = false;
        var call_to_save;

        args.shift()
        
        if (args[0] && args[0] == "-s") {
            save_call = true;
            args.shift()
        }

        if (args[0]) {
            if (save_call) {
                var options = { method: 'GET',
                    url: process.env.DB_URI,
                    headers: {
                        'cache-control': 'no-cache',
                        'x-apikey': process.env.API_KEY
                    }
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error)

                    var result = JSON.parse(body)
                    for (var i = 0; i < result.length; i++)
                        if (result[i]['_id'] == args[0]) {
                            setTimeout(function() {
                            }, 1000);
                            var options = { method: 'POST',
                            url: process.env.DB_URI_SAVE,
                            headers: {
                                'cache-control': 'no-cache',
                                'x-apikey': process.env.API_KEY_SAVE,
                                'content-type': 'application/json' },
                                body: {
                                    ticket_number: result[i]['ticket_number'],
                                    sender: result[i]['sender'],
                                    phone_number: result[i]['phone_number'],
                                    content: result[i]['content']
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
                        }
                });
            }
            
            setTimeout(function() {
            }, 1000);
            
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
        }
    }
}