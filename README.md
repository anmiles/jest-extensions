# @anmiles/jest-extensions

Extension functions and utils for jest

----

## Installation

`npm install --save-dev @anmiles/jest-extensions`

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
_Removed in favor of `mock-fs` package._
_Refer to [this diff](https://github.com/anmiles/prototypes/commit/db74a55b223169b99284aa4ff27c7adf1629ff1b#diff-bbb8ca3bbb668a3e236b87fda1f06d7a41dbeed055dbfe6bf1892d7f4fefe49eL433) for example of replacement._
