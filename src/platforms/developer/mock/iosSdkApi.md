# iOS SDK Documentation

本页依据《加推录音卡iOS SDK.md》整理。SDK 接口、参数及回调以原始资料为准。

# 1. SDK 接入
JTCardSDK 以 `JTCardSDK.xcframework` 交付，最低支持 iOS 13.0。

## 1.1. 系统要求

SDK 最低支持：iOS 13.0

## 1.2. XCFramework 集成

将 `JTCardSDK.xcframework` 添加到 Xcode 工程，并在 Target → General → Frameworks, Libraries, and Embedded Content 中设置为 **Embed & Sign**。

## 1.3. 权限配置

蓝牙功能需要声明蓝牙用途说明。只有使用一代卡 Wi-Fi Socket 快传时，才需要本地网络用途说明；Hotspot Configuration Capability 仅适用于应用需要配置或连接设备热点的场景。

```text
// 在 Info.plist 中添加权限

NSBluetoothAlwaysUsageDescription // 蓝牙权限

// 使用一代卡 Wi-Fi Socket 快传时添加

NSLocalNetworkUsageDescription // 用于连接设备Socket并传输数据(涉及本地网络权限）

// 应用需要配置或连接设备 Wi-Fi 热点时使用
Signing & Capabilities
    + Capability
        Hotspot Configuration
```

## 1.4. SDK 使用入口

```swift
import JTCardSDK

// 调用 SDK
JTSdkManager.shared
```

# 2. 蓝牙连接

## 2.1. 扫描设备

```swift
// 设置 delegate
JTSdkManager.shared.delegate = self

// 开始扫描
let _ = JTSdkManager.shared.startScan()

// 实现 delegate
func jtCardManager(
    _ manager: JTSdkManager,
    didDiscover device: JTPeripheral
) {
    // 获取到匹配的蓝牙设备
}
```

## 2.2. 获取系统已连接设备

```swift
// 获取系统已连接设备
JTSdkManager.shared.retrieveConnectedPeripherals()

// 获取对应 UUID 设备
JTSdkManager.shared.retrievePeripheral(withIdentifiers: [UUID])
```

## 2.3. 连接与断开设备

```swift
// 连接蓝牙设备
// 无超时挂起连接，连接不上一直挂起，直到设备出现或主动调用 cancelPeripheralConnection()
JTSdkManager.shared.connect(to: peripheral)

// 实现 delegate 监听连接状态
func jtCardManager(
    _ manager: JTSdkManager,
    didChangeConnectState state: JTBleConnectState,
    deviceIdentifier: String?
) {
    if state == .connected {

    }
}

// 取消连接
JTSdkManager.shared.cancelPeripheralConnection()
```

v1.0.4 起，推荐使用 `cancelPeripheralConnection()` 断开连接；旧 `disconnect` 方法名称已调整。

# 3. 设备信息与状态

## 3.1. 获取电量、设备信息与 SN

```swift
JTSdkManager.shared.getElectricityLevel()

// 监听结果
func onElectricityLevel(level: Int)
```

```swift
JTSdkManager.shared.getDeviceInfo()

// 监听结果
func onDeviceInfo(mac: String?, pid: String?, ver: String?)
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|mac|设备 Mac 地址||||
|pid|设备类型||||
|ver|设备固件版本号||||

```swift
JTSdkManager.shared.getSN()

// 监听结果
func onSNCode(snCode: String?)
```

## 3.2. 获取存储信息与设备状态

```swift
// 获取
JTSdkManager.shared.getStoreInfo()

// 监听同步结果
func onDeviceStoreInfo(fileCount: Int,
                           storeTotalSize: Int,
                           usedSize: Int)
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|fileCount|录音文件数量||Int||
|storeTotalSize|设备存储总大小（KB）||Int||
|usedSize|已用大小（KB）||Int||

```swift
// 查询设备状态
JTSdkManager.shared.getDeviceState()

// 监听删除结果
func onDeviceState(rsState: Int,
                       lsState: Int,
                       usState: Int,
                       isDeviceReport: Bool)
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|rsState|0 录音未打开<br>1 会议录音<br>3 结束录音<br>4 闪念录音（长按按钮）||Int<br>||
|lsState|0 表示未解锁录音<br>1 表示已解锁录音\(默认为解锁，未解锁时无法开启设备录音\)|||未实现<br>二代卡已实现|
|usState|0 U盘模式关闭<br>1 U盘模式打开||String||
|mtu|协商的 mtu 大小|||v1.0.7 SDK 才支持|
|isDeviceReport|是否设备主动上报||Boolean||

## 3.3. 读取休眠、Wi-Fi、时间与 U 盘状态

```swift
// 获取
JTSdkManager.shared.getSleepTime()
// 监听结果
func onReadSleepTime(time: Int)

