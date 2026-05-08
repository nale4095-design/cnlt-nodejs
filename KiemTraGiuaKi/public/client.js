const socket = io();

let myName = "";
let selectedUser = null;
let selectedUserName = "";

let allMessages = {};

window.joinChat = function () {

    myName = document.getElementById("username").value;

    if(myName.trim() === ""){
        alert("Nhập tên user");
        return;
    }

    socket.emit("join", myName);

    document.getElementById("username").disabled = true;
}

socket.on("onlineUsers", (users) => {

    const userList = document.getElementById("users");

    userList.innerHTML = "";

    for(let id in users){

        if(users[id] === myName) continue;

        const li = document.createElement("li");

        li.innerHTML = "🟢 " + users[id];

        li.onclick = () => {

            selectedUser = id;
            selectedUserName = users[id];

            document.getElementById("chatWith").innerText =
                "Đang chat với: " + selectedUserName;

            loadMessages();
        };

        userList.appendChild(li);
    }
});

window.sendMessage = function () {

    const input = document.getElementById("messageInput");

    const msg = input.value;

    if(msg.trim() === ""){
        return;
    }

    if(selectedUser == null){
        alert("Chọn user để chat");
        return;
    }

    socket.emit("privateMessage", {
        to: selectedUser,
        message: msg
    });

    input.value = "";
}

socket.on("message", (data) => {

    if(!allMessages[data.sender]){
        allMessages[data.sender] = [];
    }

    allMessages[data.sender].push({
        type: "other",
        text: data.message,
        time: data.time
    });

    if(selectedUserName === data.sender){
        loadMessages();
    }
});

socket.on("myMessage", (data) => {

    if(!allMessages[data.receiver]){
        allMessages[data.receiver] = [];
    }

    allMessages[data.receiver].push({
        type: "me",
        text: data.message,
        time: data.time
    });

    loadMessages();
});

function loadMessages(){

    const messages = document.getElementById("messages");

    messages.innerHTML = "";

    const chat = allMessages[selectedUserName] || [];

    chat.forEach(msg => {

        const div = document.createElement("div");

        div.classList.add("message");
        div.classList.add(msg.type);

        div.innerHTML = `
            <div>${msg.text}</div>
            <div class="time">${msg.time}</div>
        `;

        messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
}