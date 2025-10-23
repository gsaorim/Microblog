import { Database } from './src/database.js';
import { User, Post } from './src/models.js';

// Configuração do banco de dados
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'microblog',
    password: process.env.DB_PASSWORD || '123456',
    port: process.env.DB_PORT || 5432,
};

async function main() {
    console.log('='.repeat(60));
    console.log('MICROBLOG ORM - SISTEMA DE TESTES');
    console.log('='.repeat(60));
    
    let database;
    
    try {
        // 1. Inicializar banco de dados
        console.log('\n1. 🗄️  INICIALIZANDO BANCO DE DADOS:');
        console.log('-'.repeat(40));
        database = new Database(dbConfig);
        
        // 2. Criar instâncias dos modelos
        const userModel = new User(database);
        const postModel = new Post(database);

        // 3. TESTES DE USUÁRIOS
        console.log('\n2. 👥 TESTES DE USUÁRIOS:');
        console.log('-'.repeat(40));
        
        // Criar usuários
        const timestamp = Date.now();
        const user1 = await userModel.create({
            username: `joao_silva_${timestamp}`,
            email: `joao${timestamp}@email.com`,
            full_name: `João Silva ${timestamp}`
        });
        console.log('✅ Usuário 1 criado:', user1.username);

        const user2 = await userModel.create({
            username: `maria_oliveira_${timestamp}`,
            email: `maria${timestamp}@email.com`,
            full_name: `Maria Oliveira ${timestamp}`
        });
        console.log('✅ Usuário 2 criado:', user2.username);

        // Buscar usuário por ID
        const usuarioEncontrado = await userModel.findById(user1.id);
        console.log('✅ Usuário encontrado por ID:', usuarioEncontrado.username);

        // Buscar usuário por email
        const usuarioPorEmail = await userModel.findByEmail(user2.email);
        console.log('✅ Usuário encontrado por email:', usuarioPorEmail.username);

        // Buscar todos os usuários
        const todosUsuarios = await userModel.findAll();
        console.log('✅ Total de usuários:', todosUsuarios.length);

        // 4. TESTES DE POSTS
        console.log('\n3. 💬 TESTES DE POSTS:');
        console.log('-'.repeat(40));
        
        // Criar posts
        const post1 = await postModel.create({
            content: 'Meu primeiro post no microblog! Estou muito feliz! 😊',
            user_id: user1.id
        });
        console.log('✅ Post 1 criado:', post1.content.substring(0, 50) + '...');

        const post2 = await postModel.create({
            content: 'Aprendendo sobre ORM e PostgreSQL. Muito interessante! 🚀',
            user_id: user2.id
        });
        console.log('✅ Post 2 criado:', post2.content.substring(0, 50) + '...');

        const post3 = await postModel.create({
            content: 'Bem-vindos ao nosso microblog! Vamos compartilhar ideias! 💡',
            user_id: user1.id
        });
        console.log('✅ Post 3 criado:', post3.content.substring(0, 50) + '...');

        // Buscar posts por usuário
        const postsUsuario1 = await postModel.findByUserId(user1.id);
        console.log('✅ Posts do usuário 1:', postsUsuario1.length);

        // Buscar posts por conteúdo
        const postsFeliz = await postModel.searchByContent('feliz');
        console.log('✅ Posts com "feliz":', postsFeliz.length);

        // Buscar posts recentes
        const postsRecentes = await postModel.findRecent(5);
        console.log('✅ Posts recentes:', postsRecentes.length);

        // 5. TESTES DE ATUALIZAÇÃO
        console.log('\n4. 🔄 TESTES DE ATUALIZAÇÃO:');
        console.log('-'.repeat(40));
        
        // Atualizar post
        const postAtualizado = await postModel.update(post1.id, {
            content: 'Post ATUALIZADO! Agora estou ainda mais feliz! 🎉'
        });
        console.log('✅ Post atualizado:', postAtualizado.content);

        // Atualizar usuário
        const userAtualizado = await userModel.update(user1.id, {
            full_name: 'João Silva Santos (Nome Atualizado)'
        });
        console.log('✅ Usuário atualizado:', userAtualizado.full_name);

        // 6. TESTES DE CONSULTAS AVANÇADAS
        console.log('\n5. 🔍 TESTES DE CONSULTAS AVANÇADAS:');
        console.log('-'.repeat(40));
        
        // Consulta personalizada - estatísticas
        const stats = await database.query(`
            SELECT 
                u.username,
                COUNT(p.id) as total_posts,
                MAX(p.created_at) as ultimo_post
            FROM users u 
            LEFT JOIN posts p ON u.id = p.user_id 
            GROUP BY u.id, u.username 
            ORDER BY total_posts DESC
        `);
        
        console.log('📊 Estatísticas de usuários:');
        stats.rows.forEach(row => {
            console.log(`   ${row.username}: ${row.total_posts} posts`);
        });

        // 7. TESTES DE TRATAMENTO DE ERROS
        console.log('\n6. 🛡️  TESTES DE TRATAMENTO DE ERROS:');
        console.log('-'.repeat(40));
        
        try {
            await postModel.create({
                content: '', // Conteúdo vazio - deve gerar erro
                user_id: user1.id
            });
        } catch (error) {
            console.log('✅ Erro capturado (conteúdo vazio):', error.message);
        }

        try {
            await userModel.create({
                email: user1.email, // Email duplicado - deve gerar erro
                username: 'novousuario'
            });
        } catch (error) {
            console.log('✅ Erro capturado (email duplicado):', error.message);
        }

        // 8. ESTATÍSTICAS FINAIS
        console.log('\n7. 📈 ESTATÍSTICAS FINAIS:');
        console.log('-'.repeat(40));
        
        const totalUsers = await userModel.findAll();
        const totalPosts = await postModel.findAll();
        
        console.log(`👥 Total de usuários: ${totalUsers.length}`);
        console.log(`💬 Total de posts: ${totalPosts.length}`);
        
        // Posts por usuário
        const postsPorUsuario = await database.query(`
            SELECT u.username, COUNT(p.id) as qtd_posts 
            FROM users u 
            LEFT JOIN posts p ON u.id = p.user_id 
            GROUP BY u.id, u.username
        `);
        
        console.log('\n📊 Distribuição de posts:');
        postsPorUsuario.rows.forEach(row => {
            console.log(`   ${row.username}: ${row.qtd_posts} posts`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ TODOS OS TESTES EXECUTADOS COM SUCESSO!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Erro durante a execução:', error);
    } finally {
        if (database) {
            await database.close();
            console.log('\n🔌 Conexão com o banco fechada.');
        }
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { Database, User, Post };