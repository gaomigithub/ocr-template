import React, { useMemo, useState, useEffect } from "react";
import { Alert } from "antd";
import "antd/dist/antd.css";

const HoverText = (props) => {
  var copyOfInitailData = deepClone(INITIAL_STATE(props));

  const initBoxs = useMemo(() => copyOfInitailData, [
    props.detectors,
    props.infos,
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
  useEffect(() => {
    console.log(props.selectedId, props.hover);
    if (props.hover == true) {
      setState(
        initBoxs.map((box) => {
          return {
            ...box,
            display: box.id === props.selectedId,
          };
        })
      );
    } else {
      setState(
        initBoxs.map((box) => {
          return {
            ...box,
            display: false,
          };
        })
      );
    }
  }, [props.hover]);

  return (
    <div
      style={{
        position: "relative",
        height: "10px",
      }}
    >
      {boxs.map((box) => (
        <div
          key={box.id}
          style={{
            position: "absolute",
            display: box.display ? "block" : "none",
            top: "2000%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Alert message={box.text} type="info" />
        </div>
      ))}
    </div>
  );
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
      display: false,
      x: 0,
      y: 0,
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
      display: false,
    }));
  } else {
    let detectors = props.detectors;
    arr = [...Array(detectors.length)].map((_, id) => ({
      id: id,
      location: detectors[id].location,
      text: detectors[id].text,
      display: false,
    }));
  }
  return arr;
};

export default HoverText;
