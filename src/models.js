import Logger from './Logger.js';

/*[USER CHAMA] → [MODEL] → [BANCO DE DADOS]
     ↑             ↑            ↑
  "Crie user"   Traduz para   Executa e
                SQL e valida  devolve */

//Mother class
export class Model
{
    constructor(database, tableName) {
        if (new.target === Model) {
            throw new Error('Model é uma classe abstrata');
        }
        this.db = database;
        this.logger = new Logger();
        this.tableName = tableName;
    }

    async create(data) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(data);
        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await this.db.query(sql, values);
        return result.rows[0];
    }

    async findById(id) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
            const result = await this.db.query(sql, [id]);
            return result.rows.length === 0 ? null : result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao buscar por ID em ${this.tableName}:`, error);
            throw error;
        }
    }

    async findAll(conditions = {}) {
        try {
            let sql = `SELECT * FROM ${this.tableName}`;
            let values = [];
            if (Object.keys(conditions).length > 0) {
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

    async update(id, data) {
        try {
            const updates = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
            const values = Object.values(data);
            values.push(id);
            const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${values.length} RETURNING *`;
            const result = await this.db.query(sql, values);
            if (result.rows.length === 0) {
                throw new Error('Registro não encontrado');
            }
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao atualizar registro em ${this.tableName}:`, error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const sql = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
            const result = await this.db.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error('Registro não encontrado');
            }
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Erro ao deletar registro de ${this.tableName}:`, error);
            throw error;
        }
    }
}

// Classe User
export class User extends Model {
    constructor(database) {
        super(database, 'users');
    }

    async findByEmail(email) {
        try {
            const sql = `SELECT * FROM users WHERE email = $1`;
            const result = await this.db.query(sql, [email]);
            return result.rows.length === 0 ? null : result.rows[0];
        } catch (error) {
            this.logger.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    async searchByName(name) {
        try {
            const sql = `SELECT * FROM users WHERE username ILIKE $1`;
            const result = await this.db.query(sql, [`%${name}%`]);
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar usuários por nome:', error);
            throw error;
        }
    }

    async create(userData) {
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

// Classe Post
export class Post extends Model {
    constructor(database) {
        super(database, 'posts');
    }

    async findByUserId(userId) {
        try {
            const sql = `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`;
            const result = await this.db.query(sql, [userId]);
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts por user_id:', error);
            throw error;
        }
    }

    async searchByContent(keyword) {
        try {
            const sql = `SELECT * FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC`;
            const result = await this.db.query(sql, [`%${keyword}%`]);
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts por conteúdo:', error);
            throw error;
        }
    }

    async findRecent(limit = 10, offset = 0) {
        try {
            const sql = `
                SELECT p.*, u.username    
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC 
                LIMIT $1 OFFSET $2
            `;
            const result = await this.db.query(sql, [limit, offset]);
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts recentes:', error);
            throw error;
        }
    }

    async create(postData) {
        if (!postData.content || postData.content.trim().length === 0) {
            throw new Error('Conteúdo do post não pode estar vazio');
        }
        if (postData.content.length > 280) {
            throw new Error('Post muito longo. Máximo 280 caracteres');
        }
        if (!postData.user_id) {
            throw new Error('user_id é obrigatório');
        }
        return super.create({
            ...postData,
            created_at: new Date()
        });
    }
}

   
    
    