```

```swift
// 获取
JTSdkManager.shared.getWiFiState()
// 监听 wifi 状态
func onWiFiState(isOpen: Bool, ssid: String?, pwd: String?)
```

```swift
// 获取
JTSdkManager.shared.getDeviceDatetime()
// 监听 获取设备时间
func onDeviceDatetime(datetime: String)

```

```swift
// 获取
JTSdkManager.shared.getUsbFlashMode()
// 监听 U 盘模式
func onUsbFlashMode(isOpen: Bool)
```

# 4. 设备控制与事件

## 4.1. 注册事件监听与回调字段

因蓝牙通讯为异步操作，所有结果均已接口回调方式响应，调用操作方法的返回值仅表示，是否成功将请求通过蓝牙发送。

```swift
JTSdkManager.shared.eventDelegate = self

extension ViewModel: JTEventDelegate {
    
    func onKeyboardEvent(keycode: Int) {
        // keycode = 0 按下， 1 抬起
        appendLog("onKeyboardEvent keycode = \(keycode)")
    }
    
    func onElectricityLevel(level: Int) {
        appendLog("onElectricityLevel level = \(level)")
    }
    
    func onSleepTimeResult(isSuccess: Bool) {
        appendLog("onSleepTimeResult isSuccess = \(isSuccess)")
    }
    
    func onReadSleepTime(time: Int) {
        appendLog("onReadSleepTime time = \(time)")
    }
    
    func onDeviceInfo(mac: String?, pid: String?, ver: String?) {
        appendLog("onDeviceInfo mac = \(mac ?? "") pid = \(pid ?? "") ver = \(ver ?? "")")
    }
    
    func onBlePairingStatus(isPaired: Bool) {
        appendLog("onBlePairingStatus isPaired = \(isPaired)")
    }
    
    func onSNCode(snCode: String?) {
        appendLog("onSNCode snCode = \(snCode ?? "")")
    }
    
    func onFindMyStatus(isOpen: Bool) {
        
    }
    
    func onAudioStop() {
        
    }
    
    func onWiFiState(isOpen: Bool) {
        appendLog("onWiFiState isOpen = \(isOpen)")
    }
    
    func onDeviceStoreInfo(fileCount: Int, storeTotalSize: Int, usedSize: Int) {
        appendLog("onDeviceStoreInfo fileCount(\(fileCount)) storeTotalSize(\(storeTotalSize)) usedSize(\(usedSize))")
    }
    
    func onFileList(fileList: [FileInfo]) {
        
    }
    
    func onDownloadFile(type: JTCardSDK.DownloadType, fileSize: NSNumber?, blockDataEndPosition: NSNumber?, blockData: Data?) {
        
    }
    
    func onClearResult(isSuccess: Bool) {
        appendLog("onClearResult isSuccess = \(isSuccess)")
        
        if isSuccess {
            files.removeAll()
            selectFile = nil
        }
    }
    
    func onDeleteFileResult(isSuccess: Bool) {
        appendLog("onDeleteFileResult isSuccess: \(isSuccess)")
    }
    
    func onReceiveException(receiveData: Data?, exceptionMsg: String?) {
        
    }
    
    func onDeviceDatetime(datetime: String) {
        appendLog("onDeviceDatetime datetime: \(datetime)")
    }
    
    func onSyncDatetimeResult(isSuccess: Bool) {
        appendLog("onSyncDatetimeResult isSuccess: \(isSuccess)")
    }
    
    func onDeviceState(rsState: Int, lsState: Int, usState: Int, isDeviceReport: Bool) {
        appendLog("onDeviceState rsState(\(rsState)) lsState(\(lsState)) usState(\(usState)) isDeviceReport(\(isDeviceReport))")
    }
    
