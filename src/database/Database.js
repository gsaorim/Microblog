import pg from 'pg';
//Insdide the pg library, get Pool
const { Pool } = pg;   //Pool is a set of connections with the bank
import Logger from '../utils/Logger.js';

/*NOSSO PROGRAMA → [Database] → BANCO DE DADOS
     ↑              ↑              ↑
   Pedido      Tradutor       Resposta */


export class Database 
{
    //When someone create a new Database, execute this inicialization function
    constructor(config)
    {
        //Create a new pool of connections using the received configurations
        this.pool = new Pool(config);

        //Create a new logger to registrate what happen
        this.logger = new Logger();

        this.testConnection();
    }

    async testConnection()
    {
        try
        {
            //Wait to get a pool connection and keep on the client
            const client = await this.pool.connect();
            
            console.log('✅ Conectado ao banco de dados com sucesso!');

            //Return the connection to the pool for others to use
            client.release();
        } catch (error){
            this.logger.error('Erro ao conectar ao banco de dados:', error);
            //Throw the error above to whom call this function to see if it's an error
            throw error;
        }
    }

    //Execute SQL commands
    async query(sql, params = [])  //Receive SQL commands and parameters empties
    {
        try
        {
            //Waits to execute SQL commands on database using the parameters
            const result = await this.pool.query(sql, params);
            return result;
        }catch (error)
        {
            //Note on logger error, what was the error, the SQL command the errored and the parameters
            this.logger.error('Erro na query:', error, { sql, params });
            //Warn that it's given an error
            throw error;
        }
    }

    //Close all the connections
    async close() {
        await this.pool.end();  //Wait to close the pool connections
    }
}

