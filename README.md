# @anmiles/jest-extensions

Extend functions for jest

----

## Installation

`npm install @anmiles/jest-extensions`

## Usage examples

### equals
Checks that object equals another object. Actually exposes built-in `toEqual` matcher.

* matcher
```js
import '@anmiles/jest-extensions';

expect(object).equals(anotherObject);
```

* extension
```js
import '@anmiles/jest-extensions';

expect(spy).toHaveBeenCalledWith(expect.equals(obj));
```

* default export
```js
import { equals } from '@anmiles/jest-extensions';

function customMatcher<T>(received: T, expected: T) : jest.CustomMatcherResult {
	const receivedTransformed = someTransformFunction(received);
	return equals(receivedTransformed, expected);
}
```

### toBeFunction
Checks that function being called with specified arguments will return expected value

* matcher
```js
import '@anmiles/jest-extensions';

expect(func).toBeFunction((arg1, arg2) => expectedReturnValue);
```

* extension
```js
import '@anmiles/jest-extensions';

expect(invoker).toHaveBeenCalledWith(expect.toBeFunction((arg1, arg2) => expectedReturnValue));
```

* default export
```js
import { toBeFunction } from '@anmiles/jest-extensions';

function customMatcher(received: (key: string, value: string) => Record<string, string>, expectedValue: string) : jest.CustomMatcherResult {
	return toBeFunction(received, [ 'key', 'value' ], { key : expectedValue });
}
```

### toEqualStructure
Compares objects with structure properties only (without functions). Type of expected object should not consist of any function-like properties.

* matcher
```js
import '@anmiles/jest-extensions';

expect(obj).toEqualStructure(objWithoutFunctions);
```

* extension
```js
import '@anmiles/jest-extensions';

expect(func).toHaveBeenCalledWith(expect.toEqualStructure(obj));
```

* default export
```js
import { toEqualStructure, Structure } from '@anmiles/jest-extensions';

function customMatcher<T extends Record<any, any>>(received: T, expected: Structure<T>) : jest.CustomMatcherResult {
	return toEqualStructure(received, expected);
}
```

* `toStructure` function
```js
import { toStructure } from '@anmiles/jest-extensions';

const objWithoutFunctions = toStructure(obj);
```


### mockFS
Converts mock file structure to indexed object and provides mock functions for `fs.existsSync` and `fs.readdirSync` in order to test that mock files

```js
import fs from 'fs';
import { FSDir, Files, mockFS } from '@anmiles/jest-extensions';

const fsTree: FSDir = {
	'D:' : {
		name     : 'D:',
		type     : 'dir',
		items    : [
			{
				name     : 'link.lnk',
				type     : 'link',
				target   : 'D:/subdir/target.txt',
			},
			{
				name     : 'logs.log',
				type     : 'file',
				size     : 10,
			},
			{
				name     : 'subdir',
				type     : 'dir',
				items    : [
					{
						name     : 'target.txt',
						type     : 'file',
						size     : 20,
					},
				],
			}
		],
	},
};

const { files, mock } = mockFS(fsTree, sep);
const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation(mock.existsSync);
const readdirSyncSpy = jest.spyOn(fs, 'readdirSync').mockImplementation(mock.readdirSync);

```

