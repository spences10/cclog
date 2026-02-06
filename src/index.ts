#!/usr/bin/env bun

if (typeof globalThis.Bun === 'undefined') {
	console.error(
		'ccrecall requires Bun runtime. Install it at https://bun.sh',
	);
	process.exit(1);
}

import { runMain } from 'citty';
import { main } from './cli.ts';

runMain(main);
