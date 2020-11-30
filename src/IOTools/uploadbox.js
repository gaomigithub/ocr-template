import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import reqwest from "reqwest";
import imgTranscoding from "./imgTranscoding";
import { css } from "@emotion/react";
/*拖拽组件*/
const { Dragger } = Upload;

class UploadBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backend_data: {},
      img: null,
      url_post: props.url_post,
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
    // let transcode = await imgTranscoding(fileInfo.file)[0];
    // let imgBase64str = await imgTranscoding(fileInfo.file)[1];

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
        this.setState({ backend_data: data, img: imgBase64str });
        let data_callback = this.state.backend_data;
        this.handleData(data_callback);
        message.success("上传成功");
        // Test log/Compare
        // console.log("img base64 transcode", imgBase64str);
        console.log("data get", data);
        // console.log("data", data_callback.image_data);
      },
      error: () => {
        message.error("上传失败，请确认上传文件类型/格式");
        // console.log("img base64", this.imgBase64str);
      },
    });
  };
  // 向父containner传递后端callback data
  handleData = (backend_data) => {
    this.props.handleData(backend_data);
  };

  render() {
    let img_review =
      "data:image/jpeg;base64," +
      (this.state.backend_data.image_data
        ? this.state.backend_data.image_data
        : this.state.img);

    return (
      <div
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          z-index: 0;
        `}
      >
        <div style={{ flex: 1 }}>
          {this.state.img ? (
            <div>
              <img
                id="img"
                alt="img-review"
                src={img_review}
                style={{ width: "500px" }}
              />
            </div>
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
        <div className="mt-2">
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
