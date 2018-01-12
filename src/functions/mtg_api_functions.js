const mtg = require('mtgsdk');
const Discord = require('discord.js');
const fs = require('fs');
const jsonQuery = require('json-query');
const request = require("tinyreq");

const red   = [255, 0, 0];
const black = [0, 0, 0];
const blue  = [0, 0, 255];
const green = [0, 255, 0];
const white = [255, 255, 255];
const gold  = [255, 223, 0];

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
        if(cardJson.colors.length === 1)
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

    printEmbeddedCardList(msg, cardListJson)
    {
        let namesArr = [];
        cardListJson.forEach(card =>{
            namesArr.push(card.name + " " +  card.set)
        });
        msg.channel.send(
            new Discord.RichEmbed()
                .setTitle("Multiple cards were found:")
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
     * Will use the MTG API to get a card from gatherer.
     *
     * Returns possible are:
     * [] - no card found
     * [card] - one card found
     *
     * @param cardName the name of the card to be searched for
     * @returns Json object of cards found
     */
    getCardJson(cardName)
    {
        return new Promise(
            function (fulfill, reject) {
                try {
                    mtg.card.where({name: cardName})
                        .then(results => {
                            fulfill(results)
                        })
                }
                catch (ex) {
                    reject(ex)
                }
            })
    },

    /**
     * This method finds a set based on the code.
     * eg. mm3 -> MM3 -> Modern Masters 2017 Edition
     *
     * @param setCode
     * @returns Either the set JSon or undefined if the set is not found
     */
    findSetByCode(setCode)
    {
        setCode = setCode.toUpperCase();
        return new Promise(
            function (fulfill, reject) {
                try
                {
                    module.exports.getSetsJson().then(setsJson =>
                    {
                        let i = 0;
                        setsJson.sets.forEach(set =>
                        {
                            if (set.code === setCode)
                            {
                                fulfill(set)
                            }
                        });
                        fulfill(undefined)
                    })
                }
                catch (ex) {
                        reject(ex)
                    }
                })
    },

    /**
     * gets the a Json object of all the sets from paper MTG
     * The sets are either taken from the internet or if this has already been done
     * they are taken from a json cache file
     *
     * @returns json of all MTG sets
     */
    getSetsJson()
    {
        return new Promise(
            function (fulfill, reject) {
                try {
                    let file = undefined;
                    try
                    {
                        file = fs.readFileSync('./resources/jsonCache/mtgSets.json', 'utf8', function (err) {
                            if (err) {
                                callback(null, "error while reading file");
                            }
                            else {
                                callback(null, "file read");
                            }
                        });
                        if(file !== undefined)
                        {
                            fulfill(JSON.parse(file));
                        }
                    }
                    catch (ex)
                    {
                        request('https://api.magicthegathering.io/v1/sets', function (err, body)
                        {
                            let wstream = fs.createWriteStream('./resources/jsonCache/mtgSets.json');
                            wstream.write(body);
                            wstream.end();
                            fulfill(JSON.parse(body))
                        });
                    }
                }
                catch (ex) {
                    reject(ex)
                }
            })
    }
};

/*
functionName(param)
{
    return new Promise(
        function (fulfill, reject) {
            try {
                fulfill(returnItem)
            }
            catch (ex) {
                reject(ex)
            }
        })
}
 */