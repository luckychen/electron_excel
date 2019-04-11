

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {dialog} = require('electron').remote;
let nameArray = [];
let dataArray = [];
const path = require("path");
let fs = require("fs");
var itemMap = new Map();

itemMap.set("Last Name", "Your Last Name");
itemMap.set("Product Type", "Select Product Type");
itemMap.set("Issue Date","Issue Date (if applicable)");
itemMap.set("EPub Date", "EPub Date (if applicable)")
itemMap.set("PMID or PMCID", "PMID or PMCID (if applicable)");

//document.getElementById('#resultTable').

//update the name array according to excel files with person information
document.querySelector('#submitName').addEventListener('click', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files !== undefined) {
            // handle files
            var ext = files[0].split('.').pop();
            if (ext !== "xlsx"){
                console.log("please select correct file");
                return;
            }
            file_string=path.basename(files[0]);
            let area = document.getElementById('nameInput');
            if(area.value === "") area.value = file_string;
            else{
                let updatedFileNames = area.value.concat("\n",String(files));
                area.value=updatedFileNames;
            } 
            XLSX = require('xlsx');

            console.log(XLSX.version);
            
            var workbook = XLSX.readFile(file_string);
            //console.log(workbook.SheetNames);
            const sheet_list = workbook.SheetNames;
            if(nameArray === null)
                nameArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]);
            else{
                nameArray = nameArray.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]));
            }
            console.log(nameArray);
        }
    });
});

//update the research data array according to excel files with research records
document.querySelector('#submitData').addEventListener('click', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files !== undefined) {
            // handle files
            var ext = files[0].split('.').pop();
            if (ext !== "xlsx"){
                console.log("please select correct file");
                return;
            }
            let area = document.getElementById('dataInput');
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
            if(nameArray=null)
                dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]);
            else
                dataArray = dataArray.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]));

            console.log(dataArray);
        }
    });
});

function addRows(table, obj){
    var header = table.headers;
    var tr = table.insertRow(0);
    for(var i = 0; i < table.rows[0].cells.length; ++i){
        var cellKey = table.rows[0].cells[i];
        var cell_t = tr.insertCell(i);
        var newCellKey = cellKey;
        if(itemMap.has(cellKey) ){
            newCellKey = itemMap(cell_key);        
        }
        if(newCellKey in obj){
            cell_t.innerHTML = obj.newCellKey;
        } 
    }
}
//
document.querySelector('#searchData').addEventListener('click', function (event) {
    //read the names
    var opts = document.getElementById('searchDataOption').value;
    var name = document.getElementById('searchNameInput');
    if(opts == "err"){
        alert("items must be selected!");
        return;
    }
    resultTable = document.getElementById('searchRersult');
    if(name != ""){
        var nameMiss = 1;
        for(var i = 0; i < nameArray.length; ++i){
            var obj = nameArray[i];
            if (obj["Last Name"] == name){
                for(var j = 0; j < dataArray.length; ++j){
                    var obj_data = dataArray[i];
                    if (obj_data["Your Last Name"] == name && obj["Select Product Type"] === opts){
                        addRows(resultTable, obj);
                    }
                }
                nameMiss = 0;
            }
            if(nameMiss == 1){
                alert("last name is not match");
                return;
            } 
        }   
    }
    else{ //just search all items
        for(var j = 0; j < dataArray.length; ++j){
            var obj_data = dataArray[i];
            if (obj_data["Your Last Name"] === name && obj["Select Product Type"] === opts){
                addRows(resultTable, obj);
            }
        }
    }
});


document.querySelector('#dumpResult').addEventListener('click', function (event) {
    dialog.showSaveDialog(function (fileName) {
        if (fileName !== undefined) {
            var ext = fileName.split('.').pop();
            if (ext !== "xlsx"){
                console.log("only store .xlsx file");
                return;
            }
            XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById('searchRersult')),fileName);
        } else {
            alert("file name not specified");
        }
    });
});

