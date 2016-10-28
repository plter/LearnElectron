// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


class Main {


    constructor() {

        this.renderUI();
        this.showCamera();
        this.addListeners();
    }

    renderUI() {
        this._video = document.querySelector("#video");
        this._btnStartRecord = document.querySelector("#btn-start-record");
        this._btnStopRecord = document.querySelector("#btn-stop-record");
        this._btnDownloadVideo = document.querySelector("#btn-download-video");
        this._status = document.querySelector("#status");
    }

    addListeners() {
        this._btnStartRecord.onclick = () => {
            this._status.innerHTML = "正在录制...";

            this._chucks = [];
            this._mediaRecorder = new MediaRecorder(this._currentStream, {mimeType: 'video/webm'});
            this._mediaRecorder.ondataavailable = e=>this._chucks.push(e.data);
            this._mediaRecorder.start(20);
        };
        this._btnStopRecord.onclick = ()=> {
            this._status.innerHTML = "停止录制";
            this._mediaRecorder.stop();
        };
        this._btnDownloadVideo.onclick = ()=> {
            this._currentBlob = new Blob(this._chucks, {type: 'video/webm'});

            var url = window.URL.createObjectURL(this._currentBlob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'test.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        };
    }

    showCamera() {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream=> {
            this._currentStream = stream;
            this._video.src = URL.createObjectURL(stream);
        }).catch(error=> {
            alert("你拒绝使用本机设备");
            console.log(error);
        });
    }
}

new Main();