    func onRecordState(rsState: Int, duration: Int, dataSize: Int, fileName: String) {
        appendLog("onRecordState rsState(\(rsState)) duration(\(duration)) dataSize(\(dataSize)) fileName(\(fileName))")
    }
    
    func onUsbFlashMode(isOpen: Bool) {
        appendLog("onUsbFlashMode isOpen: \(isOpen)")
    }
    
    func onMtuChanged(mtu: Int, status: Bool) {
        
    }
    
    func onLog(type: JTCardSDK.LogCode, message: String) {
        appendLog("[onLog] code = \(type.rawValue) message: \(message)")
    }
}

```

## 4.2. 设置休眠、Wi-Fi、时间与 U 盘模式

SDK 蓝牙通信为异步操作；调用操作方法的返回值仅表示请求是否成功发送，设备处理结果通过事件回调返回。

```swift
// 设置 seconds = 0 为从不休眠
JTSdkManager.shared.setSleepTime(seconds)
// 监听设置结果
func onSleepTimeResult(isSuccess: Bool)

// 打开或关闭设备 Wi-Fi
JTSdkManager.shared.setWifiSwitch(true/false)
// 固件 >= 0.1.6 版本才支持指定 SSID 与密码
JTSdkManager.shared.setWifiSwitch(isOpen: true, ssid: ssid, pwd: wifiPwd)
// 监听 Wi-Fi 状态
func onWiFiState(isOpen: Bool, ssid: String?, pwd: String?)

// 同步 yyyyMMddHHmmss 格式的时间到设备
JTSdkManager.shared.syncDeviceDatetime("20260120133512")
// 监听同步结果
func onSyncDatetimeResult(isSuccess: Bool)

// 打开或关闭设备 U 盘模式
JTSdkManager.shared.setUsbFlashMode(true/false)
// 监听 U 盘模式结果
func onUsbFlashMode(isOpen: Bool)
```

## 4.3. 录音状态监听

在设备开启录音时会同步录音装备给到客户端，频率为每秒一次。

```swift
// 监听录音状态
func onRecordState(rsState: Int,
                       duration: Int,
                       dataSize: Int,
                       fileName: String)
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|rsType<br>|0 录音未打开<br>1 会议录音<br>3 结束录音<br>4 闪念录音（长按按钮）||Int<br>||
|duration|本次录音时长||Int||
|dataSize|本次录音文件大小||Int||
|fileName|本次录音文件的名称||String|在录音过程中因用户可能使用 MARK 标记，所以文件名称可能会有变化|

## 4.4. 录音启停接口范围

原始 iOS SDK 文档提供录音状态查询与监听说明，但没有完整明确列出对外的录音启停调用代码。此处不补造 `startMeet`、`startRecord` 或 `stopRecord` 等方法；录音启停方法签名待 SDK 方确认。

# 5. 文件管理

## 5.1. 获取一代卡录音文件列表

```swift
// 获取指定 startIndex 到 endIndex 的文件信息,一次最多获取 5 个文件的信息
// 起始下标从 1 开始
JTSdkManager.shared.getFileList(1, 5)

// 监听同步结果
func onFileList(fileList: [FileInfo])
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|FileInfo|||||
|name|文件名称||String||
|modifyTime|文件保存时间||String||
|size|文件大小（字节）||NSNumber||
|serialNumber|文件序号||NSNumber|删除增加文件时序号会改变|

注意：没有在上表中写明的字段暂不使用（其他产品固件才有值本产品为空）。

## 5.2. 删除与清空文件

```swift
// 根据指定 文件名称 删除文件
JTSdkManager.shared.deleteFile(fileName)

// 监听删除结果
func onDeleteFileResult(isSuccess: Bool)
```

```swift
// 清空设备中的所有音频文件
JTSdkManager.shared.clearFiles()

// 监听删除结果
func onClearResult(isSuccess: Bool)
```

## 5.3. 读取录音 MARK

**固件支持版本：**>= 一代卡0.2.0

根据录音文件名称查询录音过程中的 MARK 按键记录。文件名称可从文件列表或录音状态回调中获取。

```swift
JTSdkManager.shared.getMark(fileName: fileName)

