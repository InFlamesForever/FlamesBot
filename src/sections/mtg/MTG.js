const fs = require('fs');

const LookUp = require("./commands/LookUp");

const utilities = require("./../../commonFunctions/utlities");


module.exports = class MTG
{
    constructor()
    {
        this.lookUp = new LookUp();
        this.commands = [this.lookUp];

        this.__createFiles()
    }

    /**
     * Returns an array of descriptions
     */
    getCommandInfo()
    {
        let descs = [];
        this.commands.forEach(command =>
        {
            descs.push(command.getDescription())
        });
        return descs;
    }

    handleCommand(msg, commandSuffix, args, isInMessageLookUp)
    {
        if(isInMessageLookUp !== undefined && isInMessageLookUp === false)
        {
            this.commands.forEach(command =>
            {
                if(command.getCommandSuffix() === commandSuffix)
                {
                    command.doCommand(msg, args)
                }
            })
        }
        else
        {
            this.lookUp.doCommand(msg, args)
        }

    }

    /**
     * creates the files that cache the mtg set and card information
     * @private
     */
    __createFiles()
    {
        try
        {
            fs.unlinkSync('./resources/jsonCache/mtgSets.json', (err) =>
            {
                if (err)
                {
                    throw err
                }
            });
        }
        catch (ex)
        {
            utilities.logDebugText("Sets json does not exist \n" + ex)
        }

        try
        {
            fs.unlinkSync('./resources/jsonCache/mtgCards.json', (err) =>
            {
                if (err)
                {
                    throw err
                }
            });
        }
        catch (ex)
        {
            utilities.logDebugText("Cards json does not exist \n" + ex)
        }
    }


};