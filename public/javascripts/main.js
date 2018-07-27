const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};

const analyzeHaripins = async ( data ) => {
  return fetch( "http://localhost:3000/riger", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Accept": "application/json; charset=utf-8"
    },
    referrer: "no-referrer", // no-referrer, *client
    body: data, // body data type must match "Content-Type" header
  })
  .then(response =>  response.json()) // parses response to JSON
  .catch(error => console.error(`Fetch Error =\n`, error));
}

const handleUpload = async (event) => {
  console.log('handleUpload');
  const file = event.target.files[0];

  try {
    const fileContents = await readUploadedFileAsText(file);
    const analysisResults = await analyzeHaripins( fileContents );
    const topGenes = analysisResults.slice(0, 50).map( e => e['Gene Name'] );
    const outputElement = document.getElementById('output');

    topGenes.forEach( name => {
      const node = document.createElement( "li" );
      const textnode = document.createTextNode( name );
      node.appendChild(textnode);
      outputElement.appendChild(node);
    });
  } catch (e) {
    console.warn(e.message)
  }
}