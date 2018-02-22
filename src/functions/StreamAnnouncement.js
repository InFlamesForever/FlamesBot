const twitchApiLite = require("twitch-api-lite");
const printer = require("./display_on_discord");
const Discord = require("discord.js");
const twitchConfig = require("../../config/twitch_config");

//The time between updates to the discord message, 10 minutes
const timeBetweenUpdates = 10 * 60 * 1000;

module.exports = class StreamAnnouncement
{
    /**
     * Constructor
     * @param announcementChannels An array of channel ID's to post in
     * @param twitchUsername
     */
    constructor(announcementChannels, twitchUsername)
    {
        this.__announcementChannels = announcementChannels;
        this.__twitchUsername = twitchUsername;

        //initialise other variables
        this.__streamTitle = "";
        this.__streamGame = "";
        this.__streamPicUrl = "";
        this.__isLive = false;
    }

    /**
     * If a stream is live it will announce it to the channels specified when this object was constructed.
     * Calling this again will check whether the stream is live, and if it isn't the messages will be removed
     * @param bot
     */
    announceStream(bot)
    {
        if(this.__isLive)
        {
            twitchApiLite.isStreamerLiveByUsername(twitchConfig.clientID, this.__twitchUsername)
                .then(isLive =>
                {
                    if(!isLive)
                    {
                        this.__isLive = false;
                        this.__cleanUp(bot);
                    }
                });
        }
        else
        {
            twitchApiLite.getStreamDetailsByUsername(twitchConfig.clientID, this.__twitchUsername)
                         .then(streamData =>
            {
                if(streamData !== undefined && streamData.length !== 0)
                {
                    this.__streamTitle = streamData[0].title;

                    this.__streamPicUrl = streamData[0].thumbnail_url;
                    this.__streamPicUrl = this.__streamPicUrl.replace("{width}", "300");
                    this.__streamPicUrl = this.__streamPicUrl.replace("{height}", "200");

                    twitchApiLite.getGameByID(twitchConfig.clientID, streamData[0].game_id).then(game =>
                    {
                        this.__streamGame = game[0].name;

                        this.__announcementChannels.forEach(channelID =>
                        {
                            printer.printTwitchStream(bot.channels.get(channelID), this.__twitchUsername,
                                this.__streamTitle, this.__streamGame, this.__streamPicUrl, [255, 0, 0])
                        });

                        this.__isLive = true;
                    });
                }
            })

        }

    }

    /**
     * Cleans up the messages sent to discord
     * @param bot the discord bot
     * @private
     */
    __cleanUp(bot)
    {
        this.__announcementChannels.forEach(channelID =>
        {
            let channel = bot.channels.get(channelID);
            channel.messages.forEach(message => {
                if(message.author.id === bot.user.id && message.embeds[0].title.includes(this.__twitchUsername))
                {
                    console.log("Found a message");
                    message.delete();
                }
            })
        });
    }
};