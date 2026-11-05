export type FaqBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'ordered'; items: string[]; start?: number }
  | { type: 'subheading'; text: string }
  | { type: 'note'; text: string }
  | { type: 'contact'; text: string; label: string; href: string }

export type FaqItem = {
  id: number
  category: string
  question: string
  answer: FaqBlock[]
  related?: number[]
}

export const faqCategories = [
  { id: 'connection', title: '设备连接与配对' },
  { id: 'recording', title: '录音与设备使用' },
  { id: 'charging', title: '充电与续航' },
  { id: 'files', title: '文件传输与存储' },
  { id: 'compatibility', title: '配件与手机兼容' },
  { id: 'troubleshooting', title: '设备管理与故障处理' },
] as const

export const faqItems: FaqItem[] = [
  {
    id: 1, category: 'connection', question: '为什么搜索不到设备？', related: [2, 17], answer: [
      { type: 'ordered', items: ['确认蓝牙已开启，再连接设备。'] },
      { type: 'subheading', text: 'iOS' },
      { type: 'bullets', items: ['前往 iPhone「设置」，找到 APP，确保已启用蓝牙权限。'] },
      { type: 'subheading', text: 'Android' },
      { type: 'bullets', items: ['打开手机设置，启用 APP 的蓝牙和位置权限。', 'Android 12 之前需选择「始终允许」。'] },
      { type: 'ordered', start: 2, items: ['短按 MARK 键 1 秒，白灯亮起，说明设备已开启。'] },
      { type: 'bullets', items: ['如果设备没有亮起白灯，请使用提供的充电线给录音卡充电。', '充电时紫色指示灯会长亮，充电至少 10 分钟再尝试连接。'] },
      { type: 'ordered', start: 3, items: ['附近如有多个手机，可能是其他手机连接了这张卡片。'] },
      { type: 'bullets', items: ['可尝试将其他手机的蓝牙关闭。', '或将卡片与当前手机一同带到距离较远的地方，规避其他手机的干扰。', '通过卡片背后的 SN 码后 6 位（该信息即为卡片的蓝牙名称），匹配手机上识别出的蓝牙名称，确认连接的卡片为当前手上的卡片。'] },
      { type: 'ordered', start: 4, items: ['如果仍未找到设备，可以联系客服。'] },
    ],
  },
  {
    id: 2, category: 'connection', question: '设备连接不上，怎么办？', related: [1, 16, 17, 23], answer: [
      { type: 'bullets', items: [
        'A0：确保卡片是有电状态，并将 APP 升级到最新版本。',
        'A1：卡片可能处于休眠状态（默认出厂设置休眠时间为 3 小时），如果您之前连接过，长按录音卡的 MARK 键 1 秒，开启录音卡，确认能否正常连接。',
        'A2：鸿蒙部分机型，需要先在系统设置 - 蓝牙 - Aone-xxxx 进行配对，再去 APP 内进行录音卡连接。如果蓝牙设置里搜不到 Aone-xxx 设备，可以关闭蓝牙开关再打开。',
        'A3：如果是 iOS/华为手机，您之前未从 APP 内连接过卡片，而是从手机设置的蓝牙连接的卡片。您需要从手机系统设置 - 蓝牙 - 忽略 Aone-xxxx 的设备（或者取消配对），然后再从 APP 内连接录音卡。',
        'A4：如果蓝牙中找不到 Aone-xxx 的录音卡设备（录音卡一直在白灯闪烁），可以在录音卡上：',
      ] },
      { type: 'ordered', items: ['快速先短按 MARK 键 7 下（关机，红灯亮一下）。', '再长按 MARK 键 1 秒。', '关掉手机蓝牙开关，再打开。', '再去 APP 里连接录音卡。'] },
      { type: 'bullets', items: [
        'A5：如果您有多台手机，有可能当前的卡片被其他手机连接了，请先将之前连接过录音卡的手机的蓝牙关闭或忽略 Aone-xxxxx 卡片，再使用新的手机设备，在 APP 内完成蓝牙连接。',
        'A6：固件升级成功后，卡片需要 3～5 分钟的更新时间，等待完成后即可连接。',
      ] },
    ],
  },
  {
    id: 3, category: 'troubleshooting', question: '卡片 OTA 升级后无响应？', answer: [
      { type: 'paragraph', text: '固件升级成功后，卡片自己需要 3～5 分钟的更新时间。' },
      { type: 'paragraph', text: '在这个过程里，暂时还不能通过 APP 查看进度，稍等一会即可。' },
    ],
  },
  {
    id: 4, category: 'compatibility', question: 'OPPO 手机，为什么一连接上录音卡，微信的输入法就跳不出来了？', answer: [
      { type: 'paragraph', text: '这是 OPPO 手机的系统键盘冲突导致的。' },
      { type: 'paragraph', text: '可以进入系统设置 - 蓝牙，在已配对录音卡旁的设置图标，关闭「输入设备」「键盘」类选项。' },
    ],
  },
  {
    id: 5, category: 'recording', question: '录音卡可以录手机通话吗？', answer: [
      { type: 'paragraph', text: '支持，电话、微信视频、腾讯、钉钉、飞书等线上会议，全都能录。' },
      { type: 'paragraph', text: '但需将录音卡贴合手机背部/听筒震动区域。' },
      { type: 'subheading', text: '注意' },
      { type: 'bullets', items: ['蓝牙耳机通话不支持。', '放在桌面上不能录到手机内部声音。'] },
      { type: 'paragraph', text: '现场录音 ↔ 通话录音，可智能识别，自动切换，无需手动操作。' },
      { type: 'subheading', text: '现场录音场景' },
      { type: 'bullets', items: ['会议记录', '课堂讲座', '采访录音', '培训演讲', '研讨会'] },
      { type: 'subheading', text: '通话录音场景' },
      { type: 'bullets', items: ['电话采访', '微信视频通话', '线上会议', '电话咨询'] },
    ],
  },
  {
    id: 6, category: 'compatibility', question: '如何使用磁吸卡套？', answer: [
      { type: 'subheading', text: '苹果手机（iPhone 12 及以上）' },
      { type: 'paragraph', text: '直接吸附：手机背面自带磁吸功能，将卡套对准吸附即可使用。' },
      { type: 'subheading', text: '安卓/鸿蒙手机' },
      { type: 'paragraph', text: '贴圈后吸附：撕下磁吸圈背胶保护膜，将磁吸圈贴于手机背部合适位置，再吸附卡套。' },
    ],
  },
  {
    id: 7, category: 'recording', question: '戴蓝牙耳机的情况，可以录音吗？', answer: [
      { type: 'paragraph', text: '不支持，录音卡无法直接获取蓝牙耳机中播放的声音。' },
    ],
  },
  {
    id: 8, category: 'recording', question: '可以脱离手机单独使用吗？', answer: [
      { type: 'paragraph', text: '可以，脱离手机依然可以独立录音。' },
      { type: 'paragraph', text: '离线录音时设备可独立工作，录音文件会在 APP 重新连接设备后，自动同步到 APP。' },
    ],
  },
  {
    id: 9, category: 'recording', question: '录音卡防水吗？', answer: [
      { type: 'paragraph', text: '不防水，请避免让设备接触任何液体，以防损坏。' },
    ],
  },
  {
    id: 10, category: 'charging', question: '一般充电多久设备会充满？', related: [11, 27], answer: [
      { type: 'paragraph', text: '从 0 到 100% 需要约 1.5 小时即可充满电池。' },
    ],
  },
  {
    id: 11, category: 'charging', question: '为什么连接充电线之后充不了电？', related: [10, 27], answer: [
      { type: 'paragraph', text: '因为录音卡是非常薄的电子产品，为保护电池寿命及防止短路，电池不支持使用快充头进行充电。' },
      { type: 'paragraph', text: '如使用的充电头是超过 5W 的，则无法充电。' },
      { type: 'paragraph', text: '当发现充不了电时，可以检查充电头是否为快充头，或者直接用笔记本电脑连接充电。' },
    ],
  },
  {
    id: 12, category: 'charging', question: '为什么充电中，开启录音没反应呢？', answer: [
      { type: 'bullets', items: ['充电过程中，无法开启录音。', '录音中，去充电不影响录音，但无法正常充电。'] },
    ],
  },
  {
    id: 13, category: 'charging', question: '设备能录多久？', answer: [
      { type: 'paragraph', text: '续航能力强劲，最长连续录音可达 35 小时，待机最长 60 天。' },
    ],
  },
  {
    id: 14, category: 'troubleshooting', question: '卡片坏了但里面有重要录音，可以恢复吗？', answer: [
      { type: 'paragraph', text: '如果设备损坏但里面有重要录音，可尝试拆 eMMC 恢复，但概率不高，可能只有 20%～30%，单 case 独立沟通。' },
      { type: 'subheading', text: '售后提示' },
      { type: 'bullets', items: ['可协助尝试恢复。', '不能承诺一定恢复成功。', '涉及拆机和数据恢复需单独确认。'] },
      { type: 'contact', text: '请联系技术支持沟通具体情况。', label: '联系客服', href: 'mailto:developer@jeetoo.com' },
    ],
  },
  {
    id: 15, category: 'files', question: '可以将录音文件传到电脑上吗？', related: [20, 21], answer: [
      { type: 'paragraph', text: '无法直接传到电脑。' },
      { type: 'paragraph', text: '设备中录音文件会在连接 APP 后自动同步上传到云端，并进行 AI 转写和总结，最终生成录音笔记。' },
      { type: 'paragraph', text: '录音笔记本身可以支持音频文件的导出功能。' },
      { type: 'paragraph', text: '当前 APP 未开放直接通过数据线拷贝录音到电脑；设备默认通过 APP 加密同步，主要是为了保护录音数据安全。' },
      { type: 'paragraph', text: '如用户强烈需要，可记录反馈给产品经理。' },
    ],
  },
  {
    id: 16, category: 'connection', question: '可以用多个手机连接同一个录音卡吗？', related: [2], answer: [
      { type: 'paragraph', text: '一个录音卡不支持同时连接多个手机，但可以分开时间连接多个手机上的同一个 APP 账号。' },
      { type: 'paragraph', text: '当 B 手机要连接录音卡时，需要将 A 手机的蓝牙关闭，或者在 A 手机的系统设置中找到蓝牙选项，把录音卡取消配对或忽略此设备，避免录音卡已抢先被 A 手机连接，这样 B 手机就可以正常与录音卡配对使用了。' },
    ],
  },
  {
    id: 17, category: 'connection', question: 'App 里一直显示「未找到设备」，重试也不成功？', related: [1, 2], answer: [
      { type: 'paragraph', text: '尝试在手机系统的蓝牙设置里，找到 Aone 开头的设备，然后点击「忽略此设备」，再重新尝试几次。' },
    ],
  },
  {
    id: 18, category: 'compatibility', question: '磁吸导致的手机熄屏/黑屏问题？', answer: [
      { type: 'paragraph', text: '尝试华为鸿蒙手机背板磁吸导致的熄屏，大多是皮套操作功能触发的，可通过关闭皮套操作功能来解决问题：' },
      { type: 'ordered', items: ['打开手机设置，在顶部搜索栏输入「皮套操作」，点击进入对应设置项。', '将皮套操作的开关关闭，即可解决磁吸导致的自动熄屏问题。'] },
    ],
  },
  {
    id: 19, category: 'troubleshooting', question: '如何查看录音卡的电量？', answer: [
      { type: 'paragraph', text: '在 APP 内，点击右上角录音卡连接处，弹出设备列表，点击 Aone-XXX，进入设备信息页，可以看到电量和其他卡片信息。' },
    ],
  },
  {
    id: 20, category: 'files', question: '如何查看录音卡里的录音文件？', related: [15, 21], answer: [
      { type: 'paragraph', text: '录音卡中的录音文件，会在与 APP 连接后，自动上传同步到手机上。' },
    ],
  },
  {
    id: 21, category: 'files', question: '录完后怎么没有看到录音上传呢？', related: [15, 20], answer: [
      { type: 'bullets', items: ['录音中不会上传。', '录音结束后，设备检测 APP 连接状态并自动传输。', '长录音文件建议开启 Wi-Fi 快传。', '1 小时录音约 10MB。', '蓝牙传输慢，Wi-Fi 快传可明显缩短时间。'] },
    ],
  },
  {
    id: 22, category: 'compatibility', question: '带手机壳能不能磁吸，手机壳有支架怎么磁吸？', answer: [
      { type: 'paragraph', text: '手机壳也可以磁吸卡套，不影响。' },
      { type: 'paragraph', text: '如果手机壳背面有支架，会影响磁吸位置，建议更换手机壳，或可以把录音卡单独携带使用。' },
    ],
  },
  {
    id: 23, category: 'connection', question: '苹果手机用户，如果先从系统设置连接了录音卡，就无法从 App 内连接卡片？', related: [2], answer: [
      { type: 'paragraph', text: '需要从手机系统设置 - 蓝牙 - 忽略 Aone-xxxx 的设备，然后再返回 APP 内连接录音卡。' },
    ],
  },
  {
    id: 24, category: 'files', question: '如果内存满了的话，是自动覆盖最开始的吗？还是有啥办法直接看录音卡的内容？', answer: [
      { type: 'paragraph', text: '录音卡中的音频文件只要同步到手机里，就会清掉卡片中的文件，一般不会有内存压力。' },
      { type: 'paragraph', text: '极限条件下，内存满了就会提示无法录音了。' },
    ],
  },
  {
    id: 25, category: 'charging', question: '如何给录音卡充电？插手机上吗？', answer: [
      { type: 'paragraph', text: '可以通过配备充电线，直接磁吸充电，Type-C 的一端直接插在充电宝、或者 Type-C 的充电头上就行。' },
    ],
  },
  {
    id: 26, category: 'troubleshooting', question: '录音卡丢了怎么办？', answer: [
      { type: 'paragraph', text: '卡片不与自己绑定的设备解绑，捡到卡片的人是无法连接卡片获取数据的，数据安全有保障。' },
      { type: 'paragraph', text: '实在不放心，也可以联系客服，发送基本的设备信息，如设备 SN 码、手机号等，登记挂失。' },
    ],
  },
  {
    id: 27, category: 'charging', question: '录音卡充电满后灯一直是紫色，连手机上显示电量已 100%，但灯未变绿，怎么回事？', related: [10, 11], answer: [
      { type: 'paragraph', text: '手机上显示电量 100%，就说明已经充满电了，可以放心使用。' },
      { type: 'paragraph', text: '之所以灯还是紫色、没变绿，是因为：电量 100% 已经达到满电，但指示灯变绿需要再稍微多充一小段「涓流补电」，这时候其实已经不会再往里充电，只是在做微小补电，对使用没有影响。' },
      { type: 'paragraph', text: '您可以这样操作试试：' },
      { type: 'paragraph', text: '先关掉蓝牙，重新插拔一下充电线，等 3～4 分钟，一般就会变绿了。' },
      { type: 'paragraph', text: '以手机上显示的 100% 电量为准就可以。' },
    ],
  },
  {
    id: 28, category: 'files', question: '录音丢了怎么办？', answer: [
      { type: 'paragraph', text: '用户反馈录音找不到了，有一个可能性：' },
      { type: 'paragraph', text: '如果用户的卡片用到电量耗尽，充电之后马上录音，此时卡片的时间会重置到 1999 年，此时产生的录音文件时间就是 1999 年。' },
      { type: 'paragraph', text: '那么在连接蓝牙传至 APP 时，有可能因为时间排序的原因，被压在列表最下方。' },
      { type: 'paragraph', text: '在卡片连接 APP 之后，会获取到最新的服务器时间，后续的录音时间便会恢复正常。' },
    ],
  },
  {
    id: 29, category: 'recording', question: '手机都能录音了，为什么还需要录音卡？', answer: [
      { type: 'bullets', items: ['盲操一秒开录：物理按键，不用看屏幕，拨动即录。', '录音不怕打断：独立运行，手机来电、消息都不影响。', '录得更清楚：5 麦克风 + 8 米收音 + AI 降噪。', '没有手机电量焦虑：35 小时连续录音，待机时长 60 天。', '通话全都能录：电话、微信视频、腾讯 / 钉钉 / 飞书会议。', '没网、没手机，也能录：64GB 本地存储，录完再同步。'] },
      { type: 'note', text: '以上功能参数适用于相应产品型号，请以对应型号的产品资料为准。' },
    ],
  },
]
