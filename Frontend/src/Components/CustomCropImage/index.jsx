// components/cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop) {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
        image.onload = () => {
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result);
            });
        };
    });
}
