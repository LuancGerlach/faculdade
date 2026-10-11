// localStorage pode lançar exceção (aba anônima, bloqueio): sempre protegido
export function readStorage(storageKey, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function writeStorage(storageKey, value) {
  try {
    if (value === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    /* sem persistência: segue só em memória */
  }
}
