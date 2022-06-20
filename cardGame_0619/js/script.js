const $ = e => document.querySelector(e);
const $all = e => [...document.querySelectorAll(e)];
const findClass = (e, n) => e.classList.contains(n);

const data = [
    {location: '창원시', name: '풋고추', img: '창원시_풋고추'},
    {location: '진주시', name: '고추', img: '진주시_고추'},
    {location: '통영시', name: '굴', img: '통영시_굴'},
    {location: '사천시', name: '멸치', img: '사천시_멸치'},
    {location: '김해시', name: '단감', img: '김해시_단감'},
    {location: '밀양시', name: '대추', img: '밀양시_대추'},
    {location: '거제시', name: '유자', img: '거제시_유자'},
    {location: '양산시', name: '매실', img: '양산시_매실'},
    {location: '의령군', name: '수박', img: '의령군_수박'},
    {location: '함안군', name: '곶감', img: '함안군_곶감'},
    {location: '창녕군', name: '양파', img: '창녕군_양파'},
    {location: '고성군', name: '방울토마토', img: '고성군_방울토마토'},
    {location: '남해군', name: '마늘', img: '남해군_마늘'},
    {location: '하동군', name: '녹차', img: '하동군_녹차'},
    {location: '산청군', name: '약초', img: '산청군_약초'},
    {location: '함양군', name: '밤', img: '함양군_밤'},
    {location: '거창군', name: '사과', img: '거창군_사과'},
    {location: '합천군', name: '돼지고기', img: '합천군_돼지고기'}
];

{
    let page = $('section').id;
    if(page === 'event') eventPage();
    if(page === 'review') reviewPage();
}

const reg = /^[a-zA-Zㄱ-ㅎ가-핳-ㅏ-ㅣ]+$/;

function eventPage() {
    const state = {
        score: 0,
        cardClick: null,
        interval: null,
        timeout: null,
        card: false,
        start: false
    }

    const startClick = async () => {
        setting();
        hint(5);
        await timer(0, 5);
        $('.startBtn').classList.add('none');
        $('.reStartBtn').classList.remove('none');
        await timer(1, 30);
        gameEnd();
    }

    const setting = () => {
        const imgSlice = data.sort(() => Math.random() - 0.5).slice(0, 8);
        const imgData = [...imgSlice, ...imgSlice].sort(() => Math.random() - 0.5);
        $all('.card').forEach((ele, idx) => {
            ele.querySelector('.front').innerHTML = `
                <div class="img">
                    <img src="./special/${imgData[idx].img}.jpg" alt="${imgData[idx].name}" title="${imgData[idx].location}">
                    <p class="abs">${imgData[idx].location}</p>
                </div>
            `;
            ele.addEventListener('click', cardClick);
        })
    }

    const hint = sec => {
        $all('.card').forEach(e => e.classList.add('active'));
        clearTimeout(state.timeout);
        state.timeout = setTimeout(() => {
            $all('.card').forEach(e => e.classList.remove('active'));
        }, 1000 * sec);
    }

    const timer = (min, sec) => {
        return new Promise(res => {
            $('.min').innerText = min;
            $('.sec').innerText = sec;
            clearInterval(state.interval);
            state.interval = setInterval(() => {
                sec--;
                if(sec < 0 && min > 0) {
                    min--;
                    sec = 59;
                    $('.min').innerText = min;
                    $('.sec').innerText = sec;
                } else if(sec < 0 && min <= 0) {
                    res();
                } else {
                    $('.min').innerText = min;
                    $('.sec').innerText = sec;
                }
            }, 1000);
        })
    }

    const cardClick = function() {
        this.classList.add('active');
        if(!state.cardClick) {
            state.cardClick = this;
            clearTimeout(state.timeout);
            state.timeout = setTimeout(() => {
                state.cardClick.classList.remove('active');
                state.cardClick = null;
            }, 3000);
        } else {
            const before = state.cardClick.dataset.card;
            const after = this.dataset.card;
            if(before === after) {
                state.cardClick.classList.add('success');
                this.classList.add('success');
                state.cardClick = null;
                state.score++;
                $('.score').innerText = state.score;
                if(state.score === 8) gameEnd();
            } else {
                clearTimeout(state.timeout);
                state.timeout = setTimeout(() => {
                    state.cardClick.classList.remove('active');
                    this.classList.remove('active');
                }, 1000);
                state.cardClick = null;
            }
        }
    }

    const gameEnd = () => {
        clearInterval(state.interval);
        clearTimeout(state.timeout);
        $all('.card').forEach(e => {
            e.classList.add('end');
        })
    }

    const replay = () => {
        startClick();
    }

    $('.startBtn').addEventListener('click', startClick);
    $('.hintBtn').addEventListener('click', () => hint(3));
    $('.reStartBtn').addEventListener('click', replay);
}