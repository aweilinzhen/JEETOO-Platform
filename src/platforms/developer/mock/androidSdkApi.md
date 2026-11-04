# 加推录音卡Android SDK

# 更新日志：

|日期|更新内容|创建人|
|---|---|---|
|2026/01/20|初版SDK v1\.0\.0|JKenny|
|2026/04/13|添加打开 WiFi 时指定 SSID、PWD（0\.1\.6固件版本才支持）|JKenny|
|2026/04/23|兼容 targetSDK \< 31 项目，添加边录边传相关协议方法|JKenny|
|2026/05/12|添加 OTA 固件升级接口 SDK v1\.0\.3|JKenny|
|2026/05/22|获取设备信息相关字段格式调整，蓝牙扫描回调逻辑调整，SDK v1\.0\.4|JKenny|
|2026/07/31|新增边录边传 补帧下载功能，一二代协议兼容 SDK v1\.0\.6（Beta 版本）|JKenny|
|2026/08/25|增加二代卡（获取音频文件列表、WiFi\-HTTP 操作接口文档）|JKenny|
|2026/09/03|设备状态新增 mtu 字段、蓝牙连接操作相关逻辑优化|JKenny|

# 隐私声明：

JTCardSDK Android 隐私声明地址：

https://resource\.aijiatui\.com/my\-js/sdk\-privacy\-statement\-android\.html

# **固件版本说明：**

