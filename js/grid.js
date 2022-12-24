class ActionCellRenderer {
    init(params) {
        this.eGui = document.createElement('span');
        let actionButtons = ""
        actionButtons += `<a href="#" onclick="deleteRow(${params.data.id})" id="delete_${params.data.id}" class="button-small">Delete</a>`;
        actionButtons += `&nbsp;<a href="#" onclick="editRow(${params.data.id})" id="edit_${params.data.id}" class="button-small">Edit</a>`;
        actionButtons += `&nbsp;<a href="#" onclick="saveRow(${params.data.id})" id="save_${params.data.id}" class="button-small hidden">Save</a>`;
        this.eGui.innerHTML = actionButtons;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

let immutableStore = [];

function deleteRow(id) {
    const selectedRowNode = gridOptions.api.getRowNode(id);
    immutableStore = immutableStore.filter(function (dataItem) {
        return dataItem.id != id;
    });
    gridOptions.api.setRowData(immutableStore);
}

function saveRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    const editBtn = document.getElementById('edit_' + id);
    editBtn.classList.remove('hidden');
    const saveBtn = document.getElementById('save_' + id);
    saveBtn.classList.add('hidden');
    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'false');


    gridOptions.api.stopEditing();

    immutableStore[selectedRowIndex].state = "read";
    gridOptions.api.setRowData(immutableStore);
    selectedRowNode = gridOptions.api.getRowNode(id);
    selectedRowNode.setSelected(false);

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

    immutableStore[selectedRowIndex].state = "edit";
    gridOptions.api.setRowData(immutableStore);


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


}

const columnDefs = [


    {
        field: "action",
        cellRenderer: ActionCellRenderer,
        editable: false,
        filter: false,
        resizable: false,
        sortable: false,
    },
    {
        field: "name", editable: true,
        headerName: "Column Name",
        flex: 2,
        editable: (params) => params.data.state == "edit"
    },
    {
        field: "description",
        headerName: "Field Description",
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
        resizable: false,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: (params) => params.data.type == "Text" & params.data.state == "edit"
    },
    {
        field: "min_length",
        headerName: "Minimum text length",
        resizable: false,
        filter: 'agNumberColumnFilter',
        editable: (params) => params.data.type == "Text" & params.data.state == "edit",
    },
    {
        field: "max_length",
        headerName: "Maximum text length",
        resizable: false,
        filter: 'agNumberColumnFilter',
        editable: (params) => params.data.type == "Text" & params.data.state == "edit",
        valueParser: numberParser,
    },
    {
        field: "decimals",
        filter: 'agNumberColumnFilter',
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit",
        valueParser: numberParser,

    },
    {
        field: "min_value",
        filter: 'agNumberColumnFilter',
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit",
        valueParser: numberParser,
    },
    {
        field: "max_value",
        filter: 'agNumberColumnFilter',
        resizable: false,
        editable: (params) => params.data.type == "Number" & params.data.state == "edit"

    }
];

// specify the data
var rowData = [
    { id: "1", state: "read", name: "account_description", description: "Account Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
    { id: "2", state: "read", name: "account_description2", description: "Account II Description", type: "Text", special_characters: "Yes", min_length: "1", max_length: "100" },
];

// let the grid know which columns and what data to use
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
        resizable: true,
        filter: true,
        sortable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1
    }
};

// setup the grid after the page has finished loading
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
