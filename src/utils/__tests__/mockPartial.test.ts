import { mockPartial } from '../mockPartial';

describe('src/utils/partial', () => {
	describe('partial', () => {
		it('should mimic partial type as an underlying type', () => {
			type TestType = {
				requiredStr: string;
				requiredNum: number;
				optionalBool?: boolean;
			};

			const partial: TestType = mockPartial<TestType>({
				requiredStr: 'test',
			});

			expect(partial).toEqual({ requiredStr: 'test' });
		});
	});
});
