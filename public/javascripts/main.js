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

const displayOutput = ( data ) => {
  const topInfo = data.slice(0, 50).map( e => {
    return e['Gene Rank'] + '. ' + e['Gene Name'] + ': ' + e['p-value']
  });
  const topGenes = data.slice(0, 50).map( e => e['Gene Name'] )

  const outputElement = document.getElementById('output');

  const briefh3Node = document.createElement( "h3" );
  const briefTextNode = document.createTextNode( 'Genes by rank' );
  briefh3Node.appendChild(briefTextNode);
  outputElement.appendChild( briefh3Node );

  const briefTextlNode = document.createElement( "div" );
  briefTextlNode.innerHTML = topGenes.join(' ');
  outputElement.appendChild(briefTextlNode);

  const detailh3Node = document.createElement( "h3" );
  const detailTextNode = document.createTextNode( 'Detailed' );
  detailh3Node.appendChild(detailTextNode);
  outputElement.appendChild( detailh3Node );

  const detailulNode = document.createElement( "ul" );
  topInfo.forEach( name => {
    const node = document.createElement( "li" );
    const textnode = document.createTextNode( name );
    node.appendChild( textnode) ;
    detailulNode.appendChild( node );
  });
  outputElement.appendChild(detailulNode);
}

const handleUpload = async (event) => {
  console.log('handleUpload');
  const file = event.target.files[0];

  try {
    const fileContents = await readUploadedFileAsText(file);
    const analysisResults = await analyzeHaripins( fileContents );
    displayOutput( analysisResults );

  } catch (e) {
    console.warn(e.message)
  }
}