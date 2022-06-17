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


function eventPage() {
    const reg = /^[a-zA-Zㄱ-ㅎ가-핳-ㅏ-ㅣ]+$/;
    const state = {
        score: 0,
        cardClick: null,
        interval: null,
        timeout: null,
        start: false,
        card: false,
        play: false,
        replay: false,
        cnt: 0
    };
    const startClick = async () => {
        if(state.play) return;
        reset();
        state.play = true;
        state.start = true;
        setting();
        hint(5);
        await timer(0, 5);
        $('.startBtn').classList.add('none');
        $('.reStartBtn').classList.remove('none');
        state.play = false;
        state.card = true;
        state.replay = true;
        await timer(1, 30);
        gameEnd();
        state.start = false;
        state.card = false;
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
        });
    }
    const hint = sec => {
        if(!state.start) return;
        state.start = false;
        state.card = false;
        state.cardClick = null;
        $all('.cards').forEach(e => e.classList.add('active'));
        clearTimeout(state.timeout);
        state.timeout = setTimeout(() => {
            $all('.cards').forEach(e => e.classList.remove('active'));
            state.start = true;
            state.card = true;
        }, 1000 * sec);
    }
    const gameEnd = () => {
        clearInterval(state.interval);
        clearTimeout(state.timeout);
        $all('.cards').forEach(e => {
            e.classList.add('success');
            e.classList.add('end');
        });
        $('.eventModal').classList.remove('none');
        $('#score').value = state.score;
    }
    const cardClick = function() {
        if(findClass(this, 'active') || !state.card) return;
        this.classList.add('active');
        if(state.cardClick === null) {
            state.cardClick = this;
            clearTimeout(state.timeout);
            state.timeout = setTimeout(() => {
                state.cardClick?.classList.remove('active');
                this.classList.remove('active');
                state.cardClick = null;
            }, 3000);
        } else {
            const before = state.cardClick.dataset.name;
            const after = this.dataset.name;
            if(before === after) {
                state.cardClick.classList.add('success');
                this.classList.add('success');
                state.cardClick = null;
                $('.score').innerText = ++state.score;
                if(state.score === 8) gameEnd();
            } else {
                state.card = false;
                clearTimeout(state.timeout);
                state.timeout = setTimeout(() => {
                    state.cardClick.classList.remove('active');
                    this.classList.remove('active');
                    state.cardClick = null;
                    state.card = true;
                }, 1000);
            }
        }
    }
    const setting = () => {
        const imgSlice = data.sort(() => Math.random() - 0.5).slice(0, 8);
        const imgData = [...imgSlice, ...imgSlice].sort(() => Math.random() - 0.5);
        $all('.cards').forEach((ele, idx) => {
            ele.dataset.name = imgData[idx].name;
            ele.querySelector('.front').innerHTML = `
                <div class="imgBox">
                    <img src="./images/special/${imgData[idx].img}.jpg" alt="${imgData[idx].img}" title="${imgData[idx].name}">
                    <p class="abs">${imgData[idx].location}</p>
                </div>
            `;
            ele.addEventListener('click', cardClick);
        });
    }
    const reset = () => {
        state.replay = false;
        clearInterval(state.interval);
        clearTimeout(state.timeout);
        $all('.cards').forEach(e => {
            e.classList.remove('success');
            e.classList.remove('end');
            e.classList.remove('active');
        });
        state.score = 0;
        state.cardClick = null;
        state.start = false;
        state.card = false;
        state.play = false;
        $('.score').innerText = state.score;
    }
    const replay = () => {
        if(!state.replay) return;
        reset();
        startClick();
    }

    const eventModal = () => {
        if(!reg.test($('#name').value) || $('#name').value.length < 2 || $('#name').value.length > 50) {
            alert('이름은 2자 이상 50자 이내의 한글과 영어만 입력이 가능합니다.');
            return;
        }
        if($('#phone').value.length < 13) {
            alert('전화번호는 11자리 숫자만 입력이 가능합니다.');
            return;
        }
        $('.startBtn').classList.remove('none');
        $('.reStartBtn').classList.add('none');
        $('.eventModal').classList.add('none');
        alert('이벤트에 참여해 주셔서 감사합니다.');
        stamp();
    }
    const phoneInput = function() {
        this.value = this.value.replace(/[^0-9]/g, '')
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, '$1-$2-$3')
        .replace(/\-{1,2}$/g, "");
    };
    const stamp = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const today = `${year}-${month}-${date}`
        $all('.stamp > div')[state.cnt].classList.add('check');
        $all('.stamp > div')[state.cnt].innerText = today;
        state.cnt++;
    }

    $('.startBtn').addEventListener('click', startClick);
    $('.reStartBtn').addEventListener('click', replay);
    $('.hintBtn').addEventListener('click', () => hint(3));
    $('.eventBtn').addEventListener('click', eventModal);
    $('#phone').addEventListener('input', phoneInput);
}

