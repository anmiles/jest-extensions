import mockFs from 'mock-fs';

import { toMatchFiles } from '../toMatchFiles.test';

declare global {
	namespace jest {
		interface Matchers<R> {
			toMatchFiles<T extends string>(expected: Record<T, string>): R;
		}
	}
}

function customMatcher<T extends string>(directoryPath: T, expected: Record<T, string>): jest.CustomMatcherResult {
	return toMatchFiles(directoryPath, expected);
}

expect.extend({ customMatcher });

beforeEach(() => {
	mockFs({
		matchFiles: {
			file1: 'content1',
			dir2 : {
				file3: 'content3',
			},
		},
	});
});

afterAll(() => {
	mockFs.restore();
});

describe('src/extensions/toMatchFiles', () => {
	describe('matcher', () => {
		describe('pass', () => {
			it('should expect directory to match files and their content', () => {
				expect('matchFiles').toMatchFiles({
					'matchFiles/file1'     : 'content1',
					'matchFiles/dir2/file3': 'content3',
				});
			});

			it('should expect directory not to match unexpected files', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/file1'          : 'content1',
					'matchFiles/dir2/file3'     : 'content3',
					'matchFiles/unexpected-file': 'unexpected-content',
				});
			});

			it('should expect directory not to match missing files', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/dir2/file3': 'content3',
				});
			});

			it('should expect directory not to match files with unexpected content', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/file1'     : 'content1',
					'matchFiles/dir2/file3': 'unexpected-content',
				});
			});

			it('should expect empty directory to match empty files', () => {
				mockFs({
					matchFiles: {},
				});
				expect('matchFiles').toMatchFiles({});
			});

			it('should expect non-existing directory to match empty files', () => {
				mockFs({});
				expect('matchFiles').toMatchFiles({});
			});
		});

		describe('fail', () => {
			it('should fail if directory is not expected to match files and their content', () => {
				expect('matchFiles').toMatchFiles({
					'matchFiles/file1'     : 'content1',
					'matchFiles/dir2/file3': 'content3',
				});
			});

			it('should fail if directory is expected to match unexpected files', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/file1'          : 'content1',
					'matchFiles/dir2/file3'     : 'content3',
					'matchFiles/unexpected-file': 'unexpected-content',
				});
			});

			it('should fail if directory is expected to match missing files', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/dir2/file3': 'content3',
				});
			});

			it('should fail if directory is expected to match files with unexpected content', () => {
				expect('matchFiles').not.toMatchFiles({
					'matchFiles/file1'     : 'content1',
					'matchFiles/dir2/file3': 'unexpected-content',
				});
			});

			it('should fail if empty directory is not expected to match empty files', () => {
				mockFs({
					matchFiles: {},
				});
				expect('matchFiles').toMatchFiles({});
			});

			it('should fail if non-existing directory is not expected to match empty files', () => {
				mockFs({});
				expect('matchFiles').toMatchFiles({});
			});
		});

	});

	describe('extension', () => {
		it('should expect directory to contain expected files with expected content', () => {
			expect('matchFiles').toEqual(expect.toMatchFiles({
				'matchFiles/file1'     : 'content1',
				'matchFiles/dir2/file3': 'content3',
			}));
		});

		it('should expect directory not to contain unexpected files', () => {
			expect('matchFiles').not.toMatchFiles({
				'matchFiles/dir2/file3': 'content3',
			});
		});
	});

	describe('default export', () => {
		it('should be used for checking directories inside a custom matcher', () => {
			expect('matchFiles').customMatcher({
				'matchFiles/file1'     : 'content1',
				'matchFiles/dir2/file3': 'content3',
			});
			expect('matchFiles').not.customMatcher({
				'matchFiles/dir2/file3': 'content3',
			});
		});
	});
});
