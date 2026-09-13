/** Shared inline vectors keep catalog, search and details visually consistent. */
export function badgeIcon(kind: 'bestseller' | 'must-try') {
  const path =
    kind === 'bestseller'
      ? 'M12 2.5 14.9 8.4 21.4 9.3 16.7 13.9 17.8 20.4 12 17.3 6.2 20.4 7.3 13.9 2.6 9.3 9.1 8.4Z'
      : 'M8 10 12 3h1a2 2 0 0 1 2 2l-1 5h5a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1H8ZM3 10h5v10H3Z';
  return `<svg class="badge-icon" width="14" height="14" viewBox="0 0 24 24" fill="${kind === 'bestseller' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
}
