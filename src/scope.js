export function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {}

Scope.prototype.$watch = function (watchFn, listenerFn) {
    const watcher = {
        watchFn,
        listenerFn,
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
}

Scope.prototype.$digest = function () {
    const self = this;
    this.$$watchers.forEach(watcher => {
        let newValue = watcher.watchFn(self);
        let oldValue = watcher.last;
        if (newValue !== oldValue) {
            watcher.last = newValue;
            watcher.listenerFn(newValue,
                oldValue === initWatchVal ? newValue : oldValue,
                self
            );
        }
    })
}