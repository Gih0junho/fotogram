const video = document.getElementById('camera');

const photos = document.getElementById('photos');

let detections = [];

/* IMAGENS */

const imgChapeu = new Image();

imgChapeu.src = './assets/chapeu.png';

const imgOculos = new Image();

imgOculos.src = './assets/oculos.png';

/* CAMERA */

async function startCamera(){

    try{

        const stream =
        await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user",
                width:{ ideal:1280 },
                height:{ ideal:720 }
            },

            audio:false
        });

        video.srcObject = stream;

        updateStatus("Câmera ativa ✅","#8f8");

    }catch(error){

        console.error(error);

        updateStatus("Erro ao acessar câmera ❌","#f88");
    }
}

/* FACE API */

async function carregarModelos(){

    try{

        updateStatus("Carregando IA...","#ccc");

        await faceapi.nets.tinyFaceDetector.load('/models');

        updateStatus("Modelos carregados ✅","#8f8");

    }catch(error){

        console.error("ERRO:",error);

        updateStatus("Erro ao carregar modelos ❌","#f88");
    }
}

/* STATUS */

function updateStatus(text,color="#fff"){

    const status =
    document.getElementById('cameraStatus');

    status.textContent = text;

    status.style.color = color;
}

/* DETECÇÃO */

video.addEventListener('play',()=>{

    setInterval(async()=>{

        detections =
        await faceapi.detectAllFaces(

            video,

            new faceapi.TinyFaceDetectorOptions()
        );

    },200);

});

/* FOTO */

function capturarPhoto(efeito){

    if(video.videoWidth === 0){

        alert("Espere a câmera carregar.");

        return;
    }

    const photo =
    document.createElement('canvas');

    photo.width = video.videoWidth;

    photo.height = video.videoHeight;

    const ctx = photo.getContext('2d');

    /* FILTROS */

    switch(efeito){

        case 'cinza':

            ctx.filter = 'grayscale(100%)';

            break;

        case 'antiga':

            ctx.filter =
            'sepia(80%) contrast(90%)';

            break;

        case 'negativo':

            ctx.filter = 'invert(100%)';

            break;

        case 'desfoque':

            ctx.filter = 'blur(3px)';

            break;

        case 'flash':

            ctx.filter = 'brightness(2)';

            break;

        case 'vhs':

            ctx.filter =
            'contrast(140%) saturate(70%) blur(1px)';

            break;

        case 'cybershot':

            ctx.filter =
            'brightness(1.2) contrast(120%) sepia(25%)';

            break;

        case 'flash2000':

            ctx.filter =
            'brightness(2.2) contrast(1.4)';

            break;

        case 'analogica':

            ctx.filter =
            'sepia(40%) grayscale(20%) contrast(110%)';

            break;

        case 'fotolog':

            ctx.filter =
            'grayscale(100%) contrast(130%) brightness(1.1)';

            break;

        case 'rgb':

            ctx.filter =
            'contrast(130%) saturate(130%)';

            break;

        default:

            ctx.filter = 'none';
    }

    /* ESPELHAR */

    ctx.translate(photo.width,0);

    ctx.scale(-1,1);

    /* FOTO */

    ctx.drawImage(
        video,
        0,
        0,
        photo.width,
        photo.height
    );

    /* RGB */

    if(efeito === 'rgb'){

        ctx.globalCompositeOperation = 'screen';

        ctx.drawImage(
            video,
            -8,
            0,
            photo.width,
            photo.height
        );

        ctx.drawImage(
            video,
            8,
            0,
            photo.width,
            photo.height
        );

        ctx.globalCompositeOperation =
        'source-over';
    }

    ctx.filter = 'none';

    /* LIGHT LEAK */

    if(
        efeito === 'analogica' ||
        efeito === 'cybershot'
    ){

        const gradient =
        ctx.createLinearGradient(
            0,
            0,
            photo.width,
            photo.height
        );

        gradient.addColorStop(
            0,
            'rgba(255,120,0,0.25)'
        );

        gradient.addColorStop(
            1,
            'rgba(255,0,120,0)'
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            photo.width,
            photo.height
        );
    }

    /* VHS */

    if(efeito === 'vhs'){

        for(
            let i = 0;
            i < photo.height;
            i += 6
        ){

            ctx.strokeStyle =
            'rgba(255,255,255,0.05)';

            ctx.beginPath();

            ctx.moveTo(0,i);

            ctx.lineTo(photo.width,i);

            ctx.stroke();
        }
    }

    /* GLITTER */

    if(
        efeito === 'flash2000' ||
        efeito === 'cybershot' ||
        efeito === 'fotolog'
    ){

        for(let i = 0; i < 40; i++){

            const brilhoX =
            Math.random() * photo.width;

            const brilhoY =
            Math.random() * photo.height;

            const tamanho =
            Math.random() * 4;

            ctx.fillStyle =
            "rgba(255,255,255,0.8)";

            ctx.beginPath();

            ctx.arc(
                brilhoX,
                brilhoY,
                tamanho,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    /* FACE */

    detections.forEach(face=>{

        const box = face.box;

        const x =
        photo.width - box.x - box.width;

        const y = box.y;

        /* CHAPÉU */

        if(efeito === 'chapeu'){

            const larguraChapeu =
            box.width * 1.8;

            const alturaChapeu =
            larguraChapeu * .9;

            const posX =
            x - (
                larguraChapeu - box.width
            ) / 2;

            const posY =
            y - alturaChapeu + 40;

            ctx.save();

            ctx.translate(
                posX + larguraChapeu / 2,
                posY + alturaChapeu / 2
            );

            ctx.rotate(-0.05);

            ctx.drawImage(
                imgChapeu,
                -larguraChapeu / 2,
                -alturaChapeu / 2,
                larguraChapeu,
                alturaChapeu
            );

            ctx.restore();
        }

        /* ÓCULOS */

        if(efeito === 'oculos'){

            const larguraOculos =
            box.width * 1.25;

            const alturaOculos =
            larguraOculos * .45;

            ctx.save();

            ctx.translate(
                x + box.width / 2,
                y + 85
            );

            ctx.rotate(-0.02);

            ctx.drawImage(
                imgOculos,
                -larguraOculos / 2,
                -alturaOculos / 2,
                larguraOculos,
                alturaOculos
            );

            ctx.restore();
        }
    });

    /* RUÍDO */

    const imageData =
    ctx.getImageData(
        0,
        0,
        photo.width,
        photo.height
    );

    const pixels = imageData.data;

    for(let i = 0; i < pixels.length; i += 4){

        const noise =
        (Math.random() - .5) * 25;

        pixels[i] += noise;

        pixels[i + 1] += noise;

        pixels[i + 2] += noise;
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    /* DATA */

    const boxFoto =
    document.createElement('div');

    boxFoto.classList.add('foto-box');

    const data =
    document.createElement('div');

    data.classList.add('dataFoto');

    const agora = new Date();

    data.innerText =
    `${agora.toLocaleDateString()}
     ${agora.toLocaleTimeString()}`;

    boxFoto.appendChild(photo);

    boxFoto.appendChild(data);

    photos.prepend(boxFoto);
}

/* LOAD */

document.addEventListener(
    'DOMContentLoaded',
    async()=>{

        updateStatus(
            "Carregando modelos...",
            "#ccc"
        );

        await carregarModelos();

        document
        .getElementById('startBtn')
        .addEventListener(
            'click',
            startCamera
        );
    }
);