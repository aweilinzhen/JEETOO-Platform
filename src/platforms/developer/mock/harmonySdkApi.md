# HarmonyOS SDK Documentation

基于《JTCard HarmonyOS SDK 接入说明》提供的 1.0.10 接入资料整理。代码示例、参数、返回说明及注意事项均取自该资料。

# 1. SDK 接入

## 1.1 说明

本文面向第三方 HarmonyOS App 接入 `@jtcard/plugin` HAR 包。第三方只需要引入 HAR 文件，不需要插件源码。

当前资料对应 SDK 版本 `1.0.10`，交付格式为 HAR，ArkTS/ETS 工程依赖名为 `@jtcard/plugin`。交付文件名为 `jtcard_plugin-1.0.10.har`。版本记录注明最低兼容 HarmonyOS 6.0.0（API 20）。

## 1.2 最小调用流程

```ArkTS
import { common } from '@kit.AbilityKit';
import { JiatuiBleDevice, JiatuiScanResult, JtcardPlugin } from '@jtcard/plugin';

function searchAndConnect(context: common.Context): void {
  JtcardPlugin.startScan(context, (result: JiatuiScanResult) => {
    if (result.error) {
      console.error(`搜索失败：${result.error}`);
      return;
    }

    const device = result.devices[0];
    if (!device) {
      return;
    }

    JtcardPlugin.connect(device.uuid, {
      onStateChange: (connectedDevice: JiatuiBleDevice, state: string) => {
        console.info(`连接状态：${connectedDevice.uuid} ${state}`);
      },
      onConnected: async (connectedDevice: JiatuiBleDevice) => {
        console.info(`已连接：${connectedDevice.name || connectedDevice.uuid}`);
        const battery = await JtcardPlugin.getBattery();
        console.info(`电量：${battery}%`);
      },
      onError: (connectedDevice: JiatuiBleDevice, error: string) => {
        console.error(`连接失败：${connectedDevice.uuid} ${error}`);
      }
    });
  });
}
```

## 1.3 Demo 页面参考

Demo 中已实现设备搜索、手动连接、多设备保持连接、设备详情、录音控制、边录边传、文件同步和 OTA。



```Plain Text
deliverables/interaction/pages/Index.ets
deliverables/interaction/pages/DeviceDetail.ets
deliverables/interaction/pages/DenoiseTest.ets
```

## 1.4 集成

将 HAR 放到第三方工程的 `entry/libs` 目录：



```Plain Text
entry/libs/jtcard_plugin-1.0.10.har
```



在第三方工程 `entry/oh-package.json5` 增加依赖：



```Plain Text
{
  "dependencies": {
    "@jtcard/plugin": "file:./libs/jtcard_plugin-1.0.10.har"
  }
}
```



在页面中引入：



```ArkTS
import {
  JiatuiAudioSyncFailType,
  JiatuiAudioSyncProgress,
  JiatuiAudioSyncResult,
  JiatuiAudioSyncStatus,
  JiatuiBleDevice,
  JiatuiDownloadProgress,
  JiatuiDownloadStep,
  JiatuiFileItem,
  JiatuiRecordState,
  JiatuiOtaFailType,
  JiatuiOtaStep,
  JiatuiScanResult,
  JtcardPlugin
} from '@jtcard/plugin';
```

## 1.5 权限配置

在 `entry/src/main/module.json5` 的 `requestPermissions` 中配置：



```Plain Text
{
  "requestPermissions": [
    {
      "name": "ohos.permission.ACCESS_BLUETOOTH",
      "reason": "$string:bluetooth_reason",
      "usedScene": {
        "abilities": [
          "EntryAbility"
        ],
        "when": "inuse"
      }
    },
    {
      "name": "ohos.permission.INTERNET"
    },
    {
      "name": "ohos.permission.SET_WIFI_INFO"
    },
    {
      "name": "ohos.permission.GET_WIFI_INFO"
    }
  ]
}
```



|权限|用途|
|---|---|
|`ohos.permission.ACCESS_BLUETOOTH`|扫描、连接和蓝牙通信|
|`ohos.permission.INTERNET`|OTA 固件下载、WiFi 文件下载|
|`ohos.permission.SET_WIFI_INFO`|连接设备 WiFi 热点|
|`ohos.permission.GET_WIFI_INFO`|查询 WiFi 连接信息|

## 1.6 签名和包名

