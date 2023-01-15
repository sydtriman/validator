const drop_dom_element = document.getElementById('drop_dom_element');
const boxes = document.querySelectorAll('.drop_dom_element');
const sheetlist = document.getElementById('sheetlist');
const sourceitems = document.getElementById('sourceitems');
const destinationitems = document.getElementById('destinationitems');
const savedRowData = JSON.parse(localStorage.getItem('rowData')) || [];
const savedColDefs = JSON.parse(localStorage.getItem('colDefs')) || [];

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

async function fileDrop(e) {
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
function fileDragOver(e) {
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.add('drop-dom-element-hover');
}
function fileDragEnter(e) {
  e.preventDefault();
  let drop_dom_element = e.target;
  drop_dom_element.classList.add('drop-dom-element-hover');
}
function fileDragLeave(e) {
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

  populateSource(columnDefs);
  populateDestionation(savedColDefs)
}

function populateDestionation(savedColDefs) {
  htmlString = "";
  savedColDefs.forEach(function (col) {
    htmlString += "<div class=\"flex-container\"><div class=\"destinationitem\">" + col + "</div><div class=\"targetblock\">...</div></div>"
  });
  destinationitems.innerHTML = htmlString;
}

function populateSource(columnDefs) {
  htmlString = "";
  columnDefs.forEach(function (col) {
    htmlString += "<div draggable=\"true\" id=\"" + col.field + "\" class=\"sourceitem\">" + col.field + "</div>"
  })
  sourceitems.innerHTML = htmlString;
}

function colDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.drop_dom_element.classList.remove('drag-drop-hover');
  let item = e.dataTransfer.getData("text");
  e.target.appendChild(document.getElementById(item));
}
function colDrag(e) {
  e.dataTransfer.setData("text", e.target.id);
  console.log('colDrag event', e.target.id);
}
function colDragOver(e) {
  e.preventDefault();
  e.target.classList.add('drag-drop-hover');
  console.log('colDragOver event');
}
function colDragEnter(e) {
  e.preventDefault();
  e.target.classList.add('drag-drop-hover');
  console.log('colDragEnter');
}
function colDragLeave(e) {
  e.preventDefault();
  e.target.classList.remove('drag-drop-hover');
}

// -------------- EVENT LISTENERS --------------------------
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});

boxes.forEach(box => {
  box.addEventListener('dragenter', fileDragEnter)
  box.addEventListener('dragover', fileDragOver);
  box.addEventListener('dragleave', fileDragLeave);
  box.addEventListener('drop', fileDrop);
});

sourceitems.addEventListener('dragstart', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDrag(e);
  };
});
sourceitems.addEventListener('dragenter', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDragEnter(e);
  };
});
sourceitems.addEventListener('dragover', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDragOver(e);
  };
});
sourceitems.addEventListener('dragleave', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDragLeave(e);
  };
});
sourceitems.addEventListener('drop', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDrop(e);
  };
});

destinationitems.addEventListener('dragenter', function (e) {
  if (e.target.classList.contains('destinationitem')) {
    colDragEnter(e);
  };
})
destinationitems.addEventListener('dragover', function (e) {
  if (e.target.classList.contains('destinationitem')) {
    colDragOver(e);
  };
});
destinationitems.addEventListener('dragleave', function (e) {
  if (e.target.classList.contains('destinationitem')) {
    colDragLeave(e);
  };
});
