FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize
);

FilePond.setOptions({
    stylePanelAspectRatio: 30 / 70,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight:150,
    maxFileSize:3000000,
    labelMaxFileSize:'Maximum file size is 3MB'
    
})

FilePond.parse(document.body);