// 查询结果
func onRecordMark(success: Bool, marks: String?) {
    guard success else { return }

    // marks 格式：按下时间,抬起时间;按下时间,抬起时间;...
    // 例如：8,8;20,21;55,70;
}
```

MARK 时间单位为秒，并对应录音文件的音频时间；例如 `20,21;` 表示在第 20 秒按下 MARK 键、第 21 秒抬起。当前设备最多记录 1000 对 MARK 数据。



**参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|fileName|要查询的录音文件名称|String|使用设备返回的完整文件名称|
|success|设备是否成功处理本次查询|Bool||
|marks|MARK 记录字符串|String?|操作失败时为 nil；无 MARK 时可能为空字符串|

## 5.4. 二代卡音频文件列表

二代卡专用的 `getAudioFileList(offset:limit:)` 与分页字段说明见第 11.2 节。不要将它与一代卡 `getFileList(1, 5)` 混用。

# 6. BLE 文件传输

## 6.1. 下载文件及传输回调

同一时刻只能传输一个文件，只有上一个文件完成或取消传输后，才能发起下一个文件传输

```swift
// fileName 要下载的文件名称
// position 从第几个字节开始传输，用于断点续传，默认为 0 表示从头开始完整传输
JTSdkManager.shared.downloadFile(fileName, position)

// 监听文件流，进行本地保存
func onDownloadFile(type: DownloadType,
                        fileSize: NSNumber?,
                        blockDataEndPosition: NSNumber?,
                        blockData: Data?)
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|type<br>|FileSize 设备返回，准备传输的文件大小（fileSize 字段）<br>FileData 文件流（blockDataEndPosition、blockData 字段）<br>FileComplete 传输结束<br>FileCancel 传输被取消||Int<br>||
|fileSize|准备传输的文件总大小||Int||
|blockDataEndPosition|表示本数据块在整个文件中，结束的位置||Int||
|blockData|文件数据块||ByteArray||

## 6.2. 取消文件传输

```swift
// 取消当前文件传输，取消成功时会从 onDownloadFile 回调中返回 type 为 FileCancel
JTSdkManager.shared.cancelDownloadFile()
```

# 7. Wi-Fi 文件传输

## 7.1. 一代卡 Socket 传输

**打开 Wi-Fi 热点**

1. 通过 5.6 设备WiFi 相关方法打开设备热点。

2. 通过系统 API 连接热点 WiFi。

3. 使用 SDK 中 `SocketClient` 连接 Socket。



**Wi-Fi 传输文件**

使用 `SocketClient` 传输文件

```swift
// fileName 要下载的文件名称
// position 从第几个字节开始传输，用于断点续传，默认为 0 表示从头开始完整传输
socketClient.downloadFile(fileName, position)

// 监听文件流，进行本地保存
func socketClient(_ client: SocketClient, didReceiveEvent type: EventType, fileSize: NSNumber?, offset: NSNumber?, data: Data?) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|type<br>|fileSize 设备返回，准备传输的文件大小（fileSize 字段）<br>fileData 文件流（offset、blockData 字段）<br>fileComplete 传输结束<br>heartbeat 不需要使用||EventType<br>||
|fileSize|准备传输的文件总大小||NSNumber||
|offset|||NSNumber||
|data|文件数据块||Data||

## 7.2. 二代卡 HTTP 传输

当前 SDK 文档仅说明二代卡支持 Wi-Fi HTTP，并引用了未随本资料提供的另一份接口文档。该外部文档无法在本项目中核验，因此请求 URL、认证方式、请求格式及调用代码待公开资料补充。此处不将一代卡 Socket 方案套用于二代卡 HTTP。

# 8. 实时音频同步（边录边传）

## 8.1. 查询状态、开启同步与接收音频帧

**固件支持版本：**>= 一代卡0.2.0

设备默认不同步实时录音数据给 App。App 监听到录音开启后，可根据业务需要通过指令开启或关闭录音数据同步，也可以提前设置。

开启成功后，设备会将采样率、声道数、码率、每帧时长等录音参数发送给 App，方便业务解析录音数据。

当前设备的实时音频数据为 OPUS 裸数据帧（TOC \+ frame data），应用层收到后可直接进行解码。

开启录音数据同步后，设备会在录音过程中通过蓝牙实时推送音频帧。请先按 5.1 设置 `eventDelegate`，并在蓝牙连接成功后调用以下方法。

```swift
// 查询当前录音数据同步状态
JTSdkManager.shared.getAudioSyncStatus()

