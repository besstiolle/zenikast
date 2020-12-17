requirejs.config({
    baseUrl: 'medias/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/main']);