第三方 App 使用自己的 `bundleName`、证书和 profile。Demo 包名 `com.jiatui.hmmeetdemo` 只用于示例工程，不要求第三方保持一致。


# 2. 蓝牙设备连接

## 2.1 扫描蓝牙设备

调用：



```ArkTS
JtcardPlugin.startScan(context, (result: JiatuiScanResult) => {
  this.devices = result.devices;

  if (result.error) {
    this.message = result.error;
    return;
  }

  if (result.scanning) {
    this.message = `扫描中，已发现 ${result.devices.length} 台设备`;
  } else {
    this.message = `扫描结束，发现 ${result.devices.length} 台设备`;
  }
});
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`context`|`common.Context`|是|页面或 Ability 上下文，用于权限申请|
|`callback`|`(result: JiatuiScanResult) => void`|是|扫描结果回调|



回调数据：



```ArkTS
interface JiatuiScanResult {
  devices: JiatuiBleDevice[];
  scanning: boolean;
  error?: string;
}

interface JiatuiBleDevice {
  uuid: string;
  mac?: string;
  name: string;
  rssi: number;
  connectable: boolean;
  serviceUuids: string[];
  source: string;
  connectionState: string;
  pid?: string;
  cardGeneration?: 1 | 2;
  versionMajor?: number;
  versionMinor?: number;
  versionPatch?: number;
  firmwareVersion?: string;
}
```



字段说明：



|字段|说明|
|---|---|
|`devices`|当前扫描到的设备列表|
|`scanning`|是否仍在扫描|
|`error`|扫描错误信息|
|`uuid`|设备 ID，连接设备时使用|
|`mac`|广播 Manufacturer Data 中的 MAC，格式 `AA:BB:CC:DD:EE:FF`，保持大端字节顺序；未扫描到有效广播时可能为 `undefined`|
|`name`|蓝牙设备名称|
|`rssi`|信号强度|
|`connectable`|是否可连接|
|`serviceUuids`|广播服务 UUID 列表|
|`source`|设备来源，常见值为 `scan`、`paired`|
|`connectionState`|连接状态|
|`pid`|广播中的产品 ID|
|`cardGeneration`|一代卡为 `1`，二代卡为 `2`|
|`versionMajor` / `versionMinor` / `versionPatch`|广播 `VER[3]` 的主版本、副版本、补丁号|
|`firmwareVersion`|扫描广播中的 `主版本.副版本.补丁号`；仅扫描到有效广播后提供|



停止扫描：



```ArkTS
JtcardPlugin.stopScan();
```

## 2.2 连接蓝牙设备

调用：



```ArkTS
JtcardPlugin.connect(device.uuid, {
  onStateChange: (connectedDevice: JiatuiBleDevice, state: string) => {
    this.updateDeviceConnectionState(connectedDevice.uuid, state);
  },
  onConnected: (connectedDevice: JiatuiBleDevice) => {
    this.openDeviceDetail(connectedDevice);
  },
  onDisconnected: (connectedDevice: JiatuiBleDevice) => {
    this.updateDeviceConnectionState(connectedDevice.uuid, 'disconnected');
  },
  onError: (connectedDevice: JiatuiBleDevice, error: string) => {
    this.updateDeviceConnectionState(connectedDevice.uuid, 'disconnected');
    this.message = error;
  }
});
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`deviceId`|`string`|是|扫描结果中的 `JiatuiBleDevice.uuid`|
|`callbacks`|`JiatuiConnectCallbacks`|否|连接状态回调|
|`options`|`JiatuiConnectOptions`|否|连接选项，目前支持 `useSystemPairing`，缺省为 `{ useSystemPairing: true }`|



默认情况下 `connect` 会先走系统配对和系统 Profile 连接，失败后再回退到 GATT 连接；传 `{ useSystemPairing: false }` 可跳过系统配对，直接走 GATT 连接：



```ArkTS
// 不走系统配对，直接 GATT 连接
JtcardPlugin.connect(device.uuid, callbacks, { useSystemPairing: false });
```



回调类型：



```ArkTS
interface JiatuiConnectCallbacks {
  onConnecting?: (device: JiatuiBleDevice) => void;
  onConnected?: (device: JiatuiBleDevice) => void;
  onDisconnected?: (device: JiatuiBleDevice) => void;
  onError?: (device: JiatuiBleDevice, error: string) => void;
  onStateChange?: (device: JiatuiBleDevice, state: string) => void;
}
```



连接状态：