// 查询结果
func onAudioSyncStatus(
    success: Bool,
    enabled: Bool,
    config: JTAudioConfig?
) {
    guard success else { return }

    // enabled 表示录音数据同步是否已开启
    // config 为设备当前使用的音频参数
}

// 开启或关闭录音数据同步
JTSdkManager.shared.setAudioSyncEnabled(enabled: true)  // 开启
JTSdkManager.shared.setAudioSyncEnabled(enabled: false) // 关闭

// 设置结果
func onAudioSyncEnableResult(
    success: Bool,
    enabled: Bool,
    config: JTAudioConfig?
) {
    guard success else { return }

    // enabled 表示设置后的状态
}

// 开启后接收设备实时推送的音频帧
func onAudioFramesReceived(
    isLastPacket: Bool,
    frames: [JTAudioFrame]
) {
    for frame in frames {
        let frameIndex: UInt32 = frame.frameIndex
        let frameData: Data = frame.data
        // 按 frameIndex 保存或处理音频帧
    }

    if isLastPacket {
        // 已收到本次录音的最后一包音频帧
    }
}
```

**注意：**调用 `setAudioSyncEnabled(enabled: true)` 开启音频数据同步后，如果断开蓝牙连接，该设置会被重置为 `false`。

TestBLE Demo 中 `RecordRepository、AudioFrameStore` 为存储音频帧示例，音频帧存储逻辑请自行实现或根据业务需求本地不做存储直接转发至服务端。



**回调参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|success|设备是否成功处理本次查询或设置|Bool||
|enabled|录音数据同步是否开启|Bool||
|config|音频编码参数|JTAudioConfig?|设备未返回音频参数时为 nil|
|config.codec|音频编码格式值|Int|0 为 OPUS，目前只有这一种|
|config.sampleRate|采样率|Int|单位：Hz|
|config.channels|声道数|Int||
|config.bitDepth|位深|Int|单位：bit|
|config.bitrate|码率|Int|单位：bit/s|
|config.frameDuration|单帧时长|Int|单位：ms|
|isLastPacket|是否为本次录音的最后一个音频数据包|Bool|应以该字段判断音频帧是否全部接收完成|
|frames|本次收到的音频帧列表|\[JTAudioFrame\]||
|frame.frameIndex|音频帧序号|UInt32|范围为 0 到 `0xFFFFFFFF`|
|frame.data|音频帧数据|Data|每一帧的 OPUS 裸数据|

## 8.2. 下载指定音频帧与补传

**固件支持版本：**>= 一代卡0.2.0

**固件升级前录制的音频不支持该方式下载**

同一时刻只能执行一个相关文件传输任务；上一任务完成或取消后，才能开始下一任务。`downloadAudioFrames` 或第 6.1 节中的 `downloadFile`，直到传输完成或取消后才能发起下一次传输。**

`downloadAudioFrames` 用于下载完整录音的音频帧，或补传实时同步过程中缺失的帧。一次请求可指定多个帧区间，区间的起止帧均包含在下载范围内。

```swift
// requestId 由应用生成，用于关联请求和回调
let requestId: UInt32 = 1

// 以下三种下载方式按需选择一种

// 示例一：下载完整录音
JTSdkManager.shared.downloadAudioFrames(
    requestId: requestId,
    fileName: fileName,
    ranges: [JTFrameRange.all()]
)

// 示例二：下载多个缺失区间（包含起止帧）
JTSdkManager.shared.downloadAudioFrames(
    requestId: requestId,
    fileName: fileName,
    ranges: [
        JTFrameRange(startFrame: 100, endFrame: 199),
        JTFrameRange(startFrame: 350, endFrame: 499)
    ]
)

// 示例三：从指定帧下载到文件末尾
JTSdkManager.shared.downloadAudioFrames(
    requestId: requestId,
    fileName: fileName,
    ranges: [JTFrameRange.from(startFrame: 100)]
)

