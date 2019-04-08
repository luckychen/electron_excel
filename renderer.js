// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {dialog} = require('electron').remote;
let nameArray = [];
let dataArray = [];
const path = require("path");
let fs = require("fs");
document.querySelector('#submitName').addEventListener('click', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    }, function (files) {
        if (files !== undefined) {
            // handle files
            let area = document.getElementById('nameInput');
            if(area.value === "") area.value = files;
            else{
                let updatedFileNames = area.value.concat("\n",String(files));
                area.value=updatedFileNames;
            } 
            XLSX = require('xlsx');

            console.log(XLSX.version);
            file_string=path.basename(files[0]);
            var workbook = XLSX.readFile(file_string);
            //console.log(workbook.SheetNames);
            const sheet_list = workbook.SheetNames;
            console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]));
        }
    });
});

