export function formatTestType(type?: string) {
  if (type === 'pyq') return 'PYQ';
  if (type === 'mocktest') return 'Mock Test';
  return 'Chapter Wise';
}
