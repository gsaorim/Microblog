# 🐦 Microblog ORM - Sistema de Microblogging em Node.js

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Um sistema completo de microblogging desenvolvido em Node.js com PostgreSQL, implementando um ORM (Object-Relational Mapper) do zero.

## ✨ Funcionalidades

- ✅ **ORM Customizado** - Classes para gerenciamento de banco de dados
- ✅ **CRUD Completo** - Create, Read, Update, Delete
- ✅ **Validações de Negócio** - Regras de negócio robustas
- ✅ **Sistema de Logs** - Registro detalhado de operações
- ✅ **Buscas Avançadas** - Por conteúdo, usuário, etc.
- ✅ **Docker Integration** - Containerização completa com PostgreSQL
- ✅ **Tratamento de Erros** - Sistema robusto de exceções e validações
- ✅ **Consultas Otimizadas** - Índices e queries performáticas

## 🚀 Começando

### Pré-requisitos

- Docker e Docker Compose instalados

### 🐳 Execução com Docker 

```bash
# Clone o repositório
git clone https://github.com/gsaorim/Microblog-orm.git
cd Microblog-orm

# Execute com Docker Compose
docker-compose up -d

# Verifique se os containers estão rodando
docker ps

# Se não aparecer os testes automaticamente, verifique os logs:
docker logs microblog-app

# Ou execute manualmente:
docker exec -it microblog-app node index.js



