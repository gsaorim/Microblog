import { Model } from './Model.js';

/* [PROGRAMA PEDE] → [USER] → [BANCO] → [RESULTADO]
       ↑             ↑         ↑          ↑
   "Crie usuário"  Valida    Executa   Usuário
                   & monta   SQL       criado
                   SQL */

export class User extends Model   
{
    constructor(database)
    {
        super(database);

        this.tableName = 'users';
    }

    async findByEmail(email)
    {
        try {
            const sql = `SELECT * FROM users WHERE email = $1`;  
            const result = await this.db.query(sql, [email]);
            
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            this.logger.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    async searchByName(name) 
    {
        try {
            const sql = `SELECT * FROM users WHERE username ILIKE $1`;
            const result = await this.db.query(sql, [`%${name}%`]);
            
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar usuários por nome:', error);
            throw error;
        }
    }

    // Validation before create an user
    async create(userData) 
    {
        if (!userData.email || !userData.username) {
            throw new Error('Email e username são obrigatórios');
        }

        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email já está em uso');
        }
        return super.create(userData);
    }

}
