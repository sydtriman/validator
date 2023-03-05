let immutableStore = [];
const output = document.getElementById('output');
const setnametitle = document.getElementById('setname');
const setlist = document.getElementById('setlist');
const gridmessage = document.getElementById('gridmessage');

let colNames = [];
let setObject = [];

class ActionCellRenderer {
    init(params) {
        this.eGui = document.createElement('span');
        let actionButtons = ""
        actionButtons += `<a href="#" onclick="deleteRow(${params.data.id})" id="delete_${params.data.id}" class="button-small">Delete</a>`;
        this.eGui.innerHTML = actionButtons;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

let columnDefs = [
    {
        field: "action",
        cellRenderer: ActionCellRenderer,
        editable: false,
        filter: false,
        width: 100,
        resizable: false,
        sortable: false,
    },
    {
        field: "name",
        headerName: "Column Name",
        resizable: true,
        flex: 2
    },
    {
        field: "description",
        headerName: "Field Description",
        resizable: true,
        flex: 2
    },
    {
        field: "type",
        headerName: "Data Type",
        cellEditor: DropDownEditor,
        cellEditorParams: dropDownValues,

    },
    {
        field: "special_characters",
        headerName: "Special Characters Allowed?",
        width: 150,
        resizable: false,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: dropDownValues
    },
    {
        field: "min_length",
        headerName: "Minimum text length",
        width: 150,
        resizable: false,
        filter: 'agNumberColumnFilter',
        cellEditor: NumberCellEditor
    },
    {
        field: "max_length",
        headerName: "Maximum text length",
        width: 150,
        resizable: false,
        filter: 'agNumberColumnFilter',
        cellEditor: NumberCellEditor
    },
    {
        field: "decimals",
        headerName: "Number of Decimals",
        width: 150,
        filter: 'agNumberColumnFilter',
        resizable: false,
        cellEditor: NumberCellEditor

    },
    {
        field: "min_value",
        headerName: "Minimum value",
        filter: 'agNumberColumnFilter',
        width: 150,
        resizable: false,
        cellEditor: NumberCellEditor
    },
    {
        field: "max_value",
        headerName: "Maximum value",
        width: 150,
        filter: 'agNumberColumnFilter',
        resizable: false,
        cellEditor: NumberCellEditor

    }
];

let rowData = [
    { id: "1", name: "account_description", description: "Account Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
    { id: "2", name: "account_description2", description: "Account II Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
];

const gridOptions = {
    columnDefs: columnDefs,
    rowData: immutableStore,
    rowSelection: 'single',
    editType: 'fullRow',
    suppressMovableColumns: true,
    singleClickEdit: true,
    animateRows: true,
    stopEditingWhenCellsLoseFocus: true,

    //isRowSelectable: rowNode => rowNode.data ? rowNode.data.state == "edit" : false,
    getRowId: (params) => params.data.id,
    //onSelectionChanged: event => console.log("ONSELECTIONCHANGED", event),
    //onRowSelected: event => console.log("ONROWSELECTED", event),
    //onRowClicked: event => console.log('ONROWCLICKED', event),
    //onRowValueChanged: event => console.log('ONROWVALUECHANGED', event),
    // onCellEditRequest: event => console.log('ONCELLEDITREQUEST', event),
    //onCellEditingStarted: event => console.log('ONCELLEDITINGSTART', event),
    //onCellEditingStopped: event => console.log('ONCELLEDITINGSTOPPED', event),
    //onCellValueChanged: event => console.log('ONCELLVALUECHANGED', event),
    //onCellValueChanged: onCellValueChanged,
    onCellEditingStopped: onCellEditingStopped,
    onGridReady: (params) => {
        immutableStore = [];
        console.log("ONGRIDREADY");
        immutableStore = rowData;
        params.api.setRowData(immutableStore);
        gridOptions.api.sizeColumnsToFit();


    },
    defaultColDef: {
        editable: true,
        resizable: false,
        filter: true,
        sortable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,

    }
};

function deleteRow(id) {
    const selectedRowNode = gridOptions.api.getRowNode(id);
    immutableStore = immutableStore.filter(function (dataItem) {
        return dataItem.id != id;
    });
    gridOptions.api.setRowData(immutableStore);

    const addBtn = document.getElementById('addBtn');
    if (addBtn.getAttribute('data-disabled') == 'true') {
        addBtn.setAttribute('data-disabled', 'false');
    }
}

function runRow() {
    output.innerHTML = "";
    html = "";
    gridOptions.api.forEachNode(function (rowNode, index) {
        for (cell of rowNode) {
            html += Object.keys(rowNode.data)[index] + ": " + Object.values(rowNode.data)[index] + "<br>";
            console.log('html', html);
        }

    });
    output.innerHTML = html;
}

function addRow() {
    const newStore = immutableStore.slice();
    const lastID = immutableStore.length;
    const nextID = (lastID + 1).toString();
    const newRowData = { id: nextID, state: "edit", action: "", name: "new", type: "Text" };

    newStore.splice(0, 0, newRowData);
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
    //gridOptions.api.refreshCells();

    editRow(nextID);

}

function onCellEditingStopped(event) {
    console.log('ONCELLEDITINGSTOPPED', event);
    var rowNode = event.node;
    // if (event.newValue == "Number") {
    //     rowNode.setDataValue('min_length', "");
    //     rowNode.setDataValue('max_length', "");
    //     rowNode.setDataValue('decimals', "2");
    //     rowNode.setDataValue('min_value', "0");
    //     rowNode.setDataValue('max_value', "");
    //     rowNode.setDataValue('special_characters', "");

    // } else if ((event.newValue == "Text")) {
    //     rowNode.setDataValue('min_length', "1");
    //     rowNode.setDataValue('max_length', "");
    //     rowNode.setDataValue('decimals', "");
    //     rowNode.setDataValue('min_value', "");
    //     rowNode.setDataValue('max_value', "");
    //     rowNode.setDataValue('special_characters', "Yes");
    // };

}


function saveSet(e) {
    e.preventDefault();
    let setProperties = {};
    let setName = prompt("Please enter a name for your set", "");
    const d = new Date();
    let lastsavedon = d.toLocaleDateString() + " at  " + d.toLocaleTimeString();

    if (setName != null) {
        setProperties.setName = setName;
        setProperties.setID = performance.now().toString() + Math.random().toString();
        setProperties.lastsavedon = lastsavedon;
        setProperties.rowData = immutableStore;
        setProperties.columnDefs = columnDefs;
        immutableStore.forEach(function (row) {
            colNames.push(row.name)
        })
        setProperties.colNames = colNames;
        setObject.push(setProperties);
        localStorage.setItem('validator', JSON.stringify(setObject));
        setnametitle.innerHTML = `<h3>${setName}</h3><p>Last saved on ${lastsavedon}`;
        window.location.assign('/');
    }

}

function populateSaveList() {
    setObject = JSON.parse(localStorage.getItem("validator")) || [];
    let setlisthtml = "";
    for (item of setObject) {
        setlisthtml += `<option name="${item.setID}" id="${item.setID}" value="${item.setName}">${item.setName}</option>`;
    };
    setlist.innerHTML = setlisthtml;
}

function loadGrid() {
    selectedSetID = setlist[setlist.selectedIndex].id;

    let index = setObject.findIndex(function (entry) {
        return entry.setID === selectedSetID;
    });

    let selectedSet = setObject[index];

    immutableStore = selectedSet.rowData;
    gridOptions.api.setRowData(immutableStore);
    //columnDefs = selectedSet.columnDefs;

    //agGrid.Grid(gridDiv, gridOptions);
}
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    populateSaveList();
});

document.addEventListener('click', function (event) {
    // filter out clicks on any other elements
    if (event.target.nodeName == 'A' && event.target.getAttribute('data-disabled') == 'true') {
        event.preventDefault();
    }
});

