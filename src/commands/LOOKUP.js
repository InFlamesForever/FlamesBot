//Imports
const mtgFunctions = require('../functions/mtg_api_functions');
const utilities = require('../functions/utlities');
const displayDiscord = require('../functions/display_on_discord');

/**
 * This is the first iteration of the standard command class
 * setup.
 *
 * Each class will have a doCommand and getDescription function
 * These will do the obvious, more probably will be added when I think about it
 */
module.exports = class LOOKUP
{
    constructor(test)
    {
        this.test = test;
    }

    doCommand(msg, param, set)
    {
        try
        {
            //This command will be used to lookup cards
            // partial name match
            mtgFunctions.getCardJson(param)
                .then(results => {
                    //utilities.logDebugText(results);
                    if(results.length === 0)
                    {
                        msg.reply("Couldn't find card")
                    }
                    else if(results.length === 1)
                    {
                        msg.reply("Here's the card I found");
                        LOOKUP.__printCard(msg, results[0])
                    }
                    else
                    {
                        //utilities.logDebugText(set);
                        if(set !== undefined)
                        {
                            utilities.logDebugText("inside mulitple cards found, set defined");
                            let setCode = set.code.toUpperCase();
                            let cardName = param.toUpperCase();
                            utilities.logDebugText("setCode: " + setCode + "cardname: " +cardName);
                            let i = 0;
                            let found = false;
                            results.forEach(card => {
                                i++;
                                if(card.set === setCode && card.name.toUpperCase() === cardName)
                                {
                                    LOOKUP.__printCard(msg, card);
                                    found = true;
                                }
                                else if(i === results.length && found === false)
                                {
                                    msg.reply("Invalid input!");
                                    displayDiscord.printEmbeddedCardList(msg, results)
                                }
                            })
                        }
                        else
                        {
                            let found = false;
                            let cardName = param.toUpperCase();
                            results.forEach(card => {
                                if(!found && card.name.toUpperCase() === cardName)
                                {
                                    LOOKUP.__printCard(msg, card);
                                    found = true;
                                }

                            });
                            if(found)
                            {
                                displayDiscord.printEmbeddedCardList(msg, results, "Also found:")
                            }
                            else
                            {
                                displayDiscord.printEmbeddedCardList(msg, results)
                            }
                        }
                    }
                });
        }
        catch (ex)
        {
            console.log("error printing card", ex)
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
    static __printCard(msg, card)
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
    static getDescription()
    {
        return "This command looks up a card"
    }
};