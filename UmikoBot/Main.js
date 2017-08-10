var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
const fs = require('fs');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


var bot = new Discord.Client();

bot.login(auth.token);
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});


bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        var variable = '';
        var once = false;
        args.forEach(function(element) {
            if(!once){
                once = true;
            }
            else
                variable += element + ' ';
        }, this);
       
        args = args.splice(1);
        switch(cmd) {
                    case 'bugReport':
                    try{
                        fs.appendFile('bugLog.txt', variable + '\n');
                        message.reply('Bug Reported');
                    }catch(err){}
                    break;
                    default:
                    break;

         }
               
     }
        //  if(message.member.user.id == 342456832268173323)
        //                     message.reply('You fucking thot')
});