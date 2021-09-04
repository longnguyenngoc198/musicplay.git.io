const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const activeSong = $('.song.active');
const playlist =  $('.playlist');

const PLAYER_STORE_KEY = 'PLAYER';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    congfig: JSON.parse(localStorage.getItem(PLAYER_STORE_KEY)) || {},
    songs: [
        {
            name: 'Chưa Bao Giờ',
            singger: 'DSK',
            path: './asset/music/m1.mp3',
            image: './asset/img/t1.jpg'
        },
        {
            name: 'Học',
            singger: 'DSK',
            path: './asset/music/m2.mp3',
            image: './asset/img/t2.jpg'
        },
        {
            name: 'Mây Lang Thang',
            singger: 'Tùng TeA; PC; New$oulZ',
            path: './asset/music/m3.mp3',
            image: './asset/img/t3.jpg'
        },
        {
            name: 'Let Her Go',
            singger: 'Passenger',
            path: './asset/music/m4.mp3',
            image: './asset/img/t4.jpg'
        },
        {
            name: 'Chan Gai 707',
            singger: 'Low G',
            path: './asset/music/m5.mp3',
            image: './asset/img/t5.jpg'
        },
        {
            name: 'Chưa Bao Giờ',
            singger: 'DSK',
            path: './asset/music/m1.mp3',
            image: './asset/img/t1.jpg'
        },
        {
            name: 'Học',
            singger: 'DSK',
            path: './asset/music/m2.mp3',
            image: './asset/img/t2.jpg'
        },
        {
            name: 'Mây Lang Thang',
            singger: 'Tùng TeA; PC; New$oulZ',
            path: './asset/music/m3.mp3',
            image: './asset/img/t3.jpg'
        },
        {
            name: 'Let Her Go',
            singger: 'Passenger',
            path: './asset/music/m4.mp3',
            image: './asset/img/t4.jpg'
        },
        {
            name: 'Chan Gai 707',
            singger: 'Low G',
            path: './asset/music/m5.mp3',
            image: './asset/img/t5.jpg'
        }
        
    ],
    setConfig: function(key, value) {
        this.congfig[key] = value;
        localStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(this.congfig));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singger}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
       playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            }
        )
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;
    
        //cd quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ],{
            duration: 10000, //10s
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //co giẫn thumb
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // khi kích play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play(); 
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        document.onkeyup = function(e) {
            switch(e.which) {
                case 32:
                    if(_this.isPlaying) {
                        audio.pause();
                    } else {
                        audio.play();
                    }
                    break;
                case 39:
                    if(_this.isRandom) {
                        _this.playRandomSong();
                    }else {
                        _this.nextSong();
                    }
                    audio.play();
                    _this.render();
                    _this.activeSongToView();
                    break;
                case 37:
                    if(_this.isRandom) {
                        _this.playRandomSong();
                    }else {
                        _this.prevSong();
                    }
                    audio.play();
                    _this.render();
                    _this.activeSongToView();
                    break;
            }
        }

        // chạy theo thời gian bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent =  Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // tua bài hát
        progress.oninput = function(e) {
            const seekTime = (audio.duration*e.target.value)/100;
            audio.currentTime = seekTime;
        }

        //next Song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.activeSongToView();
        }

        window.addEventListener('keydown', function(e) {
                e.preventDefault();
        });
        //prev Song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.activeSongToView();
        }

        //on/off random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        
        //repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
            
        }

        //next when ended audio
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //When click to list song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    // console.log(songNode.dataset.index)
                }
            }
        }
    },

    //load bài hát đầu tiên trong list
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.congfig.isRandom;
        this.isRepeat = this.congfig.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex == this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        if(this.currentIndex == 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    activeSongToView: function() {
        // cd.style.width = '200px'
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'

            });
        }, 200)
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();


