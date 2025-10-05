import Logger from '../utils/Logger.js';

/*[USER CHAMA] → [MODEL] → [BANCO DE DADOS]
     ↑             ↑            ↑
  "Crie user"   Traduz para   Executa e
                SQL e valida  devolve */

//Mother class
export class Model
{
    //database as a parameter
    constructor(database)
    {
        //if someone try to crate a Model direct, give an error
        //Model is just one
        if (new.target === Model){
            throw new Error('Model é uma classe abstrata e não pode ser instanciada diretamente.');
        }

        //keep the database received on db
        this.db = database;

        //Create um caderno de anotação to this class
        this.logger = new Logger();

        //Create the name of the table based on the name of the class
        this.tableName = this.constructor.name.toLowerCase() + 's';
    }

    //Create new registers in the bank
    async create(data)
    {
        //Get all the keys of the object and join with commas
        const columns = Object.keys(data).join(', ');

        //Create placeholders to send SQL injection
        //SQL injection is a type of atack where hackers inject a malicious code, usin $1, $2 prevents this
        const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');

        //Get the values of the object data
        const values = Object.values(data);

        //Build the complete SQL command
        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        //Execute the SQL command in the data bank and wait for the answer 
        const result = await this.db.query(sql, values);

        //Return the first line of the result (the create register)
        return result.rows[0];
    }

    async findById (id)
    {
        try {
            //Select everything where ID = the first parameter
            const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
            //Execute query passing id as a paremeter
            const result = await this.db.query(sql, [id]);
            
            //If it didn't find any register
            if (result.rows.length === 0) {
                return null;
            }
            //If it's found, return the first register
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao buscar por ID em ${this.tableName}:`, error);
            throw error;
        }
    }

    //Find all the registers, filtered by conditions
    async findAll (conditions = {})
    {
        try
        {
            //Start with basic SQL and empty values
             let sql = `SELECT * FROM ${this.tableName}`;
            let values = [];
            //If were passed filtered conditions
            if (Object.keys(conditions).length > 0)
            {
                //Create clauses WHERE to every condition
                const whereClauses = Object.keys(conditions).map((key, i) => `${key} = $${i + 1}`);

                //Add WHERE to SQL
                sql += ` WHERE ${whereClauses.join(' AND ')}`;
                //Get the values of the conditions
                values = Object.values(conditions);
            }

            const result = await this.db.query(sql, values);
            //Return all the found registers
            return result.rows;

        } catch (error) {
            this.logger.error(`Erro ao buscar todos em ${this.tableName}:`, error);
            throw error;
        }
    }

    // UPDATE - Update the register
    async update(id, data) 
    {
        try 
        {
            //Create the SET part of SQL
            const updates = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
            //Get the values and add the ID in the end
            const values = Object.values(data);
            values.push(id);

            //Build the complete SQL
            const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${values.length} RETURNING *`;
            
            const result = await this.db.query(sql, values);
            if (result.rows.length === 0) 
            {
                throw new Error('Registro não encontrado');
            }
            
            this.logger.info(`Registro atualizado em ${this.tableName}:`, { id, ...data });
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao atualizar registro em ${this.tableName}:`, error);
            throw error;
        }
    }

    // DELETE - Remove register
    async delete(id) {
        try {
            //SLQ command: Delete where ID is iqual and return what's deleted
            const sql = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
            const result = await this.db.query(sql, [id]);
            
            //Id didn't find anything to delete, warn as an error
            if (result.rows.length === 0) 
            {
                throw new Error('Registro não encontrado');
            }
            
            this.logger.info(`Registro deletado de ${this.tableName}:`, { id });
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao deletar registro de ${this.tableName}:`, error);
            throw error;
        }
    }
}

   
    
    

