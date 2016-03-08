///<reference path='../types/DefinitelyTyped/jasmine/jasmine.d.ts'/> 

describe('TESTING THAT JASMINE WORKS: 1st tests', () => {
	it('true is true', () => expect(true).toEqual(true));
});

it('JASMINE SEEMS TO BE FINE: true is true', () => expect(true).toEqual(true));

it('JASMINE SEEMS TO BE FINE: null is not the same thing as undefined',
  () => expect(null).not.toEqual(undefined)
);