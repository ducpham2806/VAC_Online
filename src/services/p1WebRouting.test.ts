import { describe, expect, it } from 'vitest';
import { p1GodotRedirect } from './p1WebRouting';

const request = (path: string, method = 'GET') => new Request('https://vac.example' + path, { method });

describe('P1 Web cutover', () => {
  it.each(['/?p1', '/?p1=', '/?p1=1'])('redirects %s temporarily on the same origin', path => {
    const response = p1GodotRedirect(request(path), true);
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe('/godot/index.html');
    expect(response?.headers.get('cache-control')).toBe('no-store');
  });

  it.each([
    '/', '/?offline', '/?p1&offline', '/?p1&offline=false', '/?p1&client=phaser',
    '/?client=godot&p1&client=phaser', '/godot/index.html?p1', '/godot/index.wasm',
  ])('leaves %s at its existing destination', path => {
    expect(p1GodotRedirect(request(path), true)).toBeUndefined();
  });

  it('allows GET and HEAD only and restores Phaser when disabled', () => {
    expect(p1GodotRedirect(request('/?p1', 'HEAD'), true)?.status).toBe(307);
    expect(p1GodotRedirect(request('/?p1', 'POST'), true)).toBeUndefined();
    expect(p1GodotRedirect(request('/?p1'), false)).toBeUndefined();
  });
});
