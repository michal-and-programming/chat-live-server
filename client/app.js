const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({ author, content }) => addMessage(author, content));
socket.on('removeUser', ({author, content}) => addMessage(author, content));

const login = () => {
  loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const chosenName = userNameInput.value;
    if(chosenName == ''){
      alert('please enter name');
    } else {
      userName = chosenName;
      socket.emit('join', userName);
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
    }
  });
};

login();

const sendMessage = (e) => {
  e.preventDefault();
  const message = messageContentInput.value;
  if(!message){
    alert('enter message');
  } else {
    addMessage(userName, message);
    socket.emit('message', { author: userName, content: message });
    messageContentInput.value = '';
  };
};

addMessageForm.addEventListener('submit', sendMessage);

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  
  if(author === userName){
    message.classList.add('message--self');
  }

  if(author === 'Chat bot'){
    message.classList.add('chatMessage');
  }

  message.innerHTML = `
    <h3 class= "message__author">${userName === author ? 'You' : author}</h3>
    <div class= "message__content">${content}</div>
  `;
  messagesList.appendChild(message);
};
