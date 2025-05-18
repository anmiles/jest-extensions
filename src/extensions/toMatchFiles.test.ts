import fs from 'fs';

import '@anmiles/prototypes';

import { equals } from './equals.test';

declare global {
	namespace jest {
		interface Expect {
			toMatchFiles<T extends string>(expected: Record<T, string>): jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			toMatchFiles<T extends string>(expected: Record<T, string>): R;
		}
	}
}

export function toMatchFiles<T extends string>(directoryPath: T, expected: Record<T, string>): jest.CustomMatcherResult {
	const received: Record<string, string> = {};

	fs.recurse(directoryPath.replaceAll('\\', '/'), {
		file: (filePath) => {
			received[filePath] = fs.readFileSync(filePath).toString();
		},
	}, {
		sep: '/',
	});

	const posixExpected = Object.fromEntries(
		Object.entries(expected)
			.map(([ filePath, content ]) => [ filePath.replaceAll('\\', '/'), content ]),
	);

	return equals(received, posixExpected);
}

expect.extend({ toMatchFiles });
