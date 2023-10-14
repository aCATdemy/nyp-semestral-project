FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode, FilePondPluginFileMetadata, FilePondPluginImageCrop, FilePondPluginImageTransform);
const filesElem = document.querySelector('#file-upload');
const filesPond = FilePond.create(filesElem);

var username = document.getElementById("username").value;

filesPond.setOptions({
    maxFiles: 10,
    allowMultiple: true,
    labelIdle: 'Drag & Drop your Photos or <span class="filepond--label-action">Browse</span>',
    allowImageCrop: true,
    allowImageTransform: true,
    imageCropAspectRatio: '1:1',
    allowMultiple: true,
    allowReorder:true
});
let originalFiles = document.getElementsByName('files');
let originalFilesArray = [];

for(var i = 0; i < originalFiles.length; i++){
    // console.log(originalFiles[i].value);
    originalFilesArray.push(originalFiles[i].value) 
};
originalFilesArray.reverse();

for(var i = 0; i < originalFilesArray.length; i++){
    filesPond.addFile(originalFilesArray[i]);   
};


$(function () {
    $("#update-post").submit(function (e) {
        e.preventDefault();
        var imagefiles = filesPond.getFiles();
        var newimagefiles = [];

        for(var i =0 ; i < imagefiles.length; i++){
            newimagefiles.push(new File([imagefiles[i].file], imagefiles[i].filename, {
                type: imagefiles[i].fileType,
            }))
        };

        var formdata = new FormData();
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        
        formdata.append('title',title);
        formdata.append('description',description);

        for (var i = 0; i < newimagefiles.length; i++) {
            formdata.append("images", newimagefiles[i])
        }        

        $.ajax({
            url: window.location.href,
            type: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            'success': (data) => {                
                var newurl = window.location.href.replace(window.location.href, "/post/"+ username + "/myPost")
                window.location.href = newurl
            }
        })
    })
})