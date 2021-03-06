window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
readfile();
function onInitFs(fs) {
  var filestuff = document.getElementById('script').value;
  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Wrote: ' + filestuff);
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
      // Create a new Blob and write it to log.txt.
      var blob = new Blob([filestuff], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

}
function remove(){
  window.requestFileSystem(window.PERSISTANT, 1024*1024, function(fs) {
    fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

      fileEntry.remove(function() {
        console.log('File removed.');
      }, errorHandler);

    }, errorHandler);
  }, errorHandler);
}
function writestuff(){
  remove();
  setTimeout(writeytighty,1000);
  setTimeout(readfile,1100);
}
function writeytighty(){
  window.requestFileSystem(window.PERSISTANT, 1024*1024, onInitFs, errorHandler);
}
function readFS(fs) {

  fs.root.getFile('log.txt', {}, function(fileEntry) {
    
    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.getElementById('script');
         var totranslate = this.result;
         txtArea.innerHTML = this.result;
         translate(totranslate);
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);
 

}
function readfile(){
  window.requestFileSystem(window.TEMPORARY, 1024*1024, readFS, errorHandler);
}
function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case e.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case e.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case e.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case e.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case e.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}



function translate(script){
  var lines = script.split('\n');
  var script2 = '';
  var switdh = window.innerWidth * .5;
  var sheight = window.innerHeight * .4;
  script = 'jQuery(function($, undefined) { $("#term_demo").terminal(function(userinput) {';
  var secondpart = '}, { ';
  var promptything = 'index.jam >';
  var ifs = 0;
   var i = 0;
  while (i < lines.length){
    if (lines[i] == 'startsay'){
      script2 = script2 + 'greetings: "' + lines[i + 1] + '",';
      i++; 
    }
    else if (lines[i] == 'say'){
      script = script + 'this.echo(' + lines[i + 1] + ');';
      i++;
    }
    // else if (lines[i] == 'oper'){
    //   script = 'function ' + lines[i + 1] + '(userinput){' + script;
    //   i++;
    // }
    // else if (lines [i] == 'calloper'){
    //   script = script + lines[i + 1] + '(userinput);';
    //   i++;
    // }
    else if (lines[i] == 'newdata'){
      script = 'var ' + lines[i + 1] + ';' + script;
      i++;
    }
    else if (lines[i] == 'startdata'){
      script = 'var ' + lines[i + 1] + '=' + lines[i + 2] + ';' + script;
      i++;
      i++;
    }
    else if (lines[i] == 'setdata'){
      script = script + lines[i + 1] + ' = ' + lines[i + 2] + ';';
      i++;
      i++;
    }
    else if (lines[i] == 'command'){
      ifs ++;
      specialtext = 'if';
      if (ifs > 1){
        specialtext = 'else if';
      }
      script = script + specialtext + ' (userinput == ' + lines[i + 1] + ')';
      i++;
    }
    else if (lines[i] == 'none'){
      script = script + 'else';
    }
    else if (lines[i] == 'then'){
      script = script + '{';
    }
    else if (lines[i] == 'end'){
      script = script + '}';
    }
    else if (lines[i] == 'setpre'){
      promptything = lines[i + 1];
      i++;
    }
    else if (lines[i] == 'if'){
      script = script + 'if (' + lines[i + 1] + lines[i + 2] + lines[i + 3] + ')';
      i++;
      i++;
      i++;
    }
    else if (lines[i] == 'eif'){
      script = script + 'else if (' + lines[i + 1] + lines[i + 2] + lines[i + 3] + ')';
      i++;
      i++;
      i++;
    }
    else if (lines[i] == 'else'){
      script = script + 'else';
      //same as none command 
    }
    else {
      //error function  
    }
    i++;
  }
  var thirdpart = 'height: ' + sheight + ', width: ' + switdh + ', prompt: "' + promptything + '" });});';
  script = script + secondpart + script2 + thirdpart;
  writelascript(script);
}




function writelascript (script){
  if (srcy !== undefined){
    srcy.remove();
  }
  document.getElementById("term_demo").remove();
  var div = document.createElement("DIV");
  div.setAttribute('id', 'term_demo');
  document.getElementById("rightside").appendChild(div);
  var srcy = document.createElement("SCRIPT");
  srcy.innerHTML = script;
  // console.log(script);
  document.body.appendChild(srcy);
}