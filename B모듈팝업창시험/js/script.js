const $ = e => document.querySelector(e);
const $all = e => [...document.querySelectorAll(e)];

reviewPage();

function reviewPage() {
    const valueArr = [];
    const reg = /^[a-zA-Zㄱ-ㅎ가-핳-ㅏ-ㅣ]+$/;
    const reg1 = /^[a-zA-Zㄱ-ㅎ가-핳-ㅏ-ㅣ]+$/;
    const reg2 = /[a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]/g;
    // if(!/[a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]/g.test(this.name.value))

    const toggle = () => {
        $('.reviewModal').classList.toggle('none');
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
        /* images에 input태그 모두 가져와서 imgSrc() 함수에서 src 뽑아서 imgArr에 push */
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
            // 첫 번째 이미지만 넣기 위해 배열 0번째로 한정
        }

        const values = {
            name: $('form').name.value,
            product: $('form').product.value,
            place: $('form').place.value,
            date: $('form').date.value,
            content: $('form').content.value,
            score: $('form').score.value,
            img: imgArr // 이미지 url을 넣기 위해 images와 imgArr사용
        }

        valueArr.splice(0, 0, values);
        alert('구매후기가 등록되었습니다.');
        render();
        toggle();
        $all('.stars > i').forEach(e => e.classList.remove('active'));
        images.forEach(e => e.remove()); // addImg 제거
    }

    const render = () => {
        $('tbody').innerHTML = '';
        valueArr.forEach(ele => {
            const tr = document.createElement('tr');
            const scoreArr = Array.from(Array(parseInt(ele.score), (_, idx) => {
                if(idx % 2 == 0) return '<i class="fa fa-star-half"></i>'
                else return '<i class="fa fa-star-half rotate"></i>';
            }))
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
