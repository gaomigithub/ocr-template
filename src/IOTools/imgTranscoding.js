const imgTranscoding = async (file) => {
  let arrayBuffer = new ArrayBuffer();
  arrayBuffer = await getFileBuffer(file);

  const chars = new Uint8Array(arrayBuffer);
  const CHUNK_SIZE = 0x8000;
  let index = 0;
  const length = chars.length;
  let result = "";
  let slice = [];
  while (index < length) {
    slice = chars.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  const base64str = btoa(result);
  const params = JSON.stringify({
    name: file.name,
    image_data: base64str,
  });
  // return params;
  return [params, base64str];
};

const getFileBuffer = async (file) => {
  const fileReaderPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function (e) {
      resolve(e.target?.result);
    };
    reader.onerror = function (e) {
      reject(e.target?.error);
    };
  });

  return await fileReaderPromise.then((res) => {
    return res;
  });
};

export default imgTranscoding;
