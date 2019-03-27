import _ from 'lodash';


export function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {}

Scope.prototype.$$areEqual = function (newValue, oldValue, valueEq) {
    if (valueEq) {
        return _.isEqual(newValue, oldValue);
    } else {
        return newValue === oldValue ||
            (typeof oldValue === 'number' && typeof newValue === 'number' &&
                isNaN(oldValue) && isNaN(newValue));
    }
}

Scope.prototype.$watch = function (watchFn, listenerFn, valueEq) {
    const watcher = {
        watchFn,
        listenerFn: listenerFn || (() => {}),
        valueEq: !!valueEq,
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
}

Scope.prototype.$digest = function () {
    let ttl = 10; //time to live
    let dirty;
    this.$$lastDirtyWatch = null;

    do {
        dirty = this.$$digestOnce();
        if (dirty && (ttl--) === 0) {
            throw '10 digest iterations reached';
        }

    } while (dirty);
}

Scope.prototype.$$digestOnce = function () {
    const self = this;
    let dirty = null;
    _.forEach(this.$$watchers, watcher => {
        let newValue = watcher.watchFn(self);
        let oldValue = watcher.last;
        if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
            self.$$lastDirtyWatch = watcher;
            watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
            watcher.listenerFn(newValue,
                oldValue === initWatchVal ? newValue : oldValue,
                self
            );
            dirty = true;
        } else if (self.$$lastDirtyWatch === watcher) {
            return false;
        }
    });
    return dirty;
}