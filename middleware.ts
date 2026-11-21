import { next } from '@vercel/functions';
import { p1GodotRedirect } from './src/services/p1WebRouting';

export const config = { matcher: ['/'] };

export default function middleware(request: Request): Response {
  return p1GodotRedirect(request, process.env.VAC_P1_GODOT_CUTOVER === '1') ?? next();
}
