import { Database, User, Post } from '../src/index.js';

// Database configuration
//Create an object with the informations to conect on PostgreSQL bank
const dbConfig = {
    user: process.env.DB_USER || 'postgres',        //User name of the bank
    host: process.env.DB_HOST || 'localhost',       //The bank is on this machine
    database: process.env.DB_NAME || 'microblog',   //Name of the bank were're going to using
    password: process.env.DB_PASSWORD || '123456789',   
    port: process.env.DB_PORT || 5432,     //PostgreSql execution port
};


async function demo() 
{
    try 
    {
        // 1. Inicialize database
        const database = new Database(dbConfig);
        
        // 2. Create classes instances
        const userModel = new User(database);    //method to manage users
        const postModel = new Post(database);    //method to manege posts 

        console.log('=== DEMONSTRAÇÃO MICROBLOG ORM ===\n');

        // 3. CRUD of Users
        console.log('1. 👥 OPERAÇÕES DE USUÁRIO:');
        
        // Create User
        // ✅ USAR DADOS ÚNICOS - adicionar timestamp ou número aleatório
        const timestamp = Date.now();
        const novoUsuario = await userModel.create({                //create(): Validate if has an email and username
            username: `user${timestamp}`,                              //Verify if email already exist
            email: `user${timestamp}@email.com`,                           //Buil SQL; execute in the bank and return the creates user
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
        const novoPost = await postModel.create({                  //postModel.create(): Valildate if the content is not null;
            content: 'Meu primeiro post no microblog! #feliz',     //if it doesn't pass 280 caracteres; if there's an user_id
            user_id: novoUsuario.id                                //add atual data; build and execute SQL
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
        {                                                                           //Try to create an empty post and shows
            await postModel.create({                                                //that capture an error
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