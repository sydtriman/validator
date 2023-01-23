const drop_dom_element = document.getElementById('drop_dom_element');
const boxes = document.querySelectorAll('.drop_dom_element');
const sheetlist = document.getElementById('sheetlist');
const mappingArea = document.getElementById('mappingArea');
const sourceitems = document.getElementById('sourceitems');
const destinationitems = document.getElementById('destinationitems');
const savedRowData = JSON.parse(localStorage.getItem('rowData')) || [];
const savedColDefs = JSON.parse(localStorage.getItem('colDefs')) || [];
const errormsg = document.getElementById('errormsg');
const navbar = document.getElementById('navbar');

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

// -------------- FILE DRAG DROP  --------------------------
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

// -------------- GIRD  --------------------------
function populateSheetDropDown(workbook) {
  let html = "<option value=\"\"></option>";
  for (sheet of workbook.SheetNames) {
    html += `<option value="${sheet}">${sheet}</option>`;
  };
  sheetlist.innerHTML = html;
  sheetlist.value = workbook.SheetNames[0];
  populateGrid()
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

  try {
    worksheetData[0].forEach(function (cellContent) {
      let colDef = {};
      //console.log(cellContent["w"]);
      headers.push(cellContent["w"]);
      colDef.field = cellContent['w'];
      columnDefs.push(colDef);
    });

    for (let i = 1; i < worksheetData.length; i++) {
      gridCell.id = rowIndex.toString();
      worksheetData[i].forEach(function (cellContent, index) {
        //console.log(cellContent);
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
    populateDestionation(savedColDefs);
    errormsg.innerHTML = "";
  }
  catch (err) {
    console.log('Worksheet ERROR', err);
    columnDefs = [];
    immutableStore = [];
    rowData = [];

    gridOptions.api.setColumnDefs(columnDefs);
    gridOptions.api.setRowData(immutableStore);
    errormsg.innerHTML = "The select worksheet does not contain valid data"
  }

}

function populateDestionation(savedColDefs) {
  htmlString = "<h3>Required Fields</h3>";
  destinationitems.innerHTML = htmlString;
  savedColDefs.forEach(function (col) {
    htmlString += "<div class=\"flex-container\"><div class=\"destinationitem\">" + col + "</div><div data-area=\"target\" class=\"targetblock\"></div></div>"
  });
  destinationitems.innerHTML = htmlString;
}

function populateSource(columnDefs) {
  htmlString = "<h3>Source Fields</h3>";
  sourceitems.innerHTML = htmlString;
  columnDefs.forEach(function (col) {
    htmlString += "<div draggable=\"true\" id=\"" + col.field + "\" data-state=\"source\" class=\"sourceitem\">" + col.field + "</div>"
  });

  sourceitems.innerHTML = htmlString;
}

// -------------- FIELD DRAG DROP  --------------------------
function colDragStart(e) {
  console.log('colDragStart event', "id=", e.target.id);
  e.target.classList.add('drag-drop-highlight');
  e.dataTransfer.setData("text/plain", e.target.id);
}
function colDragOver(e) {
  console.log('colDragOver event');
  e.preventDefault();
  e.target.classList.add('drag-drop-hover');
}
function colDragEnter(e) {
  console.log('colDragEnter event');
  e.preventDefault();
  e.target.classList.add('drag-drop-hover');
}
function colDragLeave(e) {
  console.log('colDragLeave event');
  e.preventDefault();
  e.target.classList.remove('drag-drop-hover');
}
function colDrop(e) {
  console.log('colDrop event');

  e.preventDefault();
  e.target.classList.remove('drag-drop-hover');

  const draggedItem = e.dataTransfer;
  const draggedItemID = draggedItem.getData("text/plain");
  const draggedElement = document.getElementById(draggedItemID);
  draggedElement.classList.remove('drag-drop-highlight');
  e.target.appendChild(draggedElement);
  if (e.target.getAttribute('data-area') == 'target') {
    draggedElement.setAttribute('data-state', 'target');
  } else {
    draggedElement.setAttribute('data-state', 'source');
  }


}
function colDragEnd(e) {
  console.log('colDragEnd event', "id=", e.target.id);
  e.target.classList.remove('drag-drop-highlight');

}

function updateNavBar() {
  const pageName = window.location.href;
  const links = navbar.getElementsByTagName('a');



}

// -------------- EVENT LISTENERS --------------------------
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
  updateNavBar()
});

boxes.forEach(box => {
  box.addEventListener('dragenter', fileDragEnter)
  box.addEventListener('dragover', fileDragOver);
  box.addEventListener('dragleave', fileDragLeave);
  box.addEventListener('drop', fileDrop);
});

mappingArea.addEventListener('dragstart', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDragStart(e);
  };
});
mappingArea.addEventListener('dragover', function (e) {
  if (e.target.classList.contains('targetblock')) {
    colDragOver(e);
  };
});
mappingArea.addEventListener('dragleave', function (e) {
  if (e.target.classList.contains('targetblock')) {
    colDragLeave(e);
  };
});
mappingArea.addEventListener('dragenter', function (e) {
  if (e.target.classList.contains('targetblock')) {
    colDragEnter(e);
  };
});
mappingArea.addEventListener('drop', function (e) {
  if (e.target.classList.contains('targetblock')) {
    colDrop(e);
  };
});
mappingArea.addEventListener('dragend', function (e) {
  if (e.target.classList.contains('sourceitem')) {
    colDragEnd(e);
  };
});
sheetlist.addEventListener('change', populateGrid)