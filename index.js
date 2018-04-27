//npm libraries
const Discord = require('discord.js'); // npm install discord.js --save
const fs = require('fs');

//Local stuff to import
const utilities = require("./src/commonFunctions/utlities");
const StreamAnnouncement = require('./src/sections/twitch/classes/StreamAnnouncement');
const MTG = require("./src/sections/mtg/MTG");
const Twitch = require("./src/sections/twitch/Twitch");

const LookUp = require("./src/sections/mtg/commands/LookUp");

//import local config files
//********************************************************************************************************
const botSettings = require('./config/botSettings.json');
const privateConfig = require('./config/private_config.json');
const twitchConfig = require("./config/twitch_config");


//get bot settings e.g. token, prefix, etc and assign to local variables
//********************************************************************************************************
const botToken = privateConfig.botToken;
const commandPrefix = botSettings.prefix;
const commandConnector = botSettings.connector;

const mtgCommandPrefix = botSettings.mtgPrefix;
const twitchCommandPrefix = botSettings.twitchPrefix;

//Section wrappers - These are initialized after the bot is started to save effort if something goes wrong
//********************************************************************************************************
let mtgSection;
let twitchSection;

//********************************************************************************************************

// Initialize Discord Bot
//********************************************************************************************************
let bot = new Discord.Client({});

// When bot is ready, execute this code
//********************************************************************************************************
bot.on('ready', () =>
{
    createOrCleanNecessaryDirectoriesAndFiles();

    //initialise sections only after necessary directories are created
    mtgSection = new MTG();
    twitchSection = new Twitch();

    utilities.logDebugText('Logging in ...');
    //This will display the name in package.name and it's registered Discord ClientID
    utilities.logDebugText('Logged in as: ' + bot.user.tag + ' - (' + bot.user.id + ')');
});

// Bot is now listening in for certain commands from the discord user
//********************************************************************************************************
bot.on ('message', msg =>
{
    try
    {
        //reject the following input and exit
        if (msg.author.bot) return; //if the bot is the one sending the message exit this code block.
        if (msg.channel.type === 'dm') return; //if the bot receives a private / direct message, ignore it and exit this code block.

        let content = msg.content.toUpperCase();

        //Checks if the message has the command prefix
        if (content.substring(0, commandPrefix.length) === commandPrefix)
        {
            //split the command from the arguments, remove the prefix and convert it all to uppercase for easier processing
            let args = content.substring(commandPrefix.length, content.length).split(" ");

            //split the command up into its components eg, 'MTG' , 'L'
            let command = args[0].split(commandConnector);

            //remove command from args
            args = args.slice(1);

            if (command[0] === mtgCommandPrefix)
            {
                mtgSection.handleCommand(msg, command[1], args)
            }
            else if (command[0] === twitchCommandPrefix)
            {
                twitchSection.handleCommand(msg, command[1], args)
            }
            else
            {
                //do nothing is unrecognised command
            }
        }
        //Else for the easy lookup of magic cards using << cardname >>
        else if (content.includes(LookUp.getOpening()) && content.includes(LookUp.getClosing()))
        {
            let start = content.indexOf(LookUp.getOpening()) + LookUp.getOpening().length;
            let end = content.indexOf(LookUp.getClosing());

            let cardInfo = content.substring(start, end).toUpperCase().split(" ");

            mtgSection.handleCommand(msg, LookUp.getOpening(), cardInfo, true);
        }
    }
    catch (e)
    {
        utilities.logErrorText("Failed with command: " + msg.content, e)
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
    const jsonCacheDir = './resources/jsonCache';

    //If the directory doesn't exist, create it
    if (!fs.existsSync(jsonCacheDir))
    {
        utilities.logDebugText("json cache folder doesn't exist");
        fs.mkdirSync(jsonCacheDir);
    }

    //Logging folder
    const errorDir = './logs';
    if(!fs.existsSync(errorDir))
    {
        utilities.logDebugText("error folder doesn't exist");
        fs.mkdirSync(errorDir);
    }
}

//********************************************************************************************************
//End of functions


// Bot will now attempt to login
//********************************************************************************************************
utilities.logDebugText("about to login");
try
{
    bot.login(botToken).then(clientId =>
    {
        utilities.logDebugText("bot logged in successfully")
    });
}
catch (e)
{
    utilities.logErrorText("failed to login the bot", e);
}
//********************************************************************************************************

//Repeating Jobs
//********************************************************************************************************

//Stream announcements
try
{
    let stream1 = new StreamAnnouncement(twitchConfig.channelsToBroadcastTo, twitchConfig.streamsToAdvertise[0]);

    //10 seconds for dev purposes, should be every 5 minutes in prod
    const interval = 5 * 60 * 1000;
    setInterval(
        function()
        {
            stream1.announceStream(bot);
            utilities.logDebugText("printing")
        },
        interval
    );
}
catch (e)
{
    utilities.logErrorText("error with twitch stream announcements", e)
}

//********************************************************************************************************