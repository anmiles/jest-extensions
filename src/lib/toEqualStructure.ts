import { equals } from './equals';

export { toEqualStructure, toStructure, Structure };

type Structure<T extends Record<any, any>> = { [K in keyof T]: T[K] extends Function ? never : T[K]};

declare global {
	namespace jest {
		interface Expect {
			toEqualStructure<T extends Record<any, any>>(expected: Structure<T>) : jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			toEqualStructure<T extends Record<any, any>>(expected: Structure<T>) : R;
		}
	}
}

function toEqualStructure<T extends Record<any, any>>(received: T, expected: Structure<T>) : jest.CustomMatcherResult {
	const receivedStructure = toStructure(received);
	return equals(receivedStructure, expected);
}

function toStructure<T extends Record<any, any>>(obj: T): Structure<T> {
	const result = {} as Structure<T>;

	for (const key in obj) {
		switch (typeof obj[key]) {
			case 'function':
				continue;

			case 'object':
				result[key] = toStructure(obj[key]) as any;
				break;

			default:
				result[key] = obj[key];
				break;
		}
	}

	return result;
}

expect.extend({ toEqualStructure });
