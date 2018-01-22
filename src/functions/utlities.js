const botSettings = require('../../config/botSettings.json');
const debug = botSettings.debug;

module.exports = {
    /**
     * Logs text only if debug is set in the configuration
     * @param text
     */
    logDebugText(text)
    {
        if(debug)
        {
            console.log(text)
        }
    }
};