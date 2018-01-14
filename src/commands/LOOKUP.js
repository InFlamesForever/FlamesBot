//Imports
const mtgFunctions = require('../functions/mtg_api_functions');

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
                    //console.log(results);
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
                        if(set !== undefined)
                        {
                            let i = 0;
                            results.forEach(card => {
                                i++;
                                if(card.set === set.code && card.name === param)
                                {
                                    LOOKUP.__printCard(msg, card)
                                }
                                else if(i === results.length)
                                {
                                    msg.reply("Invalid input!");
                                    mtgFunctions.printEmbeddedCardList(msg, results)
                                }
                            })
                        }
                        else
                        {
                            mtgFunctions.printEmbeddedCardList(msg, results)
                        }
                    }
                });
        }
        catch (ex)
        {
            console.log("error printing card", ex)
        }

    }

    static __printCard(msg, card)
    {
        mtgFunctions.printEmbeddedCard(msg, card);
        if(Array.isArray(card.names) && card.names.length === 2)
        {
            mtgFunctions.getCardJson(card.names[1]).then(results =>
            {
                if(results.length === 1)
                {
                    msg.reply("and here's the flip side");
                    mtgFunctions.printEmbeddedCard(msg, results[0]);
                }
            })
        }
    }

    static getDescription()
    {
        return "This command looks up a card"
    }
};