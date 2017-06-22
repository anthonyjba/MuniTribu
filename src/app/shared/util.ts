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

/**
 * evalNamesByKeys(this.columnsGroup[indexGroup].id, keysColumns)
 */
export function evalNamesByKeys(type: string, list) {
    if(type === "TIPO_CIF"){
      list.forEach((item, i) => {
              switch(item) {
                case "B Sociedades de responsabilidad limitada": 
                      list[i] = "B Sociedades limitadas"; break;
                case "S Órganos de la Administración del Estado y de las comunidades autónomas": 
                      list[i] = "S AAEE y AACC"; break;
                case "E Comunidades de bienes y herencias yacentes":
                      list[i] = "E CCBB y herencias"; break;
                case "R congregaciones e instituciones religiosas":
                      list[i] = "R Instituciones religiosas"; break;
                case "J Sociedades civiles, con o sin personalidad jurídica":
                      list[i] = "J Sociedades civiles"; break;
                case "N personas jurídicas y entidades sin personalidad jurídica que carezcan de la nacionalidad española,":
                      list[i] = "N Sin nacionalidad española"; break;
                case "H Comunidades de propietarios en régimen de propiedad horizontal":
                      list[i] = "H Comunidades de propietarios"; break;
                case "W Establecimientos permanentes de entidades no residentes en España":
                      list[i] = "W Entidades no residentes"; break;
                case " V Otros tipos no definidos en el resto de claves. ¿Sociedad Agraria de Transformación?": 
                      list[i] = "V Otros"; break;
              }                
            });
    }
    return list;  //list.map((el) => { return el.substring(0, 40) })    
  }