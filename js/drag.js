const drop_dom_element = document.getElementById('drop_dom_element');
const boxes = document.querySelectorAll('.drop_dom_element');
const sheetlist = document.getElementById('sheetlist');
let columnDefs = [];
let immutableStore = [];
let rowData = [];
let workbook = "";

const gridOptions = {
  columnDefs: columnDefs,
  rowData: immutableStore,
  rowSelection: 'single',
  editType: 'fullRow',
  suppressMovableColumns: true,

  //isRowSelectable: rowNode => rowNode.data ? rowNode.data.state == "edit" : false,
  getRowId: (params) => params.data.id,
  //onSelectionChanged: event => console.log("ONSELECTIONCHANGED", event),
  //onRowSelected: event => console.log("ONROWSELECTED", event),
  //onRowClicked: event => console.log('ONROWCLICKED', event),
  //onCellValueChanged: event => console.log('ONCELLVALUECHANGED', event),
  //onCellEditingStarted: event => console.log('ONCELLEDITINGSTART', event),
  onGridReady: (params) => {
    immutableStore = [];
    console.log("ONGRIDREADY");
    immutableStore = rowData;
    params.api.setRowData(immutableStore);
    gridOptions.api.sizeColumnsToFit();

  },
  defaultColDef: {
    editable: false,
    resizable: false,
    filter: true,
    sortable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  }
};


async function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.remove('drop-dom-element-hover');
  const f = e.dataTransfer.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  workbook = XLSX.read(data, { dense: true });
  console.log('workbook read');
  //populateGrid(workbook);
  populateSheetDropDown(workbook);

  /* DO SOMETHING WITH workbook HERE */
}
function dragOver(e) {
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.add('drop-dom-element-hover');
}
function dragEnter(e) {
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.add('drop-dom-element-hover');
}
function dragLeave(e) {
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.remove('drop-dom-element-hover');
}

function populateSheetDropDown(workbook) {
  let html = "";
  for (sheet of workbook.SheetNames) {
    html += `<option value="${sheet}">${sheet}</option>`;
  };
  sheetlist.innerHTML = html;
}

function populateGrid() {
  // our data is in the first sheet
  let firstSheetName = workbook.SheetNames[0];
  let worksheet = workbook.Sheets[sheetlist.value];
  let worksheetData = worksheet['!data'];
  let rowData = [];
  let headers = []
  let rowIndex = 1;
  let gridCell = {};

  // iterate over the worksheet pulling out the columns we're expecting
  //while (worksheet['A' + rowIndex]) {
  // let row = {};
  // Object.keys(columns).forEach(function (column) {
  //  row[columns[column]] = worksheet[column + rowIndex].w;
  // });

  worksheetData[0].forEach(function (cellContent) {
    let colDef = {};
    console.log(cellContent["w"]);
    headers.push(cellContent["w"]);
    colDef.field = cellContent['w'];
    columnDefs.push(colDef);
  });

  for (let i = 1; i < worksheetData.length; i++) {
    gridCell.id = rowIndex.toString();
    worksheetData[i].forEach(function (cellContent, index) {
      console.log(cellContent);
      gridCell[headers[index]] = cellContent['w'];
    });
    rowData.push(gridCell);
    rowIndex++;
    gridCell = {};
  }
  immutableStore = rowData;
  gridOptions.api.setColumnDefs(columnDefs);
  gridOptions.api.setRowData(immutableStore);
}



// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
boxes.forEach(box => {
  box.addEventListener('dragenter', dragEnter)
  box.addEventListener('dragover', dragOver);
  box.addEventListener('dragleave', dragLeave);
  box.addEventListener('drop', drop);
});
