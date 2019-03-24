import _ from 'lodash';


export function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {}

Scope.prototype.$watch = function (watchFn, listenerFn) {
    const watcher = {
        watchFn,
        listenerFn: listenerFn || (() => {}),
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
        if (newValue !== oldValue) {
            self.$$lastDirtyWatch = watcher;
            watcher.last = newValue;
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