// 监听下载事件
func onDownloadAudioFrameEvent(event: JTAudioFrameEvent) {
    switch event.type {
    case .size:
        // totalFrames 本次传输的音频帧总数
        // fileTotalFrames 本次传输文件音频帧的总数（仅一代卡支持 固件0.2.0）
        let totalFrames = event.totalFrames

    case .data:
        for frame in event.frames ?? [] {
            // 按 frame.frameIndex 保存 frame.data
        }

    case .complete:
        // 本次下载完成
        break

    case .cancel:
        // 本次下载已取消，取消结果码为 event.cancelCode
        break

    @unknown default:
        break
    }
}
```

`ranges` 不能为空，否则会触发 `precondition` 失败。`requestId`、`startFrame`、`endFrame` 均为 `UInt32`，有效范围为 0 到 `0xFFFFFFFF`。建议应用为每个未完成的下载任务分配唯一 `requestId`，并通过回调中的 `event.requestId` 区分任务。



`Data` 事件的 `isLastPacket` 表示该包是否包含整个录音的最后一帧，不用于替代 `Complete` 事件。



**方法参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|requestId|本次下载任务 ID|UInt32|范围为 0 到 `0xFFFFFFFF`|
|fileName|要下载的录音文件名称|String|使用设备返回的完整文件名称|
|ranges|要下载的帧区间列表|\[JTFrameRange\]|不能为空；每个区间包含 `startFrame` 和 `endFrame`|
|JTFrameRange.all |从第 0 帧下载到文件末尾|JTFrameRange||
|JTFrameRange.from\(startFrame:\)|从指定帧下载到文件末尾|JTFrameRange||

**事件参数说明：**

|**事件类型**|**有效字段**|**说明**|
|---|---|---|
|size|requestId、totalFrames|设备返回本次传输音频总帧数|
|data|requestId、startFrameIndex、frameCount、isLastPacket、frames|返回一包音频帧数据|
|complete|requestId|本次下载任务完成|
|cancel|requestId、cancelCode|本次下载任务已取消及设备返回的取消结果码|

## 8.3. 取消音频帧下载

**固件支持版本：**>= 一代卡0.2.0

使用发起下载时相同的 `requestId` 取消对应任务。取消结果通过 `onDownloadAudioFrameEvent` 返回。

```swift
JTSdkManager.shared.cancelAudioFramesDownload(requestId: requestId)

func onDownloadAudioFrameEvent(event: JTAudioFrameEvent) {
    if event.requestId == requestId && event.type == .cancel {
        // event.cancelCode 为设备返回的取消结果码
    }
}
```

收到相同 `requestId` 且类型为 `cancel` 的事件后，才表示设备已响应取消请求。

设备无法传输时也会主动发送类型为 `cancel` 的事件，表示当前无法传输。

# 9. OTA 固件升级

## 9.1. 设置 OTA Delegate

```swift
JTSdkManager.shared.otaDelegate = self

extension ViewModel: OTADelegate {
    
    func onOTAStateChangeResult(isSuccess: Bool, isOpen: Bool) {
        // isSuccess 表示操作 openOTA、closeOTA 是否成功
        // isOpen 表示 OTA 服务是否已经打开，只有 true 打开的情况下才能 startOtaUpgrade 进行升级
    }
    
    func onOTAStart() {
        // 打开进行 OTA 升级
    }
    
    func onOTAProgress(_ progress: Double) {
        // OTA 进度
    }
    
    func onOTASuccess() {
        // 固件升级成功后避免对卡片进行操作，等待卡片重启后，重新进行蓝牙连接
        // 升级成功后需等待几秒,设备有一个重启的过程，期间蓝牙连接会断开,需重新连接
    }
    
    func onOTAFailed(_ failType: JTCardSDK.OTAFailType) {
        // OTA 失败
    }
    
    func onNewOTAUpgrade(newBreakPointCode: Data, newMtu: Int) {
        //
        // 本回调用于提供断点升级能力，可以不使用
        //
        // 如果当前是一次新的 OTA 升级，那边设备端会产生 newBreakPointCode、newMtu 用于在本次升级未完成时，下次升级可进行断点续传
        // 使用逻辑：
        //  1）将本次升级的 固件版本或标识 与 newBreakPointCode、newMtu 存储到本地，固件 升级成功 或 升级失败 时删除
        //  2）在进行 OTA 前取出这几个值，如果有值说明存在未完成的 OTA，那就可以进行 OTA 断点升级
        //  3) 在 setFirmware 时设置 breakpointCode、breakpointMtu 参数，如果有效在 OTA 升级时就会直接跳转到上一次 OTA 停止的地方开始
        // 注意：本次升级的固件要与上一次的固件一样，才能进行断点升级
    }
    
}

