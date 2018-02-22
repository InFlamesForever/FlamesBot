const fs = require('fs');

const LookUp = require("./commands/LookUp");

const utilities = require();


module.exports = class MTG
{
    constructor()
    {
        this.commands = [new LookUp];

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

    /**
     * creates the files that cache the mtg set and card information
     * @private
     */
    __createFiles()
    {
        try
        {
            fs.unlinkSync('./resources/jsonCache/mtgSets.json', function (err)
            {
                if (err)
                {
                    callback(null, "error while reading file");
                }
                else
                {
                    callback(null, "file read");
                }
            });
        }
        catch (ex)
        {
            utilities.logDebugText("Sets json does not exist \n" + ex)
        }

        try
        {
            fs.unlinkSync('./resources/jsonCache/mtgCards.json', function (err)
            {
                if (err)
                {
                    callback(null, "error while reading file");
                }
                else
                {
                    callback(null, "file read");
                }
            });
        }
        catch (ex)
        {
            utilities.logDebugText("Cards json does not exist \n" + ex)
        }
    }


};