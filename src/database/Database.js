import pg from 'pg';
const { Pool } = pg;   
import Logger from '../utils/Logger.js';

/*NOSSO PROGRAMA → [Database] → BANCO DE DADOS
     ↑              ↑              ↑
   Pedido      Tradutor       Resposta */


const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'microblog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456'
};

export class Database 
{
    
    constructor(config = dbConfig)
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