```

## 9.2. 打开关闭 OTA 服务

```swift
// 进行 OTA 升级前需要先打开服务，不使用 OTA 功能时需要关闭，操作结果在 onOTAStateChangeResult 回调
JTSdkManager.shared.openOTAService()

// 关闭 OTA
JTSdkManager.shared.closeOTAService()
```

## 9.3. 配置 OTA 升级固件信息

```swift
// 设置升级所需的固件
JTSdkManager.shared.setFirmware(firmwareData)

// 或使用 breakpointCode 跟 breakpointMtu 进行断点设置
// sendInterval* 参数用于设置发送固件包的时间间隔，默认50，TF卡版本建议设置 80~100（可不设置）*
JTSdkManager.shared.setFirmware(firmwareData, breakpointCode: code, breakpointMtu: mtu)
```

## 9.4. 开始 OTA 升级

```swift
// 开始 OTA 升级
JTSdkManager.shared.startOtaUpgrade()
```

## 9.5. 取消 OTA 升级

```swift
// 取消正在进行的 OTA 升级（正常情况下不建议使用）
JTSdkManager.shared.cancelOTA()
```

# 10. State Restoration

## 10.1. 功能与使用条件

在满足 iOS State Restoration 条件时，即使 App 在后台被系统终止，SDK 也可以在 App 被重新唤起后自动恢复之前的蓝牙连接状态，无需重新扫描设备。

**主要功能**

1. 支持以下恢复场景：

- 系统维持蓝牙连接时，打开 APP 自动恢复蓝牙连接状态。

- 蓝牙处于连接状态，App 在后台被销毁，系统维持蓝牙连接，之后设备触发蓝牙事件 Notify，APP 在后台恢复连接状态。

- 蓝牙连接成功，APP 退到后台被销毁后，接收到蓝牙断开事件，自动发起蓝牙连接（一般需要等到设备处于可连接状态才会连上）。

- APP 发起蓝牙连接，但还未连接成功，App 退到后台并被销毁，等到设备可连接时会连接上。

> 注意：主动调用 cancelPeripheralConnection 取消连接，或用户手动上划关闭 App 则不触发上面场景的状态恢复。
> 
> 



2. 新增连接状态 `JTBleConnectState.restoring` 当 SDK 检测到系统正在恢复之前连接的设备时，会首先回调该状态。

3. 新增 `JTSdkManager.configure(enableStateRestoration: true) `用于控制是否启用 State Restoration 必须要在 `JTSdkManager.shared` 调用前配置，否则不生效。默认情况下（未调用 `configure`），SDK 保持与旧版本一致，不启用 State Restoration。

4. 新增恢复后自动重连配置 `restoreAutoReconnect` 用于控制：State Restoration 时，如果恢复的设备已断开，是否自动发起重新连接。默认值：true ，设置为 `false` 后，SDK 将不会自动发起重连。



## 10.2. 启用状态恢复与自动重连

需要给 App 添加 `UIBackgroundModes` 的 `bluetooth-central`。在 `didFinishLaunchingWithOptions` 中尽早配置状态恢复，并在配置完成后再访问 `JTSdkManager.shared`。

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    JTSdkManager.configure(enableStateRestoration: true)
    // 默认 true；设置为 false 可关闭恢复后的自动重连。
    // JTSdkManager.shared.restoreAutoReconnect = false
    return true
}
```

# 11. 二代卡专属能力

## 11.1. 获取 HTTP UserKey

```swift
JTSdkManager.shared.getUserKey()
```

只能在蓝牙已连接且设备信息已成功返回后调用。如果返回空值，App 不应发起 HTTP 请求。切换设备后，必须重新获取新设备对应的 `userkey`。

## 11.2. 分页获取音频文件列表

注意：二代卡才支持该方法，使用二代卡时可用该方法代替 **5.10 获取文件列表** 。

