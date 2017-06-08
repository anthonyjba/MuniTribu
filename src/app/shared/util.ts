/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */

const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export function keys(currentDict: any) : Array<string> {
  return Object.keys(currentDict);
}

export function getUniqueValueById<T>(list: any[], id: string, column: string){
  let result: any = undefined;
  let item = list.find((item) => item.id === id)
  if(item) { result = item[column]; }
      
  return <T>result;
}

export function decompressJson(jsonComp, id: string) {

	        var json = [];
	        var campos = jsonComp[0];
	        for (var i = 1, l = jsonComp.length; i < l; i++) {	            
	            var line = jsonComp[i];
              if(line[0] === id) {
                var reg = {};
                for (var z = 0; z < campos.length; z++) {
                    reg[campos[z]] = line[z];
                }
                json.push(reg);
              }
	        }
	        return json;
	    }