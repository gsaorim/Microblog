import { Model } from './Model.js';

/*[USUÁRIO PEDE] → [POST] → [BANCO] → [RESULTADO]
     ↑              ↑         ↑          ↑
"Posts do João"  Monta SQL  Executa   Lista de posts
                 específico           do João */

                 
export class Post extends Model 
{
    constructor(database) {
        super(database);  
        this.tableName = 'posts';
    }

    // Search for all posts of an especific user
    async findByUserId(userId) {
        try 
        {
            const sql = `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`;
            const result = await this.db.query(sql, [userId]);
            
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts por user_id:', error);
            throw error;
        }
    }

    // Search posts that contain a key-word
    async searchByContent(keyword) 
    {
        try 
        {
            const sql = `SELECT * FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC`;
            const result = await this.db.query(sql, [`%${keyword}%`]);
            
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts por conteúdo:', error);
            throw error;
        }
    }

    // Find recents posts with limit and paging
    async findRecent(limit = 10, offset = 0) 
    {
        try 
        {
            const sql = `
                SELECT p.*, u.username    
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC 
                LIMIT $1 OFFSET $2
            `;
            const result = await this.db.query(sql, [limit, offset]); //parameters
            
            return result.rows;
        } catch (error) {
            this.logger.error('Erro ao buscar posts recentes:', error);
            throw error;
        }
    }

    // Validation before creating the posts
    async create(postData) 
    {
        if (!postData.content || postData.content.trim().length === 0) 
        {
            throw new Error('Conteúdo do post não pode estar vazio');
        }

        if (postData.content.length > 280)
        {
            throw new Error('Post muito longo. Máximo 280 caracteres');
        }

        if (!postData.user_id) 
        {
            throw new Error('user_id é obrigatório');
        }

        return super.create({
            ...postData,  
            created_at: new Date() 
        });
    }

}
