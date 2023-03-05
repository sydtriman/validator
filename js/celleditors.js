const dropDownValues = (params) => {
    switch (params.colDef.field) {
        case "type":
            return {

                values: ['Text', 'Number', 'Boolean']
            };
        case "special_characters":
            return {

                values: ['Yes', 'No', 'Not applicable']
            }
    }
}

class DropDownEditor {
    init(params) {
        this.editorName = "DropDownEditor";
        this.fieldName = params.colDef.field;
        this.eInput = document.createElement('select');
        this.eInput.id = params.colDef.field;

        for (let v in params.values) {
            let optionelement = document.createElement('option');
            optionelement.value = params.values[v];
            optionelement.innerHTML = params.values[v];
            this.eInput.appendChild(optionelement);
        }

        this.eInput.addEventListener('change', (event) => {
            this.dropDownChanged(event);
        });
    }


    dropDownChanged(event) {
        let numberCellEditorInstances = [];
        let dropDownCellEditorInstances = [];

        const selectedRowData = gridOptions.api.getSelectedRows()[0];
        const selectedRowNode = gridOptions.api.getSelectedNodes();
        const instances = gridOptions.api.getCellEditorInstances();

        if (instances.length > 0) {

            instances.forEach(function (instance) {

                if (instance.editorName && instance.editorName == "NumberCellEditor") {
                    numberCellEditorInstances.push(instance);
                } else if (instance.editorName && instance.editorName == "DropDownEditor") {
                    dropDownCellEditorInstances.push(instance);
                }
            });


        }

    }

    getGui() {
        return this.eInput;
    }

    refresh(params) {
        return false;
    }
}

class NumberCellEditor {
    // gets called once before the renderer is used
    init(params) {
        this.editorName = "NumberCellEditor";
        this.fieldName = params.colDef.field;
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.classList.add('numeric-input');
        this.eInput.style.width = '100%';
        this.eInput.style.height = '100%';
        this.eInput.classList.add('.ag-theme-alpine')


        if (this.isCharNumeric(params.charPress)) {
            this.eInput.value = params.charPress;
        } else {
            if (params.value !== undefined && params.value !== null) {
                this.eInput.value = params.value;
            }
        }

        this.eInput.addEventListener('keypress', (event) => {
            if (!this.isKeyPressedNumeric(event)) {
                this.eInput.focus();
                if (event.preventDefault) event.preventDefault();
            } else if (this.isKeyPressedNavigation(event)) {
                event.stopPropagation();
            }
        });

        // only start edit if key pressed is a number, not a letter
        const charPressIsNotANumber =
            params.charPress && '1234567890'.indexOf(params.charPress) < 0;
        this.cancelBeforeStart = !!charPressIsNotANumber;
    }

    isKeyPressedNavigation(event) {
        // console.log('isKeyPressedNavigation', event);
        return event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    }

    // gets called once when grid ready to insert the element
    getGui() {
        return this.eInput;
    }

    // focus and select can be done after the gui is attachedd
    afterGuiAttached() {
        //console.log('afterGuiAttached');
        this.eInput.focus();
    }

    // returns the new value after editing
    isCancelBeforeStart() {
        //console.log('isCancelBeforeStart');
        return this.cancelBeforeStart;
    }

    // example - will reject the number if it contains the value 007
    // - not very practical, but demonstrates the method.
    isCancelAfterEnd() {

        const cellDefs = gridOptions.api.getEditingCells();
        // console.log('isCancelAfterEnd', cellDefs);
        const value = this.getValue();
        return true

    }

    // returns the new value after editing
    getValue() {
        return this.eInput.value;
    }

    // any cleanup we need to be done here
    destroy() {
        // but this example is simple, no cleanup, we could  even leave this method out as it's optional
    }

    // if true, then this editor will appear in a popup
    isPopup() {
        // and we could leave this method out also, false is the default
        return false;
    }

    isCharNumeric(charStr) {
        return charStr && !!/\d/.test(charStr);
    }

    isKeyPressedNumeric(event) {
        // console.log('IsKeyPressedNumeric', event)
        const charStr = event.key;
        return this.isCharNumeric(charStr);
    }
}