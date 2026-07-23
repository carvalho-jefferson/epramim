# É pra mim?

Plataforma de comparação de produtos eletrônicos com foco em ajudar o usuário a tomar a melhor decisão de compra.

<!-- ![Screenshot](assets/home.png) -->

Início | Comparação | Admin
--|--|--
![Início](assets/home.png)| ![Comparação](assets/compare.png)| ![Admin](assets/admin-panel.png)

<!-- <p align="center">
    <img src="assets/home.png" width="70%">
</p> -->

<p align="center">
    <a href="https://epramim.vercel.app/">Ver demonstração</a>
</p>

## Sobre o projeto

**É pra mim?** é uma aplicação web full stack para comparação de especificações técnicas de smartphones. O usuário pesquisa dois produtos e visualiza um comparativo detalhado lado a lado, com destaque automático para o atributo superior em cada categoria.

O projeto foi desenvolvido com foco em boas práticas de arquitetura, segurança de API e experiência do usuário.

## Funcionalidades

- Busca com debounce — pesquisa em tempo real com navegação por teclado
- Comparação lado a lado — especificações de tela, hardware, câmera e conectividade com destaque do vencedor por atributo
- Página de produto — especificações completas com tooltips explicativos para cada atributo
- Painel administrativo — CRUD completo de produtos com autenticação por cookie, protegido por senha
- Importação em lote — script de importação via planilha Excel com validação de slugs duplicados
- Tema claro/escuro — alternância manual com persistência entre sessões
- SEO — URLs semânticas com slugs, meta tags dinâmicas e sitemap automático

**Em desenvolvimento:**
- Histórico de preços — integração com APIs oficiais de marketplaces (Mercado Livre, Amazon) e coleta complementar via scraping
- Motor de recomendação — endpoint que sugere produtos com base em orçamento e caso de uso, já implementado no backend, ainda não ativado na API pública

## Tecnologias

**Backend**
- Python 3.14 / FastAPI
- SQLAlchemy + PostgreSQL
- Pydantic (validação de schemas)
- Slowapi (rate limiting)
- Jinja2 (painel admin)
- python-dotenv

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- next-themes

**Infraestrutura**
- Vercel (frontend)
- Render (backend)
- Neon (PostgreSQL serverless)

---

## Arquitetura

```
├── backend/
│   ├── app/
│   │   ├── routers/        # products, compare, recommend
│   │   ├── admin/          # painel admin com Jinja2
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
|   |   ├── database.py
│   │   └── main.py
│   ├── scripts/
│   │   ├── import_from_excel.py
|   |   ├── insert_product.py 
│   │   └── generate_template.py
│   └── requirements.txt
│
└── frontend/
    └── app/
        ├── compare/        # página de comparação
        ├── product/        # página de produto
        └── components/
```

## Como rodar localmente

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Crie o arquivo `.env` em `backend/`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_PASSWORD=sua_senha
SECRET_KEY=sua_secret_key
ENVIRONMENT=development
```

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local` em `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `ALLOWED_ORIGINS` | Origens permitidas no CORS |
| `ADMIN_PASSWORD` | Senha do painel administrativo |
| `SECRET_KEY` | Chave secreta da aplicação |
| `ENVIRONMENT` | `development` ou `production` |
| `NEXT_PUBLIC_API_URL` | URL base da API |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend |
