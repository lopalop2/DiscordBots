var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var variable = args[1];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
            if(variable != 'undefined'){
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });}
                else{
                    bot.sendMessage({
                    to: channelID,
                    message: 'Pong! ' + variable
                });}
            break;
			
			//help
			case 'help':
				bot.sendMessage({
					to: channelID,
					message: 'You can: \n!ping -- pong \n!connect -- connects to voice \n!record -- begins recording'
			});
            break;
            
            case 'connect':         
                bot.joinVoiceChannel('321410885761499136');
            break;
			 case 'disconnect':
                bot.leaveVoiceChannel('321410885761499136');
            break;
            
            case 'hi':
                bot.sendMessage({
					to: channelID,
					message: 'Hi ' + user.charAt(0).toUpperCase() + user.substring(1,user.length) + '!'
            });
                break;



                
            case 'pingLoop':
                if(userID == 173268150559834112 || userID == bot.id || userID == 321134145076068363)
                    {
                        bot.sendMessage({
					            to: channelID,
					            message: '!pingLoop ' + variable
            });
                            break;
                    }

                    default:
                   
                            break;

         }
     }
});