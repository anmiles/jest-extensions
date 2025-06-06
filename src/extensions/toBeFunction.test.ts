import { equals } from './equals.test';

declare global {
	namespace jest {
		interface Expect {
			toBeFunction<P, V>(args: P[], expectedReturnValue: V): jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			toBeFunction<P, V>(args: P[], expectedReturnValue: V): R;
		}
	}
}

export function toBeFunction<P, V>(received: (...args: P[])=> V, args: P[], expectedReturnValue: V): jest.CustomMatcherResult {
	const receivedReturnValue = received(...args);
	return equals(receivedReturnValue, expectedReturnValue);
}

expect.extend({ toBeFunction });
