class MusicPlayerModel {
    woolAnalasser;
    playlist;

    constructor() {
        this.playlist = new Playlist(1, "Djaga djaga");
        this.woolAnalasser = new WoolAnalaser();
    }

}


class Track {
    href; //
    id;
    bob;
    // album;
    // artists;
    // available_markets;
    // disc_number;
    duration_ms;
    // external_ids;
    // external_urls;
    // href;
    // id;
    name;
    // track_number;
    type;

    constructor(id, name, href, bob) {
        this.id = id;
        this.href = href;
        this.name = name;
        this.bob = bob;
    }
}

class Playlist {
    id;
    name;
    description;
    external_urls;
    href;
    images;
    owner;
    tracks = [];

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addTrack(track) {
        this.tracks.push(track);
    }
}


class WoolAnalaser {
    static MP3_PATH = ""; //Путь к треку
    static MAX_PARTICLES = 20; //Максимальное количсетво кругов
    static MAX_BIRDS = 20; //Максимальное количество птичек
    static TWO_PI = Math.PI * 2;
    static SMOOTHING = 0.3;
    static FURIE = 512;
    static RADIUS = {
        MAX: 50.0,
        MIN: 10.0
    };
    static SIZE = {
        WIDTH: 570,
        HEIGHT: 500
    };
    static OPACITY = {
        MIN: 0.4,
        MAX: 0.8
    };
    static SPEED = {
        MIN: 0.2,
        MAX: 0.8
    };
    static BIRD_SPEED = {
        MIN: 3.5,
        MAX: 4.2
    };
    static BIRD_JUMP = {
        MIN: 20,
        MAX: 30
    };
    static IMAGES = ['assets/img/red.png', 'assets/img/ell.png', 'assets/img/blue.png', 'assets/img/black.png', 'assets/img/white.png']; //Изображение птиц
    static COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']; //цвета частиц


    config;
    particles = []; //Тут будут храниться все созданные частицы
    rope;
    birds = []; //Массив птичек
    audio;
    static freeSpace = WoolAnalaser.SIZE.WIDTH;
    // input = document.getElementById('song');

    constructor() {
        this.config = {
            fullscreen: true,
            interval: 10,
            type: "canvas"
        };
        this.rope = null;
        this.audio = null;
    }

    static random(min, max) {
        if (this.isArray(min)) {
            return min[~~(Math.random() * min.length)];
        }
        if (!this.isNumber(max)) {
            max = min || 1, min = 0;
        }
        return min + Math.random() * (max - min);
    }

    /*
    * Проверка на массив
    */
    static isArray(object) {
        return Object.prototype.toString.call(object) == '[object Array]';
    }

    /*
    * Проверка на число
    */
    static isNumber(object) {
        return typeof object == 'number';
    }

    createParticles() {
        var particle = null;
        for (var i = 0; i < WoolAnalaser.MAX_PARTICLES; i++) {
            particle = new Particle();
            this.particles.push(particle);
        }
    }

    createBirds() {
        for (var i = 0; i < WoolAnalaser.MAX_BIRDS; i++) {
            this.birds.push(new Bird());
        }
    }

    createAudio() {
        this.audio = new Analyse();
    }


}

// Констуктор анализатора
class Analyse {
    AudioContext;
    audio;
    context;
    node;
    analyser;
    bands;

    constructor() {
        this.AudioContext = window.AudioContext || window.webkitAudioContext;

        //Создание источника
        this.audio = new Audio();
        this.audio.src = WoolAnalaser.MP3_PATH;
        this.audio.controls = true;

        //Создание аудио-контекста
        this.context = new AudioContext();
        // Этот метод позволяет создать интерфейс для сбора, обработки или анализа аудио-данных при помощи js.
        this.node = this.context.createScriptProcessor(2048, 1, 1);

        //Анализатор
        // Данный метод позволяет получить информацию о частотных и временных параметрах сигнала в виде массива данных
        this.analyser = this.context.createAnalyser();
        // частота опроса с которой анализатор будет требовать данные
        this.analyser.smoothingTimeConstant = WoolAnalaser.SMOOTHING;
        // указывает, сколько данных мы хотим получить в результате частотного анализа сигнала, это кол-во будет равно fftSize/2
        this.analyser.fftSize = WoolAnalaser.FURIE;
        // создания массива с четким указанием границ, в нашем случае его длина будет равна 256.
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
        console.log(this.bands);

        this.audio.addEventListener("canplay", function () {
            if (!this.source) {
                // Создает интерфейс, который представляет собой источник звука от аудио или видео элемента
                this.source = this.context.createMediaElementSource(this.audio);
                //связываем источник с анализатором
                this.source.connect(this.analyser);
                //связываем анализатор с интерфейсом, из которого он будет получать данные
                this.analyser.connect(this.node);
                //Связываем все с выходом
                // AudioContext.destination — это системный звуковой выход по умолчанию (обычно это колонки).
                this.node.connect(this.context.destination);
                this.source.connect(this.context.destination);

                //подписываемся на событие изменения входных данных
                this.node.onaudioprocess = function () {
                    // Метод getByteFrequencyData — этот метод получает данные от анализатора и копирует их в переданный массив, который мы в итоге и возвращаем, благодаря великой магии замыканий.
                    this.analyser.getByteFrequencyData(this.bands);
                    if (!this.audio.paused) {
                        return typeof this.update === "function" ? this.update(this.bands) : 0;
                    }
                }.bind(this);
            }

        }.bind(this));
    }


}

