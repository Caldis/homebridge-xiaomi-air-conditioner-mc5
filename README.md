# homebridge-xiaomi-aircondition-mc5

HomeBridge Plugin for XiaoMiAirConditionMC5

Homebridge 小米空调插件

## 对应特征
小米的空调型号实在太TM多了, 下面这些指的都是同一台机器
- KFR-35GW/V1A1
- xiaomi.aircondition.mc5
- 小米互联网空调A｜1.5匹变频｜冷暖｜超1级能效
- 京东 https://item.jd.com/100005722435.html

其余型号无条件测试，不保证可用性

## 安装
```bash
npm i homebridge-xiaomi-airconditionmc5@latest
```

## 配置
```json
"platforms": [
   {
       "platform": "XiaoMiAirConditionMC5",
       "devices": [
           {
               "name": "AirCondition Name 1",
               "address": "AirCondition 1 IP Address",
               "token": "AirCondition 1 Token"
           },
           {
               "name": "AirCondition Name 2",
               "address": "AirCondition 2 IP Address",
               "token": "AirCondition 2 Token"
           },
       ]
   }
],
```
