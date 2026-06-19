export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

export function extractCollection(source: unknown, keys: string[]): UnknownRecord[] {
  if (Array.isArray(source)) return source.filter(isRecord);
  if (!isRecord(source)) return [];

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value.filter(isRecord);
  }

  return [];
}

export function pickString(record: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (isRecord(value)) {
      const nestedId = pickString(value, ['id', '_id']);
      if (nestedId) return nestedId;
    }
  }
  return '';
}

export function normalizeEntities<T extends { id: string; name: string }>(
  source: unknown,
  collectionKeys: string[],
  idKeys: string[],
  nameKeys: string[],
  relationField?: string,
  relationKeys: string[] = []
): T[] {
  return extractCollection(source, collectionKeys)
    .map((row) => {
      const id = pickString(row, idKeys);
      const name = pickString(row, nameKeys);
      const relationId = relationField && relationKeys.length ? pickString(row, relationKeys) : '';

      if (!id || !name) return null;
      return {
        ...row,
        id,
        name,
        ...(relationField && relationId ? { [relationField]: relationId } : {})
      } as T;
    })
    .filter((item): item is T => Boolean(item));
}
