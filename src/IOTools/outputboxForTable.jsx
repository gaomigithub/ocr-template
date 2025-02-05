/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { css } from "@emotion/react";
import "../table-recog.css";

const OutputBoxForTable = (props) => {
  let detectors = props.detectors;
  console.log("origin data, detectors", detectors);
  // console.log("data passed to outputbox", detectors);
  let results = [];
  for (let i = 0; i < detectors.length; i++) {
    if (detectors[i].is_table) {
      results[i] = sortingTables(detectors[i]);
    } else {
      results[i] = sortingTitles(detectors[i]);
    }
  }

  return results;
};

const sortingTitles = (titleInfo) => {
  let result = [];
  let idx = 0;
  for (let key in titleInfo.cells) {
    result[idx] = (
      <div key={idx}>
        <span>{titleInfo.cells[key].text}</span>
        {/* {console.log(titleInfo.cells[key].text)} */}
      </div>
    );
    idx++;
  }
  result[result.length] = <br />;
  return result;
};

// get current row index
const get_start_row = (row) => {
  return row[0].start_row;
};

// mininum height of the row
const get_min_span_row = (row) => {
  let min_span = 0;
  if (is_the_same_span(row)) {
    return 1;
  }
  for (let index in row) {
    let span = row[index].end_row - row[index].start_row;
    if (min_span == 0) {
      min_span = span;
      continue;
    }
    if (span < min_span) {
      min_span = span;
    }
  }
  return min_span;
};

// check if having irregular cell height by scanning all in this row
const is_the_same_span = (row) => {
  let init_span = row[0].end_row - row[0].start_row;
  for (var i = 1; i < row.length; i++) {
    let span = row[i].end_row - row[i].start_row;
    if (init_span !== span) {
      return false;
    }
  }
  return true;
};

// use for add extra empty rows for Rowspan did above
const add_empty_tr = (empty_count, real_tr) => {
  let output_row = [];
  for (var i = 0; i < empty_count; i++) {
    output_row[i] = <tr />;
  }
  output_row[empty_count] = real_tr;
  return output_row;
};

const handleClick = (text) => {
  console.log(`hit in the cell ${text}`);
};

const sortingTables = (tableInfo) => {
  // console.log("data extended", tableInfo);
  const allCells = tableInfo.cells;
  const rows = [];
  let next_row_index = 0;
  // iterate the rows then push into the array based on the row#
  for (let i = 0; i < tableInfo.rows; i++) {
    rows[i] = allCells.filter((item) => item.start_row === i);
  }
  // console.log("oriArr for the table", rows);
  // filter the rows which has values
  let filtered = rows.filter(function (e) {
    return e != "";
  });
  // console.log("Array before filtered", rows);
  // console.log("cleanArray for the table", filtered);

  return (
    <div>
      <table className="table-recog">
        <tbody>
          {filtered.map((row, index) => {
            row.sort(function (a, b) {
              return a.start_column - b.start_column;
            });
            // console.log("row", row);
            // console.log("start row:", get_start_row(row));
            // console.log("next row:", next_row_index);
            let empty_row_combine = [];
            if (get_start_row(row) !== next_row_index) {
              let empty_count = Math.abs(get_start_row(row) - next_row_index);
              // console.log("empty count " + empty_count + " at row#" + index);
              let real_tr = (
                <tr key={index}>
                  {row.map((cell, idx) => {
                    let len_row = cell.end_row - cell.start_row;
                    let len_col = cell.end_column - cell.start_column;
                    let text = cell.text;
                    text = text.replace(/\\n/g, "\n");

                    return (
                      <td
                        key={idx}
                        rowSpan={len_row}
                        colSpan={len_col}
                        // style={{ flex: len_col }}
                        onClick={() => handleClick(cell.text)}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
              empty_row_combine = add_empty_tr(empty_count, real_tr);
              next_row_index = get_start_row(row) + get_min_span_row(row);
              return empty_row_combine;
            }
            next_row_index = get_start_row(row) + 1;
            // console.log("next row (done):", next_row_index);
            return (
              <tr key={index}>
                {row.map((cell, idx) => {
                  let len_row = cell.end_row - cell.start_row;
                  let len_col = cell.end_column - cell.start_column;
                  let text = cell.text;
                  text = text.replace(/\\n/g, "\n");

                  return (
                    <td
                      key={idx}
                      rowSpan={len_row}
                      colSpan={len_col}
                      // style={{ flex: len_col }}
                      onClick={() => handleClick(cell.text)}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default OutputBoxForTable;
