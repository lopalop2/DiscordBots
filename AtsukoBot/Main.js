var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
const fs = require('fs');
const ytdl = require('ytdl-core');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


var bot = new Discord.Client();
var count = 0;
var videoQueue = [];
var q = 0;

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
            // !ping
            case 'ping':
                    message.channel.sendMessage('Pong ' + variable);
            break;
             case 'pong':
                    if (message.member.voiceChannel) 
                {     
                message.member.voiceChannel.join().then(connection => 
                    { // Connection is an instance of VoiceConnection
                        try{
                        stream = ytdl(variable, {filter : 'audioonly'});
                        
                        dispatcher = connection.playStream(stream);
                        
                        dispatcher.setVolume(.05);
                        }
                    catch(err){}
                    }
                )
             }
            break;

            case 'queue':
                if(bot.voiceConnections.first())
                    {
                        try{
                            videoQueue[videoQueue.length] = variable;
                            if(videoQueue.length == 1)
                                {
                                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});
                                    dispatcher = bot.voiceConnections.first().playStream(stream);          
                                    dispatcher.setVolume(.05);
                                }
                        } 
                        catch(err){}   

                    }
            break;
            case 'next':
                q++;
                if(q >= videoQueue.length){
                    q = 0;
                    videoQueue = [];
                    break;
                }
                try{
                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});                        
                    dispatcher = bot.voiceConnections.first().playStream(stream);          
                    dispatcher.setVolume(.05);
                }
                catch(err){}

            break;
			
			//help
            case 'help':
            message.channel.sendMessage('You can: \n!ping -- pong \n!connect -- connects to voice \n!record -- begins recording');
            break;
            
            case 'connect':    
             if (message.member.voiceChannel) 
                {     
                message.member.voiceChannel.join().then(connection => 
                    { // Connection is an instance of VoiceConnection
                        message.reply('I have successfully connected to the channel!');
                        con = connection.playFile('SFX/IBC.mp3');
                        con.setVolume(.1);
                    }
                )
             }
            
            
            break;

           // case 'volume':
            //dispatch.setVolume(variable);
           // break;

            case 'record':
            break;

			case 'disconnect':
             bot.voiceConnections.first().disconnect();
            break;
            
            case 'hi':
                message.channel.sendMessage('Hi ' + message.member.displayName.charAt(0).toUpperCase() + message.member.displayName.substring(1,message.member.displayName.length) + '!');            
                break;



                
            case 'pingLoop':
                if((message.userID == 173268150559834112 || message.userID == bot.id || message.userID == 321134145076068363) && count < 5)
                    {
                message.channel.sendMessage('!pingLoop ' + variable);   
                count++;                                 
                            break;
                    }
                        else if(count >= 5)
                            count = 0;

                    default:
                   
                            break;

         }
     }
});