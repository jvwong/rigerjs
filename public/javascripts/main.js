console.log('ok');

var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var data = reader.result;
    var output = document.getElementById('output');
    // var input = document.getElementById('input');
    // input.innerHTML = data;

    fetch('http://localhost:3000/riger', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Accept": "application/json"
      },
      body: data // body data type must match "Content-Type" header
    })
    .then( result => {
      console.log( result );
      return;
      // output.innerHTML = JSON.stringify( result );
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
  };

  reader.readAsText(input.files[0]);
};


