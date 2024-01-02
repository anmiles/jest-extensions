import '../../extensions/toBeFunction';
import { FSDir, mockFS } from '../fs';

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
			const { files } = mockFS(fsTree, '/');

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
			const { mock } = mockFS(fsTree, '/');

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

			expect(mock.readdirSync('D:/logs.log')).toEqual([]);
		});
	});
});
