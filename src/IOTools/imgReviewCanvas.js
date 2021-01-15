import React, { useMemo, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import lodash from "lodash";

let INITIAL_STATE = (props) => {
  let arr = [];
  if (props == undefined) {
    arr = [...Array(1)].map((_, id) => ({
      id: id,
      location: [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ],
      text: "error case",
      x: 0,
      y: 0,
      isClicked: false,
      isOvering: false,
    }));
  } else if (props.infos) {
    let infos = props.infos;

    // Draw ALL data detected
    // let tmp2d = [...Array(infos.length)].map((_, id) => infos[id].cells);

    // Draw cells only
    let tmp2d = [...Array(infos.length)].map((_, id) =>
      infos[id].is_table ? infos[id].cells : null
    );
    tmp2d = tmp2d.filter(function (n) {
      return n;
    });
    let tmp1d = [].concat.apply([], tmp2d);
    arr = [...Array(tmp1d.length)].map((_, id) => ({
      id: id,
      location: tmp1d[id].location,
      text: tmp1d[id].text,
      isClicked: false,
      isOvering: false,
    }));
  } else {
    let detectors = props.detectors;
    arr = [...Array(detectors.length)].map((_, id) => ({
      id: id,
      location: detectors[id].location,
      text: detectors[id].text,
      isClicked: false,
      isOvering: false,
    }));
  }
  return arr;
};

const propsData = (props) => {
  let data = [];
  if (props.infos != null && props.infos != undefined) {
    data = props.infos;
  } else {
    data = props.detectors;
  }
  return data;
};

function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

const ImgReviewCanvas = (props) => {
  // size of the frame
  const stageWidth = props.frameSize;
  // Scaling based on the frame size
  // var scalingRatio = stageWidth / props.imgWidth;
  // var stageHeight = props.imgHeight * scalingRatio;
  const imgObj = useMemo(() => props.imgObj, [props]);
  const scalingRatio = stageWidth / imgObj.width;
  const stageHeight = imgObj.height * scalingRatio;

  // var copyOfInitailData = lodash.cloneDeep(INITIAL_STATE(props));
  var copyOfInitailData = deepClone(INITIAL_STATE(props));

  const initBoxs = useMemo(() => copyOfInitailData, [
    props.infos,
    props.detectors,
  ]);

  const [boxs, setState] = useState([]);
  const [boolValue, setBoolValue] = useState(false);

  useEffect(() => {
    setState(initBoxs);
  }, []);
  useEffect(() => {
    setBoolValue(true);
    if (boolValue) {
      setState(initBoxs);
    }
  }, [initBoxs]);

  // 向父containner(uploadbox)传递
  const handleHover = (id, bool) => {
    props.callback_hover(id, bool);
  };

  const handleMouseOver = (e) => {
    const id = e.target.id();
    setState(
      boxs.map((box) => {
        return {
          ...box,
          isOvering: box.id === id,
        };
      })
    );
    handleHover(id, true);
  };
  const handleMouseLeave = (e) => {
    const id = e.target.id();
    setState(
      boxs.map((box) => {
        return {
          ...box,
          isOvering: false,
        };
      })
    );
    handleHover(id, false);
  };
  // const handleAlert = (e) => {
  //   const id = e.target.id();
  //   window.alert = function (text) {
  //     // customize the alert
  //     var div = document.createElement("div");
  //     div.style.backgroundColor = "white";
  //     div.style.color = "black";
  //     div.style.boxShadow = "0 0 10px #b2b2b2 ";
  //     div.style.position = " fixed";
  //     div.style.zIndex = 9999999;
  //     div.style.width = " 30%";
  //     div.style.top = " 40%";
  //     div.style.left = "75%";
  //     div.style.lineHeight = " 60px";
  //     div.style.borderRadius = " 4px";
  //     div.style.fontSize = " 15px";
  //     div.style.textAlign = "center";
  //     div.style.padding = "0 20px";
  //     div.className = "animated  bounceInDown";
  //     div.id = "alert";
  //     div.innerHTML = text;
  //     document.getElementsByTagName("body")[0].appendChild(div);
  //     var selfObj = document.getElementById("alert");
  //     // Dynamically fix the position of the alert
  //     var alertWidth = window.getComputedStyle(selfObj, null).width;
  //     div.style.marginLeft = -parseInt(alertWidth) / 2 + "px";
  //     // Set the time of showing
  //     setTimeout(function () {
  //       document.getElementsByTagName("body")[0].removeChild(div);
  //     }, 5000);
  //   };
  //   return alert(boxs[id].text);
  // };

  return (
    <div>
      {/* draw canvas if stageWidth has value; 
      otherwise, error caused by NaN value*/}
      {stageHeight ? (
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {boxs.map((box) => (
              <Line
                key={box.id}
                id={box.id}
                points={[
                  box.location[0][0] * scalingRatio,
                  box.location[0][1] * scalingRatio,
                  box.location[1][0] * scalingRatio,
                  box.location[1][1] * scalingRatio,
                  box.location[2][0] * scalingRatio,
                  box.location[2][1] * scalingRatio,
                  box.location[3][0] * scalingRatio,
                  box.location[3][1] * scalingRatio,
                ]}
                closed
                stroke={box.isOvering ? "yellow" : "#3377ff"}
                strokeWidth={box.isOvering ? 5 : 1}
                fill={box.isOvering ? "rgba(100,149,237,0.5)" : null}
                opacity={box.isOvering ? 1 : 0.7}
                // draggable
                // onMouseEnter={handleAlert}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </Layer>
        </Stage>
      ) : (
        <div />
      )}
    </div>
  );
};

export default ImgReviewCanvas;
