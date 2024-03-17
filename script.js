const chatInput = document.querySelector(".chat-input textarea");

const sendChatBtn = document.querySelector(".chat-input span");

const chatbox = document.querySelector(".chatbox ")
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi = (messege , className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>`: `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = messege;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messegeElement =incomingChatLi.querySelector("p");
    const requestOptions = {
        method : "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`

        },
        body: JSON.stringify({
            model:  "gpt-3.5-turbo",
            messages: [{role:"user", content:userMessage}]
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messegeElement.textContent = data.choices[0].message.content;
    }).catch((error)=> {
        messegeElement.classList.add("error");
        messegeElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height = `${inputInitHeight}px`;


    chatbox.appendChild(createChatLi(userMessage ,  "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=> {
        const incomingChatLi =createChatLi("Thinking...." ,  "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);

    },600);
    chatInput.addEventListener("input", ()=> {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    })
   
    
}

chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);