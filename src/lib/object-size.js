function roughSizeOfObject(object) {
  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    switch (typeof value) {
      case 'boolean':
        bytes += 4;
        break;
      case 'string':
        bytes += value.length * 2;
        break;
      case 'number':
        bytes += 8;
        break;
      case 'object':
        if (!objectList.includes(value)) {
          objectList.push(value);
          for (const prop in value) {
            if (value.hasOwnProperty(prop)) {
              stack.push(value[prop]);
            }
          }
        }
        break;
    }
  }

  return bytes;
}



function formatByteSize(bytes) {
  if(bytes < 1024) return bytes + " bytes";
  else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
  else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
  else return(bytes / 1073741824).toFixed(3) + " GiB";
};

export function sizeOf( obj ){
  return formatByteSize(roughSizeOfObject(obj));
}
