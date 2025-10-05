
export default class Logger 
{
    constructor() 
    {
        //Create levels of importance for the logs
        this.logLevels = {
            ERROR: 0,  //❌Just shows serious errors
            WARN: 1,   //❌⚠️Shows warns and errors
            INFO: 2,   //❌⚠️ℹ️Shows normals informations as well
            DEBUG: 3   //❌⚠️ℹ️🔍Shows EVERYTHING, even tecnicals details
        };
        //Start showing logs of INFO level and up
        this.currentLevel = this.logLevels.INFO;
    }

    getTimestamp()
    {
        //Method that return current formated date/hour 
        return new Date().toISOString();
    }

    //Methos to register errors
    error(message, error = null, context = {}) 
    {
        //Show that if the current level allows showing errors
        if (this.currentLevel >= this.logLevels.ERROR) 
        {
            //Shows the error message with an emoji and a timestamp
            console.error(`[${this.getTimestamp()}] ❌ ERRO: ${message}`);
            if (error) 
            {
                //If it was passed an error object, show details
                console.error('Detalhes do erro:', error.message);
                //the way that the code went through to get to the error
                console.error('Stack trace:', error.stack);   
            }
            //if it's passed context and it's not empty, show
            if (Object.keys(context).length > 0) 
            {
                console.error('Contexto:', context); //extra information that helps to understand the error
            }
        }
    }

    //Method to register warns
    warn(message, context = {}) {
        //Only execute if the current level for WARN(1), INFO(2) or DEBUG(3)
        if (this.currentLevel >= this.logLevels.WARN) 
        {
            console.warn(`[${this.getTimestamp()}] ⚠️  AVISO: ${message}`);

            if (Object.keys(context).length > 0) 
            {
                console.warn('Contexto:', context);
            }
        }
    }

    //Method to register normal informations of the sistem
    info(message, data = null) 
    {
        //Only execute if the current level for INFO(2) or DEBU(3)
        if (this.currentLevel >= this.logLevels.INFO) 
        {
            console.log(`[${this.getTimestamp()}] ℹ️  INFO: ${message}`);

            //If it was passed extra datas, show it
            if (data) 
            {
                console.log('Dados:', data);
            }
        }
    }

    //Method to register tecnicals details (only to development)
    debug(message, data = null) 
    {
        //Only execute if current level is exactily DEBUG(3)
        if (this.currentLevel >= this.logLevels.DEBUG) 
        {
            console.log(`[${this.getTimestamp()}] 🔍 DEBUG: ${message}`);

            if (data) 
            {
                console.log('Dados debug:', data);
            }
        }
    }

    //Method to change the level of current log
    setLevel(level) 
    {
        this.currentLevel = level;
    }
}
