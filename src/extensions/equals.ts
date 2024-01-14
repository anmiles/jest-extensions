export { equals };

declare global {
	namespace jest {
		interface Expect {
			equals<T>(expected: T) : jest.CustomMatcherResult;
		}
		interface Matchers<R> {
			equals<T>(expected: T) : R;
		}
	}
}

function equals<T>(received: T, expected: T) : jest.CustomMatcherResult {
	try {
		expect(received).toEqual(expected);

		return {
			pass    : true,
			message : () => {
				try {
					expect(received).not.toEqual(expected);
					/* istanbul ignore next */
					return '';
				} catch (ex) {
					return ex as string;
				}
			},
		};
	} catch (ex) {
		return {
			pass    : false,
			message : () => ex as string,
		};
	}
}

expect.extend({ equals });

