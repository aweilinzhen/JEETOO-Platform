import recorderImage from '../assets/jeetoo-recorder-hero.png'

export function DeviceVisual() {
  return (
    <div className="device-stage" aria-label="JEETOO Device SDK 支持的硬件设备">
      <div className="device-shadow" />
      <img className="device-product-image" src={recorderImage} alt="JEETOO 黑色超薄 AI 录音卡" />
    </div>
  )
}
