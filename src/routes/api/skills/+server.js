import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const registryPath = join(process.cwd(), 'static', 'skills', 'registry.json');
	const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
	return json(registry);
}
