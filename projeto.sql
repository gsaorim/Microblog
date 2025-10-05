-- =============================================
-- PROJETO: MICROBLOG ORM
-- ALUNO: GABRIELA SAORI MIYASAKA
-- DATA: 05/10/2025
-- =============================================

-- Criar banco de dados
CREATE DATABASE microblog;

-- Conectar ao banco (execute separadamente no pgAdmin)
-- \c microblog

-- Criar tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content VARCHAR(280) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- DADOS DE EXEMPLO 
-- =============================================

-- Inserir usuários de exemplo
INSERT INTO users (username, email, full_name) VALUES
('joaosilva', 'joao@email.com', 'João Silva'),
('mariasouza', 'maria@email.com', 'Maria Souza'),
('pedroalves', 'pedro@email.com', 'Pedro Alves');

-- Inserir posts de exemplo
INSERT INTO posts (content, user_id) VALUES
('Bom dia! Hoje o dia está lindo! ☀️', 1),
('Aprendendo Node.js e PostgreSQL! 💻', 1),
('Alguém quer jogar futebol amanhã? ⚽', 2),
('Post de teste para busca #tecnologia #programacao', 3);

-- =============================================
-- CONSULTAS DE TESTE 
-- =============================================

-- Verificar usuários criados
SELECT * FROM users;

-- Verificar posts criados  
SELECT p.*, u.username 
FROM posts p 
JOIN users u ON p.user_id = u.id 
ORDER BY p.created_at DESC;