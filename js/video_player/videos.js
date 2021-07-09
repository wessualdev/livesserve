var Videos = {
    video: {},
    events: function() {

        var videoURL = 'https://d3ed7ab5g77y04.cloudfront.net/out/v1/cda9dd046cd941a5a24db2d8b970b582/index.m3u8';
        var poster = 'imgs/poster-videos.jpg';
        Videos.crearVideo(videoURL, poster);
        $('#capaFrontal #closeVideo').click(function() {
            Videos.cerrarVideo();
        });

    },
    crearVideo: function(videoURL, poster) {
        // Creo el tag video dentro del contenedor
        Videos.video = document.createElement('video');
        Videos.video.setAttribute('id', 'video1');
        Videos.video.setAttribute('controls', 'controls');
        Videos.video.setAttribute('autoplay', 'autoplay');
        Videos.video.setAttribute('poster', poster);
        Videos.video.setAttribute('controlsList', 'nodownload');
        document.getElementById('contenedorVideosGeneral').appendChild(Videos.video);

        // Meto el source
        var source = document.createElement('source');
        source.src = videoURL;
        source.type = 'video/mp4';
        Videos.video.appendChild(source);

        // Si tengo posición inicial del video, lo pongo ahí
        // Si ha visto ya un trozo, le llevo al segundo donde se quedó

        $('#capaFrontal').show();
        $('#columnaVideo').show();
        var alto = ($('#columnaVideo video').width() * 1080) / 1920;
        $('#columnaVideo video').height(alto);

        // Lanzo los eventos
        //        VideosGeneral.controlAvance(nItem, 'intro');
    },
    controlAvance: function(nItem, tipo) {
        Index.itemsSeguimiento[nItem].video.ontimeupdate = function() {
            Index.currentItem = nItem;
            VideosGeneral.bloquearAvance(nItem);
            if (!Index.itemsSeguimiento[nItem].video.seeking) {
                VideosGeneral.progress(Index.itemsSeguimiento[nItem].video.currentTime, nItem);
            }
            Index.itemsSeguimiento[nItem].video.onended = function() {
                Modulos.modulos[Course.currentModule].itemsSeguimiento[0].status = 'C';
                SeguimientoGeneral.completarItem(0);
                //                Subtitulos.eliminar();
            };
            //            Subtitulos.update(Index.itemsSeguimiento[nItem].video.currentTime, tipo);
        };
    },
    progress: function(currentTime, nItem) {
        if (currentTime > Index.itemsSeguimiento[nItem].last_position) {
            Index.itemsSeguimiento[nItem].last_position = parseInt(currentTime);
            Modulos.modulos[Course.currentModule].itemsSeguimiento[nItem].last_position = parseInt(currentTime);
        }
    },
    bloquearAvance: function(nItem) {
        Index.itemsSeguimiento[nItem].video.onseeking = function() {
            if (Index.itemsSeguimiento[nItem].video.currentTime > Index.itemsSeguimiento[nItem].last_position) {
                Index.itemsSeguimiento[nItem].video.currentTime = Index.itemsSeguimiento[nItem].last_position;
            }
        };
    },
    cerrarVideo: function() {
        $('#capaFrontal').hide();
        $('#columnaVideo').hide();
        $('#contenedorVideosGeneral').html('');
    },
}