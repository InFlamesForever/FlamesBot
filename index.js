//npm libraries
const Discord = require('discord.js'); // npm install discord.js --save
const fs = require('fs');


const mtgFunctions = require('./src/sections/mtg/functions/mtg_api_functions');
const utilities = require("./src/commonFunctions/utlities");
const StreamAnnouncement = require('./src/sections/twitch/classes/StreamAnnouncement');

//import local config files
//********************************************************************************************************
const botSettings = require('./config/botSettings.json');
const tokens = require('./config/private_config.json');
const twitchConfig = require("./config/twitch_config");


//get bot settings e.g. token, prefix, etc and assign to local variables
//********************************************************************************************************
const botToken = tokens.botToken;
const botPrefix = botSettings.prefix;
const debug = botSettings.debug;

// Initialize Discord Bot
//********************************************************************************************************
let bot = new Discord.Client({});

// When bot is ready, execute this code
//********************************************************************************************************
bot.on
('ready', () =>
{
    createOrCleanNecessaryDirectoriesAndFiles();
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
        let args = msg.content.substring(botPrefix.length, msg.content.length).toUpperCase().split(" ");
        let command = args[0].split(botSettings.connector);
        if(command[0] === botSettings.mtgPrefix)
        {
            msg.reply("you got mtg")
        }
        else
        {
            msg.reply("Unrecognised Command")
        }


    }
});

//Start of functions
//********************************************************************************************************

/**
 * Creates the necessary directories for the bot to function
 */
function createOrCleanNecessaryDirectoriesAndFiles()
{
    //Json directory used for storing data
    //May eventually be replaced by a database
    const dir = './resources/jsonCache';

    //If the directory doesn't exist, create it
    if (!fs.existsSync(dir))
    {
        console.log("folder doesn't exist");
        fs.mkdirSync(dir);
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


let stream1 = new StreamAnnouncement(twitchConfig.channelsToBroadcastTo, twitchConfig.streamsToAdvertise[0]);


//Continuous jobs
setInterval(function()
                {
                    stream1.announceStream(bot);
                    utilities.logDebugText("printing")
                }
                , 10 * 1000
);
