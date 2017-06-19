'use strict'

const fs = require('fs')
const input = './src/assets/data/cubo_cuota_toledo_c.json'
const output = './src/assets/data/cubo_cuota_totelo_new.json'

fs.unlink(output, err => err && console.error(err))

const inputFile = JSON.parse(fs.readFileSync(input, 'utf8')) //.toString().split('\n')

/** Extract only municipalities code */
var municipalities = {}
const firstLine = inputFile.shift(0);
console.log(firstLine);

inputFile.forEach( function( item) {    
    if(!municipalities.hasOwnProperty(item[0])){
        municipalities[item[0]] = true
    }
});

var outputList = [];
outputList.push(firstLine)

let arrayMunis = Object.keys(municipalities);
for(let muni in arrayMunis){
    let dsByMuni = inputFile.filter(row => 
                    { return row[0] === arrayMunis[muni] });
    
    outputList.push(removeEqualItems(dsByMuni));
}



//console.log( JSON.stringify(outputList) )
fs.appendFileSync(output, JSON.stringify( outputList, null, 0 ))

//console.log(outputList);
/*for(let muni in municipalities){
    console.log(muni);
}*/

/**
 * To remove equals items
 */
function removeEqualItems(dataset) {
    let newContainer = []; 
    dataset.forEach( function( item ) {
    if(
    !newContainer.some(d => { return d[1] === item[1] && d[2]===item[2] && d[3]===item[3] && d[4]===item[4] && d[5]===item[5] && d[6]===item[6] && d[7]===item[7] })
        ) {
            //console.log("true");
            newContainer.push(item)
        }
        //else{ console.log("false");}    
    });
    return newContainer;
}

/**
 * To extract some levels
 *
inputFile.forEach( function( item ) {
    if(item[1]!==null && item[2]!==null && item[3]===null && item[4]===null && item[5]===null && item[6]===null && item[7]!==null)
        {
            outputList.push(item)
        }
});
*/

