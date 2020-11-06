"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const MIoTDevice_utils_1 = require("./MIoTDevice.utils");
const miio_1 = __importDefault(require("miio"));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NotConnect"] = "Device not connected.";
    ErrorMessages["SpecNotFound"] = "Spec not found.";
})(ErrorMessages || (ErrorMessages = {}));
const RE_CONNECT_THRESHOLD = 90000;
const REQUEST_CONNECT_DEBOUNCE_THRESHOLD = 500;
const REQUEST_PROPERTY_DEBOUNCE_THRESHOLD = 500;
class MIoTDevice {
    constructor(props) {
        this.deviceConnectQueue = [];
        // Properties
        this.specs = {};
        this.specsQueue = [];
        // Connection
        this.debounceRequestConnect = lodash_debounce_1.default(async () => {
            // Device
            try {
                this.log.info(`${this.identify.name} ${this.identify.address} start ${!!this.device ? 're-' : ''}connecting.`);
                // Pull queue
                const queue = [...this.deviceConnectQueue];
                this.deviceConnectQueue = [];
                // Create miio device instance
                const device = await miio_1.default.device({
                    address: this.identify.address,
                    token: this.identify.token,
                });
                // Extract deviceId and attach to instance
                device.did = MIoTDevice_utils_1.getDeviceId(device.id);
                device.timeout = Date.now();
                // Logger
                this.device = device;
                queue.forEach(resolve => resolve());
                this.log.info(`${this.identify.name} ${this.identify.address} connected.`);
                return true;
            }
            catch (e) {
                // Retry if failure
                if (!this.isConnected) {
                    this.log.info(`${this.identify.name} ${this.identify.address} connect failure, reconnecting ...`, e);
                    await MIoTDevice_utils_1.sleep(5000);
                    await this.connect();
                }
                return true;
            }
        }, REQUEST_CONNECT_DEBOUNCE_THRESHOLD);
        this.connect = async () => {
            return new Promise(resolve => {
                // Queue update
                this.deviceConnectQueue.push(resolve);
                // Trigger Property getter
                this.debounceRequestConnect();
            });
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
            // Action: getAll
            if (!name)
                return Object.values(this.specs).map(i => ({ ...i, did }));
            // Action: getByName
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
                if (spec)
                    targetSpecs.push({ ...spec, did });
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
        // Merging request by debounce
        // When HomeBridge device is in initialization
        // multiple requests will be triggered in order to request the corresponding target value.
        // These fragmentation request will cause the MIoT device to refuse to response or weak performance
        // and cause the Accessory display "Not Response" in iOS Home app.
        this.debounceRequestProperty = lodash_debounce_1.default(async () => {
            // Spec
            const targetSpecs = await this.getSpec();
            // Pull queue
            const queue = [...this.specsQueue];
            this.specsQueue = [];
            // Get properties
            const properties = await this.device.miioCall('get_properties', targetSpecs);
            const mapping = targetSpecs.reduce((acc, cur, idx) => ({
                ...acc,
                [cur.name]: properties[idx].value
            }), {});
            this.log.debug(`Merging request of ${this.identify.name} ${this.identify.address}`);
            queue.forEach(resolve => resolve(mapping));
        }, REQUEST_PROPERTY_DEBOUNCE_THRESHOLD);
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
        // Events
        this.pullProperty = async () => {
            var _a;
            // Guard
            if (!this.isConnected)
                await this.connect();
            if (!((_a = this.device) === null || _a === void 0 ? void 0 : _a.did))
                throw new Error(ErrorMessages.NotConnect);
            // Action
            return new Promise((resolve => {
                // Queue update
                this.specsQueue.push(resolve);
                // Trigger Property getter
                this.debounceRequestProperty();
            }));
        };
        // HomeBridge
        this.hap = props.hap;
        this.log = props.log;
        this.characteristicsService = props.characteristicsService;
        // Device
        this.identify = props.identify;
        (async () => this.connect())();
    }
    // Flags
    get isConnected() {
        const now = Date.now();
        const flag = !!this.device && (now - this.device.timeout < RE_CONNECT_THRESHOLD);
        if (!!this.device && flag) {
            this.device.timeout = now;
        }
        return flag;
    }
    addCharacteristicListener(type, config) {
        const characteristic = this.characteristicsService.getCharacteristic(type);
        if ('get' in config) {
            characteristic.on("get" /* GET */, async (callback) => {
                try {
                    this.log.debug(`GET START ${type.name}`, Date.now());
                    const property = await this.pullProperty();
                    const propertyFormatted = config.get.formatter(property);
                    this.log.debug(`GET SUCCESS ${type.name}`, propertyFormatted);
                    callback(undefined, propertyFormatted);
                }
                catch (e) {
                    this.log.error(`ERROR ${type.name}`, e);
                    callback(e);
                }
            });
        }
        if ('set' in config) {
            const set = config.set;
            if (set) {
                characteristic.on("set" /* SET */, async (value, callback) => {
                    try {
                        this.log.debug(`SET START ${type.name}`, Date.now());
                        const valueFormatted = set.formatter(value);
                        await this.setProperty(set.property, valueFormatted);
                        this.log.debug(`SET SUCCESS ${type.name}`, valueFormatted);
                        callback(undefined, value);
                    }
                    catch (e) {
                        this.log.error(`ERROR ${type.name}`, e);
                        callback(e);
                    }
                });
            }
        }
    }
}
exports.default = MIoTDevice;
//# sourceMappingURL=MIoTDevice.js.map