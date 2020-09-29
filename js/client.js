// making the connection between server and browser 
const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables 
const form = document.getElementById('send-chat');
const messageInput = document.getElementById('chat')
const messageContainer = document.querySelector('.container')

// Audio that will play on receiving message
var audio = new Audio('snapchat.mp3');

// function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();

    }
    
}

// Ask new user for their name and let the server know
const name = prompt("Enter your name to join ")
socket.emit('new-user-joined', name);

// If new user join, receive their name form the serverr
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// if server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name} : ${data.message}`, 'left')
})

// if a user leaves the chat, let other know by appending info in container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

//  if the form get submmited, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = ''
})