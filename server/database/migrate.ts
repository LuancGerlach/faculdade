import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { env, isDatabaseConfigured } from '../config/env.js';
import { productsSeed } from './seed/products.seed.js';

// Migrator no estilo Flyway: aplica V{n}__*.sql em ordem e grava checksum em schema_history
const migrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

async function runMigrations() {
  if (!isDatabaseConfigured) {
    console.error('DATABASE_URL não configurada. Nada a migrar.');
    process.exit(1);
  }

  const sqlClient = neon(env.DATABASE_URL);

  await sqlClient.query(`
    CREATE TABLE IF NOT EXISTS schema_history (
      version     INTEGER PRIMARY KEY,
      script      VARCHAR(200) NOT NULL,
      checksum    VARCHAR(64)  NOT NULL,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )`);

  const appliedMigrations = (await sqlClient.query('SELECT version, checksum FROM schema_history')) as {
    version: number;
    checksum: string;
  }[];
  const appliedChecksumByVersion = new Map(appliedMigrations.map((migration) => [migration.version, migration.checksum]));

  const migrationFiles = readdirSync(migrationsDirectory)
    .filter((fileName) => /^V\d+__.+\.sql$/.test(fileName))
    .sort((firstFile, secondFile) => extractVersion(firstFile) - extractVersion(secondFile));

  for (const migrationFile of migrationFiles) {
    const version = extractVersion(migrationFile);
    const scriptContent = readFileSync(join(migrationsDirectory, migrationFile), 'utf8');
    const checksum = createHash('sha256').update(scriptContent).digest('hex');
    const appliedChecksum = appliedChecksumByVersion.get(version);

    if (appliedChecksum) {
      if (appliedChecksum !== checksum) {
        throw new Error(`Checksum divergente em ${migrationFile}. Não altere migrations aplicadas: crie uma nova versão.`);
      }
      continue;
    }

    const statements = scriptContent.split(';').map((statement) => statement.trim()).filter(Boolean);
    for (const statement of statements) {
      await sqlClient.query(statement);
    }
    await sqlClient.query('INSERT INTO schema_history (version, script, checksum) VALUES ($1, $2, $3)', [
      version,
      migrationFile,
      checksum,
    ]);
    console.log(`Aplicada: ${migrationFile}`);
  }

  await seedProducts(sqlClient);
  console.log('Migrations concluídas.');
}

async function seedProducts(sqlClient: NeonQueryFunction<false, false>) {
  const [{ total }] = (await sqlClient.query('SELECT COUNT(*)::int AS total FROM products')) as { total: number }[];
  if (total > 0) return;

  for (const product of productsSeed) {
    await sqlClient.query(
      `INSERT INTO products (title, type, category, map, price_in_cents, old_price_in_cents, rating,
         reviews_count, sales_count, badge, author, description, modules)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        product.title, product.type, product.category, product.map, product.priceInCents,
        product.oldPriceInCents, product.rating, product.reviewsCount, product.salesCount,
        product.badge, product.author, product.description, JSON.stringify(product.modules),
      ],
    );
  }
  console.log(`Seed: ${productsSeed.length} produtos inseridos.`);
}

function extractVersion(fileName: string) {
  return Number(fileName.match(/^V(\d+)__/)?.[1]);
}

runMigrations().catch((migrationError) => {
  console.error(migrationError);
  process.exit(1);
});
