
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
        
        this.currentLevel = this.logLevels.INFO;
    }

    getTimestamp()
    {
        return new Date().toISOString();
    }

    //Methos to register errors
    error(message, error = null, context = {}) 
    {
        if (this.currentLevel >= this.logLevels.ERROR) 
        {
            console.error(`[${this.getTimestamp()}] ❌ ERRO: ${message}`);
            if (error) 
            {
                console.error('Detalhes do erro:', error.message);
                console.error('Stack trace:', error.stack);   
            }
            if (Object.keys(context).length > 0) 
            {
                console.error('Contexto:', context); //extra information that helps to understand the error
            }
        }
    }

    //Method to register warns
    warn(message, context = {}) {
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
        if (this.currentLevel >= this.logLevels.INFO) 
        {
            console.log(`[${this.getTimestamp()}] ℹ️  INFO: ${message}`);

            if (data) 
            {
                console.log('Dados:', data);
            }
        }
    }

    //Method to register tecnicals details 
    debug(message, data = null) 
    {
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

