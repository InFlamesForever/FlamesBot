
//import npm libraries
//********************************************************************************************************
const Discord = require('discord.js'); // npm install discord.js --save
const mtg = require('mtgsdk');
const fs = require('fs');
const twitchStuff = require("twitch-api-lite");


const mtgFunctions = require('./functions/mtg_api_functions');
const utilities = require("./functions/utlities");
const StreamAnnouncement = require('./functions/StreamAnnouncement');

//import local config files
//********************************************************************************************************
const botSettings = require('../config/botSettings.json');
const tokens = require('../config/private_config.json');


//get bot settings e.g. token, prefix, etc and assign to local variables
//********************************************************************************************************
const botToken = tokens.botToken;
const botPrefix = botSettings.prefix;
const debug = botSettings.debug;

const LOOKUP = require('./commands/LOOKUP.js');
let testLookup = new LOOKUP('test');
// Initialize Discord Bot
//********************************************************************************************************
let bot = new Discord.Client({});

// When bot is ready, execute this code
//********************************************************************************************************
bot.on
('ready', () =>
{
    cleanUp();
    if (debug)
    {
        console.log('Logging in ...');
        console.log('Logged in as: ' + bot.user.tag + ' - (' + bot.user.id + ')'); //This will display the name in package.name and it's registered Discord ClientID
    }
}
);

// Bot is now listening in for certain commands from the discord user e.g. !Ping
//********************************************************************************************************
bot.on ('message', msg =>
{
    //reject the following input and exit
    if(msg.author.bot) return; //if the bot is the one sending the message exit this code block.
    if(msg.channel.type === 'dm') return; //if the bot recieves a private / direct message, ignore it and exit this code block.

    if (msg.content.substring(0, botPrefix.length) === botPrefix) //if the first string is a !, continue...
    {
        //Stripper - this code block will take the entire user input !UploadScore 3, 7 or !MakeTeams and then strip it into a command variable=MakeTeams and param1 =3, param2=7, etc....
        let args = msg.content.slice(botPrefix.length).trim().split(/ +/g); //this will remove the prefix and then load the contents into an array
        let command = args.shift().toUpperCase(); //This will remove (aka shift) the first element of the array. It will assign the command variable with a value of UploadScore,  MakeTeams, etc.

        //Start of command
        //********************************************************************************************************
        if (command === 'HELP')
        {
            msg.reply('');
            msg.channel.send({embed:
                    {
                        color: 3447003,
                        author: {
                            name: bot.user.username,
                            icon_url: bot.user.avatarURL
                        },
                        title: '__Placeholder__',
                        //url: 'http://google.com',
                        description: 'placeholder' ,
                        fields:
                            [
                                {
                                    name: '__Commands__',
                                    value: 'All commands are non case sensitive so you can type !Help or !help or !HELP.'
                                },
                                {
                                    name: '!placeholder',
                                    value: 'placeholder'
                                },
                            ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: '© The above is work in progress. Contact InFlamesForever for feedback.'
                        }
                    }
            });

        }
        //********************************************************************************************************
        //End of command

        //Start of command
        //********************************************************************************************************
        else if (command === 'LOOKUP')
        {

            mtgFunctions.findSetByCode(args[args.length-1]).then(set =>{
                if(set !== undefined)
                {
                    utilities.logDebugText("got inside");
                    args.pop();
                    testLookup.doCommand(msg, args.join(" "), set);
                }
                else
                {
                    testLookup.doCommand(msg, args.join(" "));
                }
            });
        }
        //********************************************************************************************************
        //End of command

        //Start of command
        //********************************************************************************************************
        else if (command === 'PLACEHOLDER2')
        {
            msg.reply('Command=' + command + ' param1=' + param1 + ' param2=' + param2 + ' param3=' + param3);
        }
        //********************************************************************************************************
        //End of command

        //Start of command
        //********************************************************************************************************
        else if (command === 'PLACEHOLDER3')
        {
            msg.reply('Command=' + command + ' param1=' + param1 + ' param2=' + param2 + ' param3=' + param3);
        }
        //********************************************************************************************************
        //End of command

    }
});

//Start of functions
//********************************************************************************************************


function cleanUp()
{
    try
    {
        fs.unlinkSync('./resources/jsonCache/mtgSets.json', function (err)
        {
            if (err)
            {
                callback(null, "error while reading file");
            }
            else
            {
                callback(null, "file read");
            }
        });
    }
    catch (ex)
    {
        utilities.logDebugText("Sets json does not exist \n" + ex)
    }
    try
    {
        fs.unlinkSync('./resources/jsonCache/mtgCards.json', function (err)
        {
            if (err)
            {
                callback(null, "error while reading file");
            }
            else
            {
                callback(null, "file read");
            }
        });
    }
    catch (ex)
    {
        utilities.logDebugText("Cards json does not exist \n" + ex)
    }
}

//********************************************************************************************************
//End of functions







// Bot will now attempt to login
//********************************************************************************************************
console.log("about to login");
try
{
    bot.login(botToken);
}
catch (e)
{
    console.log(e);
}

//output message to console if debug value is 1 in botSettings.json
//********************************************************************************************************
utilities.logDebugText('bot.js loaded succesfully!');


let stream1 = new StreamAnnouncement(["407521504100614144"], "InFlamesForever");
setInterval(function(){stream1.announceStream(bot);}, 5 * 60 * 1000);
