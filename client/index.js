const socket = io();
const keys = new window.RSA({ b: 512 }) 

var users = []
var id = ""
var encryptKey = null

publicKey = keys.exportKey('public')
privateKey= keys.exportKey('private')

const dom = {
    send: document.querySelector('.send'),
    feed: document.querySelector('.feed'),
    info: document.querySelector('.info'),
    text: document.querySelector('.text-input'),
    startButton: document.querySelector('.start-button'),
    main: document.querySelector('.main')
}


window.onload = () => {

    socket.emit('send keys', {
        publicKey
    });

    const addLine = document.createElement("li")
    
    addLine.innerHTML = `
    <p>Your public key:</p>
    <p>${publicKey}</p>
    `
    const addLine2 = document.createElement("li")
    addLine2.innerHTML = `
    <p>Your public key:</p>
    <p>${privateKey}</p>
    `
    dom.info.appendChild(addLine)
    dom.info.appendChild(addLine2)
}

dom.startButton.onclick = () => {
    socket.emit('request pKey', {id})
}

socket.on('get socket id', payload => {
    id = payload.id
})

dom.text.onkeyup = e => {

    dom.send.onclick = () => {

        const message = e.target.value;
        partnerRSA = new window.RSA()
        partnerRSA.importKey(encryptKey)
        encryptedMessage = partnerRSA.encrypt(message).toString('base64')
        socket.emit('send message', {
            encryptedMessage
        });

        printMessage(message);

        e.target.value = '';
    }
}

socket.on('too many users', () => {
    alert("Max 2 users allowed, sorry")
    dom.main.remove()
})

socket.on('second user', () => {
    alert("please open a second localhost session, you need two users")
})

socket.on('broadcast message', payload => {
    printBroadcastMessage(payload.message)
})

socket.on('get pKey', key => {
    printPartnerpKey(key)
})

const printPartnerpKey = (partnerKey) => {
    encryptKey = partnerKey.key

    const addPartnerKey = document.createElement("li")
    
    addPartnerKey.innerHTML = `
    <p>Here's they public key of your partner :):</p>
    <p>${partnerKey.key}</p>
    `
    dom.startButton.remove()
    alert("please make sure you request both keys before sending messages")
    dom.info.appendChild(addPartnerKey)
}

const printBroadcastMessage = (message) => {

    mRSA = new window.RSA()
    mRSA.importKey(privateKey)
    decryptedMessage = mRSA.decrypt(message).toString()

    const addLine = document.createElement("li")
    addLine.innerHTML = 
    
    
    `<p>OTHER USER'S MESSAGE: ${decryptedMessage}</p>`
    dom.feed.appendChild(addLine)
}

const printMessage = (message) => {
    const addLine = document.createElement("li")
    addLine.innerHTML = 
    
    
    `<p>YOUR MESSAGE: ${message}</p>`
    dom.feed.appendChild(addLine)
}