|状态|说明|
|---|---|
|`connecting`|连接中|
|`connected`|已连接|
|`disconnecting`|断开中|
|`disconnected`|未连接|

## 2.3 断开蓝牙设备

```ArkTS
JtcardPlugin.disconnect(device.uuid, {
  onStateChange: (connectedDevice: JiatuiBleDevice, state: string) => {
    this.updateDeviceConnectionState(connectedDevice.uuid, state);
  },
  onError: (_device: JiatuiBleDevice, error: string) => {
    this.message = error;
  }
});
```

## 2.4 判断一代卡或二代卡

```ArkTS
try {
  const secondGeneration = await JtcardPlugin.isSecondGeneration(device.uuid);
  this.addMessage(`卡型：${secondGeneration ? '二代卡' : '一代卡'}`);
} catch (error) {
  this.addMessage(`判断卡型失败：${error}`);
}
```



方法签名：



```ArkTS
static async isSecondGeneration(deviceId: string): Promise<boolean>
```



`deviceId` 传入设备 `uuid`。插件依据广播 Manufacturer Data 或设备信息中的 `PID[1]` 判断：`0x00` 为一代卡，`0x01` 为二代卡；返回 `true` 表示二代卡，返回 `false` 表示一代卡。


# 3. 设备信息与状态

## 3.1 获取电量

```ArkTS
try {
  const battery = await JtcardPlugin.getBattery();
  this.addMessage(`当前电量：${battery}%`);
} catch (error) {
  this.addMessage(`读取电量失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`number`|电量百分比，通常为 `0-100`|

## 3.2 获取存储容量

```ArkTS
try {
  const capacity = await JtcardPlugin.getCapacity();
  this.addMessage(`可用容量：${capacity.available} KB，总容量：${capacity.total} KB`);
} catch (error) {
  this.addMessage(`读取存储容量失败：${error}`);
}
```



返回值：



|字段|类型|说明|
|---|---|---|
|`available`|`number`|可用容量，单位 KB|
|`total`|`number`|总容量，单位 KB|



设备协议通过 `42 00` 查询文件系统存储信息，容量字段按小端 4 字节整数返回。

## 3.3 获取固件版本

```ArkTS
try {
  const version = await JtcardPlugin.getFirmwareVersion();
  this.addMessage(`固件版本：${version}`);
} catch (error) {
  this.addMessage(`读取固件版本失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`string`|设备固件版本号|

## 3.4 获取设备 SN

```ArkTS
try {
  const sn = await JtcardPlugin.getSn();
  this.addMessage(`SN：${sn}`);
} catch (error) {
  this.addMessage(`读取 SN 失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`string`|设备 SN 码|

## 3.5 查询设备 WiFi 状态

```ArkTS
try {
  const enabled = await JtcardPlugin.getWifiStatus();
  this.addMessage(`WiFi：${enabled ? '已开启' : '已关闭'}`);
} catch (error) {
  this.addMessage(`查询 WiFi 失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示已开启，`false` 表示已关闭|

## 3.6 查询设备时间

```ArkTS
try {
  const datetime = await JtcardPlugin.queryDatetime();
  this.addMessage(`设备时间：${datetime.toLocaleString()}`);
} catch (error) {
  this.addMessage(`查询设备时间失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`Date`|设备当前时间|

## 3.7 查询 U 盘模式

```ArkTS
try {
  const enabled = await JtcardPlugin.getUpan();
  this.addMessage(`U 盘模式：${enabled ? '已开启' : '已关闭'}`);
} catch (error) {
  this.addMessage(`查询 U 盘模式失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示 U 盘模式已开启，`false` 表示已关闭|

## 3.8 查询休眠时间

```ArkTS
try {
  const seconds = await JtcardPlugin.getSleep();
  this.addMessage(`休眠时间：${seconds} 秒`);
} catch (error) {
  this.addMessage(`查询休眠时间失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`number`|设备休眠时间，单位秒|


# 4. 设备控制与事件监听

## 4.1 注册按键响应监听

设备按键事件通过 `setButtonCallback` 注册。



```ArkTS
JtcardPlugin.setButtonCallback((event: JiatuiButtonEvent) => {
  this.addMessage(`${event.button} 按键${event.action === 'down' ? '按下' : '弹起'}`);
});
```



页面退出时建议清理：



```ArkTS
JtcardPlugin.setButtonCallback(undefined);
```



录音状态监听：



