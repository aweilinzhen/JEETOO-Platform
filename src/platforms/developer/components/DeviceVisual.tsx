import recorderImage from '../assets/jeetoo-recorder-hero.png'

export function DeviceVisual() {
  return (
    <div className="device-stage" aria-label="JEETOO AI 智能录音卡示意图">
      <div className="device-shadow" />
      <img className="device-product-image" src={recorderImage} alt="JEETOO 黑色超薄 AI 录音卡" />
      <div className="device-caption"><span className="caption-line" />JEETOO AI 录音卡</div>
      <div className="device-code">RECORD<br />CONNECT<br />CREATE</div>
    </div>
  )
}
