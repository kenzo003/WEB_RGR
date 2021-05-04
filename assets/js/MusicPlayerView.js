class MusicPlayerView {
    Tracks = [];
    inputCanvas;
    inputAudio;
    inputPlaylist;
    btn_play;
    btn_prev;
    btn_next;
    btn_addTrack;
    canvas; //Холст
    ctx; //Контекст холста
    model; //Модель
    controller; //Контроллер
    widthVisualizer; //Ширина холста
    heightVisualizer; //Высота холста
    audio;

    currentTrack;
    prevTrack;
    nextTreck;


    constructor(model, controller) {

        this.createInterfacePlayer();
        this.inputAudio = document.getElementById('audio');
        this.inputCanvas = document.getElementById('canvas');
        this.inputPlaylist = document.getElementById('playlist');
        this.btn_play = document.getElementById('play');
        this.btn_prev = document.getElementById('prev');
        this.btn_next = document.getElementById('next');
        this.btn_addTrack = document.getElementById('addTrack');

        this.model = model;
        this.controller = controller;
        this.controller.setView(this);
        this.widthVisualizer = this.inputCanvas.parentNode.offsetWidth;
        WoolAnalaser.SIZE.WIDTH = this.widthVisualizer;
        this.heightVisualizer = WoolAnalaser.SIZE.HEIGHT;

        this.createVisualizer();
        this.createAudio();
        this.dispatch();
    }

    dispatch() {

        //Добавление трека в плейлист
        this.btn_addTrack.addEventListener("change", function (file) {
            let reader = new FileReader();
            reader.onloadend = (e) => {
                this.addTrackPlaylist(file.files[0].name, file.value, reader.result);
                this.view.audio.load();
            }
            reader.readAsDataURL(file.files[0]);

        }.bind(this.controller, this.btn_addTrack));

        //Воспроизведение
        this.btn_play.addEventListener("click", this.controller.play.bind(this.controller));

        this.btn_prev.addEventListener("click", function () {
            this.addTrackPlaylist(this.prevTrack);
            this.prevTrack[0].click();
        }.bind(this));

        this.btn_next.addEventListener("click", function () {
            this.addTrackPlaylist(this.nextTreck);
            this.nextTreck[0].click();
        }.bind(this));

        // this.btn_next.addEventListener("click", this.controller.play.bind(this.controller));


    }


    createInterfacePlayer() {
        var frame = document.createElement('div');
        frame.setAttribute('class', 'card text-white border border-secondary bg-dark col-12 col-sm-12 col-md-12 col-lg-3');

        var header = document.createElement('div');
        header.setAttribute('class', 'card-header text-center fw-bold fs-6 m-3');
        header.id = "header";

        var body = document.createElement('div');
        body.setAttribute('class', 'card-body border p-0 bg-light border-secondary');
        body.setAttribute('style', 'height:' + this.heightVisualizer + "px");

        //Body <

        var carousel = document.createElement('div');
        carousel.id = "carouselExampleControls";
        carousel.className = "carousel slide";
        carousel.setAttribute("data-bs-interval", 'false');
        carousel.setAttribute('data-bs-ride', 'carousel');

        var carousel_inner = document.createElement('div');
        carousel_inner.className = 'carousel-inner';

        var carousel_item = document.createElement('div');
        carousel_item.className = "carousel-item active";
        carousel_item.id = "canvas";

        var carousel_item_playlist = document.createElement('div');
        carousel_item_playlist.className = "carousel-item";

        var btn_addTrack = document.createElement('div');
        btn_addTrack.className = "input-group  input-group-sm ms-3";
        btn_addTrack.setAttribute('style', 'height: 30px');
        var label = document.createElement('label');
        label.className = "input-group-text";
        label.setAttribute('for', 'addTrack');
        label.textContent = "+";

        var add_Track = document.createElement('input');
        add_Track.type = "file";
        add_Track.className = "form-control";
        add_Track.id = "addTrack";
        add_Track.style = "visibility: hidden";
        add_Track.multiple = true;

        var playlist = document.createElement('div');
        playlist.className = "list-group overflow-auto";
        var height = Number(WoolAnalaser.SIZE.HEIGHT - parseInt(btn_addTrack.style.height, 10));
        playlist.setAttribute('style', "min-height: " + height + "px; max-height: " + height + "px; overflow:scroll");
        playlist.id = "playlist";

        var btn_prev = document.createElement('button');
        btn_prev.className = "carousel-control-prev";
        btn_prev.type = "button";
        btn_prev.setAttribute('data-bs-target', '#carouselExampleControls');
        btn_prev.setAttribute('data-bs-slide', 'prev');
        btn_prev.style = "width: 15px";
        var spn_p1 = document.createElement('span');
        spn_p1.className = "carousel-control-prev-icon";
        spn_p1.setAttribute('aria-hidden', 'true');
        var spn_p2 = document.createElement('span');
        spn_p2.className = "visually-hidden";

        var btn_next = document.createElement('button');
        btn_next.className = "carousel-control-next";
        btn_next.type = "button";
        btn_next.setAttribute('data-bs-target', '#carouselExampleControls');
        btn_next.setAttribute('data-bs-slide', 'next');
        btn_next.style = "width: 15px";
        var spn_n1 = document.createElement('span');
        spn_n1.className = "carousel-control-next-icon";
        spn_n1.setAttribute('aria-hidden', 'true');
        var spn_n2 = document.createElement('span');
        spn_n2.className = "visually-hidden";


        var footer = document.createElement('div');
        footer.setAttribute('class', 'card-footer border border-secondary');
        var audio = document.createElement('div');
        audio.id = "audio";

        var btn_music = document.createElement('div');
        btn_music.className = "d-flex justify-content-center p-2";
        var btn_music_prev = document.createElement('button');
        btn_music_prev.id = "prev";
        btn_music_prev.type = 'button';
        btn_music_prev.className = "btn btn-outline-secondary rounded-pill btn-lg";
        var ico_music_prev = document.createElement('i');
        ico_music_prev.className = "fa fa-fast-backward";
        var btn_music_play = document.createElement('button');
        btn_music_play.id = "play";
        btn_music_play.type = 'button';
        btn_music_play.className = "btn btn-outline-secondary rounded-pill btn-lg";
        var ico_music_play = document.createElement('i');
        ico_music_play.className = "fa fa-play";
        var btn_music_next = document.createElement('button');
        btn_music_next.id = "next";
        btn_music_next.type = 'button';
        btn_music_next.className = "btn btn-outline-secondary rounded-pill btn-lg";
        var ico_music_next = document.createElement('i');
        ico_music_next.className = "fa fa-fast-forward";


        header.textContent = "Music";
        document.body.appendChild(frame);
        frame.appendChild(header);
        frame.appendChild(body);
        body.appendChild(carousel);
        carousel.appendChild(carousel_inner);
        carousel_inner.appendChild(carousel_item);
        carousel_inner.appendChild(carousel_item_playlist);
        carousel_item_playlist.appendChild(btn_addTrack);
        btn_addTrack.appendChild(label);
        btn_addTrack.appendChild(add_Track);
        carousel_item_playlist.appendChild(playlist);
        carousel.appendChild(btn_prev);
        btn_prev.appendChild(spn_p1);
        btn_prev.appendChild(spn_p2);
        carousel.appendChild(btn_next);
        btn_next.appendChild(spn_n1);
        btn_next.appendChild(spn_n2);
        frame.appendChild(footer);
        footer.appendChild(audio);
        footer.appendChild(btn_music);
        btn_music.appendChild(btn_music_prev);
        btn_music_prev.appendChild(ico_music_prev);
        btn_music.appendChild(btn_music_play);
        btn_music_play.appendChild(ico_music_play);
        btn_music.appendChild(btn_music_next);
        btn_music_next.appendChild(ico_music_next);
    }

    //Создание визуализатора
    createVisualizer() {
        this.createCanvas();
        this.createParticles();

    }

    //Создание холста
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        //Делаем наш холст на всю страницу
        this.canvas.width = this.widthVisualizer;
        this.canvas.height = this.heightVisualizer;
        //Добавляем его на страницу
        this.inputCanvas.appendChild(this.canvas);
    }

    //Создание и отрисовка частиц
    createParticles() {
        //Создание частиц
        this.model.woolAnalasser.createParticles();

        this.createBird();
        //Тут запускаем непосредственно ф-ю отрисовки
        setInterval(this.action.bind(this), 12);
    }

    createBird() {
        this.model.woolAnalasser.createBirds();
    }

    createAudio() {
        this.model.woolAnalasser.createAudio();
        this.audio = this.model.woolAnalasser.audio.audio;

        this.audio.setAttribute('style', 'width: 100%')
        this.inputAudio.appendChild(this.audio);
        this.model.woolAnalasser.audio.update = function (bands) {
            // alert("Hi");
            var ln = WoolAnalaser.MAX_PARTICLES;
            var bLn = WoolAnalaser.MAX_BIRDS;

            while (ln--) {
                var loc = this.model.woolAnalasser.particles[ln];
                loc.pulse = bands[loc.band] / 256;
            }

            for (var i = 0; i < bLn; i++) {
                var bird = this.model.woolAnalasser.birds[i];
                bird.pulse = bands[bird.band] / 256;
            }

        }.bind(this);
        // this.audio.update = function (bands) {
        //     alert("Hi");
        //     // var ln = WoolAnalaser.MAX_PARTICLES;
        //     // // bLn = MAX_BIRDS;
        //     //
        //     // while(ln--) {
        //     //     var loc = this.model.particles[ln];
        //     //     loc.pulse = this.audio.bands[loc.band] / 256;
        //     // }
        //
        // };
        // try {
        //     audio = new Analyse();
        //     d.body.appendChild(audio.audio);
        //
        //     input.addEventListener('change', function () {
        //         var song = this.value,
        //             fReader = new FileReader();
        //
        //         fReader.readAsDataURL(this.files[0]);
        //         fReader.onloadend = function (event) {
        //             var e = event || w.event;
        //             audio.audio.src = e.target.result;
        //             audio.audio.load();
        //         };
        //     }, false);
        //
        //     audio.update = function (bands) {
        //         var ln = MAX_PARTICLES,
        //             bLn = MAX_BIRDS;
        //
        //         while (ln--) {
        //             var loc = particles[ln];
        //             loc.pulse = bands[loc.band] / 256;
        //         }
        //
        //         for (var i = 0; i < bLn; i++) {
        //             var bird = birds[i];
        //             bird.pulse = bands[bird.band] / 256;
        //         }
        //     };
        // } catch (e) {
        //     throw ('Ваш барузер не поддержывает audio Api');
        // }
    }

    action() {
        this.canvas.width = this.inputCanvas.parentNode.offsetWidth;
        WoolAnalaser.SIZE.WIDTH = this.inputCanvas.parentNode.offsetWidth;
        var ln = WoolAnalaser.MAX_PARTICLES;
        this.clear();
        for (var i = 0; i < ln; i++) {
            var loc = this.model.woolAnalasser.particles[i];
            this.drawParticles(loc);
        }

        for (var i = 0; i < WoolAnalaser.MAX_BIRDS; i++) {
            var loc = this.model.woolAnalasser.birds[i];
            this.drawBird(loc);
            loc.move();
        }
    }

    // drawTracksOfPlaylist() {
    //     this.inputPlaylist.textContent = "";
    //     var playlist = this.model.playlist;
    //     for (var i = 0; i < playlist.tracks.length; i++) {
    //         var track = document.createElement('button');
    //         track.className = "list-group-item list-group-item-action";
    //         track.type = "button";
    //         track.textContent = playlist.tracks[i].name;
    //
    //         this.Tracks.push([track, playlist.tracks[i]]);
    //
    //         this.inputPlaylist.appendChild(track);
    //         this.addTrackPlaylist([track, playlist.tracks[i]]);
    //
    //         // track.addEventListener("click", function (track, id) {
    //         //     if (this.currentTrack) {
    //         //         this.currentTrack.className = "list-group-item list-group-item-action";
    //         //     }
    //         //     document.getElementById('header').textContent = this.model.playlist.tracks[id].name;
    //         //
    //         //     if (this.model.playlist.tracks[id-1])
    //         //         this.prevTrack =
    //         //     this.currentTrack = track;
    //         //     track.className = "list-group-item active";
    //         //     this.audio.src = this.model.playlist.tracks[id].bob;
    //         //     this.audio.load();
    //         //     this.audio.play();
    //         // }.bind(this, track, i));
    //
    //
    //     }
    // }

    // addTracksPlaylist() {
    //     for (var track of this.Tracks) {
    //         this.addTrackPlaylist(track);
    //     }
    // }

    addTrackPlaylist(track) {
        track[0].addEventListener("click", function () {
            var id = track[1].id;

            if (this.Tracks[id - 1])
                this.prevTrack = this.Tracks[id - 1];
            if (this.Tracks[id + 1])
                this.nextTreck = this.Tracks[id + 1];

            if (this.currentTrack)
                this.currentTrack[0].className = "list-group-item list-group-item-action";

            this.currentTrack = track;
            track[0].className = "list-group-item active";
            this.audio.src = track[1].bob;
            this.audio.load();
            this.audio.play();
        }.bind(this));
    }

    drawTracksOfPlaylist(_track) {
        // var playlist = this.model.playlist;
        var track = document.createElement('button');
        track.className = "list-group-item list-group-item-action";
        track.type = "button";
        track.textContent = _track.name;
        this.inputPlaylist.appendChild(track);

        this.Tracks.push([track, _track]);

        this.inputPlaylist.appendChild(track);
        this.addTrackPlaylist([track, _track]);
    }


    //Очистка холста
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //Отображение частицы на экране
    drawParticles(particle) {
        var that = particle;
        var pulsar, scale;
        pulsar = Math.exp(that.pulse);
        scale = pulsar * that.radius || that.radius;
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath(); //Начинает отрисовку фигуры
        ctx.arc(that.x, that.y, scale, 0, Math.PI * 2);
        ctx.fillStyle = that.color; //цвет
        ctx.globalAlpha = that.opacity / that.level; //прозрачность
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = that.color; //цвет рамки
        ctx.stroke();
        ctx.restore();

        //Движение частицы
        that.move();
    }

    drawBird(bird) {
        var pulse = Math.exp(bird.pulse) || 1;
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();

        if (bird.direction === "right" && bird.stop) {
            ctx.scale(-1, 1);
            ctx.drawImage(bird.img, -bird.x, bird.y, bird.img.width * pulse, bird.img.height * pulse);
        } else {
            ctx.drawImage(bird.img, bird.x, bird.y, bird.img.width * pulse, bird.img.height * pulse);
        }
        ctx.closePath();
        ctx.restore();
    }

}