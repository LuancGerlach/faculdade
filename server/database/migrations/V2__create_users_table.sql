CREATE TABLE IF NOT EXISTS users (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(120) NOT NULL,
    email          VARCHAR(160) NOT NULL UNIQUE,
    cpf            VARCHAR(11)  NOT NULL UNIQUE,
    password_hash  VARCHAR(100) NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
