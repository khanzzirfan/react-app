import React, { createRef } from "react";

class CanvasImages extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.imageRef = createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = this.imageRef.current;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 100, 100);
      ctx.font = "40px Courier";
      // ctx.fillText(this.props.text, 210, 75);
    };
  }
  render() {
    const { imageUrl } = this.props;
    return (
      <div>
        <canvas ref={this.canvasRef} width={100} height={100} />
        <img
          ref={this.imageRef}
          src={imageUrl}
          className="hidden"
          alt="canvas"
        />
      </div>
    );
  }
}
export default CanvasImages;
