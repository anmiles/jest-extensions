type PartialDeep<T> = {
	[P in keyof T]?: T[P] extends object
		? T[P] extends Function
			? T[P]
			: PartialDeep<T[P]>
		: T[P];
};

export function mockPartial<T>(partial: PartialDeep<T>): T {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return partial as T;
}
