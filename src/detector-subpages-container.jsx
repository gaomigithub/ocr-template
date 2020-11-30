/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Component } from "react";
import { Col } from "reactstrap";
import UploadBox from "./IOTools/uploadbox";
import OutputBox from "./IOTools/outputbox";
import OutputBoxForTable from "./IOTools/outputboxForTable";
import { Row } from "antd";
import { jsx, css } from "@emotion/react";

class FeatureBox extends Component {
  // callback data got after uploaded
  constructor(props) {
    super(props);
    this.state = {
      dataForOutput: [],
      url_post: props.url_post,
      imgSource: null,
    };
  }
  handleData = (data) => {
    if (data.detectors) {
      this.setState({
        dataForOutput: data.detectors,
        imgSource: "data:image/jpeg;base64," + data.image_data,
      });
    } else if (data.infos) {
      this.setState({ dataForOutput: data.infos });
    }
  };
  render() {
    return (
      <React.Fragment
        css={css`
          // display: flex;
          // flex-grow: 1;
        `}
      >
        <Row
          css={css`
            // flex: 1;
            display: flex;
            padding: 20px;
            flex-wrap: nowrap;
          `}
        >
          <Col
            css={css`
              flex: 1;
            `}
          >
            <div
              css={css`
                position: relative;
              `}
            >
              <UploadBox
                url_post={this.state.url_post}
                handleData={this.handleData.bind(this)}
              />
            </div>
            {/* {console.log("detectors", this.state.data)} */}
          </Col>
          <Col
            css={css`
              flex: 2;
              margin-left: 30px;
            `}
          >
            <Row>
              <h5
                css={css`
                  color: #3377ff;
                `}
              >
                识别结果
              </h5>
            </Row>
            {/* <OutputBox detectors={this.state.dataForOutput} /> */}
            {this.state.dataForOutput[0]?.hasOwnProperty("cells") ? (
              <OutputBoxForTable detectors={this.state.dataForOutput} />
            ) : (
              <OutputBox detectors={this.state.dataForOutput} />
            )}

            {/* test only below */}
            {/* <OutputBoxTest detectors={arrResult} /> */}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default FeatureBox;
