let immutableStore = [];

const columnDefs = [
    {
        field: "state",
        editable: true,
        hide: true
    },
    {
        field: "action",
        cellRenderer: ActionCellRenderer,
        editable: false,
        filter: false,
        minWidth: 150,
        resizable: false,
        sortable: false,
    },
    {
        field: "name", editable: true,
        headerName: "Column Name",
        resizable: true,
        flex: 2,
        editable: (params) => params.data.state == "edit"
    },
    {
        field: "description",
        headerName: "Field Description",
        resizable: true,
        flex: 2,
        editable: (params) => params.data.state == "edit"
    },
    {
        field: "type",
        headerName: "Data Type",
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Text', 'Number', 'Boolean'] },
        editable: (params) => params.data.state == "edit"
    },
    {
        field: "special_characters",
        headerName: "Special Characters Allowed?",
        width: 150,
        resizable: false,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: (params) => params.data.type == "Text" & params.data.state == "edit"
    },
    {
        field: "min_length",
        headerName: "Minimum text length",
        width: 150,
        resizable: false,
        filter: 'agNumberColumnFilter',
        editable: (params) => params.data.type == "Text" & params.data.state == "edit",
    },
    {
        field: "max_length",
        headerName: "Maximum text length",
        width: 150,
        resizable: false,
        filter: 'agNumberColumnFilter',
        editable: (params) => params.data.type == "Text" & params.data.state == "edit",
        valueParser: numberParser,
    },
    {
        field: "decimals",
        headerName: "Number of Decimals",
        width: 150,
        filter: 'agNumberColumnFilter',
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit",
        valueParser: numberParser,

    },
    {
        field: "min_value",
        headerName: "Minimum value",
        filter: 'agNumberColumnFilter',
        width: 150,
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit",
        valueParser: numberParser,
    },
    {
        field: "max_value",
        headerName: "Maximum value",
        width: 150,
        filter: 'agNumberColumnFilter',
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit"

    }
];

let rowData = [
    { id: "1", state: "read", name: "account_description", description: "Account Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
    { id: "2", state: "read", name: "account_description2", description: "Account II Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
];

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

class ActionCellRenderer {
    init(params) {
        this.eGui = document.createElement('span');
        let actionButtons = ""
        actionButtons += `<a href="#" onclick="deleteRow(${params.data.id})" id="delete_${params.data.id}" class="button-small">Delete</a>`;
        actionButtons += `&nbsp;<a href="#" onclick="editRow(${params.data.id})" id="edit_${params.data.id}" class="button-small">Edit</a>`;
        actionButtons += `&nbsp;<a href="#" onclick="saveRow(${params.data.id})" id="save_${params.data.id}" class="button-small hidden">Save</a>`;
        actionButtons += `&nbsp;<a href="#" onclick="runRow(${params.data.id})" id="run_${params.data.id}" class="button-small">Run</a>`;
        this.eGui.innerHTML = actionButtons;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

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

function saveRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    const editBtn = document.getElementById('edit_' + id);
    editBtn.classList.remove('hidden');
    const runBtn = document.getElementById('run_' + id);
    runBtn.classList.remove('hidden');
    const saveBtn = document.getElementById('save_' + id);
    saveBtn.classList.add('hidden');
    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'false');


    gridOptions.api.stopEditing();

    selectedRowNode.setDataValue('state', "read");
    selectedRowNode.setSelected(false);

}

function runRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    const output = document.getElementById('output');
    output.innerHTML = "";
    for (let key of Object.keys(immutableStore[selectedRowIndex])) {
        output.innerHTML += key + ": " + immutableStore[selectedRowIndex][key] + "<br>";
    }

}

function addRow() {
    const newStore = immutableStore.slice();
    const lastID = immutableStore.length;
    const nextID = (lastID + 1).toString();
    const newRowData = { id: nextID, state: "edit", action: "", name: "new" };

    newStore.splice(0, 0, newRowData);
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
    //gridOptions.api.refreshCells();

    editRow(nextID);

}

function editRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    selectedRowNode.setDataValue('state', "edit");

    gridOptions.api.startEditingCell({
        rowIndex: selectedRowIndex,
        colKey: 'name',
    });

    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'true');
    const editBtn = document.getElementById('edit_' + id);
    editBtn.classList.add('hidden');
    const saveBtn = document.getElementById('save_' + id);
    saveBtn.classList.remove('hidden');
    const runBtn = document.getElementById('run_' + id);
    runBtn.classList.add('hidden');


}

function onCellEditingStopped(event) {
    //console.log('ONCELLEDITINGSTOPPED', event);
    var rowNode = event.node;
    if (event.newValue == "Number") {
        rowNode.setDataValue('min_length', "");
        rowNode.setDataValue('max_length', "");
        rowNode.setDataValue('decimals', "2");
        rowNode.setDataValue('min_value', "0");
        rowNode.setDataValue('max_value', "");
        rowNode.setDataValue('special_characters', "");

    } else if ((event.newValue == "Text")) {
        rowNode.setDataValue('min_length', "1");
        rowNode.setDataValue('max_length', "");
        rowNode.setDataValue('decimals', "");
        rowNode.setDataValue('min_value', "");
        rowNode.setDataValue('max_value', "");
        rowNode.setDataValue('special_characters', "Yes");
    };
    rowNode.setSelected(false);
}

function numberParser(params) {
    return Number(params.newValue);
}
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

document.addEventListener('click', function (event) {
    // filter out clicks on any other elements
    if (event.target.nodeName == 'A' && event.target.getAttribute('data-disabled') == 'true') {
        event.preventDefault();
    }
});

