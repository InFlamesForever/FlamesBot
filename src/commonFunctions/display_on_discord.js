const Discord = require('discord.js');

const red   = [255, 0, 0];
const black = [0, 0, 0];
const blue  = [0, 0, 255];
const green = [0, 255, 0];
const white = [255, 255, 255];
const gold  = [255, 223, 0];
const colourless  = [128,128,128];

module.exports = {

    /**
     * Takes the Json of a card and prints it to Discord
     * @param msg - the message
     * @param cardJson - the json of the mtg card
     */
    printEmbeddedCard(msg, cardJson)
    {
        let cardName = cardJson.name !== undefined ? cardJson.name : "Error";
        let manaCost = cardJson.manaCost !== undefined ? cardJson.manaCost : "";
        let type = cardJson.type !== undefined ? cardJson.type : "";
        let rarity = cardJson.rarity !== undefined ? cardJson.rarity : "";
        let oracleText = cardJson.text !== undefined ? cardJson.text : "";
        let imageUrl = cardJson.imageUrl;
        let color;
        if (Array.isArray(cardJson.colors))
        {
            if (cardJson.colors.length === 1)
            {
                switch (cardJson.colors[0].toUpperCase())
                {
                    case "GREEN":
                        color = green;
                        break;
                    case "WHITE":
                        color = white;
                        break;
                    case "BLACK":
                        color = black;
                        break;
                    case "RED":
                        color = red;
                        break;
                    case "BLUE":
                        color = blue;
                        break;
                }
            }
            else
            {
                color = gold;
            }
        }
        else
        {
            color = colourless;
        }

        msg.channel.send(
            new Discord.RichEmbed()
                .setTitle(cardName + " " + manaCost)
                /*
                 * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
                 */
                .setColor(color)
                .setDescription(type + " | " + rarity +
                    "\n\n" + oracleText)
                .setFooter("By MTG Bot")
                .setImage(imageUrl)
                /*
                 * Takes a Date object, defaults to current date.
                 */
                .setTimestamp()
        )

    },

    /**
     * Prints a list of cards given as a Json object
     *
     * @param msg - the discord message
     * @param cardListJson
     * @param message - the text to be used as the message title
     */
    printEmbeddedCardList(msg, cardListJson, message)
    {
        if (message === undefined)
        {
            message = "Multiple cards were found:";
        }
        let namesArr = [];
        cardListJson.forEach(card =>
        {
            namesArr.push(card.name + " " + card.set)
        });
        msg.channel.send(
            new Discord.RichEmbed()
                .setTitle(message)
                .setColor([255, 255, 255])
                .setDescription(namesArr.join("\n"))
                .setFooter("By MTG Bot")
                /*
                 * Takes a Date object, defaults to current date.
                 */
                .setTimestamp()
        )
    },

    /**
     * Prints the details of a stream
     * @param channel the discord channel to print to
     * @param streamer the username of the streamer
     * @param streamTitle the title of the stream
     * @param game the game being played by the streamer
     */
    printTwitchStream(channel, streamer, streamTitle, game)
    {
        channel.send(
            streamer + " is live! \n" +
            streamTitle + "\n" +
            "Playing " + game + "\n" +
            "http://twitch.tv/" + streamer
        );
    }
};