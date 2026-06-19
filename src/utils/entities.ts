interface NamedEntity {
  id: string;
  name: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_PATTERN.test(value.trim());
}

export function resolveEntityId(
  value: string | { id?: string; name?: string } | undefined,
  options: NamedEntity[] = []
): string {
  if (!value) return '';
  if (typeof value === 'object') {
    if (value.id) return resolveEntityId(value.id, options);
    if (value.name) return resolveEntityId(value.name, options);
    return '';
  }

  const trimmed = value.trim();
  const byId = options.find((option) => option.id === trimmed);
  if (byId) return byId.id;

  if (isUuid(trimmed)) return trimmed;

  const normalized = trimmed.toLowerCase();
  const byName = options.find((option) => option.name.trim().toLowerCase() === normalized);
  return byName?.id ?? '';
}

export function resolveEntityIds(
  values: (string | { id?: string; name?: string })[] | undefined,
  options: NamedEntity[]
): string[] {
  if (!values?.length) return [];
  return [...new Set(values.map((value) => resolveEntityId(value, options)).filter(Boolean))];
}

export function filterOptionsByIds<T extends NamedEntity>(options: T[], ids: string[]): T[] {
  if (!ids.length) return options;
  return options.filter((option) => ids.includes(option.id));
}
