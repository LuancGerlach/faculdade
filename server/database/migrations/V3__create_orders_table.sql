CREATE TABLE IF NOT EXISTS orders (
    id                  SERIAL PRIMARY KEY,
    code                VARCHAR(20)  NOT NULL UNIQUE,
    user_id             INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status              VARCHAR(20)  NOT NULL,
    payment_method      VARCHAR(20)  NOT NULL,
    subtotal_in_cents   INTEGER      NOT NULL,
    discount_in_cents   INTEGER      NOT NULL DEFAULT 0,
    total_in_cents      INTEGER      NOT NULL,
    items               JSONB        NOT NULL,
    email_sent_count    INTEGER      NOT NULL DEFAULT 1,
    last_email_sent_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
