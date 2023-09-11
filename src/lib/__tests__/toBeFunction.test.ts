import { toBeFunction } from '../toBeFunction';

declare global {
	namespace jest {
		interface Matchers<R> {
			customMatcher(expectedValue: string) : R;
		}
	}
}

function customMatcher(received: (key: string, value: string) => Record<string, string>, expectedValue: string) : jest.CustomMatcherResult {
	return toBeFunction(received, [ 'key', 'value' ], { key : expectedValue });
}

expect.extend({ customMatcher });

function objectCreator(key: string, value: string): Record<string, string> {
	return { [key] : value };
}

describe('src/lib/toBeFunction', () => {
	describe('matcher', () => {
		describe('pass', () => {
			it('should expect function to return correct value', () => {
				expect(objectCreator).toBeFunction([ 'key', 'value' ], { key : 'value' });
			});

			it('should expect function not to return incorrect value', () => {
				expect(objectCreator).not.toBeFunction([ 'key', 'value' ], { key2 : 'value2' });
			});
		});

		describe('fail', () => {
			it('should fail when function is not expected to return correct value', () => {
				expect(() => expect(objectCreator).not.toBeFunction([ 'key', 'value' ], { key : 'value' })).toThrow();
			});

			it('should fail when function is expected to return incorrect value', () => {
				expect(() => expect(objectCreator).toBeFunction([ 'key', 'value' ], { key2 : 'value2' })).toThrow();
			});
		});

	});

	describe('extension', () => {
		it('should expect function to return correct value', () => {
			expect(objectCreator).toEqual(expect.toBeFunction([ 'key', 'value' ], { key : 'value' }));
		});

		it('should expect function not to return incorrect value', () => {
			expect(objectCreator).not.toEqual(expect.toBeFunction([ 'key', 'value' ], { key2 : 'value2' }));
		});
	});

	describe('default export', () => {
		it('should be used for checking functions inside a custom matcher', () => {
			expect(objectCreator).customMatcher('value');
			expect(objectCreator).not.customMatcher('value2');
		});
	});
});
