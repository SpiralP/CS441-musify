import util from "util";

export function inspect(myObject: any) {
  console.log(util.inspect(myObject, false, null, true /* enable colors */));
}
