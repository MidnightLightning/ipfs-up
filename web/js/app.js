var currentHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'; // Start with empty folder

function postToIPFS(fileObj) {
  var def = $.Deferred();
  $.ajax({
    url: '/ipfs/' + currentHash + '/' + fileObj.name,
    type: 'PUT',
    data: fileObj,
    contentType: false,
    processData: false,
    success: function(data, status, jqXHR) {
      var hash = jqXHR.getResponseHeader('ipfs-hash');
      def.resolve(hash);
    },
    error: function(jqXHR, status, error) {
      def.reject(jqXHR.status, error);
    }
  });
  return def.promise();
}

function addToFileList(fileObj) {
  var $container = $('#current-upload');
  $container.find('#file-list').append('<div>' + fileObj.name + '</div>');
  $container.show();
}

function updateResultLinks() {
  var $container = $('#upload-result');
  $container.find('#upload-url').html('<a target="_top" href="/ipfs/' + currentHash + '">/ipfs/' + currentHash + '</a>');
  $container.find('#eternum-link').attr('href', 'https://www.eternum.io/pin/' + currentHash);
  $container.show();
}

$(document).ready(function() {
 $('#dropped-file')
   .on('change', function(e) {
     debugger;
   });
 $('#drop-zone')
   .on('dragover', function(e) {
     e.preventDefault();
     e.stopPropagation();
     $(this).addClass('hover');
   })
   .on('dragleave', function(e) {
     e.preventDefault();
     e.stopPropagation();
     $(this).removeClass('hover');
   })
   .on('drop', function(e) {
     e.preventDefault();
     e.stopPropagation();
     $(this).removeClass('hover');
     var dt = e.originalEvent.dataTransfer;
     var fileObj = dt.files[0];
     postToIPFS(fileObj).then(function(newHash) {
       console.log('New Hash', newHash);
       addToFileList(fileObj);
       currentHash = newHash;
       updateResultLinks();
     }, function(err, msg) {
       console.error(err, msg);
    });

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

   $('#clear-btn').on('click', function(e) {
     e.preventDefault();
     e.stopPropagation();
     currentHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn';
     $('#current-upload').hide().find('#file-list').html('');
     $('#upload-result').hide();
   });
});