```swift
// offset 表示分页偏移量，从第几个文件开始
// limit 表示每页数量
JTSdkManager.shared.getAudioFileList(offset: offset, limit: limit)

// 监听同步结果
// success 表示请求是否成功
func onRecordFileList(success: Bool, result: JTRecordFileListResult) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|resultCode|结果码 0 成功||Int||
|totalCount|设备文件总数||Int||
|fileCount|本次返回文件数||Int||
|FileInfo|||||
|name|文件名称||String||
|recordType|录音类型||JTRecordType||
|size|文件大小（字节）||NSNumber||
|durationMs|录音时长（毫秒）||NSNumber||
|startTime|开始时间（Unix 秒时间戳）||NSNumber||
|serialNumber|文件ID||NSNumber||
|mark|录音过程中的 MARK 数据||String||
|md5|文件MD5||String||

## 11.3. 设置通讯密钥与服务范围

```swift
// 应用按项目安全方案准备密钥数据后调用
JTSdkManager.shared.setEncryptionKey(key: key, scope: .basicService)
JTSdkManager.shared.setEncryptionKey(key: key, scope: .transcriptionService)
```

|**类型（JTEncryptionScope）**|**说明**|
|---|---|
|ALL|所有服务|
|basicService|基础服务|
|transcriptionService|转录服务|



**basicService 相关功能**

|**功能**|**说明**|
|---|---|
|5.3 获取设备信息||
|5.4 获取设备SN码||
|5.5 设备休眠时间||
|查询设备配对状态||
|接收按钮事件||
|开启/关闭录音||
|设置/获取休眠时间||
|发送粘贴指令||
|恢复出厂设置||



**transcriptionService 相关功能**

|**功能**|**说明**|
|---|---|
|5.6 设备WiFi||
|5.7 设备时间||
|5.8 U盘模式||
|5.9 设备存储信息||
|5.10 获取文件列表||
|5.11 删除指定文件||
|5.12 清空所有文件||
|5.13 设备状态||
|5.14 录音状态同步||
|5.15 BLE传输文件||
|5.16 取消当前文件传输||
|5.17 获取录音 MARK||
|5.18 录音数据实时同步||
|5.19 下载指定音频帧||
|5.20 取消指定音频帧下载||
|5.21 获取 HTTP UserKey||
|5.22 获取音频文件列表||

## 11.4. 二代卡 Wi-Fi HTTP

该 HTTP 相关接口仅支持二代卡。具体调用方式依赖另一份《二代卡 WiFi 快传 HTTP 接口文档》，当前资料未包含其正文；接口细节待公开资料补充。

# 12. 接入注意事项

## 12.1. 卡片类型与固件适用范围

| 卡片类型 | 通俗说法 | 固件说明 |
|---|---|---|
| 三麦 + EMMC 录音卡；三麦 + TF 录音卡 | 一代卡 | 仅适用特定固件的方法会在对应章节标出版本要求。 |
| 五麦 + EMMC 录音卡 | 二代卡 | 未特别说明时，一代卡调用方法通常适用于二代卡；二代卡专属接口另行标注。 |

## 12.2. 权限与异步回调

蓝牙功能需要在 `Info.plist` 声明 `NSBluetoothAlwaysUsageDescription`。使用一代卡 Wi-Fi Socket 快传时，再配置 `NSLocalNetworkUsageDescription`，并按 iOS 系统方式连接设备热点；Hotspot Configuration Capability 仅在需要由应用配置或连接热点的场景使用。蓝牙操作为异步通信，最终设备状态以 SDK Delegate / EventDelegate 回调为准。

## 12.3. 传输、音频与 OTA 限制

一代卡 `getFileList()` 一次最多取 5 个文件，起始下标从 1 开始；二代卡使用带 `offset` / `limit` 的 `getAudioFileList()`。BLE 文件传输和音频帧下载同一时刻只能进行一个任务。实时音频为 Opus 裸数据帧，使用 `frameIndex` 标识；断开蓝牙后同步开关会重置。部分实时音频能力要求一代卡固件 0.2.0 或更高版本。OTA 需先打开 OTA 服务、配置固件，再启动升级；成功后等待设备重启并重新连接。

## 12.4. State Restoration 条件

必须在首次访问 `JTSdkManager.shared` 前调用 `JTSdkManager.configure(enableStateRestoration:)`。默认不启用；需要配置 `bluetooth-central` 后台模式。用户主动结束 App 或主动调用取消连接等场景不触发系统状态恢复。

## 12.5. 隐私声明与外部资料

JTCardSDK iOS 隐私声明：[查看隐私声明](https://resource.aijiatui.com/my-js/sdk-privacy-statement-ios.html)。固件资料及二代卡 Wi-Fi HTTP 资料在原始文档中仅有内部文档引用，本页面不公开其链接、密码或受限文件。