```ArkTS
JtcardPlugin.setMeetStatusCallback((recording: boolean) => {
  this.addMessage(`设备录音状态：${recording ? '录音中' : '未录音'}`);
});
```



设备收到录音状态包 `0x47` 后触发回调。页面退出时清理：



```ArkTS
JtcardPlugin.setMeetStatusCallback(undefined);
```

## 4.2 富录音状态监听

如需获取设备侧录音类型、实时录音时长、数据大小和原始文件名，使用 `setRecordStateCallback`：



```ArkTS
JtcardPlugin.setRecordStateCallback((state: JiatuiRecordState) => {
  this.addMessage(
    `录音状态=${state.rsType}，时长=${state.duration}s，` +
    `大小=${state.dataSize}B，文件=${state.fileName}`
  );
});
```



`rsType` 的取值为：`0` 未录音、`1` 会议录音、`2` 通话录音、`3` 本次录音结束、`4` 闪念录音。设备在录音过程中约每秒回调一次；文件名可能因 MARK 或文件分段变化。页面退出时调用 `setRecordStateCallback(undefined)` 清理监听。



事件类型：



```ArkTS
type JiatuiButtonName = 'M' | 'T';
type JiatuiButtonAction = 'down' | 'up';
interface JiatuiButtonEvent {
  button: JiatuiButtonName;
  action: JiatuiButtonAction;
}
```



|字段|说明|
|---|---|
|`button`|按键名称：`M` 或 `T`|
|`action`|按键动作：`down` 按下，`up` 弹起|

## 4.3 开关设备 WiFi

开启：



```ArkTS
const enabled = await JtcardPlugin.switchWifiStatus(true);
```



关闭：



