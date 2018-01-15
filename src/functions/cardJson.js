

module.exports = {

    /**
     * Takes in a card object from two different sources
     * and produces a single unified Json.
     *
     * @param mtgApi - Json card object from MTG API
     * @param scryFall - Json card object from scryfall
     * @param callback - error handling
     */
    createCardJson(mtgApi, scryFall, callback)
    {
        let cardName, manaCost, cmc, type, rarity, setCode, oracleText,
            multiverseId, imageUrl, usd, tix, eur = "";
        let cardNames, colours, legalities, imageUris = [];

        let mtgApiUsed = false;
        if(mtgApi !== undefined)
        {
            cardName = mtgApi.name;
            cardNames = mtgApi.names;
            manaCost = mtgApi.manaCost;
            cmc = mtgApi.cmc;
            colours = mtgApi.colors;
            type = mtgApi.type;
            rarity = mtgApi.rarity;
            setCode = mtgApi.set;
            oracleText = mtgApi.text;
            multiverseId = mtgApi.multiverseid;
            imageUrl = mtgApi.imageUrl;
            imageUris = {
                normal : mtgApi.imageUrl
            };

            mtgApiUsed = true;
        }
        if(scryFall !== undefined)
        {
            if(!mtgApiUsed)
            {
                cardName = scryFall.name;
                cardNames = [];
                manaCost = scryFall.mana_cost;
                cmc = scryFall.cmc;
                colours = scryFall.colors;
                type = scryFall.type_line;
                rarity = scryFall.rarity;
                setCode = scryFall.set.toUpperCase();
                oracleText = scryFall.oracle_text;
                multiverseId = scryFall.multiverseid;
                imageUrl = scryFall.image_uris.normal;
            }
            imageUris = scryFall.image_uris;
            usd = scryFall.usd;
            tix = scryFall.tix;
            eur = scryFall.eur;
            legalities = scryFall.legalities;
        }
        else
        {
            //somethings gone wrong, throw an error
            callback("Both inputs are undefined")
        }

        return {
            name : cardName,
            names : cardNames,
            manaCost : manaCost,
            cmc : cmc,
            colors : colours,
            type : type,
            rarity : rarity,
            set : setCode,
            text : oracleText,
            multiverseid : multiverseId,
            imageUrl : imageUrl,
            imageUris : imageUris,
            usd : usd,
            tix : tix,
            eur : eur,
            legalities : legalities,
            updated : Date.now()
        };

    }


};