"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.withNames = void 0;
exports.withNames = (value, prefix) => {
    return Object.entries(value).reduce((acc, [name, value]) => {
        return Object.assign(acc, {
            [name]: {
                name: prefix ? `${prefix}.${name}` : name,
                ...value
            }
        });
    }, {});
};
exports.sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
};
//# sourceMappingURL=XiaoMiAirConditionMC5.utils.js.map