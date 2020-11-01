"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const miio_1 = __importDefault(require("miio"));
const XiaoMiAirConditionMC5_utils_1 = require("./XiaoMiAirConditionMC5.utils");
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NotConnect"] = "Device not connected.";
    ErrorMessages["SpecNotFound"] = "Spec not found.";
})(ErrorMessages || (ErrorMessages = {}));
class MIoTDevice {
    constructor(identify, logger) {
        // Properties
        this.specs = {};
        // Connection
        this.connect = async () => {
            // Device
            try {
                const device = await miio_1.default.device({
                    address: this.identify.address,
                    token: this.identify.token,
                });
                device.did = device.id.replace(/miio:/, '');
                this.device = device;
                this.log(`${this.identify.name} ${this.identify.address} connected.`);
                return true;
            }
            catch (e) {
                if (!this.isConnected) {
                    this.log(`${this.identify.name} ${this.identify.address} connect failure, reconnecting ...`, e);
                    await XiaoMiAirConditionMC5_utils_1.sleep(5000);
                    await this.connect();
                }
                return true;
            }
        };
        // Spec
        this.addSpec = (spec) => {
            this.specs[spec.name] = spec;
        };
        this.getSpec = async (name) => {
            var _a;
            // Guard
            if (!this.isConnected)
                await this.connect();
            if (!((_a = this.device) === null || _a === void 0 ? void 0 : _a.did))
                throw new Error(ErrorMessages.NotConnect);
            const did = this.device.did;
            // Action
            if (!name)
                return Object.values(this.specs).map(i => ({ ...i, did }));
            const targetSpecs = [];
            if (Array.isArray(name)) {
                name.forEach(i => {
                    const spec = this.specs[i];
                    if (spec)
                        targetSpecs.push({ ...spec, did });
                });
            }
            else {
                const spec = this.specs[name];
                if (spec) {
                    targetSpecs.push({ ...spec, did });
                }
            }
            return targetSpecs;
        };
        // Properties
        this.getProperty = async (name) => {
            var _a;
            // Guard
            if (!this.isConnected)
                await this.connect();
            if (!((_a = this.device) === null || _a === void 0 ? void 0 : _a.did))
                throw new Error(ErrorMessages.NotConnect);
            // Spec
            const targetSpecs = await this.getSpec(name);
            if (!Array.isArray(targetSpecs) || targetSpecs.length === 0)
                throw new Error(ErrorMessages.SpecNotFound);
            // Action
            return this.device.miioCall('get_properties', targetSpecs);
        };
        this.setProperty = async (name, value) => {
            var _a;
            // Guard
            if (!this.isConnected)
                await this.connect();
            if (!((_a = this.device) === null || _a === void 0 ? void 0 : _a.did))
                throw new Error(ErrorMessages.NotConnect);
            const did = this.device.did;
            // Spec
            const targetSpec = this.specs[name];
            if (!targetSpec)
                throw new Error(ErrorMessages.SpecNotFound);
            // Action
            return this.device.miioCall('set_properties', [Object.assign(targetSpec, { did, value })]);
        };
        this.identify = identify;
        this.log = logger;
        (async () => this.connect())();
    }
    // Flags
    get isConnected() {
        return !!this.device;
    }
}
exports.default = MIoTDevice;
//# sourceMappingURL=MIoTDevice.js.map