//Частица
class Particle {
    x;
    y;
    level;
    speed;
    radius;
    color;
    opacity;
    band;

    constructor() {
        this.x = WoolAnalaser.random(WoolAnalaser.SIZE.WIDTH);
        this.y = WoolAnalaser.random(WoolAnalaser.SIZE.HEIGHT);
        this.level = 1 * WoolAnalaser.random(4);
        this.speed = WoolAnalaser.random(WoolAnalaser.SPEED.MIN, WoolAnalaser.SPEED.MAX);
        this.radius = WoolAnalaser.random(WoolAnalaser.RADIUS.MIN, WoolAnalaser.RADIUS.MAX); //радиус частиц
        this.color = WoolAnalaser.random(WoolAnalaser.COLORS); //цвет частицы
        this.opacity = WoolAnalaser.random(WoolAnalaser.OPACITY.MIN, WoolAnalaser.OPACITY.MAX);
        this.band = Math.floor(WoolAnalaser.random(128));
    }

    // Движение частиц
    move() {
        this.y -= this.speed * this.level;
        //Возврашам в начало частицы которые ушли за пределы хослста
        if (this.y < -100) {
            this.y = WoolAnalaser.SIZE.HEIGHT;
        }
    }
}

//Птичка
class Bird {
    img;
    up;
    down;
    stop;
    band;
    direction;
    finish;
    level;
    x;
    y;
    speed;
    jump;

    constructor() {
        var img = new Image();
        img.src = WoolAnalaser.random(WoolAnalaser.IMAGES);
        img.width = 70;
        img.height = 70;
        this.up = true;
        this.down = false;
        this.stop = false;
        this.band = Math.floor(WoolAnalaser.random(128));
        this.direction = WoolAnalaser.random(["right", "left"]);
        this.finish = false;
        this.level = WoolAnalaser.random(0.2, 0.6);
        this.x = WoolAnalaser.SIZE.WIDTH - img.width;
        this.y = WoolAnalaser.SIZE.HEIGHT / 2 - img.height;
        this.speed = WoolAnalaser.random(WoolAnalaser.BIRD_SPEED.MIN, WoolAnalaser.BIRD_SPEED.MAX);
        this.jump = WoolAnalaser.random(WoolAnalaser.BIRD_JUMP.MIN, WoolAnalaser.BIRD_JUMP.MAX);
        if (this.direction === "right") {
            this.bord = WoolAnalaser.SIZE.WIDTH - (WoolAnalaser.freeSpace - 260);
        } else {
            this.bord = WoolAnalaser.SIZE.WIDTH - (WoolAnalaser.freeSpace - 130);
        }
        WoolAnalaser.freeSpace -= 130;
        this.img = img;
    }

    move() {
        if (this.x > this.bord && !this.stop) {
            this.run();
        } else {
            this.stop = true;
            var pulse = Math.exp(this.pulse) || 1;
            this.y = (WoolAnalaser.SIZE.HEIGHT / 2 - this.img.height * pulse);
        }
    }

    run(){
        this.x -= this.speed;
        if (this.y > WoolAnalaser.SIZE.HEIGHT / 2 - this.img.height - this.jump && !this.down) {
            this.y--;
        } else {
            this.up = false;
            this.down = true;
        }

        if (this.y < WoolAnalaser.SIZE.HEIGHT / 2 - this.img.height && !this.up) {
            this.y += this.speed;
        } else {
            this.up = true;
            this.down = false;
        }
    }
}