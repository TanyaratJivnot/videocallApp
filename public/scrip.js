const socket = io('/')
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream
/* ฟังก์ชัน JavaScript ในตัวที่ใช้ในการเข้าถึงอุปกรณ์สื่อของผู้ใช้เช่นเว็บแคมหรือไมโครโฟนและรับวัตถุสตรีมสื่อ */
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on('call', call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream=>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    });

    /* mesage */

let inputText = document.querySelector('#chat_message');
document.querySelector('html').addEventListener('keydown', (e) => {
    if (e.which == 13 && inputText.value.length !== 0) {
        console.log(inputText.value);
        socket.emit('message', inputText.value);
        inputText.value='';
    }
});
socket.on('createMessage', message=>{
    console.log('This is comming form server: ',message);
    const messagesContainer = document.getElementsByClassName('messages')[0];
    messagesContainer.innerHTML += `<li class="message"><b>user</b><br/>${message}</li>`;
    /* scrollToBottom(); */
})

});
peer.on('open',id=>{
    socket.emit('join-room', ROOM_ID,id);
})
/* join the room */
/* socket.emit('join-room', ROOM_ID); *//* เสมือนว่าเข้าร่วมห้องนี้ */

/* เชื่อมต่อกับผู้ใช้ที่เข้ามาใหม่ */
const  connectToNewUser = (userId, stream) =>{
    const call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}



const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video);
}

/* const scrollToBottom = ()=>{
    let d = $('main__chat_window');
    d.scrollToBottom(d.prop("scorllHeight"));
} */

/* เสียงเปิดปิดไมค์ */
const mutedUnmute = () =>{
    const enable = myVideoStream.getAudioTracks()[0].enabled;
    if(enable) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = ()=>{
    const html = `
    <i class="fa-solid fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
    console.log(myVideoStream);
}
const setUnmuteButton = ()=>{
    const html = `
    <i class="unmute fa-solid fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
    console.log(myVideoStream);
}

/* เปิด ปิด วิดีโอ */
const playStop = () =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopVideo();
    }else {
        setPlayVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
const setPlayVideo = ()=>{
    const html = `
    <i class="fa-solid fa-video"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
    console.log(myVideoStream);
}
const setStopVideo = ()=>{
    const html = `
    <i class="unmute fa-solid fa-video-slash"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
    console.log(myVideoStream);
}