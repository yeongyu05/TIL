const $ = e => document.querySelector(e);
const $all = e => [...document.querySelectorAll(e)];

reviewPage();

function reviewPage() {
    const reg = /^[a-zA-Zㄱ-ㅎ-가-힣-ㅏ-ㅣ]+$/;
    const valueArr = [];

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
                throw '이름은 2자 이상 50자 이내만 입력이 가능합니다.'
            if(!reg.test($('form').name.value))
                throw '이름은 한글과 영어만 입력이 가능합니다.';
            if($('form').product.value === '')
                throw '구매품은 필수 값 입니다.';
            if($('form').place.value === '')
                throw '구매처는 필수 값 입니다.';
            if($('form').date.value === '')
                throw '구매일은 필수 값 입니다.';
            if($('form').content.value.length < 100)
                throw '내용은 100자 이상 작성해야 합니다.';
            if($('form').score.value == 0)
                throw '별점은 필수 값 입니다.';
            if(!images.length || !images.some(e => e.value))
                throw '사진은 최소 1개 이상 등록해야 하고, jpg 파일만 등록할 수 있습니다.';
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
        alert('구매 후기가 등록되었습니다.');
        toggle();
        render();
        $all('.stars > i').forEach(e => e.classList.remove('active'));
        images.forEach(e => e.remove());
    }

    const render = () => {
        $('tbody').innerHTML = '';
        valueArr.forEach(ele => {
            const tr = document.createElement('tr');
            const scoreArr = Array.from(Array(parseInt(ele.score)), (_, idx) => {
                if(idx % 2 === 0) return '<i class="fa fa-star-half"></i>';
                else return '<i class="fa fa-star-half rotate"></i>';
            })
            tr.innerHTML = `
                <td>
                    <img src="${ele.img[0]}" alt="${ele.product}">
                </td>
                <td>
                    ${scoreArr.map(e => e).join('')}
                </td>
                <td>${ele.name}</td>
                <td>${ele.product}</td>
                <td>${ele.place}</td>
                <td>${ele.date}</td>
                <td>
                    <p>${ele.content}</p>
                </td>
            `;
            $('tbody').appendChild(tr);
        })
    }
    
    $('.review').addEventListener('click', toggle);
    $('form').closeBtn.addEventListener('click', toggle);
    $('form').addImgBtn.addEventListener('click', addImgClick);
    $('form').uploadBtn.addEventListener('click', upload);
    $all('.stars > i').forEach(e => e.addEventListener('mousemove', mousemoveHandler));
}