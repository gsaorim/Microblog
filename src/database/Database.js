import pg from 'pg';
//Insdide the pg library, get Pool
const { Pool } = pg;   
import Logger from '../utils/Logger.js';

/*NOSSO PROGRAMA → [Database] → BANCO DE DADOS
     ↑              ↑              ↑
   Pedido      Tradutor       Resposta */


export class Database 
{
    
    constructor(config)
    {
        this.pool = new Pool(config);

        this.logger = new Logger();

        this.testConnection();
    }

    async testConnection()
    {
        try
        {
            const client = await this.pool.connect();
            
            console.log('✅ Conectado ao banco de dados com sucesso!');

            client.release();
        } catch (error){
            this.logger.error('Erro ao conectar ao banco de dados:', error);
            throw error;
        }
    }

    //Execute SQL commands
    async query(sql, params = []) 
    {
        try
        {
            const result = await this.pool.query(sql, params);
            return result;
        }catch (error)
        {
            this.logger.error('Erro na query:', error, { sql, params });
            throw error;
        }
    }

    //Close all the connections
    async close() {
        await this.pool.end();  //Wait to close the pool connections
    }
}