[固件版本](https://my.feishu.cn/wiki/C73DwHpSYiQCdWk8vzOc5m86nwm)   密码：jiatui888

|#### 卡片类型|#### 通俗说法|#### 固件说明|
|---|---|---|
|1. 三麦\+EMMC录音卡<br>2. 三麦\+TF录音卡|一代卡|SDK中，如某方法仅适用于某个版本之后的固件，则通常描述为【\>= 一代卡XXX】|
|1. 五麦\+EMMC录音卡|二代卡|SDK中，如无特殊描述，则适用于一代卡的调用方法，均适用于二代卡|





本 SDK 用于调用 加推录音卡 相关功能使用。

# 1、SDK使用说明

SDK 最低支持： Android 5\.0（API 21）

## 1\.1 集成

将 **jtcard\-sdk\-x\.x\.x\-release\.aar** 复制到项目 libs 目录下；

在 gradle 中配置相关依赖：

```Kotlin
flatDir **{**
**    **dirs("app/libs")
**}**

implementation(files("libs/jtcard-sdk-x.x.x-release.aar")) // x.x.x 修改为对应的版本号
```



## 1\.2 权限配置

本 SDK 内部使用到蓝牙与WiFi 相关系统功能，客户端在使用 SDK 前应先进行相关权限申请。

```Kotlin
// 蓝牙
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

// 部分机型可能还需要
<uses-permission 
    android:name="android.permission.ACCESS_FINE_LOCATION"
    android:maxSdkVersion="30" />
<uses-permission
    android:name="android.permission.ACCESS_COARSE_LOCATION"
    android:maxSdkVersion="30" />
<uses-feature
    android:name="android.hardware.bluetooth_le"
    android:required="true" />
    
// WiFi 不使用WiFi热点传输文件可不添加
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
<uses-permission
    android:name="android.permission.NEARBY_WIFI_DEVICES"
    android:usesPermissionFlags="neverForLocation" />

```

应用内动态申请蓝牙相关权限：

```Kotlin
Manifest.permission.BLUETOOTH_SCAN
Manifest.permission.BLUETOOTH_ADVERTISE
Manifest.permission.BLUETOOTH_CONNECT
```

**其他兼容问题**

1、目前发现 鸿蒙 4\.2 机型，在手机系统 **定位服务** 未开启的情况下，系统不允许 App 进行蓝牙扫描（扫描没有结果），建议发现该类机型时，提示用户打开系统定位服务。

示例代码：

```Dart
object LocationUtil {
    */***
*     * 判断系统定位开关是否开启*
*     */*
*    *fun isLocationEnabled(context: Context): Boolean {
        val locationManager =
            context.getSystemService(Context.*LOCATION_SERVICE*) as LocationManager

        return try {
            locationManager.isProviderEnabled(LocationManager.*GPS_PROVIDER*) ||
                    locationManager.isProviderEnabled(LocationManager.*NETWORK_PROVIDER*)
        } catch (e: Exception) {
            false
        }
    }

    */***
*     * 跳转系统定位设置页面*
*     */*
*    *fun openLocationSetting(activity: Activity) {
        val intent = Intent(Settings.*ACTION_LOCATION_SOURCE_SETTINGS*)
        activity.startActivity(intent)
    }
}
```

# 2、初始化SDK

初始化 SDK

```Kotlin
import com.jiatui.jtcardsdk.JTSdkManager

// 初始化 SDK
JTSdkManager.initialize(context)
```



# 3、连接蓝牙设备

## 3\.1 扫描蓝牙广播



```Kotlin
// 开始扫描
JTSdkManager.startScanning(this)

// 实现 ScanListener 接口
override fun onScanResult(peripheral: Peripheral) {
    // 获取到匹配的蓝牙设备
}
```



## 3\.2 获取系统已配对设备（系统原生API）

```Kotlin
// 参考代码
val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
if (bluetoothAdapter != null) {
    val sets = bluetoothAdapter.bondedDevices
    // 从 sets 中过滤出自己的设备
}
```



## 3\.3 连接蓝牙设备

```Kotlin
// 关闭蓝牙连接时发起配对（默认为 true，iOS 为固件控制）
// 关闭后 App 可不进行配对直接连上设备，避免配对后记录到系统蓝牙的已配对列表里（未打开App时系统发现设备也会主动连接上）
JTSdkManager.isConnectPair = false

// 监听蓝牙连接状态
JTSdkManager.registerConnectStateListener(this)

// 连接蓝牙设备
JTSdkManager.connect(peripheral)
// or 如果是使用原生 API 获取的 bluetoothDevice 设备，可以使用这个方法进行连接
JTSdkManager.connectBleWithMac(bluetoothDevice.address)

// 实现 BleConnectStateListener 接口
override fun onBleConnectStateChanged(state: JTSdkManager.BleConnectState) {
    when (state) {
        JTSdkManager.BleConnectState.Connecting -> {

        }
        JTSdkManager.BleConnectState.Connected -> {
            // 连接成功后即可对设备进行操作（查询电量、设备信息、传输文件等）
            Toast.makeText(this, "连接成功", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, CmdTestActivity::class.java))
        }
        else -> {
            
        }
    }
}
```



# 4、操作设备

## 4\.1 注册响应监听

因蓝牙通讯为异步操作，所有结果均已接口回调方式响应，调用操作方法的返回值仅表示，是否成功将请求通过蓝牙发送。

```Kotlin
JTSdkManager.registerBleListener(object : JTSdkManager.BleListener {

    override fun onKeyboardEvent(keycode: Int) {
       // 表示卡片按钮 按下或抬起 0 按下， 1 抬起（部分版本需在录音状态下才能监听到）
    }

    override fun onElectricityLevel(level: Int) {}

    override fun onDeviceInfo(mac: String, pid: String, ver: String) {}

    override fun onFileList(fileList: List<FileInfo>) {}

    override fun onDownloadFile(
        type: DownloadType,
        fileSize: Int?,
        blockDataEndPosition: Int?,
        blockData: ByteArray?
    ) {}

    override fun onReceiveException(receiveData: ByteArray?, exceptionMsg: String?) {}

    // 其余方法按需实现
})

```



## 4\.2 获取电量

```Kotlin
JTSdkManager.getElectricityLevel()

// 监听结果
override fun onElectricityLevel(level: Int) {}
```



## 4\.3 获取设备信息

```Kotlin
JTSdkManager.getDeviceInfo()

// 监听结果
override fun onDeviceInfo(mac: String, pid: String, ver: String) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|mac|设备 Mac 地址||||
|pid|设备类型||||
|ver|设备固件版本号||||



## 4\.4 获取设备SN码

```Kotlin
JTSdkManager.getSN()

// 监听结果
override fun onSNCode(snCode: String) {}
```



## 4\.5 设备休眠时间

```Kotlin
// 获取
JTSdkManager.getSleepTime()
// 监听结果
override fun onReadSleepTime(time: Int) {}

// 设置 seconds = 0 为从不休眠
JTSdkManager.setSleepTime(seconds)
// 监听设置结果
override fun onSleepTimeResult(isSuccess: Boolean) {}
```



## 4\.6 设备WiFi

```Kotlin
// 获取
JTSdkManager.getWiFiState()
// 打开关闭设备 wifi 默认打开方式，ssid/pwd 为出厂默认
JTSdkManager.setWifiSwitch(true/false)

// 固件 >= 0.1.6 版本才支持（可先不使用）
// ssid 为 WiFi 名称，pwd 为密码长度必须 >= 8位
JTSdkManager.setWifiSwitch(isOpen = true, ssid = wifiName, pwd = wifiPwd)

// 监听 wifi 状态
// 替换原有 onWiFiState(isOpen: Boolean) 方法
override fun onWiFiState(isOpen: Boolean, ssid: String? = null, pwd: String? = null)
```



## 4\.7 设备时间

```Kotlin
// 获取
JTSdkManager.getDeviceDatetime()
// 监听 获取设备时间
override fun onDeviceDatetime(datetime: String) {}

// 同步时间(yyyyMMddHHmmss) 到设备
JTSdkManager.syncDeviceDatetime("20260120133512")
// 监听同步结果
override fun onSyncDatetimeResult(isSuccess: Boolean) {}
```



## 4\.8 U盘模式

```Kotlin
// 获取
JTSdkManager.getUsbFlashMode()
// 打开关闭设备 U盘模式
JTSdkManager.setUsbFlashMode(true/false)

// 监听同步结果
override fun onUsbFlashMode(isOpen: Boolean) {}
```



## 4\.9 设备存储信息

```Kotlin
// 获取
JTSdkManager.getStoreInfo()

// 监听同步结果
override fun onDeviceStoreInfo(fileCount: Int, storeTotalSize: Int, usedSize: Int) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|fileCount|录音文件数量||Int||
|storeTotalSize|设备存储总大小（KB）||Int||
|usedSize|已用大小（KB）||Int||



## 4\.10 获取文件列表

```Kotlin
// 获取指定 startIndex 到 endIndex 的文件信息,一次最多获取 5 个文件的信息
// 起始下标从 1 开始
JTSdkManager.getFileList(1, 5)

// 监听同步结果
override fun onFileList(fileList: List<FileInfo>) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|FileInfo|||||
|name|文件名称||Int||
|modifyTime|文件保存时间||String||
|size|文件大小（字节）||Int||
|serialNumber|文件序号||Int|删除增加文件时序号会改变|

注意：没有在上表中写明的字段暂不使用（其他产品固件才有值本产品为空）。



## 4\.11 删除指定文件

```Kotlin
// 根据指定 文件名称 删除文件
JTSdkManager.deleteFile(fileName)

// 监听删除结果
override fun onDeleteFileResult(isSuccess: Boolean) {}
```



## 4\.12 清空所有文件

```Kotlin
// 清空设备中的所有音频文件
JTSdkManager.clearFiles()

// 监听删除结果
override fun onClearResult(isSuccess: Boolean) {}
```



## 4\.13 设备状态

```Kotlin
// 查询设备状态
JTSdkManager.getDeviceState()

// 监听删除结果
override fun onDeviceState(rsState: Int, lsState: Int, usState: Int, isDeviceReport: Boolean) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|rsState<br>|0 录音未打开<br>1 会议录音<br>3 结束录音<br>4 闪念录音（长按按钮）||Int<br>||
|lsState|0 表示未解锁录音<br>1 表示已解锁录音\(默认为解锁，未解锁时无法开启设备录音\)|||未实现<br>二代卡已实现|
|usState|0 U盘模式关闭<br>1 U盘模式打开||String<br>||
|mtu|协商的 mtu 大小|||v1\.0\.7 SDK 才支持|
|isDeviceReport|是否设备主动上报||Boolean||



## 4\.14 录音状态同步

在设备开启录音时会同步录音装备给到客户端，频率为每秒一次。

```Kotlin
// 监听录音状态
override fun onRecordState(rsType: Int, duration: Int, dataSize: Int, fileName: String) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|rsType<br>|0 录音未打开<br>1 会议录音<br>3 结束录音<br>4 闪念录音（长按按钮）||Int||
|duration|本次录音时长||Int||
|dataSize|本次录音文件大小||Int||
|fileName|本次录音文件的名称||String|在录音过程中因用户可能使用 MARK 标记，所以文件名称可能会有变化|



## 4\.15 BLE传输文件

同一时刻只能调用一次 `downloadFile` 直到完成。

```Kotlin
// fileName 要下载的文件名称
// position 从第几个字节开始传输，用于断点续传，默认为 0 表示从头开始完整传输
JTSdkManager.downloadFile(fileName, position)

// 监听文件流，进行本地保存
override fun onDownloadFile(type: DownloadType, fileSize: Int? = null, blockDataEndPosition: Int? = null, blockData: ByteArray? = null) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|type<br>|FileSize 设备返回，准备传输的文件大小（fileSize 字段）<br>FileData 文件流（blockDataEndPosition、blockData 字段）<br>FileComplete 传输结束<br>FileCancel 传输被取消||Int<br>||
|fileSize|准备传输的文件总大小||Int||
|blockDataEndPosition|表示本数据块在整个文件中，结束的位置||Int||
|blockData|文件数据块||ByteArray||



## 4\.16 取消当前文件传输

```Kotlin
// 取消当前文件传输，取消成功时会从 onDownloadFile 回调中返回 type 为 FileCancel
JTSdkManager.getCancelDownloadFile()
```



## 4\.17 获取录音 MARK

**固件支持版本：**\>= 一代卡0\.2\.0

根据录音文件名称查询录音过程中的 MARK 按键记录。文件名称可从文件列表或录音状态回调中获取。

```Kotlin
JTSdkManager.getMark(fileName)

// 查询结果
override fun onRecordMark(success: Boolean, marks: String?) {
    if (!success) return

    // marks 格式：按下时间,抬起时间;按下时间,抬起时间;...
    // 例如：8,8;20,21;55,70;
}
```

MARK 时间单位为秒，并对应录音文件的音频时间；例如 `20,21;` 表示在第 20 秒按下 MARK 键、第 21 秒抬起。当前设备最多记录 1000 对 MARK 数据。

**参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|fileName|要查询的录音文件名称|String|使用设备返回的完整文件名称|
|success|设备是否成功处理本次查询|Boolean||
|marks|MARK 记录字符串|String?|操作失败时为 null；无 MARK 时可能为空字符串|



## 4\.18 录音数据实时同步

**固件支持版本：\>= 一代卡0\.2\.0**

设备默认不同步实时录音数据给 App，App 监听到录音开启时根据进业务需求，通过指令请求设备开启或关闭录音数据同步功能（可提前设置）。

开启成功后，设备会将录音相关参数一起发送给 App，如 采样率、声道数、码率、每帧时长等，方便业务解析录音数据。

当前设备默认实时音频数据为 OPUS 裸数据帧（ TOC \+ frame data），应用层拿到数据帧后，可以直接进行解码使用。

开启录音数据同步后，设备会在录音过程中通过蓝牙实时推送音频帧。请先按 5\.1 注册 `BleListener`，并在蓝牙连接成功后调用以下方法。

```Kotlin
// 查询当前录音数据同步状态
JTSdkManager.getAudioSyncStatus()

// 查询结果
override fun onAudioSyncStatus(
    success: Boolean,
    enabled: Boolean,
    config: JTAudioConfig?
) {
    if (!success) return

    // enabled 表示录音数据同步是否已开启
    // config 为设备当前使用的音频参数
}

// 开启或关闭录音数据同步
JTSdkManager.setAudioSyncEnabled(true)  // 开启
JTSdkManager.setAudioSyncEnabled(false) // 关闭

// 设置结果
override fun onAudioSyncEnableResult(
    success: Boolean,
    enabled: Boolean,
    config: JTAudioConfig?
) {
    if (!success) return

    // enabled 表示设置后的状态
}

// 开启后接收设备实时推送的音频帧
override fun onAudioFramesReceived(
    isLastPacket: Boolean,
    frames: List<JTAudioFrame>
) {
    frames.forEach { frame ->
        val frameIndex: Long = frame.frameIndex
        val frameData: ByteArray = frame.data
        // 按 frameIndex 保存或处理音频帧
    }

    if (isLastPacket) {
        // 已收到本次录音的最后一包音频帧
    }
}
```

**注意：**

设置 `setAudioSyncEnabled(true)` 开启音频数据同步后，如果断开蓝牙连接该设置会被重置为 `flase`。

TestBLE Demo 中 `RecordRepository、AudioFrameStore` 为存储音频帧示例，音频帧存储逻辑请自行实现或根据业务需求本地不做存储直接转发至服务端。



**回调参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|success|设备是否成功处理本次查询或设置|Boolean||
|enabled|录音数据同步是否开启|Boolean||
|config|音频编码参数|JTAudioConfig?|操作失败时可能为 null|
|config\.codec|音频编码格式值|Int|0 为  OPUS<br>目前只有这一种|
|config\.sampleRate|采样率|Int|单位：Hz|
|config\.channels|声道数|Int||
|config\.bitDepth|位深|Int|单位：bit|
|config\.bitrate|码率|Int|单位：bit/s|
|config\.frameDuration|单帧时长|Int|单位：ms|
|isLastPacket|是否为本次录音的最后一个音频数据包|Boolean|应以该字段判断音频帧是否全部接收完成|
|frames|本次收到的音频帧列表|List\<JTAudioFrame\>||
|frame\.frameIndex|音频帧序号|Long|范围为 0 到 `0xFFFFFFFFL`|
|frame\.data|音频帧数据|ByteArray|每一帧的 OPUS 裸数据|



## 4\.19 下载指定音频帧

**固件支持版本：\>= 一代卡0\.2\.0**

**固件升级前录制的音频不支持该方式下载**

**同一时刻只能使用调用一次 ****`downloadAudioFrames`**** 或 5\.15 中的 ****`downloadFile`**** 直到完成。**

`downloadAudioFrames` 用于下载完整录音的音频帧，或补传实时同步过程中缺失的帧。一次请求可指定多个帧区间，区间的起止帧均包含在下载范围内。

```Kotlin
import com.jiatui.jtcardsdk.model.JTAudioFrameEvent
import com.jiatui.jtcardsdk.model.JTAudioFrameEventType
import com.jiatui.jtcardsdk.model.JTFrameRange

// requestId 由应用生成，用于关联请求和回调
val requestId = 1L

// 以下三种下载方式按需选择一种

// 示例一：下载完整录音
JTSdkManager.downloadAudioFrames(
    requestId = requestId,
    fileName = fileName,
    ranges = *listOf*(JTFrameRange.all())
)

// 示例二：下载多个缺失区间（包含起止帧）
JTSdkManager.downloadAudioFrames(
    requestId = requestId,
    fileName = fileName,
    ranges = *listOf*(
        JTFrameRange(startFrame = 100, endFrame = 199),
        JTFrameRange(startFrame = 350, endFrame = 499)
    )
)

// 示例三：从指定帧下载到文件末尾
JTSdkManager.downloadAudioFrames(
    requestId = requestId,
    fileName = fileName,
    ranges = *listOf*(JTFrameRange.from(startFrame = 100))
)

// 监听下载事件
override fun onDownloadAudioFrameEvent(event: JTAudioFrameEvent) {
    when (event.type) {
        JTAudioFrameEventType.Size -> {
          // totalFrames 本次传输的音频帧总数
          // fileTotalFrames 本次传输文件音频帧的总数（仅一代卡支持 固件0.2.0）
            val totalFrames = event.totalFrames
        }
        JTAudioFrameEventType.Data -> {
            event.frames.orEmpty().forEach **{** frame **->**
                // 按 frame.frameIndex 保存 frame.data
            **}**
        }
        JTAudioFrameEventType.Complete -> {
            // 本次下载完成
        }
        JTAudioFrameEventType.Cancel -> {
            // 本次下载已取消，取消结果码为 event.cancelCode
        }
    }
}
```

`ranges` 不能为空，否则方法会抛出 `IllegalArgumentException`。`requestId`、`startFrame`、`endFrame` 在 Android SDK 中使用 `Long` 表示协议的 UInt32，有效范围均为 0 到 `0xFFFFFFFFL`。建议应用为每个未完成的下载任务分配唯一 `requestId`，并通过回调中的 `event.requestId` 区分任务。



`Data` 事件的 `isLastPacket` 表示该包是否包含整个录音的最后一帧，不用于替代 `Complete` 事件。



**方法参数说明：**

|**参数名称**|**参数说明**|**数据类型**|**备注**|
|---|---|---|---|
|requestId|本次下载任务 ID|Long|范围为 0 到 `0xFFFFFFFFL`|
|fileName|要下载的录音文件名称|String|使用设备返回的完整文件名称|
|ranges|要下载的帧区间列表|List\<JTFrameRange\>|不能为空；每个区间包含 `startFrame` 和 `endFrame`|
|JTFrameRange\.all\(\)|从第 0 帧下载到文件末尾|JTFrameRange||
|JTFrameRange\.from\(startFrame\)|从指定帧下载到文件末尾<br>|JTFrameRange<br>||

**事件参数说明：**

|**事件类型**|**有效字段**|**说明**|
|---|---|---|
|Size|requestId、totalFrames|设备返回本次传输音频总帧数|
|Data|requestId、startFrameIndex、frameCount、isLastPacket、frames|返回一包音频帧数据<br>|
|Complete|requestId|本次下载任务完成|
|Cancel|requestId、cancelCode|本次下载任务已取消及设备返回的取消结果码|

## 

## 4\.20 取消指定音频帧下载

**固件支持版本：\>= 一代卡0\.2\.0**

使用发起下载时相同的 `requestId` 取消对应任务。取消结果通过 `onDownloadAudioFrameEvent` 返回。

```Kotlin
JTSdkManager.cancelAudioFramesDownload(requestId)

override fun onDownloadAudioFrameEvent(event: JTAudioFrameEvent) {
    if (event.requestId == requestId &&
        event.type == JTAudioFrameEventType.Cancel
    ) {
        // event.cancelCode 为设备返回的取消结果码
    }
}
```

收到相同 `requestId` 且类型为 `Cancel` 的事件后，才表示设备已响应取消请求。

设备无法传输时也会主动发送类型为 `Cancel` 的事件，表示当前无法传输。



## 4\.21 获取 HTTP UserKey

```Kotlin
JTSdkManager.getUserKey()
```

只能在蓝牙已连接且设备信息已成功返回后调用。如果返回空值，App 不应发起 HTTP 请求。切换设备后，必须重新获取新设备对应的 `userkey`。



## 4\.22 获取音频文件列表（仅支持二代卡）

注意：二代卡才支持该方法，使用二代卡时可用该方法代替 **5\.10 获取文件列表** 。

```Kotlin
// offset 表示分页偏移量，从第几个文件开始
// limit 表示每页数量
JTSdkManager.getAudioFileList(offset, limit)

// 监听同步结果
// success 表示请求是否成功
override fun onRecordFileList(success: Boolean, result: JTRecordFileListResult) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|resultCode|结果码 0 成功||Int||
|totalCount|设备文件总数||Int||
|fileCount|本次返回文件数||Int||
|FileInfo|||||
|name|文件名称||Int||
|recordType|录音类型||JTRecordType||
|size|文件大小（字节）||Long||
|durationMs|录音时长（毫秒）||Long||
|startTime|开始时间（Unix 秒时间戳）||Long||
|serialNumber|文件ID||Long||
|mark|录音过程中的 MARK 数据||String||
|md5|文件MD5||String||



## 4\.23 设置通讯密钥（仅支持二代卡）

```Kotlin
// 基础功能密钥
val basicKey = *byteArrayOf*(0x00...)
// 转录功能密钥
val transcriptionKey = *byteArrayOf*(0x00...)

// 两个服务设置相同密钥
JTSdkManager.setEncryptionKey(basicKey)

// or 不同服务设置不同密钥
// JTSdkManager.setEncryptionKey(basicKey, scope = JTEncryptionScope.BASIC_SERVICE)
// JTSdkManager.setEncryptionKey(transcriptionKey, scope = JTEncryptionScope.TRANSCRIPTION_SERVICE)
```

|**类型（JTEncryptionScope）**|**说明**|
|---|---|
|ALL|所有服务|
|BASIC\_SERVICE|基础服务|
|TRANSCRIPTION\_SERVICE|转录服务|



**BASIC\_SERVICE 相关功能**

|**功能**|**说明**|
|---|---|
|5\.3 获取设备信息||
|5\.4 获取设备SN码||
|5\.5 设备休眠时间||
|查询设备配对状态||
|接收按钮事件||
|开启/关闭录音||
|设置/获取休眠时间||
|发送粘贴指令||
|恢复出厂设置||



**TRANSCRIPTION\_SERVICE 相关功能**

|**功能**|**说明**|
|---|---|
|5\.6 设备WiFi||
|5\.7 设备时间||
|5\.8 U盘模式||
|5\.9 设备存储信息||
|5\.10 获取文件列表||
|5\.11 删除指定文件||
|5\.12 清空所有文件||
|5\.13 设备状态||
|5\.14 录音状态同步||
|5\.15 BLE传输文件||
|5\.16 取消当前文件传输||
|5\.17 获取录音 MARK||
|5\.18 录音数据实时同步||
|5\.19 下载指定音频帧||
|5\.20 取消指定音频帧下载||
|5\.21 获取 HTTP UserKey||
|5\.22 获取音频文件列表||





# 5、WiFi传输文件\(一代卡Socket\)

## 5\.1 打开WiFi 热点

1. 通过 5\.6 设备WiFi 相关方法打开设备热点。

2. 通过系统 API 连接热点 WiFi。

3. 使用 SDK 中 `SocketClient` 连接 Socket。



## 5\.2 WIFI传输文件

使用 `SocketClient` 传输文件

```Kotlin
// 连接 Socket
// *maxRetryCount 首次连接失败后的最大重试次数；默认总共尝试 4 次。*
// *retryDelayMillis 重试基础间隔，实际间隔会随失败次数线性增加并限制上限。*
socketClient.connect(maxRetryCount, retryDelayMillis)

// fileName 要下载的文件名称
// position 从第几个字节开始传输，用于断点续传，默认为 0 表示从头开始完整传输
socketClient.downloadFile(fileName, position)

// 监听文件流，进行本地保存
override fun onDownload(type: DownloadType, fileSize: Int?, offset: Int?, blockData: ByteArray?) {}
```

**回调参数说明：**

|**参数名称**|**参数说明**|**是否必须**|**数据类型**|**备注（default）**|
|---|---|---|---|---|
|type<br>|FileSize 设备返回，准备传输的文件大小（fileSize 字段）<br>FileData 文件流（offset、blockData 字段）<br>FileComplete 传输结束||Int||
|fileSize|准备传输的文件总大小||Int||
|offset|||Int||
|blockData|文件数据块||ByteArray||



# 6、OTA 固件升级

TestBLE Demo 中有相应的示例，可通过 Demo 进行 SDK 升级。

## 6\.1 设置 OTA Delegate

```Kotlin
// 注册 OTA 过程回调
JTSdkManager.setOtaListener(this)
// 移除回调
// JTSdkManager.setOtaListener(null)

*/** OTAListener */*

override fun onOTAStateChangeResult(isSuccess: Boolean, isOpen: Boolean) {
    // isSuccess 表示操作 openOTA、closeOTA 是否成功
    // isOpen 表示 OTA 服务是否已经打开，只有 true 打开的情况下才能 startOtaUpgrade 进行升级
}

override fun onOTAStart() {
    // 打开进行 OTA 升级
}

override fun onOTAProgress(progress: Double) {
    // OTA 进度
}

override fun onOTASuccess() {
    // 固件升级成功后避免对卡片进行操作，等待卡片重启后，重新进行蓝牙连接
    // 升级成功后需等待几秒,设备有一个重启的过程，期间蓝牙连接会断开,需重新连接
}

override fun onOTAFailed(failType: OTAFailType) {
    // OTA 失败
}

override fun onNewOTAUpgrade(newBreakPointCode: ByteArray, newMtu: Int) {
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
```

## 6\.2 打开关闭 OTA 服务

```Kotlin
// 进行 OTA 升级前需要先打开服务，不使用 OTA 功能时需要关闭，操作结果在 onOTAStateChangeResult 回调
JTSdkManager.openOTAService()

// 关闭 OTA
JTSdkManager.closeOTAService()
```

## 6\.3 配置 OTA 升级固件信息

```Swift
// 设置升级所需的固件
JTSdkManager.setFirmware(firmwareData)

// 或使用 breakpointCode 跟 breakpointMtu 进行断点设置
// *otaType 参数为固件类型 1代卡 3（默认值），二代卡为 1（还未对外发布）*
// *sendInterval 参数用于设置发送固件包的时间间隔，默认50，TF卡版本建议设置 80~100（可不设置）*
JTSdkManager.setFirmware(firmwareData, breakpointCode = breakpointCode, breakpointMtu = breakpointMtu)
```

## 6\.4 开始 OTA 升级

```Swift
// 开始 OTA 升级
JTSdkManager.startOtaUpgrade()
```

## 6\.5 取消 OTA 升级

```Swift
// 取消正在进行的 OTA 升级（正常情况下不建议使用）
JTSdkManager.cancelOTA()
```



# 7、二代卡WiFi（HTTP\)

该 HTTP 相关接口仅支持二代卡使用。

[二代卡 WiFi 快传 HTTP 接口文档](https://my.feishu.cn/docx/PCwcdkpKtodTUGxBFW2cohVvnvh)   密码：jiatui888



