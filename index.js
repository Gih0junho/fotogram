const video = document.getElementById('camera');
const photos = document.getElementById('photos');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        alert('Erro ao acessar câmera: ' + error.message);
    }
}

function capturarPhoto(efeito) {
    const photo = document.createElement('canvas');
    photo.width = video.videoWidth;
    photo.height = video.videoHeight;
    const context = photo.getContext('2d');

    // Espelha a foto para combinar com o vídeo
    context.translate(photo.width, 0);
    context.scale(-1, 1);

    switch (efeito) {
        case 'cinza':
            context.filter = 'grayscale(100%)';
            break;
        case 'antiga':
            context.filter = 'sepia(100%)';
            break;
        case 'invertido':
            context.filter = 'invert(100%)';
            break;
        case 'negativo':
            context.filter = 'contrast(200%)';
            break;
        case 'desfoque':
            context.filter = 'blur(5px)';
            break;
        case 'brilho':
            context.filter = 'brightness(150%)';
            break;
        case 'sobreposicao':
            context.filter = 'contrast(150%) brightness(120%)';
            break;
        case 'tintado':
            context.filter = 'hue-rotate(90deg)';
            break;
        case 'flash':
            context.filter = 'brightness(200%) contrast(150%)';
            break;
        case 'saturacao':
            context.filter = 'saturate(200%)';
            break;
        case 'opacidade':
            context.filter = 'opacity(0.5)';
            break;
        case 'rotacao':
            context.filter = 'hue-rotate(180deg)';
            break;
        default:
            context.filter = 'none';
            break;
    }

    if (photo.width === 0 || photo.height === 0) {
        alert('A câmera ainda não está pronta. Espere alguns segundos e tente novamente.');
        return;
    }

    context.drawImage(video, 0, 0, photo.width, photo.height);
    photos.appendChild(photo);
}

startCamera();
