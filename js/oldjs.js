function numberParser(params) {
    return Number(params.newValue);
}


function saveRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    const cellDefs = gridOptions.api.getEditingCells();
    console.log(cellDefs);

    // if (selectedRowNode.data.type == "Number" && selectedRowNode.data.min_length  null) {
    //     gridmessage.innerHTML = "You cannot have a minimum length for a number field."
    //     return
    // }



    const editBtn = document.getElementById('edit_' + id);
    editBtn.classList.remove('hidden');
    const runBtn = document.getElementById('runBtn');
    runBtn.classList.remove('hidden');
    const saveBtn = document.getElementById('save_' + id);
    saveBtn.classList.add('hidden');
    const addBtn = document.getElementById('addBtn');
    addBtn.setAttribute('data-disabled', 'false');


    gridOptions.api.stopEditing();

    selectedRowNode.setDataValue('state', "read");
    selectedRowNode.setSelected(false);

}

function editRow(id) {
    let selectedRowNode = gridOptions.api.getRowNode(id);
    let selectedRowIndex = selectedRowNode.rowIndex;

    selectedRowNode.setDataValue('state', "edit");
    gridOptions.api.setFocusedCell(selectedRowIndex, 'name');
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
    const runBtn = document.getElementById('runBtn');
    runBtn.classList.add('hidden');


}
class DropDownRenderer {
    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `${params.value}`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}