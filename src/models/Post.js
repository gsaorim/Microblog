import { Model } from './Model.js';

/*[USUÁRIO PEDE] → [POST] → [BANCO] → [RESULTADO]
     ↑              ↑         ↑          ↑
"Posts do João"  Monta SQL  Executa   Lista de posts
                 específico           do João */

                 //herda
export class Post extends Model 
{
    constructor(database) {
        super(database);  //Call the constructor of Model class (classe pai = super)
        this.tableName = 'posts';
    }

    // Search for all posts of an especific user
    async findByUserId(userId) {
        try 
        {
            //Select all the posts where user_id = first parameter, more recent to the oldest
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
            //Select aposts where the content han the parameter (ignoring upper and low cases = ILIKE)
            const sql = `SELECT * FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC`;
            //Execute query passing key-word between %% (any text before or after)
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
            //Put the posts together with users to bring the username
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
        //If content is empty ou only has spaces, throw an error
        if (!postData.content || postData.content.trim().length === 0) 
        {
            throw new Error('Conteúdo do post não pode estar vazio');
        }

        //If post has more tem 280 characters, throw an error
        if (postData.content.length > 280)
        {
            throw new Error('Post muito longo. Máximo 280 caracteres');
        }

        //If it didn't have user_id, throw an error (every post needs an author)
        if (!postData.user_id) 
        {
            throw new Error('user_id é obrigatório');
        }

        return super.create({
            ...postData,  // Get ALL the properties of the object postData and spread here
            created_at: new Date() // Adiciona timestamp automaticamente
        });
    }
}