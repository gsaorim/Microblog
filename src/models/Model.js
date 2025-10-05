import Logger from '../utils/Logger.js';

/*[USER CHAMA] → [MODEL] → [BANCO DE DADOS]
     ↑             ↑            ↑
  "Crie user"   Traduz para   Executa e
                SQL e valida  devolve */

//Mother class
export class Model
{
    constructor(database)
    {
        if (new.target === Model){
            throw new Error('Model é uma classe abstrata e não pode ser instanciada diretamente.');
        }

        this.db = database;

        this.logger = new Logger();

        this.tableName = this.constructor.name.toLowerCase() + 's';
    }

    //Create new registers in the bank
    async create(data)
    {
        const columns = Object.keys(data).join(', ');

        const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');

        const values = Object.values(data);

        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        const result = await this.db.query(sql, values);

        return result.rows[0];
    }

    async findById (id)
    {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
            const result = await this.db.query(sql, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
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
            let sql = `SELECT * FROM ${this.tableName}`;
            let values = [];
            if (Object.keys(conditions).length > 0)
            {
                const whereClauses = Object.keys(conditions).map((key, i) => `${key} = $${i + 1}`);

                sql += ` WHERE ${whereClauses.join(' AND ')}`;
                values = Object.values(conditions);
            }

            const result = await this.db.query(sql, values);
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
            const updates = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
            const values = Object.values(data);
            values.push(id);

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
            const sql = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
            const result = await this.db.query(sql, [id]);
            
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

   
    
    


