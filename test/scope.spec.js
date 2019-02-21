'use stric';

import {
    Scope
} from '../src/scope';

describe('Scope', () => {
    var scope;

    beforeEach(() => {
        scope = new Scope();
    });

    it('can be construct and used as an object', () => {
        const scope = new Scope();
        scope.aProperty = 1;

        expect(scope.aProperty).toBe(1);
    });

    it('calls the listener function of a watch on first $digest', () => {
        const watchFn = () => 'wat';
        const listenerFn = jest.fn()
        scope.$watch(watchFn, listenerFn);
        scope.$digest();

        expect(listenerFn).toBeCalled();
    });
});