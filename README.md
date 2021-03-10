# homebridge-xiaomi-air-conditioner-mc5

HomeBridge Plugin for XiaoMi Air Conditioner MC5

HomeBridge 小米空调插件

## 对应特征
小米的空调型号实在太TM多了, 下面这些指的都是同一台机器
- KFR-35GW/V1A1
- xiaomi.aircondition.mc5
- 小米互联网空调A｜1.5匹变频｜冷暖｜超1级能效
- 京东 https://item.jd.com/100005722435.html

其余型号无条件测试，不保证可用性

## 安装
```bash
npm i homebridge-xiaomi-air-conditioner-mc5@latest
```

## 配置
```json
"platforms": [
   {
       "platform": "XiaoMiAirConditionerMC5",
       "devices": [
           {
               "name": "AirConditioner Name 1",
               "address": "AirConditioner 1 IP Address",
               "token": "AirConditioner 1 Token"
           },
           {
               "name": "AirConditioner Name 2",
               "address": "AirConditioner 2 IP Address",
               "token": "AirConditioner 2 Token"
           },
       ]
   }
],
```

## 参考
http://miot-spec.org/miot-spec-v2/instances?status=all
