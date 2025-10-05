import { Model } from './Model.js';

/* [PROGRAMA PEDE] → [USER] → [BANCO] → [RESULTADO]
       ↑             ↑         ↑          ↑
   "Crie usuário"  Valida    Executa   Usuário
                   & monta   SQL       criado
                   SQL */

export class User extends Model   //extend = herdar
{
    constructor(database)
    {
        //When create an User, call the first constructor of the class Model(super)
        super(database);

        //Overwrite the name of the table to 'users
        this.tableName = 'users';
    }

    async findByEmail(email)
    {
        try {
            const sql = `SELECT * FROM users WHERE email = $1`;  //first parameter
            //Execute query passing email as a parameter
            const result = await this.db.query(sql, [email]);
            
            //If it didn't find any users return null
            if (result.rows.length === 0) {
                return null;
            }
            //if it did, return the first user
            return result.rows[0];
        } catch (error) {
            this.logger.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    async searchByName(name) 
    {
        try {
            //Select users where username has a parameter (ignoring upper and low cases)
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
        // Basic Validations
        //If miss an email or username, throw an error
        if (!userData.email || !userData.username) {
            throw new Error('Email e username são obrigatórios');
        }

        // Verify if the email exist
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email já está em uso');
        }
        //If it pass all the validations, call method create original of Model class
        return super.create(userData);
    }
}