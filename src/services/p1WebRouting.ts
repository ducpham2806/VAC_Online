/** LT-14: only the online P1 entry point is eligible for the Godot cutover. */
export function p1GodotRedirect(request: Request, enabled: boolean): Response | undefined {
  if (!enabled || (request.method !== 'GET' && request.method !== 'HEAD')) return;

  const { pathname, searchParams } = new URL(request.url);
  if (pathname !== '/' || !searchParams.has('p1') || searchParams.has('offline')
    || searchParams.getAll('client').includes('phaser')) return;

  return new Response(null, {
    status: 307,
    headers: { Location: '/godot/index.html', 'Cache-Control': 'no-store' },
  });
}
