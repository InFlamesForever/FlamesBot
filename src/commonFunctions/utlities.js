const fs = require("fs");

const botSettings = require('../../config/botSettings.json');
const debug = botSettings.debug;
const date = new Date();
const errorFile = "././logs/errorLog " + date.toDateString() + " " +
    date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".txt";

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
     * Logs errors to a log file
     * @param location the location the error was thrown from
     * @param error the error
     */
    logErrorText(location, error)
    {
        const errorText = location + "\n"  + error + "\n";
        if (fs.existsSync(errorFile))
        {
            this.logDebugText(errorText);
            fs.appendFile(errorFile, errorText, function (err)
            {
                if (err)
                {
                    throw (err);
                }

            });
        }
        else
        {
            this.logDebugText(errorText);
            let wstream = fs.createWriteStream(errorFile);
            wstream.on('open', function(fd)
            {
                wstream.write(errorText);
                wstream.end();
            })
        }
    }

};