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
				} catch (ex) {
					return ex;
				}
			},
		};
	} catch (ex) {
		return {
			pass    : false,
			message : () => ex,
		};
	}
}

expect.extend({ equals });

