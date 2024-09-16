const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Função para criar uma mensagem no chat
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Função para gerar resposta da API do Google Gemini
const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // Mostra mensagem de "pensando" enquanto espera a resposta da API
    messageElement.textContent = "Pensando...";

    // A sua chave da API
    const apiKey = 'AIzaSyDbRN4-MzyelPbul3vBAVwI_PEoVeX9wws'; // Substitua pela sua chave de API correta

    // Corpo da requisição
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: userMessage }  // A mensagem enviada pelo usuário
                ]
            }
        ]
    };

    // Fazendo a requisição à API do Google Gemini
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`  // Adicione a chave da API no cabeçalho
        },
        body: JSON.stringify(requestBody)
    });


        const data = await response.json();
        const botMessage = data.candidates?.[0]?.output || "Não foi possível gerar uma resposta.";  // Ajuste isso conforme a resposta da API

        // Exibe o texto de resposta no chat
        messageElement.textContent = botMessage;

    } catch (error) {
        // Em caso de erro
        messageElement.textContent = "Ocorreu um erro ao processar a resposta.";
        console.error("Erro na API do Google Gemini:", error);
    }

    // Rolar até o final da janela de chat
    chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Função para lidar com o envio de mensagens do usuário
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // Limpa a área de entrada e ajusta sua altura
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Adiciona a mensagem do usuário ao chat
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Simula a resposta após um pequeno delay
    setTimeout(() => {
        // Mostra a mensagem de "Pensando..." enquanto aguarda a resposta da API
        const incomingChatLi = createChatLi("Pensando...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Ajusta a altura da área de entrada ao digitar
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Lida com a tecla Enter
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Botão para enviar mensagem
sendChatBtn.addEventListener("click", handleChat);

// Botão para fechar o chatbot
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
