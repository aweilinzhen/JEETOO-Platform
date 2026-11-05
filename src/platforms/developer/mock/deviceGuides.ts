import fiveMicPhoto from '../assets/jeetoo-five-mic-device-guide-dark.png'
import threeMicPhoto from '../assets/jeetoo-three-mic-flash-device-guide-dark.png'

export type DeviceGuideId = 'five-mic' | 'three-mic-flash'

export type DeviceGuideRow = { label: string; value: string }
export type DeviceGuideSection = {
  id: string
  number: string
  title: string
  intro?: string
  rows?: DeviceGuideRow[]
  notes?: string[]
}

export type DeviceGuideProduct = {
  id: DeviceGuideId
  name: string
  shortName: string
  description: string
  features: string[]
  image: string
  imageAlt: string
  manualName: string
  sections: DeviceGuideSection[]
}

export const deviceGuideProducts: Record<DeviceGuideId, DeviceGuideProduct> = {
  'five-mic': {
    id: 'five-mic',
    name: '加推五麦录音卡',
    shortName: '五麦录音卡',
    description: '卡片式录音产品，手册涵盖会议与闪念录音、蓝牙/Wi-Fi/电脑传输、U 盘模式及固件升级。',
    features: ['会议录音', '闪念录音', '蓝牙传输', 'Wi-Fi 快传', 'U 盘模式', '固件升级'],
    image: fiveMicPhoto,
    imageAlt: '加推五麦录音卡产品图',
    manualName: '加推五麦录音卡使用手册',
    sections: [
      { id: 'product-intro', number: '01', title: '产品概述', intro: '本录音卡是一款卡片式录音产品。手册介绍会议录音、闪念录音、设备连接、数据传输与固件升级。' },
      { id: 'hardware', number: '02', title: '硬件按键及接口介绍', intro: '手册提及 Mark 键、录音拨钮及 USB 连接。未说明 USB 接口规格，因此此处不标注接口类型。', rows: [
        { label: 'Mark 键', value: '用于开关机、闪念录音、录音重点标记、复位及恢复出厂设置。' },
        { label: '录音拨钮', value: '拨钮向上开始会议录音，向下结束会议录音；操作会根据算法切换现场录音与通话录音模式。' },
        { label: 'USB 连接', value: '硬复位说明要求连接 USB 供电；手册未注明接口规格。' },
      ] },
      { id: 'power-reset', number: '03', title: '开关机与设备复位', rows: [
        { label: '开机', value: '长按 Mark 键 1 秒；蓝灯亮 1 秒后熄灭。' },
        { label: '关机', value: '设备开机且录音拨钮未开启时，0.5 秒内连续按 Mark 键 7 次；红灯亮 1 秒后关机。' },
        { label: '硬复位', value: '设备软件崩溃时连接 USB 供电，0.5 秒内连续短按 Mark 键 3 次，再长按 3 秒。硬复位后设备重启，不是直接关机。' },
        { label: '休眠', value: '默认无操作 30 分钟后休眠；APP 可设置休眠时间，0 秒为从不休眠。手册列举 15 分钟、30 分钟、1 小时、3 小时、5 小时及从不。休眠时拨动录音拨钮或长按 Mark 键可立即启动录音。' },
      ] },
      { id: 'recording', number: '04', title: '录音操作', rows: [
        { label: '闪念录音', value: '长按 Mark 键开始录音，红灯长亮并振动一次；松开 Mark 键结束录音，灯熄灭并振动两次。' },
        { label: '会议录音', value: '拨钮向上开始录音，红灯长亮并振动一次；向下拨回结束录音，灯熄灭并振动两次。现场录音与通话录音由算法切换，操作上无区别。' },
        { label: '重点标记', value: '会议录音过程中按住 Mark 键标记重点，按住期间蓝灯亮，松开后蓝灯熄灭。' },
      ] },
      { id: 'bluetooth', number: '05', title: '蓝牙连接', rows: [
        { label: '待连接', value: '开机或退出休眠后设备持续广播；白灯闪烁 30 秒。若一直未连接，将在默认休眠时间到达后休眠。' },
        { label: '已连接', value: '白灯长亮 5 秒后熄灭。连接状态下按 Mark 键不会闪白灯。' },
      ] },
      { id: 'transfer', number: '06', title: '文件管理与传输', rows: [
        { label: '蓝牙传输', value: '设备有录音且连接 APP 后自动开始传输；文件传输完成后自动停止。蓝牙传输时不亮传输灯。' },
        { label: 'Wi-Fi 传输', value: '在 APP 手动启用 Wi-Fi；热点等待连接时青灯闪烁，Wi-Fi 连接后青灯熄灭，传输中青灯长亮，传输结束后 Wi-Fi 自动关闭。' },
        { label: 'U 盘模式', value: '默认关闭；APP 可发起开启或关闭。通过数据线连接电脑时，开启后进入 U 盘模式。手册注明当前仅用于产测环节。' },
      ] },
      { id: 'indicators', number: '07', title: '指示灯状态', rows: [
        { label: '白灯闪烁 30 秒', value: '蓝牙未连接。' },
        { label: '白灯长亮 5 秒', value: '蓝牙已连接，之后熄灭。' },
        { label: '青灯闪烁 / 熄灭 / 长亮', value: 'Wi-Fi 已启用等待连接 / Wi-Fi 已连接 / Wi-Fi 数据传输中。蓝牙传输不亮灯。' },
        { label: '紫灯闪烁 5 秒 / 长亮', value: '电量不足 / 充电中。' },
        { label: '绿灯长亮', value: '电量已满。' },
        { label: '黄灯闪烁 5 秒', value: '设备存储已满，容量在 5% 以内。' },
        { label: '红蓝灯闪烁 / 红灯长亮', value: '固件升级中 / 设备正在录音。' },
        { label: '蓝灯长亮', value: '按住按钮，翻译中。' },
      ], notes: [
        '蓝牙连接与充电同时发生时，充电紫灯优先；录音中连接蓝牙时，录音红灯优先。',
        '录音中开始充电或传输时，手册列明录音红灯优先。Wi-Fi 传输期间充电时，传输青灯优先。',
        '录音时存储已满：黄灯闪烁 5 秒后切换为录音红灯。录音时电量不足：紫灯闪烁 5 秒后切换为红灯；电量不足且存储已满时，依次显示紫灯 5 秒、黄灯 5 秒、红灯。',
        '传输期间开始录音时，手册说明蓝牙或 Wi-Fi 传输中止，录音红灯优先。',
      ] },
      { id: 'maintenance', number: '08', title: '设备维护与恢复出厂', intro: '恢复出厂设置会清空全部数据。APP 端也可以恢复出厂设置。', rows: [
        { label: '按键恢复', value: '录音拨钮未开启时，连续按 Mark 键 5 次，再长按 5 秒；紫灯亮 1 秒后熄灭、马达振动两次，表示重置成功。手册亦将操作记作短按 5 次后最后长按，共 6 次。' },
      ] },
      { id: 'firmware', number: '09', title: '固件升级', rows: [
        { label: '升级中', value: 'APP 发起固件升级后，设备红蓝灯闪烁。' },
        { label: '升级完成', value: '升级完成后指示灯熄灭。' },
      ] },
    ],
  },
  'three-mic-flash': {
    id: 'three-mic-flash',
    name: '加推三麦录音卡（闪念版）',
    shortName: '三麦录音卡（闪念版）',
    description: '集 NFC 名片、Mark 标记与录音转写于一体。包含闪念录音、会议录音及通过蓝牙和 Wi-Fi 传输文件的操作说明。',
    features: ['NFC 名片', '闪念录音', '会议录音', '蓝牙连接', 'Wi-Fi 传输', '录音标记'],
    image: threeMicPhoto,
    imageAlt: '加推三麦录音卡（闪念版）正反面产品图',
    manualName: '加推三麦录音卡使用手册（闪念版）',
    sections: [
      { id: 'product-intro', number: '01', title: '产品概述', intro: '加推录音卡是一款集名片、Mark 和录音转写于一体的智能设备。录音存储在卡片上，连接手机 APP 后经低速蓝牙或高速 Wi-Fi 传输到 APP，再进行转写和会议纪要总结。', notes: ['闪念录音文件名带有 _flash 后缀。长录音每 5 小时自动分割为一个文件，后续文件按文件名_2、文件名_3 的格式命名。'] },
      { id: 'nfc-card', number: '01+', title: 'NFC 名片', intro: '手机轻触设备 NFC 区域，可通过浏览器打开名片。' },
      { id: 'hardware', number: '02', title: '硬件按键及接口介绍', intro: '手册涉及录音拨钮、Mark 键和 USB 充电连接；未说明 USB 接口规格。', rows: [
        { label: '录音拨钮', value: '向上拨开始会议录音，向下拨结束录音。' },
        { label: 'Mark 键', value: '用于闪念录音、长录音重点标记、开关机、唤醒蓝牙广播、硬复位及恢复出厂设置。' },
        { label: 'USB 连接', value: '手册在硬复位和充电说明中提及 USB；未注明接口规格。' },
      ] },
      { id: 'power-reset', number: '03', title: '开关机与设备复位', rows: [
        { label: '开机', value: '长按 Mark 键 1 秒开机，蓝灯亮 1 秒。未绑定账户时白灯闪烁；已绑定账户时白灯长亮 5 秒。连接后白灯熄灭。' },
        { label: '关机', value: '设备开机且录音拨钮未开启时，0.5 秒内短按 Mark 键 7 次；红灯亮 1 秒后关机。' },
        { label: '硬复位', value: '设备软件崩溃时连接 USB 供电，0.5 秒内短按 Mark 键 3 次，再长按 3 秒。USB 用于给复位芯片供电。' },
        { label: '休眠与唤醒', value: '休眠章节记载：3 小时不使用后自动休眠；单击 Mark 键激活 BLE 广播，若 3 小时内未连接手机且未录音，则再次自动休眠。SDK 提供休眠时长设置能力。' },
      ], notes: ['开机/配对流程另记载：10 分钟内无操作自动休眠；手册未解释此时间与休眠章节所述 3 小时的适用条件差异。'] },
      { id: 'recording', number: '04', title: '录音操作', rows: [
        { label: '闪念录音', value: '非录音状态下长按 Mark 键，马达振动后开始录音；松开 Mark 键，马达振动后结束录音。手册另在概述中写作再次长按结束，具体以设备实际交互为准。闪念为现场录音模式，文件名增加 _flash 后缀。' },
        { label: '会议录音', value: '拨钮向上开始、向下结束。现场录音与通话录音由算法自动区分，无需手动选择。开始时红灯长亮、马达振动一次；结束时灯熄灭、马达振动两次。' },
        { label: '重点标记', value: '长录音过程中可按 Mark 键标记；手册说明 Mark 键可用于长录音标记。' },
        { label: 'APP 状态', value: '设备蓝牙连接 APP 时，开始录音后 APP 显示正在录音及录音时长。' },
      ] },
      { id: 'bluetooth', number: '05', title: '蓝牙连接', rows: [
        { label: '未绑定账户', value: '开启蓝牙广播时白灯闪烁；手册指示白灯闪烁 30 秒。' },
        { label: '已绑定账户', value: '开启蓝牙广播时白灯长亮 5 秒。设备连接后白灯熄灭。' },
        { label: '休眠后唤醒', value: '单击 Mark 键激活 BLE 广播；若未连接手机且未录音，按手册休眠说明，3 小时后再次休眠。' },
      ] },
      { id: 'transfer', number: '06', title: '文件管理与传输', rows: [
        { label: '蓝牙传输', value: '连接手机 APP 后可无线传输录音文件；手册称蓝牙为低速传输方式。' },
        { label: 'Wi-Fi 传输', value: '设备 Wi-Fi 启动、等待连接时青灯闪烁；Wi-Fi 连接后青灯熄灭；传输中青灯长亮。' },
        { label: 'U 盘模式', value: '设备蓝牙连接 APP 时可开关 U 盘模式。开启后连接电脑进入 U 盘模式并可操作文件；关闭时连接电脑不进入 U 盘模式。默认关闭。' },
      ] },
      { id: 'indicators', number: '07', title: '指示灯状态', rows: [
        { label: '白灯闪烁 30 秒', value: '未绑定账户。' },
        { label: '白灯长亮 5 秒', value: '账户绑定成功。' },
        { label: '青灯闪烁 / 长亮', value: 'Wi-Fi 已启用、等待连接 / Wi-Fi 数据传输中；连接后青灯熄灭。' },
        { label: '紫灯闪烁 5 秒 / 长亮', value: '电量不足 / 充电中。' },
        { label: '绿灯长亮', value: '电量已满；断开电源后绿灯消失。' },
        { label: '黄灯闪烁 10 秒', value: '设备存储已满，容量在 10% 以内。' },
        { label: '红蓝灯闪烁', value: '固件升级中。' },
        { label: '红灯长亮', value: '设备正在录音。' },
        { label: '蓝灯闪一次', value: '录音中标注高亮。' },
      ], notes: [
        '录音灯优先：录音时充电、连接蓝牙或传输时优先显示录音状态；录音时存储已满，黄灯先闪烁 10 秒，再显示红灯。',
        '蓝牙连接同时充电时，蓝牙连接灯优先；Wi-Fi 热点设置同时充电时，Wi-Fi 热点灯优先；传输同时充电时，传输灯优先。',
      ] },
      { id: 'maintenance', number: '08', title: '设备维护与恢复出厂', intro: '恢复出厂设置会清空全部数据；手册也说明支持通过 APP 恢复出厂设置。', rows: [
        { label: '按键恢复', value: '录音拨钮未开启时，连续按 Mark 键 5 次，再长按 5 秒，直到充电灯熄灭；马达振动两次表示重置成功。' },
      ] },
      { id: 'firmware', number: '09', title: '固件升级', rows: [
        { label: '升级中', value: '固件升级时红蓝灯闪烁。' },
        { label: '升级完成', value: '升级完成后指示灯熄灭。' },
      ] },
    ],
  },
}

