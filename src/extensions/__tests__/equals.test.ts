import { equals } from '../equals.js';

declare global {
	namespace jest {
		interface Matchers<R> {
			customMatcher<T>(received: T) : R;
		}
	}
}

function customMatcher<T>(received: T, expected: T) : jest.CustomMatcherResult {
	return equals(received, expected);
}

expect.extend({ customMatcher });

const object = { key : 'value' };

describe('src/extensions/equals', () => {
	describe('matcher', () => {
		describe('pass', () => {
			it('should expect object to be equal the same object', () => {
				expect(object).equals({ key : 'value' });
			});

			it('should expect object not to be equal different object', () => {
				expect(object).not.equals({ key : 'value2' });
			});
		});

		describe('fail', () => {
			it('should fail when object is not expected to be equal the same object', () => {
				expect(() => expect(object).not.equals({ key : 'value' })).toThrow();
			});

			it('should fail when object is expected to be equal different object', () => {
				expect(() => expect(object).equals({ key2 : 'value2' })).toThrow();
			});
		});
	});

	describe('extension', () => {
		it('should expect object to be equal the same object', () => {
			expect(object).toEqual(expect.equals({ key : 'value' }));
		});

		it('should expect object not to be equal different object', () => {
			expect(object).not.toEqual(expect.equals({ key2 : 'value2' }));
		});
	});

	describe('default export', () => {
		it('should be used for asserting objects to be equal with built-in "toEqual" jest matcher inside a custom matcher', () => {
			expect(object).customMatcher({ key : 'value' });
			expect(object).not.customMatcher({ key2 : 'value2' });
		});
	});
});
