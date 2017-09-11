var currentHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'; // Start with empty folder

function postToIPFS(fileObj) {
  var def = $.Deferred();
  $.ajax({
    url: 'https://eternum.io/ipfs/' + currentHash + '/' + fileObj.name,
    type: 'PUT',
    data: fileObj,
    contentType: false,
    processData: false,
    success: function(data, status, jqXHR) {
      def.resolve(data);
    },
    error: function(jqXHR, status, error) {
      def.reject(jqXHR.status, error);
    }
  });
  return def.promise();
}

$(document).ready(function() {
 $('#dropped-file').on('change', function(e) {
   debugger;
 });
 $('#drop-zone').on('dragover', function(e) {
   e.preventDefault();
   e.stopPropagation();
   $(this).addClass('hover');
 }).on('dragleave', function(e) {
   e.preventDefault();
   e.stopPropagation();
   $(this).removeClass('hover');
 });
 $('#drop-zone').on('drop', function(e) {
   e.preventDefault();
   e.stopPropagation();
   $(this).removeClass('hover');
   var dt = e.originalEvent.dataTransfer;
   postToIPFS(dt.files[0]);

   /*
   for (var i = 0; i < dt.files.length; i++) {
     var fileReader = new FileReader();
     fileReader.onload = (function(fileData) {
       return function(e) {
         console.log(fileData.fileName, e.target.result);
       }
     })(dt.items[i]);
     fileReader.readAsDataURL(dt.files[i]);
     console.log(dt.files[i]);
   }
   */
 });
});
