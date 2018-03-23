const fs = require('fs');

const LookUp = require("./commands/LookUp");

const utilities = require("./../../commonFunctions/utlities");


module.exports = class MTG
{
    constructor()
    {
        this.lookUp = new LookUp();
        this.commands = [this.lookUp];

        this.__deleteFiles()
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
     * deletes old files
     * @private
     */
    __deleteFiles()
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
            utilities.logErrorText("Something went wrong deleting the sets json \n" + ex)
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
            utilities.logErrorText("Something went wrong deleting the cards json \n" + ex)
        }
    }


};