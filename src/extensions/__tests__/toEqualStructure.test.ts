import type { Structure } from '../toEqualStructure';
import { toEqualStructure, toStructure } from '../toEqualStructure';

declare global {
	namespace jest {
		interface Matchers<R> {
			customMatcher<T extends object>(expectedValue: Structure<T>) : R;
		}
	}
}

function customMatcher<T extends object>(received: T, expected: Structure<T>) : jest.CustomMatcherResult {
	return toEqualStructure(received, expected);
}

expect.extend({ customMatcher });

const srcObject = {
	key     : 'value',
	func    : () => 1,
	count   : 1,
	nullKey : null,
	nested  : {
		key2   : 'value2',
		func   : () => 2,
		count2 : 2,
		undef  : undefined,
	},
};

const dstObject = {
	key     : 'value',
	count   : 1,
	nullKey : null,
	nested  : {
		key2   : 'value2',
		count2 : 2,
		undef  : undefined,
	},
};

describe('src/extensions/toEqualStructure', () => {
	describe('matcher', () => {
		describe('pass', () => {
			it('should expect object without functions to equal its correct non-function copy', () => {
				expect(srcObject).toEqualStructure(dstObject);
			});

			it('should not expect object without functions to equal its incorrect non-function copy', () => {
				expect(srcObject).not.toEqualStructure({ ...dstObject, newKey : 'newValue' });
			});
		});

		describe('fail', () => {
			it('should fail when object is not expected to equal its correct non-function copy', () => {
				expect(() => {
					expect(srcObject).not.toEqualStructure(dstObject);
				}).toThrow();
			});

			it('should fail when object is expected to equal its incorrect non-function copy', () => {
				expect(() => {
					expect(srcObject).toEqualStructure({ ...dstObject, newKey : 'newValue' });
				}).toThrow();
			});
		});

	});

	describe('extension', () => {
		it('should expect function to return correct value', () => {
			expect(srcObject).toEqual(expect.toEqualStructure(dstObject));
		});

		it('should expect function not to return incorrect value', () => {
			expect(srcObject).not.toEqual(expect.toEqualStructure({ ...dstObject, newKey : 'newValue' }));
		});
	});

	describe('default export', () => {
		it('should be used for checking functions inside a custom matcher', () => {
			expect(srcObject).customMatcher(dstObject);
			expect(srcObject).not.customMatcher({ ...dstObject, newKey : 'newValue' });
		});
	});

	describe('toStructure', () => {
		it('should recursively exclude functions from object', () => {
			expect(toStructure(srcObject)).toEqual(dstObject);
		});
	});
});
