'use stric';

import {
    Scope
} from '../src/scope';

describe('Scope', () => {

    it('can be construct and used as an object', () => {
        const scope = new Scope();
        scope.aProperty = 1;

        expect(scope.aProperty).toBe(1);
    });

    describe('digest', () => {
        let scope;

        beforeEach(() => {
            scope = new Scope();
        });

        it('calls the listener function of a watch on first $digest', () => {
            const watchFn = () => 'wat';
            const listenerFn = jest.fn()
            scope.$watch(watchFn, listenerFn);
            scope.$digest();

            expect(listenerFn).toBeCalled();
        });

        it('calls the watch function with the scope as an argument ', () => {
            const watchFn = jest.fn();
            const listenerFn = jest.fn();
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(watchFn).toBeCalledWith(scope);
        });

        it('call the listener function when the watched value changes', () => {
            scope.someValue = 'a';
            scope.counter = 0;

            scope.$watch(
                function (scope) {
                    return scope.someValue
                },
                function (newValue, oldValue, scope) {
                    scope.counter++
                }
            );

            expect(scope.counter).toBe(0);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.someValue = 'b'
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(2);
        });

        it('calls listener when watch value is first undefined', () => {
            scope.counter = 0;

            scope.$watch(
                function (scope) {
                    return scope.someValue
                },
                function (newValue, oldValue, scope) {
                    scope.counter++
                }
            );

            scope.$digest();
            expect(scope.counter).toBe(1);
        });

    });

});