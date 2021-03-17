const { Client } = require('discord.js')
const AddCall = require('./commands/addCall')
const RandomCall = require('./commands/randomCall')
const RemoveCall = require('./commands/removeCall')
const FindCall = require('./commands/findCall')
const ClearChannel = require('./commands/clearChannel')
const ListCall = require('./commands/listCall')
const SaveCall = require('./commands/saveCall')

const bot = new Client()

bot.on('ready', () => {
    console.log('Bot connected !')

    bot.user.setActivity('Waiting PrankCall', {
        type: 'STREAMING'
    })
})

bot.on('message', (message) => {
    let commandUser = AddCall.parse(message) || RandomCall.parse(message) || RemoveCall.parse(message) || FindCall.parse(message) || ClearChannel.parse(message) || ListCall.parse(message) || SaveCall.parse(message)
})

bot.login(process.env.TOKEN)