```ArkTS
const enabled = await JtcardPlugin.switchWifiStatus(false);
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`enabled`|`boolean`|是|`true` 开启设备 WiFi，`false` 关闭设备 WiFi|



返回值：



|类型|说明|
|---|---|
|`boolean`|设备最终 WiFi 状态|

## 4.4 同步设备时间

同步当前系统时间：



```ArkTS
try {
  const success = await JtcardPlugin.asyncDatetime();
  this.addMessage(`同步时间${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`同步时间失败：${error}`);
}
```



同步指定时间：



```ArkTS
const success = await JtcardPlugin.asyncDatetime(new Date());
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`datetime`|`Date`|否|不传时默认使用当前系统时间|



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示同步时间命令发送成功|

## 4.5 开关 U 盘模式

开启：



```ArkTS
const enabled = await JtcardPlugin.setUpan(true);
```



关闭：



```ArkTS
const enabled = await JtcardPlugin.setUpan(false);
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`enabled`|`boolean`|是|`true` 开启 U 盘模式，`false` 关闭 U 盘模式|



返回值：



|类型|说明|
|---|---|
|`boolean`|设备最终 U 盘模式状态|

## 4.6 设置休眠时间

```ArkTS
try {
  // seconds = 0 表示从不休眠。
  const seconds = await JtcardPlugin.setSleep(20 * 60);
  this.addMessage(`休眠时间：${seconds} 秒`);
} catch (error) {
  this.addMessage(`设置休眠时间失败：${error}`);
}
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`seconds`|`number`|是|休眠时间，单位秒，取值范围 `0-65535`。设置为 `0` 表示从不休眠|



返回值：



|类型|说明|
|---|---|
|`number`|设备确认后的休眠时间，单位秒|



说明：设备查询和设置休眠时间的回包字节序不同，插件内部已做兼容处理，业务侧统一使用秒数。


# 5. 录音管理

## 5.1 开始录音

```ArkTS
try {
  const success = await JtcardPlugin.startMeet();
  this.addMessage(`启动录音${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`启动录音失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示开始录音命令发送成功|

## 5.2 停止录音

```ArkTS
try {
  const success = await JtcardPlugin.stopMeet();
  this.addMessage(`停止录音${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`停止录音失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示停止录音命令发送成功|

## 5.3 查询录音状态

```ArkTS
try {
  const meeting = await JtcardPlugin.getMeet();
  this.addMessage(`录音状态：${meeting ? '录音中' : '未录音'}`);
} catch (error) {
  this.addMessage(`查询录音状态失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示录音中，`false` 表示未录音|



如需监听设备主动上报的录音状态，使用 `setMeetStatusCallback()`；`getMeet()` 用于主动查询。


# 6. 文件管理

## 6.1 获取文件列表

```ArkTS
try {
  const files = await JtcardPlugin.getFile();
  this.recordFiles = files;
  this.addMessage(`获取到 ${files.length} 个文件`);
} catch (error) {
  this.addMessage(`获取文件列表失败：${error}`);
}
```



返回类型：



```ArkTS
interface JiatuiFileItem {
  id: string;
  fileName: string;
  modifyTime: string;
  size: string;
  recordType?: JTRecordType;
  durationMs?: number;
  startTime?: number;
  serialNumber?: number;
  mark?: string;
  md5?: string;
}

enum JTRecordType {
  MEETING = 1,
  CALL = 2,
  FLASH = 4
}
```



字段说明：



|字段|说明|
|---|---|
|`id`|文件 ID|
|`fileName`|文件名，下载和删除时使用|
|`modifyTime`|修改时间|
|`size`|文件大小，字符串格式|
|`recordType`|录音类型：会议、通话或闪记；二代卡返回，一代卡为 `undefined`|
|`durationMs`|录音时长，单位毫秒；二代卡返回|
|`startTime`|录音开始时间，Unix 秒时间戳；二代卡返回|
|`serialNumber`|设备记录编号；二代卡返回|
|`mark`|录音备注；二代卡返回，可能为空字符串|
|`md5`|文件 MD5；二代卡返回，可能为空字符串|



`getFile()` 不接收参数，返回的文件对象可直接用于文件下载和删除。

## 6.2 查询录音 MARK

二代卡可根据设备返回的完整录音文件名查询 MARK。没有 MARK 时返回空字符串。



```ArkTS
try {
  const mark = await JtcardPlugin.getMark(file.fileName);
  this.addMessage(`MARK：${mark || '无'}`);
} catch (error) {
  this.addMessage(`查询 MARK 失败：${error}`);
}
```

## 6.3 分页获取文件

业务需要分页加载时，可指定页码和每页条数：



```ArkTS
const page = await JtcardPlugin.getFilePage(1, 20);
const files = page.files;
const fileTotal = page.fileTotal;
```



`page` 从 `1` 开始，`pageSize` 表示每页条数，默认值为 `5`；两个参数都必须是正整数。二代卡会返回 `fileTotal`，一代卡没有总数时该字段为 `undefined`。

## 6.4 删除指定文件

```ArkTS
try {
  const success = await JtcardPlugin.deleteFileForName(file.fileName);
  this.addMessage(`删除${success ? '成功' : '失败'}：${file.fileName}`);
} catch (error) {
  this.addMessage(`删除失败：${error}`);
}
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`fileName`|`string`|是|`JiatuiFileItem.fileName`|



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示删除成功|

## 6.5 清空文件

清除设备上的所有音频文件。设备返回状态 `ST` 为 `0` 时表示失败，其它值表示成功。



```ArkTS
try {
  const success = await JtcardPlugin.clearFiles();
  this.addMessage(`清空文件${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`清空文件失败：${error}`);
}
```



返回值：



|类型|说明|
|---|---|
|`boolean`|`true` 表示设备上的所有音频文件已清除|


# 7. 文件传输

## 7.1 BLE 传输文件

```ArkTS
import { common } from '@kit.AbilityKit';

private async syncFile(file: JiatuiFileItem): Promise<void> {
  const context = getContext(this) as common.UIAbilityContext;

  try {
    const result = await JtcardPlugin.downloadFile({
      context: context,
      file: file,
      onProgress: (progress: JiatuiDownloadProgress) => {
        this.updateDownloadProgress(progress.fileName, progress.downloaded, progress.total, '');
      }
    });

    this.updateDownloadProgress(result.fileName, result.downloaded, result.total, result.path);
    this.addMessage(`同步完成：${result.fileName}`);
    this.addMessage(`保存路径：${result.path}`);
  } catch (error) {
    this.addMessage(`同步失败：${error}`);
  }
}
```



参数类型：



```ArkTS
interface JiatuiDownloadOptions {
  context: common.Context;
  file: JiatuiFileItem;
  onProgress?: (progress: JiatuiDownloadProgress) => void;
}

interface JiatuiDownloadProgress {
  fileName: string;
  downloaded: number;
  total: number;
  path: string;
}

interface JiatuiDownloadResult extends JiatuiDownloadProgress {
  success: boolean;
}
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`context`|`common.Context`|是|页面或 Ability 上下文，用于保存下载文件|
|`file`|`JiatuiFileItem`|是|来自 `getFile()` 的文件对象|
|`onProgress`|`(progress: JiatuiDownloadProgress) => void`|否|下载进度回调|

## 7.2 取消 BLE 文件传输

```ArkTS
try {
  const success = await JtcardPlugin.abortFileBle();
  this.addMessage(`中断蓝牙下载${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`中断蓝牙下载失败：${error}`);
}
```

## 7.3 WiFi 传输文件

WiFi 下载会自动按步骤打开设备 WiFi、连接热点、建立 Socket、下载文件、关闭设备 WiFi。



```ArkTS
private async syncFileByWifi(file: JiatuiFileItem): Promise<void> {
  const context = getContext(this) as common.UIAbilityContext;

  try {
    const result = await JtcardPlugin.downloadFileByWifi({
      context: context,
      file: file,
      ssid: 'MMEETT',
      password: '12345678',
      onProgress: (progress: JiatuiDownloadProgress) => {
        this.updateDownloadProgress(progress.fileName, progress.downloaded, progress.total, '');
      },
      onStep: (step: JiatuiDownloadStep) => {
        this.addMessage(`${step.type}：${step.message}`);
      }
    });

    this.updateDownloadProgress(result.fileName, result.downloaded, result.total, result.path);
    this.addMessage(`WiFi 同步完成：${result.fileName}`);
    this.addMessage(`保存路径：${result.path}`);
  } catch (error) {
    this.addMessage(`WiFi 同步失败：${error}`);
  }
}
```



参数类型：



```ArkTS
interface JiatuiWifiDownloadOptions {
  context: common.Context;
  file: JiatuiFileItem;
  ssid: string;
  password: string;
  onProgress?: (progress: JiatuiDownloadProgress) => void;
  onStep?: (step: JiatuiDownloadStep) => void;
}

interface JiatuiDownloadStep {
  type: string;
  message: string;
}
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`context`|`common.Context`|是|页面或 Ability 上下文，用于保存下载文件|
|`file`|`JiatuiFileItem`|是|来自 `getFile()` 的文件对象|
|`ssid`|`string`|是|设备 WiFi 热点名称|
|`password`|`string`|是|设备 WiFi 热点密码|
|`onProgress`|`(progress: JiatuiDownloadProgress) => void`|否|下载进度回调|
|`onStep`|`(step: JiatuiDownloadStep) => void`|否|WiFi 下载步骤回调|



常见步骤：



|`type`|说明|
|---|---|
|`openWifi`|打开设备 WiFi|
|`connectWifi`|连接设备 WiFi 热点|
|`connectSocket`|建立 Socket 连接|
|`download`|下载文件|
|`closeWifi`|关闭设备 WiFi|
|`closeWifiError`|关闭设备 WiFi 失败|



说明：`MMEETT` / `12345678` 是 Demo 示例热点信息，第三方应替换为实际设备热点。

## 7.4 取消 WiFi 文件传输

```ArkTS
try {
  const success = await JtcardPlugin.abortFileWifi();
  this.addMessage(`中断 WiFi 下载${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`中断 WiFi 下载失败：${error}`);
}
```


# 8. 实时音频同步（边录边传）

## 8.1 查询同步状态

```ArkTS
try {
  const status = await JtcardPlugin.getAudioSyncStatus();
  this.addMessage(`录音数据同步：${status.enabled ? '已开启' : '已关闭'}`);
} catch (error) {
  this.addMessage(`查询录音数据同步失败：${error}`);
}
```



返回类型：



```ArkTS
interface JiatuiAudioSyncStatus {
  enabled: boolean;
  codec?: 'opus';
  sampleRate?: number;
  channels?: number;
  bitDepth?: number;
  bitRate?: number;
  frameDurationMs?: number;
}
```

## 8.2 注册回调并开启同步

必须先注册监听，再调用 `setAudioSyncEnabled(true)`：



```ArkTS
private async enableAudioSync(): Promise<void> {
  const context = getContext(this) as common.UIAbilityContext;

  JtcardPlugin.onAudioSyncEnableResult(context, {
    onStart: (status: JiatuiAudioSyncStatus) => {
      this.addMessage(
        `同步已开启：${status.sampleRate ?? 0}Hz ${status.channels ?? 0}声道`
      );
    },
    onAudioFrame: (frame) => {
      // frame.data 为单个裸 Opus 数据包，可直接送入实时转写链路
      this.addMessage(`收到音频帧：${frame.frameIndex}`);
    },
    onProgress: (progress: JiatuiAudioSyncProgress) => {
      this.addMessage(
        `${progress.fileName}：${progress.downloaded}/${progress.total} B，` +
        `缺 ${progress.missingFrames} 帧`
      );
    },
    onSuccess: (result: JiatuiAudioSyncResult) => {
      this.addMessage(`同步完成：${result.fileName}`);
      this.addMessage(`保存路径：${result.path}`);
    },
    onFailed: (failType: JiatuiAudioSyncFailType, message: string) => {
      this.addMessage(`同步失败[${failType}]：${message}`);
    }
  });

  const enabled = await JtcardPlugin.setAudioSyncEnabled(true);
  this.addMessage(`开启同步${enabled ? '成功' : '失败'}`);
}
```



回调说明：



|回调|说明|
|---|---|
|`onStart`|设备确认同步开关已开启，只在开启成功时触发|
|`onProgress`|当前录音的数据、时长、帧数或缺帧数变化|
|`onSuccess`|当前录音完成并生成本地 OGG/Opus 文件|
|`onFailed`|开启、蓝牙、数据、补传、文件处理失败或主动取消|



同步开关保持开启时，每次录音都会创建独立文件会话并分别触发 `onProgress`、`onSuccess`。一次录音的 `onSuccess` 不会注销监听，也不需要再次调用 `setAudioSyncEnabled(true)`。

## 8.3 关闭同步

```ArkTS
try {
  const success = await JtcardPlugin.setAudioSyncEnabled(false);
  this.addMessage(`关闭同步${success ? '成功' : '失败'}`);
} catch (error) {
  this.addMessage(`关闭同步失败：${error}`);
}
```



关闭同步不会停止设备当前录音。如业务需要同时结束录音，应另行调用 `stopMeet()`。



最终文件默认保存在：



```Plain Text
{context.filesDir}/jiatui_meet/sync_{设备录音文件名}.ogg
```


# 9. OTA 固件升级

## 9.1 开始 OTA 升级

```ArkTS
const OTA_UPGRADE_URL: string = 'https://example.com/firmware.bin';

await JtcardPlugin.startOtaUpgrade(OTA_UPGRADE_URL, {
  onStart: () => {
    this.addMessage('OTA 已开始');
  },
  onProgress: (progress: number) => {
    const percent = Math.floor(progress * 100);
    this.addMessage(`OTA 进度：${percent}%`);
  },
  onSuccess: () => {
    this.addMessage('OTA 升级成功');
  },
  onFailed: (failType: JiatuiOtaFailType, message: string) => {
    this.addMessage(`OTA 失败：${failType} ${message}`);
  },
  onStep: (step: JiatuiOtaStep) => {
    this.addMessage(`${step.type}：${step.message}`);
  },
  onNewUpgrade: (_breakPointCode: number[], mtu: number) => {
    this.addMessage(`OTA 新升级会话，MTU：${mtu}`);
  }
});
```



参数类型：



```ArkTS
interface JiatuiOtaCallbacks {
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onFailed?: (failType: JiatuiOtaFailType, message: string) => void;
  onStep?: (step: JiatuiOtaStep) => void;
  onNewUpgrade?: (breakPointCode: number[], mtu: number) => void;
}

type JiatuiOtaFailType =
  'firmwareNotSet' |
  'cancelUpgrade' |
  'setUpgradeModeFail' |
  'setOTAUserFail' |
  'configureFail' |
  'segmentCRCFail' |
  'firmwareCRCFail' |
  'applyFirmwareFail' |
  'noResponse' |
  'downloadFail' |
  'bleFail';

interface JiatuiOtaStep {
  type: string;
  message: string;
}
```



参数说明：



|参数|类型|必填|说明|
|---|---|---|---|
|`url`|`string`|是|固件下载地址|
|`callbacks`|`JiatuiOtaCallbacks`|否|OTA 过程回调|



回调说明：





|回调|说明|
|---|---|
|`onStart`|OTA 开始|
|`onProgress`|OTA 进度，值为 `0-1` 的小数|
|`onSuccess`|OTA 成功|
|`onFailed`|OTA 失败或取消，统一以 `onFailed(failType, message)` 回调；`failType` 区分失败类型，`message` 提供详细原因|
|`onStep`|OTA 步骤变化|
|`onNewUpgrade`|新升级会话建立|



`JiatuiOtaFailType` 类型值说明：



|`failType`|含义|
|---|---|
|`firmwareNotSet`|未设置固件|
|`cancelUpgrade`|用户取消 OTA|
|`setUpgradeModeFail`|设置升级模式失败|
|`setOTAUserFail`|设置 OTA 用户类型失败|
|`configureFail`|OTA 配置失败|
|`segmentCRCFail`|固件分段 CRC 校验失败|
|`firmwareCRCFail`|固件整包 CRC 校验失败|
|`applyFirmwareFail`|应用固件失败|
|`noResponse`|等待 OTA 响应超时|
|`downloadFail`|固件下载失败|
|`bleFail`|OTA 蓝牙通信失败|

## 9.2 取消 OTA 升级

```ArkTS
JtcardPlugin.cancelOtaUpgrade();
```



建议只在用户明确取消 OTA 或页面退出确认后调用。OTA 过程中不要重复触发 `startOtaUpgrade`。


# 10. 实时降噪播放器

## 10.1 实时降噪播放器

实时降噪播放器边解码、边降噪、边播放，不生成新的音频文件。同一进程同时只能打开一个播放器。



```ArkTS
import { common } from '@kit.AbilityKit';
import {
  JiatuiDenoisePlaybackState,
  JiatuiDenoisePlayer,
  JtcardPlugin
} from '@jtcard/plugin';

const context = getContext(this) as common.UIAbilityContext;
const player: JiatuiDenoisePlayer = await JtcardPlugin.openDenoisePlayer(
  context,
  'https://example.com/audio.mp3'
);

player.onStateChange((state: JiatuiDenoisePlaybackState) => {
  console.info(`${state.status}: ${state.positionMs}/${state.durationMs}`);
});

await player.play();
await player.setDenoiseEnabled(false);
await player.seek(30000);
await player.setSpeed(1.25);
await player.setVolume(0.8);
await player.pause();
await player.stop();
await player.dispose();
```



- `source` 支持 HTTP/HTTPS 地址和本地文件路径。

- `openDenoisePlayer` 第三个参数可传 `headers`，用于 Token、Cookie、Referer 等请求头。

- 页面退出时必须调用 `dispose()` 释放解码器、模型和音频播放器。

- 播放完成后状态为 `completed`，不会自动循环；再次调用 `play()` 会从头播放。

    

完整交互参考 `deliverables/interaction/pages/DenoiseTest.ets`。


# 11. 日志管理

## 11.1 日志记录与导出

插件默认记录实时降噪、蓝牙连接、设备命令、文件传输、边录边传和 OTA 日志。系统 `hilog` 输出保持不变，同时在 App 私有目录保存可导出的文件日志。



```ArkTS
const context = getContext(this) as common.UIAbilityContext;

JtcardPlugin.setLogEnabled(context, true);
const logPath: string = await JtcardPlugin.exportLogs(context);
console.info(`日志文件：${logPath}`);

await JtcardPlugin.clearLogs(context);
```



- 文件日志默认开启，首次调用带 `context` 的接口时自动初始化。

- 单个日志文件最大约 `2 MB`，保留当前文件和 2 个历史文件。

- `exportLogs()` 将历史日志按时间顺序合并，返回 App 缓存目录中的 `.log` 文件。

- `setLogEnabled(context, false)` 只关闭文件记录，不影响系统 `hilog`。

- 网络 URL 的查询参数会隐藏，自定义请求头仅记录数量、不记录内容。


# 12. 接入注意事项

## 12.1 接入注意事项

- 业务 API 调用前必须先完成蓝牙连接。

- `connect` 前先调用 `startScan`，并使用扫描结果中的 `uuid`。

- `connect` 内部会停止扫描。

- 文件下载和 OTA 建议在页面状态中维护 `loading`、`progress`、`status`。

- 边录边传必须先调用 `onAudioSyncEnableResult()` 注册监听，再调用 `setAudioSyncEnabled(true)`。

- 页面不再使用边录边传时调用 `setAudioSyncEnabled(false)`；关闭蓝牙连接也会结束同步。

- 页面退出时清理按键回调：`JtcardPlugin.setButtonCallback(undefined)`。

- 下载中退出页面时，根据下载方式调用 `abortFileBle()` 或 `abortFileWifi()`。

- WiFi 下载示例中的热点信息需要按实际设备配置替换。

- 第三方 App 使用自己的签名、包名和 profile，不需要使用 Demo 签名。
