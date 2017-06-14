'use strict'

const fs = require('fs')
const input = './src/assets/data/cubo_cuota.json'
const output = './src/assets/data/cubo_cuota_levelAC_TCIF.json'

fs.unlink(output, err => err && console.error(err))

const inputFile = JSON.parse(fs.readFileSync(input, 'utf8')) //.toString().split('\n')
var outputList = [];

/**
 * To remove equals items
 *
inputFile.forEach( function( item ) {
    if(
    !outputList.some(d => { return d[1] === item[1] && d[2]===item[2] && d[3]===item[3] && d[4]===item[4] && d[5]===item[5] && d[6]===item[6] && d[7]===item[7] })
        ) {
            console.log("true");
            outputList.push(item)
        }
        else{ console.log("false");}    
});
*/

/**
 * To extract some levels
 */
inputFile.forEach( function( item ) {
    if(item[1]!==null && item[2]!==null && item[3]===null && item[4]===null && item[5]===null && item[6]===null && item[7]!==null)
        {
            outputList.push(item)
        }
});

console.log( JSON.stringify(outputList) )
fs.appendFileSync(output, JSON.stringify( outputList, null, 0 ))
