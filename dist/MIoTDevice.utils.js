"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getDeviceId = void 0;
exports.getDeviceId = (id) => {
    return id.replace(/miio:/, '');
};
exports.sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
};
//# sourceMappingURL=MIoTDevice.utils.js.map