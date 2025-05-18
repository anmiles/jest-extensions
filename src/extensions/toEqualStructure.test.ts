import { equals } from './equals.test';

export type Structure<T extends object> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };

declare global {
	namespace jest {
		interface Expect {
			toEqualStructure<T extends object>(expected: Structure<T>): jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			toEqualStructure<T extends object>(expected: Structure<T>): R;
		}
	}
}

export function toEqualStructure<T extends object>(received: T, expected: Structure<T>): jest.CustomMatcherResult {
	const receivedStructure = toStructure(received);
	return equals(receivedStructure, expected);
}

export function toStructure<T extends object>(obj: T): Structure<T> {
	const result = {} as Structure<T>; // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion

	for (const key in obj as Structure<T>) {
		const value = obj[key];

		if (value === null || value === undefined) {
			result[key] = value;
		} else if (typeof value === 'object') {
			result[key] = toStructure(value) as T[Extract<keyof Structure<T>, string>]; // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
		} else if (typeof value !== 'function') {
			result[key] = value;
		}
	}

	return result;
}

expect.extend({ toEqualStructure });
