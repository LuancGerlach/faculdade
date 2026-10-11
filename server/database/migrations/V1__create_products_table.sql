CREATE TABLE IF NOT EXISTS products (
    id                  SERIAL PRIMARY KEY,
    title               VARCHAR(160) NOT NULL,
    type                VARCHAR(20)  NOT NULL,
    category            VARCHAR(60)  NOT NULL,
    map                 VARCHAR(40),
    price_in_cents      INTEGER      NOT NULL,
    old_price_in_cents  INTEGER,
    rating              REAL         NOT NULL DEFAULT 0,
    reviews_count       INTEGER      NOT NULL DEFAULT 0,
    sales_count         INTEGER      NOT NULL DEFAULT 0,
    badge               VARCHAR(10),
    author              VARCHAR(80)  NOT NULL,
    description         TEXT         NOT NULL,
    modules             JSONB        NOT NULL DEFAULT '[]'::jsonb,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_type ON products (type);
