let immutableStore = [];


const columnDefs = [
    {
        field: "state",
        editable: true,
        //hide: true
    },
    {
        field: "fieldName",
        checkboxSelection: true,
        editable: true,
        headerName: "Field",
        resizable: true
    },
    {
        field: "value",
        editable: true,
        headerName: "Value",
        resizable: true,
    }
];

let rowData = [
    { id: "1", state: "read", fieldName: "account_code", fieldDescription: "Account Code", value: "98723489723" },
    { id: "2", state: "read", fieldName: "account_name", fieldDescription: "Account Name", value: "Legal" },
    { id: "3", state: "read", fieldName: "account_description", fieldDescription: "Account Description", value: "Legal and costs costs" },
    { id: "4", state: "read", fieldName: "account_type", fieldDescription: "Account Type", value: "Text" },
    { id: "5", state: "read", fieldName: "min_length", fieldDescription: "Minimum Length", value: "1" },
    { id: "6", state: "read", fieldName: "max_length", fieldDescription: "Maximum Length", value: "100" },
    { id: "7", state: "read", fieldName: "decimals", fieldDescription: "Decimal Places", value: "" },
    { id: "8", state: "read", fieldName: "min_number", fieldDescription: "Minimum Value", value: "0" },
    { id: "9", state: "read", fieldName: "max_number", fieldDescription: "Maximum Value", value: "0" },
];

const gridOptions = {
    columnDefs: columnDefs,
    rowData: immutableStore,
    rowSelection: 'multiple',
    editType: 'fullRow',
    suppressMovableColumns: true,
    animateRows: true,

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
        resizable: false,
        filter: true,
        sortable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        editable: (params) => params.data.state == "edit"
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

function saveRow(id) {
    gridOptions.api.stopEditing();
    gridOptions.api.forEachNode(function (rowNode, index) {
        rowNode.setDataValue('state', 'read');
    });

    const editBtn = document.getElementById('editBtn');
    editBtn.classList.remove('hidden');
    const runBtn = document.getElementById('runBtn');
    runBtn.classList.remove('hidden');
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.classList.add('hidden');
    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'false');
}

function runRow(id) {
    console.log('addRow run');

}

function addRow() {
    const newStore = immutableStore.slice();
    const lastID = immutableStore.length;
    const nextID = (lastID + 1).toString();
    const newRowData = { id: nextID, state: "edit", action: "", fieldName: "...", value: "..." };

    newStore.splice(0, 0, newRowData);
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
    //gridOptions.api.refreshCells();

    editRow(nextID);

}

function editRow() {
    gridOptions.api.forEachNode(function (rowNode, index) {
        rowNode.setDataValue('state', 'edit');
    });

    gridOptions.api.startEditingCell({
        rowIndex: 0,
        colKey: 'fieldName',
    });

    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'true');
    const editBtn = document.getElementById('editBtn');
    editBtn.classList.add('hidden');
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.classList.remove('hidden');
    const runBtn = document.getElementById('runBtn');
    runBtn.classList.add('hidden');


}
function cellEditorSelector(params) {
    if (params.data.type === 'age') {
        return {
            component: NumericCellEditor,
        };
    }

    if (params.data.type === 'gender') {
        return {
            component: 'agRichSelectCellEditor',
            params: {
                values: ['Male', 'Female'],
            },
            popup: true,
        };
    }

    if (params.data.type === 'mood') {
        return {
            component: MoodEditor,
            popup: true,
            popupPosition: 'under',
        };
    }

    return undefined;
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

