const mtg = require('mtgsdk');
const fs = require('fs');
const request = require("tinyreq");

module.exports = {

    /**
     * Will use the MTG API to get a card from gatherer.
     *
     * Returns possible are:
     * [] - no card found
     * [card] - one card found
     *
     * @param cardName the name of the card to be searched for
     * @returns Promise<any> object of cards found
     */
    getCardJson(cardName)
    {
        return new Promise(function (fulfill, reject)
        {
            try
            {
                mtg.card.where({name: cardName}).then(results =>
                {
                    fulfill(results)
                })
            }
            catch (ex)
            {
                reject(ex)
            }
        })
    },

    /**
     * This method finds a set based on the code.
     * eg. mm3 -> MM3 -> Modern Masters 2017 Edition
     *
     * @param setCode
     * @returns Promise<any> the set JSon or undefined if the set is not found
     */
    findSetByCode(setCode)
    {
        setCode = setCode.toUpperCase();
        return new Promise(function (fulfill, reject)
        {
            try
            {
                module.exports.getSetsJson().then(setsJson =>
                {
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
            catch (ex)
            {
                reject(ex)
            }
        })
    },

    /**
     * gets the a Json object of all the sets from paper MTG
     * The sets are either taken from the internet or if this has already been done
     * they are taken from a json cache file
     *
     * @returns Promise<any> of all MTG sets
     */
    getSetsJson()
    {
        return new Promise(function (fulfill, reject)
        {
            try
            {
                let file = undefined;
                try
                {
                    file = fs.readFileSync('./resources/jsonCache/mtgSets.json', 'utf8', (err) =>
                    {
                        if (err)
                        {
                            throw err;
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
            catch (ex)
            {
                reject(ex)
            }
        })
    }
};