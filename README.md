# @anmiles/jest-extensions

Extension functions and utils for jest

----

## Installation

`npm install --save-dev @anmiles/jest-extensions`

## Usage examples

### equals
Checks that object equals another object. Actually exposes built-in `toEqual` matcher.

* matcher
```ts
import '@anmiles/jest-extensions';

expect(object).equals(anotherObject);
```

* extension
```ts
import '@anmiles/jest-extensions';

expect(spy).toHaveBeenCalledWith(expect.equals(obj));
```

* default export
```ts
import { equals } from '@anmiles/jest-extensions';

function customMatcher<T>(received: T, expected: T) : jest.CustomMatcherResult {
	const receivedTransformed = someTransformFunction(received);
	return equals(receivedTransformed, expected);
}
```

### toBeFunction
Checks that function being called with specified arguments will return expected value

* matcher
```ts
import '@anmiles/jest-extensions';

expect(func).toBeFunction((arg1, arg2) => expectedReturnValue);
```

* extension
```ts
import '@anmiles/jest-extensions';

expect(invoker).toHaveBeenCalledWith(expect.toBeFunction((arg1, arg2) => expectedReturnValue));
```

* default export
```ts
import { toBeFunction } from '@anmiles/jest-extensions';

function customMatcher(received: (key: string, value: string) => Record<string, string>, expectedValue: string) : jest.CustomMatcherResult {
	return toBeFunction(received, [ 'key', 'value' ], { key : expectedValue });
}
```

### toEqualStructure
Compares objects with structure properties only (without functions). Type of expected object should not consist of any function-like properties.

* matcher
```ts
import '@anmiles/jest-extensions';

expect(obj).toEqualStructure(objWithoutFunctions);
```

* extension
```ts
import '@anmiles/jest-extensions';

expect(func).toHaveBeenCalledWith(expect.toEqualStructure(obj));
```

* default export
```ts
import { toEqualStructure, Structure } from '@anmiles/jest-extensions';

function customMatcher<T extends Record<any, any>>(received: T, expected: Structure<T>) : jest.CustomMatcherResult {
	return toEqualStructure(received, expected);
}
```

* `toStructure` function
```ts
import { toStructure } from '@anmiles/jest-extensions';

const objWithoutFunctions = toStructure(obj);
```

### toMatchFiles
Reads directory recursively and compares the list of files and their contents with expected object.

* matcher
```ts
import '@anmiles/jest-extensions';

expect(dirPath).toMatchFiles({ 'file': 'content', 'subdir/file2': 'content2' });
```

* extension
```ts
import '@anmiles/jest-extensions';

expect(targetDir).toEqual(expect.toMatchFiles({ 'file': 'content', 'subdir/file2': 'content2' }));
```

* default export
```ts
import { toMatchFiles } from '@anmiles/jest-extensions';

function customMatcher<T extends string>(directoryPath: T, expected: Record<T, string>): jest.CustomMatcherResult {
	return toMatchFiles(directoryPath, expected);
}
```

### mockPartial
Mimics partial type as an underlying type when need to mock object with only part of required properties.
Do not expects required properties to be specified, but type-check any specified properties to match original type.
_This is not type-safe and should be used only in tests._

```ts
import { mockPartial } from '@anmiles/jest-extensions';

type TestType = {
	requiredStr: string;
	requiredNum: number;
	optionalBool?: boolean;
};

// Valid: only one required property specified, but specified correctly
const partial1: TestType = mockPartial<TestType>({
	requiredStr: 'test',
});

// Valid: no required properties specified
const partial2: TestType = mockPartial<TestType>({});

// Not valid: unknown properties specified
const partial3: TestType = mockPartial<TestType>({
	unknownProp: 'value',
});

// Not valid: known properties of wrong type specified 
const partial3: TestType = mockPartial<TestType>({
	requiredStr: 5,
});
```

### mockFS
_Removed in favor of `mock-fs` package._
_Refer to [this diff](https://github.com/anmiles/prototypes/commit/db74a55b223169b99284aa4ff27c7adf1629ff1b#diff-bbb8ca3bbb668a3e236b87fda1f06d7a41dbeed055dbfe6bf1892d7f4fefe49eL433) for example of replacement._
