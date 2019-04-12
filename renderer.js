

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {dialog} = require('electron').remote;
var nameArray = [];
var dataArray = [];
const path = require("path");
let fs = require("fs");
var itemMap = new Map();

itemMap.set("Last Name", "Your Last Name");
itemMap.set("Product Type", "Select Product Type");
itemMap.set("Issue Date","Issue Date (if applicable)");
itemMap.set("EPub Date", "EPub Date (if applicable)")
itemMap.set("PMID or PMCID", "PMID or PMCID (if applicable)");

/*resultTable = document.getElementById("searchResult");
var tableMap = new Map();
for(let i = 0; i < resultTable.rows[0].cells.length; ++i){
    tableMap.set(resultTable.rows[0].cells[i], i)
}*/


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
            fileString=path.basename(files[0]);
            let area = document.getElementById('nameInput');
            if(area.value === "") area.value = fileString;
            else{
                let updatedFileNames = area.value.concat("\n",fileString);
                area.value=updatedFileNames;
            } 
            XLSX = require('xlsx');

            console.log(XLSX.version);
            
            var workbook = XLSX.readFile(fileString);
            //console.log(workbook.SheetNames);
            const sheetList = workbook.SheetNames;
            if(nameArray === null)
                nameArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
            else{
                nameArray = nameArray.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]));
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
            fileString=path.basename(files[0]);
            if(area.value === "") area.value = fileString;
            else{
                let updatedFileNames = area.value.concat("\n",fileString);
                area.value=updatedFileNames;
            } 
            XLSX = require('xlsx');

            
            var workbook = XLSX.readFile(fileString);
            //console.log(workbook.SheetNames);
            const sheetList = workbook.SheetNames;
            if(dataArray == null)
                dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
            else
                dataArray = dataArray.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]));

            console.log(dataArray);
        }
    });
});

function addRows(table, obj, obj_data){
    let header = table.headers;
    let tr = table.insertRow(0);
    for(let i = 0; i < table.rows[0].cells.length; ++i){
        let cellKey = table.rows[0].cells[i];
        let cell_t = tr.insertCell(i);
        let newCellKey = cellKey;
        //convert the json item name to name of table head (for example, delete "if applicable")
        if(itemMap.has(cellKey) ){
            newCellKey = itemMap(cell_key);        
        }
        if(newCellKey in obj){
            cell_t.innerHTML = obj.newCellKey;
        } else if(newCellKey in obj_data){
            cell_t.innerHTML = obj.newCellKey;
        }
    }
}
//
document.querySelector('#searchData').addEventListener('click', function (event) {
    //read the names
    var opts = document.getElementById('searchDataOptions').value;
    var name = document.getElementById('searchNameInput').value;
    if(opts == "err"){
        alert("items must be selected!");
        return;
    }

    resultTable = document.getElementById("searchResult");
    if(name != ""){
        let nameMiss = 1;
        for(let i = 0; i < nameArray.length; ++i){
            let obj = nameArray[i];
            if (obj["Last Name"] == name){
                for(let j = 0; j < dataArray.length; ++j){
                    let obj_data = dataArray[j];
                    if (obj_data["Your Last Name"] == name && obj_data["Select Product Type"] === opts){
                        //addRows(resultTable, obj, obj_data);
                        console.log(obj_data);
                    }
                }
                nameMiss = 0;
            }
        }  
        if(nameMiss == 1){
            alert("last name is not match");
            return;
        }  
    }
    else{ //just search all items
        for(var j = 0; j < dataArray.length; ++j){
            var obj_data = dataArray[i];
            if (obj_data["Your Last Name"] === name && obj["Select Product Type"] === opts){
                console.log(obj);
                //addRows(resultTable, obj, obj_data);
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

