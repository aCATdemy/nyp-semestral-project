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
    allowReorder: true
});


$(function () {
    $("#create-post").submit(function (e) {
        e.preventDefault();
        var imagefiles = filesPond.getFiles();
        var formdata = new FormData();
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        
        formdata.append('title',title);
        formdata.append('description',description);

        for (var i = 0; i < imagefiles.length; i++) {
            formdata.append("images", imagefiles[i].file)
        }

        $.ajax({
            url: window.location.href,
            type: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            'success': (data) => {
                var newurl = window.location.href.replace("/post/create", "/post/" + username + "/myPost")
                window.location.href = newurl
            }
        })
    })
})