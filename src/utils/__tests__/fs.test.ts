import '../../extensions/toBeFunction';
import { type FSDir, mockFS } from '../fs.js';

const fsTree: FSDir = {
	name  : 'D:',
	type  : 'dir',
	items : [
		{
			name   : 'link.lnk',
			type   : 'link',
			target : 'D:/subdir/target.txt',
		},
		{
			name : 'logs.log',
			type : 'file',
			size : 10,
		}, {
			name  : 'subdir',
			type  : 'dir',
			items : [
				{
					name : 'target.txt',
					type : 'file',
					size : 20,
				},
			],
		}, {
			name : 'subdir2',
			type : 'dir',
		},
	],
};

describe('fs.utils', () => {
	describe('mockFS', () => {
		it('should generate correct files object', () => {
			const { files } = mockFS([ fsTree ], '/');

			expect(files).toEqual({
				'D:' : {
					name     : 'D:',
					fullName : 'D:',
					type     : 'dir',
					items    : [
						{
							name     : 'link.lnk',
							fullName : 'D:/link.lnk',
							type     : 'link',
							target   : 'D:/subdir/target.txt',
						},
						{
							name     : 'logs.log',
							fullName : 'D:/logs.log',
							type     : 'file',
							size     : 10,
						},
						{
							name     : 'subdir',
							fullName : 'D:/subdir',
							type     : 'dir',
							items    : [
								{
									name     : 'target.txt',
									fullName : 'D:/subdir/target.txt',
									type     : 'file',
									size     : 20,
								},
							],
						},
						{
							name     : 'subdir2',
							fullName : 'D:/subdir2',
							type     : 'dir',
							items    : undefined,
						},
					],
				},
				'D:/link.lnk' : {
					name     : 'link.lnk',
					fullName : 'D:/link.lnk',
					type     : 'link',
					target   : 'D:/subdir/target.txt',
				},
				'D:/logs.log' : {
					name     : 'logs.log',
					fullName : 'D:/logs.log',
					type     : 'file',
					size     : 10,
				},
				'D:/subdir' : {
					name     : 'subdir',
					fullName : 'D:/subdir',
					type     : 'dir',
					items    : [
						{
							name     : 'target.txt',
							fullName : 'D:/subdir/target.txt',
							type     : 'file',
							size     : 20,
						},
					],
				},
				'D:/subdir2' : {
					name     : 'subdir2',
					fullName : 'D:/subdir2',
					type     : 'dir',
					items    : undefined,
				},
				'D:/subdir/target.txt' : {
					name     : 'target.txt',
					fullName : 'D:/subdir/target.txt',
					type     : 'file',
					size     : 20,
				},
			});
		});

		it('should generate correct mock functions', () => {
			const { mock } = mockFS([ fsTree ], '/');

			expect(mock.existsSync('D:/subdir')).toBe(true);
			expect(mock.existsSync('D:/wrongpath')).toBe(false);

			expect(mock.readdirSync('D:')).toEqual([
				'link.lnk',
				'logs.log',
				'subdir',
				'subdir2',
			]);

			expect(mock.readdirSync('D:', null)).toEqual([
				'link.lnk',
				'logs.log',
				'subdir',
				'subdir2',
			]);

			expect(mock.readdirSync('D:', {})).toEqual([
				'link.lnk',
				'logs.log',
				'subdir',
				'subdir2',
			]);

			expect(mock.readdirSync('D:', 'ascii')).toEqual([
				'link.lnk',
				'logs.log',
				'subdir',
				'subdir2',
			]);

			expect(mock.readdirSync('D:/subdir2')).toEqual([]);

			expect(mock.readdirSync('D:', { withFileTypes : true })).toEqual([
				{
					name           : 'link.lnk',
					isDirectory    : expect.toBeFunction([], false),
					isFile         : expect.toBeFunction([], false),
					isSymbolicLink : expect.toBeFunction([], true),
				},
				{
					name           : 'logs.log',
					isDirectory    : expect.toBeFunction([], false),
					isFile         : expect.toBeFunction([], true),
					isSymbolicLink : expect.toBeFunction([], false),
				},
				{
					name           : 'subdir',
					isDirectory    : expect.toBeFunction([], true),
					isFile         : expect.toBeFunction([], false),
					isSymbolicLink : expect.toBeFunction([], false),
				},
				{
					name           : 'subdir2',
					isDirectory    : expect.toBeFunction([], true),
					isFile         : expect.toBeFunction([], false),
					isSymbolicLink : expect.toBeFunction([], false),
				},
			]);
		});

		it('should generate multiple trees', () => {
			const fsTrees: FSDir[] = [
				{
					name  : 'C:',
					type  : 'dir',
					items : [ {
						name : 'pagefile.sys',
						type : 'file',
						size : 1000,
					} ],
				},

				{
					name  : 'D:',
					type  : 'dir',
					items : [ {
						name : 'src',
						type : 'dir',
					} ],
				},
			];

			expect(mockFS(fsTrees, '\\').files).toEqual({
				'C:' : {
					name     : 'C:',
					fullName : 'C:',
					type     : 'dir',
					items    : [
						{
							name     : 'pagefile.sys',
							fullName : 'C:\\pagefile.sys',
							type     : 'file',
							size     : 1000,
						},
					],
				},
				'C:\\pagefile.sys' : {
					name     : 'pagefile.sys',
					fullName : 'C:\\pagefile.sys',
					type     : 'file',
					size     : 1000,
				},
				'D:' : {
					name     : 'D:',
					fullName : 'D:',
					type     : 'dir',
					items    : [
						{
							name     : 'src',
							fullName : 'D:\\src',
							type     : 'dir',
							items    : undefined,
						},
					],
				},
				'D:\\src' : {
					name     : 'src',
					fullName : 'D:\\src',
					type     : 'dir',
					items    : undefined,
				},
			});
		});

		it('should throw if trying to read directory that not in the tree', () => {
			const { mock } = mockFS([ fsTree ], '/');

			expect(() => mock.readdirSync('D:/wrong/path')).toThrow('Mock directory D:/wrong/path does not exist');
		});

		it('should throw if trying to read directory that is file in the tree', () => {
			const { mock } = mockFS([ fsTree ], '/');

			expect(() => mock.readdirSync('D:/subdir/target.txt')).toThrow('Mock directory D:/subdir/target.txt is a file in the mock tree');
		});
	});
});
