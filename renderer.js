

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {dialog} = require('electron').remote;
XLSX = require('xlsx');
var nameArray = [];
var dataArray = [];
var productType = [ "Abstract", "Book", "Book Chapter", "Peer-reviewed Manuscript", "Presentation", "Review Article"];
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
                alert("please select correct file");
                return;
            }
            fileString=path.basename(files[0]);
            var workbook = XLSX.readFile(fileString);
            
            const sheetList = workbook.SheetNames;
            parsedArrayName = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
            if(("Role in Center" in parsedArrayName[1]) === false){
                alert("Please select right excel file for name data");
                return;
            }
            //console.log(workbook.SheetNames);
            if(nameArray === null){
                nameArray = parsedArrayName;
            }else{
                nameArray = nameArray.concat(parsedArrayName);
            }

            
            let area = document.getElementById('nameInput');
            if(area.value === "") area.value = fileString;
            else{
                let updatedFileNames = area.value.concat("\n",fileString);
                area.value=updatedFileNames;
            } 
            //console.log(nameArray);
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
                alert("please select file with xlsx type");
                return;
            }    
            fileString=path.basename(files[0]);        
            
            
            var workbook = XLSX.readFile(fileString);
            //console.log(workbook.SheetNames);
            const sheetList = workbook.SheetNames;

            parsedArrayData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
            if(("Select Product Type" in parsedArrayData[1]) === false){
                alert("Please select right excel file for research data");
                return;
            }
            if(dataArray == null)
                dataArray = parsedArrayData;
            else
                dataArray = dataArray.concat(parsedArrayData);
          
            let area = document.getElementById('dataInput');
            
            if(area.value === "") area.value = fileString;
            else{
                let updatedFileNames = area.value.concat("\n",fileString);
                area.value=updatedFileNames;
            } 
        }
    });
});

function addRows(table, obj, obj_data){
    let tr = table.insertRow(-1);
    let tableCol = table.rows[0].cells.length;
    for(let i = 0; i < tableCol; ++i){
        let cellKey = table.rows[0].cells[i].textContent;
        let cell_t = tr.insertCell(i);
        let newCellKey = cellKey;
        //convert the json item name to name of table head (for example, delete "if applicable")
        if(itemMap.has(cellKey) ){
            newCellKey = itemMap.get(cellKey);        
        }
        if(newCellKey in obj){
            cell_t.innerHTML = obj[newCellKey];
        } else if(newCellKey in obj_data){
            cell_t.innerHTML = obj_data[newCellKey];
        }
    }
}
function checkCategoryMatch(data_obj, searchCriteria){
    for(let i = 0; i < Object.keys(searchCriteria).length; ++i){
        if(){

        }
    }
    return true;
}
function checkItems(data_obj, opts){
    if(opts == "Other"){
        for(let i = 0; i < productType.length; ++i){
            if(data_obj["Select Product Type"] == productType[i])
                return false;
        }
    } else {
        for(let i = 0; i < productType.length; ++i){
            if(data_obj["Select Product Type"] != productType[i])
                return false;
        }
    }
    return true;
}
//
document.querySelector('#searchData').addEventListener('click', function (event) {
    //read the names
    if(nameArray == null || dataArray == null){
        alert("please load name file AND data file first");
        return;
    }

    let searchCriteria = buildSearchArray();
    var opts = document.getElementById('searchDataOptions').value;
    if(opts == "err"){
        alert("items must be selected!");
        return;
    }

    resultTable = document.getElementById('searchResult');
    if(Object.keys(searchCriteria).length > 0){
        let searchMiss = 1;
        for(let i = 0; i < dataArray.length; ++i){
            let obj = dataArray[i];
            if (checkCategoryMatch(obj, searchCriteria) && checkItems(obj, opts)){
                searchMiss = 0;
                addRows(resultTable, obj, obj_data);
                //console.log(obj_data);
            }
        }  
        if(nameMiss == 1){
            alert("no match found");
            return;
        }  
    } else{ //just search all items
        alert("at least one criteria should be specified");
    }
});


document.querySelector('#dumpResult').addEventListener('click', function (event) {
    dialog.showSaveDialog(function (fileName) {
        resultTable = document.getElementById('searchResult');
        if (fileName !== undefined) {
            var ext = fileName.split('.').pop();
            if (ext !== "xlsx"){
                console.log("only store .xlsx file");
                return;
            }
            XLSX.writeFile(XLSX.utils.table_to_book(resultTable),fileName);
        } else {
            alert("file name not specified");
        }
    });
});