function reviewPage() {
    const valueArr = [];
    const reg = /^[a-zA-Zㄱ-ㅎ가-핳-ㅏ-ㅣ]+$/;

    const toggle = () => {
        $('.reviewModal').classList.toggle('none');
        $('form').reset();
    }
    const mousemoveHandler = function() {
        let star = parseInt(this.dataset.star);
        $all('.stars > i').forEach(e => {
            if(e.dataset.star <= star) {
                e.classList.add('active');
            } else {
                e.classList.remove('active');
            }
            $('form').score.setAttribute('value', star);
        })
    }
    const addImgClick = () => {
        const inputTag = document.createElement('input');
        inputTag.type = 'file';
        inputTag.name = 'addImg';
        inputTag.accept = '.jpg';
        $('.images').appendChild(inputTag);
    }
    const upload = async () => {
        const images = $all('input[name="addImg"]');
        const imgArr = [];

        try {
            if($('form').name.value === '')
                throw '이름은 필수 값 입니다.';
            if($('form').name.value.length < 2 || $('form').name.value.length > 50)
                throw '이름은 2자이상 50자이내만 입력이 가능합니다.'
            if(!reg.test($('form').name.value))
                throw '이름은 한글과 영어만 입력이 가능합니다.'
            if($('form').product.value === '')
                throw '구매품은 필수 값 입니다.';
            if($('form').place.value === '')
                throw '구매처는 필수 값 입니다.';
            if($('form').date.value === '')
                throw '구매일은 필수 값 입니다.';
            if($('form').product.value === '')
                throw '구매품은 필수 값 입니다.';
            if($('form').content.value.length < 100)
                throw '내용은 100자 이상 작성해야 합니다.';
            if($('form').score.value === '0')
                throw '별점은 필수 값 입니다.';
            if(!images.length || !images.some(e => e.value))
                throw "사진은 최소 1개이상 등록해야 합니다.";
        } catch(e) {
            alert(e);
            return;
        }

        const imgSrc = img => {
            return new Promise(res => {
                const reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = () => res(reader.result);
            })
        }

        for(const p of images) {
            if(!p.files[0]) continue;
            imgArr.push(await imgSrc(p.files[0]));

        }

        const values = {
            name: $('form').name.value,
            product: $('form').product.value,
            place: $('form').place.value,
            date: $('form').date.value,
            content: $('form').content.value,
            score: $('form').score.value,
            img: imgArr
        }

        valueArr.splice(0, 0, values);
        alert('구매후기가 등록되었습니다.');
        render();
        toggle();
        $all('.stars > i').forEach(e => e.classList.remove('active'));
        images.forEach(e => e.remove());
    }

    const render = () => {
        $('tbody').innerHTML = '';
        valueArr.forEach(ele => {
            const tr = document.createElement('tr');
            const scoreArr = Array.from(Array(parseInt(ele.score)), (_, idx) => {
                if(idx % 2 == 0) return '<i class="fa fa-star-half"></i>'
                else return '<i class="fa fa-star-half rotate"></i>';
            })
            tr.innerHTML = `
            <td>
                <img src="${ele.img[0]}" alt="${ele.product}">
            </td>
            <td>${scoreArr.map(e => e).join('')}</td>
            <td>${ele.name}</td>
            <td>${ele.product}</td>
            <td>${ele.place}</td>
            <td>${ele.date}</td>
            <td>
                <p>${ele.content}</p>
            </td>
            `;
            $('table > tbody').appendChild(tr);
        })
    }

    $('.review').addEventListener('click', toggle);
    $('form').closeBtn.addEventListener('click', toggle);
    $all('.stars > i').forEach(e => e.addEventListener('mousemove', mousemoveHandler));
    $('form').addImgBtn.addEventListener('click', addImgClick);
    $('form').uploadBtn.addEventListener('click', upload);
}