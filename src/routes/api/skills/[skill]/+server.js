import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { skill } = params;

	try {
		const skillPath = join(process.cwd(), 'static', 'skills', skill, 'SKILL.md');
		const content = readFileSync(skillPath, 'utf-8');

		return new Response(content, {
			headers: {
				'Content-Type': 'text/markdown'
			}
		});
	} catch (err) {
		throw error(404, `Skill '${skill}' not found`);
	}
}
