//Imports
const mtgFunctions = require('../functions/mtg_api_functions');
const utilities = require('../../../commonFunctions/utlities');
const displayDiscord = require('../../../commonFunctions/display_on_discord');

const botSettings = require("./../../../../config/botSettings");

const commandSuffix = "L";

/**
 * This is the first iteration of the standard command class
 * setup.
 *
 * Each class will have a doCommand and getDescription function
 * These will do the obvious, more probably will be added when I think about it
 */
module.exports = class LookUp
{
    /**
     * empty constructor
     */
    constructor()
    {

    }

    /**
     * returns the command suffix constant
     * @returns {string} the command suffix
     */
    getCommandSuffix()
    {
        return commandSuffix;
    }

    /**
     * Checks if there is a set code provided then looks up the card
     * @param msg the discord message
     * @param args the card name with optional set parameter
     */
    doCommand(msg, args)
    {
        mtgFunctions.findSetByCode(args[args.length-1]).then(set =>
        {
            //If there is a set provided remove the set from the card name
            if(set !== undefined)
            {
                args.pop();
            }
            this.__lookupCard(msg, args.join(" "), set);
        });


    }

    /**
     *
     * @param msg
     * @param cardName
     * @param set
     * @private
     */
    __lookupCard(msg, cardName, set)
    {
        try
        {
            mtgFunctions.getCardJson(cardName).then(results =>
            {
            if(results.length === 0)
            {
                msg.reply("Couldn't find card")
            }
            else if(results.length === 1)
            {
                msg.reply("Here's the card I found");
                this.__printCard(msg, results[0])
            }
            else
            {
                if(set !== undefined)
                {
                    this.__MultipleCardsFoundSetDefined(msg, cardName, set, results)
                }
                else
                {
                    this.__MultipleCardsFoundSetUndefined(msg, cardName, results)
                }
            }
        });
        }
        catch (ex)
        {
            console.log("error printing card", ex)
        }
    }


    __MultipleCardsFoundSetDefined(msg, cardName, set, cardArr)
    {
        let i = 0;
        let found = false;
        cardArr.forEach(card => {
            i++;
            if(card.set === set.code && card.name.toUpperCase() === cardName)
            {
                this.__printCard(msg, card);
                found = true;
            }
            else if(i === cardArr.length && found === false)
            {
                msg.reply("Invalid input!");
                displayDiscord.printEmbeddedCardList(msg, cardArr)
            }
        })
    }

    __MultipleCardsFoundSetUndefined(msg, cardName, cardArr)
    {
        let found = false;
        cardArr.forEach(card =>
        {
            if(!found && card.name.toUpperCase() === cardName)
            {
                this.__printCard(msg, card);
                found = true;
            }

        });
        if(found)
        {
            displayDiscord.printEmbeddedCardList(msg, cardArr, "Also found:")
        }
        else
        {
            displayDiscord.printEmbeddedCardList(msg, cardArr)
        }
    }

    /**
     * Prints the card to discord, if there is a flip side to
     * the card, this is also printed
     *
     * @param msg - the discord message from the user
     * @param card - the found card
     * @private
     */
    __printCard(msg, card)
    {
        displayDiscord.printEmbeddedCard(msg, card);
        //Prints the flip side of a card if it has a flip side
        if(Array.isArray(card.names) && card.names.length === 2)
        {
            mtgFunctions.getCardJson(card.names[1]).then(results =>
            {
                if(results.length === 1)
                {
                    msg.reply("and here's the flip side");
                    displayDiscord.printEmbeddedCard(msg, results[0]);
                }
            })
        }
    }

    /**
     * Returns a description of the command
     * @returns {string}
     */
    getDescription()
    {
        return "Looks up a card: \n" +
            botSettings.prefix + botSettings.mtgPrefix
            + botSettings.connector + commandSuffix +
            " (card name) (optional three character set code)";
    }
};