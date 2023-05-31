
class camera {
    static video;
    static set res(re) {
        camera.video.style.width = re + "px";
        camera.video.style.height = re + "px";
    }
    static Init() {
        const video = document.createElement("video");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("muted", "");
        video.style.width = 200 + "px";
        video.style.height = 200 + "px";

        const facingMode = "user";
        const constraints = {
            audio: false,
            video: {
                facingMode,
            },
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
        });
        document.body.appendChild(video);
        camera.video = video;
        camera.image = new Image2(camera.video);
    }
    static image;
}