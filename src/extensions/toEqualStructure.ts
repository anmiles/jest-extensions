import { equals } from './equals';

// eslint-disable-next-line @typescript-eslint/ban-types -- allow filtering any function-like types, even class constructors
type Structure<T extends object> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };

declare global {
	namespace jest {
		interface Expect {
			toEqualStructure<T extends object>(expected: Structure<T>) : jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			toEqualStructure<T extends object>(expected: Structure<T>) : R;
		}
	}
}

function toEqualStructure<T extends object>(received: T, expected: Structure<T>) : jest.CustomMatcherResult {
	const receivedStructure = toStructure(received);
	return equals(receivedStructure, expected);
}

function toStructure<T extends object>(obj: T): Structure<T> {
	const result = {} as Structure<T>;

	for (const key in obj as Structure<T>) {
		const value = obj[key];

		if (value === null || value === undefined) {
			result[key] = value;
		} else if (typeof value === 'object') {
			result[key] = toStructure(value) as T[Extract<keyof Structure<T>, string>];
		} else if (typeof value !== 'function') {
			result[key] = value;
		}
	}

	return result;
}

expect.extend({ toEqualStructure });

export { toEqualStructure, toStructure };
export type { Structure };
