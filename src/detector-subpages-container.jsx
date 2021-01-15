/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import UploadBox from "./IOTools/uploadbox";
import OutputBox from "./IOTools/outputbox";
import OutputBoxForTable from "./IOTools/outputboxForTable";
import HoverText from "./IOTools/hoverText";
// import { Row } from "antd";
import { jsx } from "@emotion/react";
import { css } from "@emotion/react";

class FeatureBox extends Component {
  // callback data got after uploaded
  constructor(props) {
    super(props);
    this.state = {
      dataForOutput: [],
      url_post: props.url_post,
      imgSource: null,
      selectedId: null,
      hover: false,
    };
  }

  callback = (data) => {
    if (data.detectors) {
      this.setState({
        dataForOutput: data.detectors,
        imgSource: "data:image/jpeg;base64," + data.image_data,
      });
    } else if (data.infos) {
      this.setState({ dataForOutput: data.infos });
    }
  };

  callback_hover = (id, hover) => {
    this.setState({
      selectedId: id,
      hover: hover,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row
          css={css`
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
            <UploadBox
              url_post={this.state.url_post}
              callback={this.callback.bind(this)}
              callback_hover={this.callback_hover.bind(this)}
            />
          </Col>
          <Col
            css={css`
              flex: 1;
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
              <div>
                <HoverText
                  infos={this.state.dataForOutput}
                  selectedId={this.state.selectedId}
                  hover={this.state.hover}
                />
                <OutputBoxForTable detectors={this.state.dataForOutput} />
              </div>
            ) : (
              <div>
                <HoverText
                  detectors={this.state.dataForOutput}
                  selectedId={this.state.selectedId}
                  hover={this.state.hover}
                />
                <OutputBox detectors={this.state.dataForOutput} />
              </div>
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
