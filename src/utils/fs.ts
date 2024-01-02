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
		const items     = item.items?.map((childItem) => processItem(childItem, sep, files, fullName));
		files[fullName] = { ...item, items, fullName };
	} else {
		files[fullName] = { ...item, fullName };
	}

	return files[fullName];
}

function mockFS(fsTree: FSDir<false>, sep: typeof path.sep): {
	files: Files,
	mock: {
		existsSync: typeof fs.existsSync,
		readdirSync: <T extends boolean>(path: fs.PathLike, options?: { withFileTypes?: T; } | Parameters<typeof fs.readdirSync>[1]['encoding']) => ReturnType<typeof fs.readdirSync>,
	}
} {
	const files: Files = {};
	processItem(fsTree, sep, files);

	return {
		files,
		mock : {
			existsSync  : (path: fs.PathLike) => Object.keys(files).includes(path.toString()),
			readdirSync : <T extends boolean>(path: fs.PathLike, options?: { withFileTypes?: T; } | Parameters<typeof fs.readdirSync>[1]['encoding']) => {
				const fsDir = files[path.toString()];

				if (fsDir.type !== 'dir') {
					return [];
				}

				const result = fsDir.items?.map((item) => typeof options === 'object' && options?.withFileTypes ? {
					name           : item.name,
					isFile         : () => files[item.fullName].type === 'file',
					isDirectory    : () => files[item.fullName].type === 'dir',
					isSymbolicLink : () => files[item.fullName].type === 'link',
				} : item.name) ?? [];

				return result as ReturnType<typeof fs.readdirSync>;
			},
		},
	};
}
