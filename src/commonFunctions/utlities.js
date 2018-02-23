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
    },

    /**
     * TODO: Change this so it logs to a log file rather than the console
     * @param location the location the error was thrown from
     * @param error the error
     */
    logErrorText(location, error)
    {
        console.log(location + "\n"  + error)
    }
};