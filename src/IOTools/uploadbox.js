import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import reqwest from "reqwest";
import imgTranscoding from "./imgTranscoding";
import ImgReviewCanvas from "./imgReviewCanvas";

/*拖拽组件*/
const { Dragger } = Upload;

class UploadBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backend_data: {},
      img: null,
      imgObj: null,
      url_post: props.url_post,
      selectedId: null, // id of box on the canvas
      hover: false, // box has been overred or not
    };
  }

  customRequest = async (fileInfo) => {
    // Test log
    // console.log("fileInfo", fileInfo.file);
    this.setState({
      uploading: true,
    });

    /*添加向imgTranscoding传递file去重编ArrayBuffer*/
    /*ImgTranscoding回传array*/
    let dataAfterTranscode = await imgTranscoding(fileInfo.file);
    let transcode = dataAfterTranscode[0];
    let imgBase64str = dataAfterTranscode[1];

    /*AJAX POST REQUEST*/
    // const postRequest =
    reqwest({
      url: this.state.url_post, //项目接口云url
      // url: "http://10.10.10.10:5000/general/process", //公司本地环境接口url
      method: "POST",
      contentType: "application/json",
      data: transcode,
      success: (data) => {
        // Data反馈测试
        // 提取Data到本地状态
        var height;
        var width;
        let imgObj = new Image();
        imgObj.onload = () => {
          height = imgObj.height;
          width = imgObj.width;
          // console.log("imgOnload width and height", height, width);
          this.setState({
            imgObj,
          });
        };
        imgObj.src = "data:image/jpeg;base64," + data.image_data;

        this.setState({
          backend_data: data,
          img: imgBase64str,
          imgObj: imgObj,
        });
        let data_callback = this.state.backend_data;
        this.handleData(data_callback);
        message.success("上传成功");
        // Test log/Compare
        // console.log("img base64 transcode", imgBase64str);
        console.log("data get", data);
      },
      error: () => {
        message.error("上传失败，请确认上传文件类型/格式");
        // console.log("img base64", this.imgBase64str);
      },
    });
  };

  // 向父containner传递后端callback data
  handleData = (backend_data) => {
    this.props.callback(backend_data);
  };

  // callback from imgReviewCanvas component
  callback_hover = (id, hover) => {
    this.setState({ selectedId: id, hover: hover }, () => this.handleHover());
  };

  handleHover = () => {
    this.props.callback_hover(this.state.selectedId, this.state.hover);
  };

  render() {
    let img_review =
      "data:image/jpeg;base64," +
      (this.state.backend_data.image_data
        ? this.state.backend_data.image_data
        : this.state.img);

    let frameSize = 600;
    return (
      <div>
        <div>
          {this.state.img ? (
            this.state.backend_data.detectors ? (
              <div
                style={{
                  margin: "0 auto",
                  width: frameSize,
                  backgroundImage: "url(" + img_review + ")",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <ImgReviewCanvas
                  frameSize={frameSize}
                  imgObj={this.state.imgObj}
                  imgWidth={this.state.imgObj?.width}
                  imgHeight={this.state.imgObj?.height}
                  detectors={this.state.backend_data.detectors}
                  callback_hover={this.callback_hover.bind(this)}
                />
              </div>
            ) : (
              <div
                style={{
                  margin: "0 auto",
                  width: frameSize,
                  backgroundImage: "url(" + img_review + ")",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <ImgReviewCanvas
                  frameSize={frameSize}
                  imgObj={this.state.imgObj}
                  imgWidth={this.state.imgObj?.width}
                  imgHeight={this.state.imgObj?.height}
                  infos={this.state.backend_data.infos}
                  callback_hover={this.callback_hover.bind(this)}
                />
              </div>
            )
          ) : (
            <Dragger customRequest={this.customRequest} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽到此处上传文件</p>
              <p className="ant-upload-hint">jpg/png</p>
            </Dragger>
          )}
        </div>
        <div
          className="mt-2"
          style={{ position: "absolute", paddingRight: "15px" }}
        >
          <Upload customRequest={this.customRequest} showUploadList={false}>
            <Button>
              <UploadOutlined /> 选择文件
            </Button>
          </Upload>
        </div>
      </div>
    );
  }
}
export default UploadBox;
