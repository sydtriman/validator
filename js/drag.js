// XLSX is a global from the standalone script

async function handleDropAsync(e) {
  e.stopPropagation();
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);
  populateGrid(workbook);

  /* DO SOMETHING WITH workbook HERE */
}
drop_dom_element.addEventListener("drop", handleDropAsync, false);

function populateGrid(workbook) {
  // our data is in the first sheet
  var firstSheetName = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[firstSheetName];

  // we expect the following columns to be present
  var columns = {
    A: 'athlete',
    B: 'age',
    C: 'country',
    D: 'year',
    E: 'date',
    F: 'sport',
    G: 'gold',
    H: 'silver',
    I: 'bronze',
    J: 'total',
  };

  var rowData = [];

  // start at the 2nd row - the first row are the headers
  var rowIndex = 2;

  // iterate over the worksheet pulling out the columns we're expecting
  while (worksheet['A' + rowIndex]) {
    var row = {};
    Object.keys(columns).forEach(function (column) {
      row[columns[column]] = worksheet[column + rowIndex].w;
    });

    rowData.push(row);

    rowIndex++;
  }

  // finally, set the imported rowData into the grid
  gridOptions.api.setRowData(rowData);
}
