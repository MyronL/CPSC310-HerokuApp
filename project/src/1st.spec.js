///<reference path='../types/DefinitelyTyped/jasmine/jasmine.d.ts'/> 
describe('TESTING THAT JASMINE WORKS: 1st tests', function () {
    it('true is true', function () { return expect(true).toEqual(true); });
});
it('JASMINE SEEMS TO BE FINE: true is true', function () { return expect(true).toEqual(true); });
it('JASMINE SEEMS TO BE FINE: null is not the same thing as undefined', function () { return expect(null).not.toEqual(undefined); });
