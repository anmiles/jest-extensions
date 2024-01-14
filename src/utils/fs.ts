import fs from 'fs';
import path from 'path';

export { mockFS };
export type { FSItem, FSFile, FSLink, FSDir, Files };

type FSItem<Full extends boolean = false> = { name: string, type: 'file' | 'link' | 'dir' } & (Full extends true ? { fullName: string} : {});
type FSFile<Full extends boolean> = FSItem<Full> & { type: 'file', size: number };
type FSLink<Full extends boolean> = FSItem<Full> & { type: 'link', target: string };
type FSDir<Full extends boolean = false> = FSItem<Full> & { type: 'dir', items?: (FSDir<Full> | FSFile<Full> | FSLink<Full>)[] };

type Files = Record<string, FSFile<true> | FSDir<true> | FSLink<true>>;

function processItem<TItem extends FSFile<false> | FSDir<false> | FSLink<false>>(item: TItem, sep: typeof path.sep, files: Files, prefix?: string): FSFile<true> | FSDir<true> | FSLink<true> {
	const fullName = prefix ? `${prefix}${sep}${item.name}` : item.name;

	if (item.type === 'dir') {
		const items = item.items?.map((childItem) => processItem(childItem, sep, files, fullName));
		return files[fullName] = { ...item, items, fullName };
	} else {
		return files[fullName] = { ...item, fullName };
	}
}

function mockFS(fsTrees: FSDir<false>[], sep: typeof path.sep): {
	files: Files,
	mock: {
		existsSync: typeof fs.existsSync,
		readdirSync: <T extends boolean>(path: fs.PathLike, options?: { withFileTypes?: T; } | Parameters<typeof fs.readdirSync>[1]['encoding']) => ReturnType<typeof fs.readdirSync>,
	}
} {
	const files: Files = {};
	fsTrees.forEach((fsTree) => processItem(fsTree, sep, files));

	return {
		files,
		mock : {
			existsSync  : (path: fs.PathLike) => Object.keys(files).includes(path.toString()),
			readdirSync : <T extends boolean>(path: fs.PathLike, options?: { withFileTypes?: T; } | Parameters<typeof fs.readdirSync>[1]['encoding']) => {
				const fsDir = files[path.toString()];

				if (!fsDir) {
					throw `Mock directory ${path} does not exist`;
				}

				if (fsDir.type !== 'dir') {
					throw `Mock directory ${path} is a ${fsDir.type} in the mock tree`;
				}

				const result = fsDir.items
					?.filter((item) => item.fullName in files)
					.map((item) => {
						if (typeof options !== 'object' || !options?.withFileTypes) {
							return item.name;
						}

						return {
							name           : item.name,
							isFile         : () => files[item.fullName]!.type === 'file',
							isDirectory    : () => files[item.fullName]!.type === 'dir',
							isSymbolicLink : () => files[item.fullName]!.type === 'link',
						};
					})
					.filter((item) => item) ?? [];

				return result as ReturnType<typeof fs.readdirSync>;
			},
		},
	};
}
