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
                    case 'setTime':
                        if(message.member.user.id == 173268150559834112 || message.member.user.id == 321134145076068363)
                            {
                                fs.writeFile('Time.txt', variable);
                                message.channel.sendMessage('Time saved');
                            }
                    break;
                    case 'time':
                        fs.readFile('Time.txt',function(err, buffer){
                            var print = new String();
                            buffer.forEach(function(char) {
                                print += String.fromCharCode(char);
                            }, this);
                            message.channel.send(print, {tts: true});
                        });
                    break;
                    case 'roll':
                    var dice = variable.split('d');
                  
                    var ret = 0;
                    for(i = 0; i < dice[0]; i++)
                        {
                            var die = Math.floor(((Math.random() * 100) % (dice[1] - 1)) + 1);
                            message.reply('\ndie ' + (i+1) + ': ' +  die);
                            ret += die;
                        }
                    message.reply('\n' + ret);
                    break;
                    case 'mushroom':
                            message.channel.send('');
                    break;
                    default:
                        message.channel.send('Commands:\n!setTime -- sets time for D&D\n!time -- tells time for D&D\n!roll xdy-- rolls y dice, x times');
                    break;

         }
               
     }
        //  if(message.member.user.id == 342456832268173323)
        //                     message.reply('You fucking thot')
});