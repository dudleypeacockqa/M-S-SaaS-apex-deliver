BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 8dcb6880a52b

DROP TABLE IF EXISTS quality_records CASCADE;

DROP TABLE IF EXISTS sessions CASCADE;

DROP TABLE IF EXISTS ai_insights CASCADE;

DROP TABLE IF EXISTS audit_logs CASCADE;

DROP TABLE IF EXISTS departments CASCADE;

DROP TABLE IF EXISTS products CASCADE;

DROP TABLE IF EXISTS cash_flow_forecasts CASCADE;

DROP TABLE IF EXISTS system_settings CASCADE;

DROP TABLE IF EXISTS _prisma_migrations CASCADE;

DROP TABLE IF EXISTS notifications CASCADE;

DROP TABLE IF EXISTS production_jobs CASCADE;

DROP TABLE IF EXISTS demand_forecasts CASCADE;

DROP TABLE IF EXISTS inventory_items CASCADE;

DROP TABLE IF EXISTS mcp_requests CASCADE;

DROP TABLE IF EXISTS scheduled_jobs CASCADE;

DROP TABLE IF EXISTS dashboards CASCADE;

DROP TABLE IF EXISTS inventory_movements CASCADE;

DROP TABLE IF EXISTS vector_store CASCADE;

DROP TABLE IF EXISTS working_capital CASCADE;

DROP TABLE IF EXISTS data_exports CASCADE;

DROP TABLE IF EXISTS what_if_scenarios CASCADE;

DROP TABLE IF EXISTS organizations CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS "UserRole" CASCADE;

DROP TYPE IF EXISTS "userrole" CASCADE;

CREATE TABLE users (
    id UUID NOT NULL, 
    clerk_user_id VARCHAR NOT NULL, 
    email VARCHAR NOT NULL, 
    first_name VARCHAR, 
    last_name VARCHAR, 
    profile_image_url VARCHAR, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    last_login_at TIMESTAMP WITH TIME ZONE, 
    is_active BOOLEAN DEFAULT 'true' NOT NULL, 
    role VARCHAR(32) DEFAULT 'solo' NOT NULL, 
    organization_id UUID, 
    deleted_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    UNIQUE (clerk_user_id), 
    UNIQUE (email)
);

CREATE UNIQUE INDEX ix_users_clerk_user_id ON users (clerk_user_id);

CREATE UNIQUE INDEX ix_users_email ON users (email);

✅ Database cleaned and users table created for M&A platform
INSERT INTO alembic_version (version_num) VALUES ('8dcb6880a52b') RETURNING alembic_version.version_num;

-- Running upgrade 8dcb6880a52b -> 36b3e62b4148

