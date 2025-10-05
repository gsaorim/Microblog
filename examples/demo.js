import { Database, User, Post } from '../src/index.js';

// Database configuration
//Create an object with the informations to conect on PostgreSQL bank
const dbConfig = {
    user: process.env.DB_USER || 'postgres',        
    host: process.env.DB_HOST || 'localhost',       
    database: process.env.DB_NAME || 'microblog',   
    password: process.env.DB_PASSWORD || 'sua_senha',   
    port: process.env.DB_PORT || 5432,     
};


async function demo() 
{
    try 
    {
        // 1. Inicialize database
        const database = new Database(dbConfig);
        
        // 2. Create classes instances
        const userModel = new User(database);    
        const postModel = new Post(database);    

        console.log('=== DEMONSTRAÇÃO MICROBLOG ORM ===\n');

        // 3. CRUD of Users
        console.log('1. 👥 OPERAÇÕES DE USUÁRIO:');
        
        // Create User
        // ✅ USAR DADOS ÚNICOS - adicionar timestamp ou número aleatório
        const timestamp = Date.now();
        const novoUsuario = await userModel.create({                
            username: `user${timestamp}`,                              
            email: `user${timestamp}@email.com`,                           
            full_name: `Usuário Teste ${timestamp}`
        });
        console.log('✅ Usuário criado:', novoUsuario);

        // Search user ID
        const usuarioEncontrado = await userModel.findById(novoUsuario.id);
        console.log('✅ Usuário encontrado por ID:', usuarioEncontrado.username);

        // Search for email
        const usuarioPorEmail = await userModel.findByEmail(novoUsuario.email);
        console.log('✅ Usuário encontrado por email:', usuarioPorEmail.username);

        // 4. CRUD of Posts
        console.log('\n2. 💬 OPERAÇÕES DE POST:');
        
        // Create post
        const novoPost = await postModel.create({                  
            content: 'Meu primeiro post no microblog! #feliz',     
            user_id: novoUsuario.id                                
        });
        console.log('✅ Post criado:', novoPost.content);

        // Search users posts
        const postsUsuario = await postModel.findByUserId(novoUsuario.id);
        console.log('✅ Posts do usuário:', postsUsuario.length, 'encontrados');

        // Search posts by content
        const postsFelicidade = await postModel.searchByContent('feliz');
        console.log('✅ Posts com "feliz":', postsFelicidade.length);

        // Search recents posts
        const postsRecentes = await postModel.findRecent(5);
        console.log('✅ Posts recentes:', postsRecentes.length);

        // 5. Update post
        const postAtualizado = await postModel.update(novoPost.id, {
            content: 'Post atualizado! Agora está ainda melhor! ✨'
        });
        console.log('✅ Post atualizado:', postAtualizado.content);

        // 6. Errors treatment
        console.log('\n3. 🛡️ TESTE DE TRATAMENTO DE ERROS:');
        
        try 
        {                                                                           
            await postModel.create({                                                
                content: '', // Empty content - should generate error
                user_id: novoUsuario.id
            });
        } catch (error) {
            console.log('✅ Erro capturado corretamente:', error.message);
        }

        // 7. Close connection
        await database.close();
        console.log('\n=== DEMONSTRAÇÃO CONCLUÍDA ===');

    } catch (error) {
        console.error('❌ Erro na demonstração:', error);
    }
}


demo();
