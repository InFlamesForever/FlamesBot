//Imports
const mtg = require('mtgsdk');
const Discord = require('discord.js');
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
                    results.forEach(card =>{

                        msg.reply("Here's the card I found");

                        mtgFunctions.printEmbeddedCard(msg, card);


                        if(card.names.length === 2)
                        {
                            //TODO: split cards functionality
                        }
                    })
                }
                else
                {
                    console.log("here");
                    if(set !== undefined)
                    {
                        console.log("here 2");
                        results.forEach(card => {
                            if(card.set === set.code && card.name === param)
                            {
                                console.log("here 3");
                                //TODO: modularise
                                mtgFunctions.printEmbeddedCard(msg, card);
                                if(card.names.length === 2)
                                {
                                    //TODO: split cards functionality
                                }
                            }
                            //TODO: add if no card is printed
                        })
                    }
                    else
                    {
                        mtgFunctions.printEmbeddedCardList(msg, results)
                    }
                }
            });
    }

    static getDescription()
    {
        return "This command looks up a card"
    }
};