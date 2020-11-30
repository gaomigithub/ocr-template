/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { Divider } from "antd";
import { jsx, css } from "@emotion/react";

const OutputBox = (props) => {
  let detectors = props.detectors;
  return (
    <div
      css={css`
        overflow: auto;
        height: 100%;
      `}
    >
      {detectors.map((item, index) => {
        const dividerVisible =
          (index + 1 < detectors.length && detectors[index + 1].y !== item.y) ||
          index + 1 === detectors.length;

        return (
          <React.Fragment key={index}>
            <span
              css={css`
                padding-right: 20px;
                display: inline-block;
              `}
            >
              {item.text}
            </span>
            {dividerVisible && (
              <Divider
                css={css`
                  margin-top: 10px;
                  margin-bottom: 10px;
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OutputBox;
