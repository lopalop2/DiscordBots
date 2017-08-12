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
var curStream;
var vol;

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
        var targChannel = 0;
        var mustConnect = true;
        if (message.member.voiceChannel) 
            {
            for(i = 0; i < bot.voiceConnections.array().length; i++)
                {
                    if(bot.voiceConnections.array()[i].channel == message.member.voiceChannel){
                        targChannel = i;
                        mustConnect = false;
                        break;
                }
                    }
            }
        switch(cmd) {
            // !ping
            case 'ping':
                    message.channel.sendMessage('Pong ' + variable);
            break;
             case 'pong':
                    if (message.member.voiceChannel) 
                {     
                if(mustConnect){
                     if(!message.member.voiceChannel)
                    break;
                    message.member.voiceChannel.join();
                    targChannel = bot.voiceConnections.array().length - 1;
                }
            }
                     // Connection is an instance of VoiceConnection
                        try{
                        stream = ytdl(variable, {filter : 'audioonly'});
                        curStream = variable;
                        dispatcher = bot.voiceConnections.array()[targChannel].playStream(stream);
                        if(mustConnect)
                            dispatcher.setVolume(.05);
                        else
                            dispatcher.setVolume(vol);  
                            
                        }
                    catch(err){}
            break;

            case 'queue':
            if(mustConnect){
                if(!message.member.voiceChannel)
                    break;
                    message.member.voiceChannel.join();
                    targChannel = bot.voiceConnections.array().length - 1;
                }
                        try{
                            videoQueue[videoQueue.length] = variable;
                            if(videoQueue.length == 1)
                                {
                                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});
                                    curStream = videoQueue[q];
                                    dispatcher = bot.voiceConnections.array()[targChannel].playStream(stream);          
                                    if(mustConnect)
                            dispatcher.setVolume(.05);
                        else
                            dispatcher.setVolume(vol);  
                                }
                                message.reply('Queued');
                        } 
                        catch(err){}   
bot.voiceConnections.array()[targChannel].on("speaking", function(user, speaking){
    if(user.username == 'RecordBot' && speaking == false)
        {
            q++;
                if(q >= videoQueue.length){
                    q = 0;
                    videoQueue = [];
                }
                try{
                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});                        
                    dispatcher = bot.voiceConnections.first().playStream(stream);          
                    dispatcher.setVolume(.05);
                }
                catch(err){}
        }
});

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
                    curStream = videoQueue[q];                      
                    dispatcher = bot.voiceConnections.array()[targChannel].playStream(stream);          
                    if(mustConnect)
                            dispatcher.setVolume(.05);
                        else
                            dispatcher.setVolume(vol);  
                                
                }
                catch(err){}
                message.reply('Skipped to next song');

            break;
            case 'loop':
                try{
                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});  
                    curStream = videoQueue[q];                      
                    dispatcher = bot.voiceConnections.array()[targChannel].playStream(stream);          
                    if(mustConnect)
                            dispatcher.setVolume(.05);
                        else
                            dispatcher.setVolume(vol);  
                                
                }
                catch(err){}
                message.reply('Repeating current song');
            break;
             case 'pause':
             if(!mustConnect)
                try{
                    if(!bot.voiceConnections.array()[targChannel].player.dispatcher.paused){
                        bot.voiceConnections.array()[targChannel].player.dispatcher.pause();
                                message.reply('Paused');
                    }
                    else
                        {
                        bot.voiceConnections.array()[targChannel].player.dispatcher.resume();
                                message.reply('Resumed');
                        }
                }
                catch(err){}

            break;

            case 'airhorn':
            try{
                    if(mustConnect){
                         if(!message.member.voiceChannel)
                    break;
                    message.member.voiceChannel.join();
                    targChannel = bot.voiceConnections.array().length - 1;
                }
                    curTime = bot.voiceConnections.array()[targChannel].player.dispatcher.time;
                    stream = ytdl('https://www.youtube.com/watch?v=OFr74zI1LBM', {filter : 'audioonly'});                        
                    dispatcher = bot.voiceConnections.array()[targChannel].playStream(stream);          
                    dispatcher.setVolume(.1);
                    setTimeout(function(){
                        stream = ytdl(curStream, {filter : 'audioonly'});                        
                        bot.voiceConnections.array()[targChannel].playStream(stream, {seek: curTime * .001});  
                        bot.voiceConnections.array()[targChannel].player.dispatcher.setVolume(.1);
                                                        
                    }, 5000);
            }catch(err){}
            break;
			
			//help
            case 'help':
            //message.channel.sendMessage('You can: \n!ping -- pong \n!connect -- connects to voice \n!record -- begins recording');
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

            case 'volume':
                   bot.voiceConnections.array()[targChannel].player.dispatcher.setVolume(variable * .1);
                                message.reply('Volume set to ' + variable);
                                vol = variable *.1;
            break;
                
            // case 'record':
            // if(!mustConnect)
            //    rec(message,targChannel);
            // else
            //     message.reply('You must construct additonal pylons');

            // break;
            // case 'resumeRecord':
            //     //PCMstream.resume();
            //  break;
            // case 'pauseRecord':
            //     //PCMstream.pause();
            // break;

			case 'disconnect':
             bot.voiceConnections.array()[targChannel].disconnect();
                                message.reply('Disconnected from voice channel');
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

function rec(message, targChannel)
{
    try{
                const receiver = bot.voiceConnections.array()[targChannel].createReceiver();
                //bot.voiceConnections.array()[targChannel].channel.members.array(); //-------------Record All
                const PCMstream = receiver.createPCMStream(message.member);
                const writeStream = fs.createWriteStream('recordTest.PCM');
                PCMstream.pipe(writeStream);
                message.reply('Recording');
    }catch(err){
        message.reply(err);
    }
}

try{
bot.voiceConnections.array()[targChannel].on("speaking", function(user, speaking){
    if(user.username == 'RecordBot' && speaking == false)
        {
            q++;
                if(q >= videoQueue.length){
                    q = 0;
                    videoQueue = [];
                }
                try{
                    stream = ytdl(videoQueue[q], {filter : 'audioonly'});                        
                    dispatcher = bot.voiceConnections.first().playStream(stream);          
                    dispatcher.setVolume(.05);
                }
                catch(err){}
        }
});
}catch(err){}
