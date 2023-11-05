const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('#login');
const userCtrl = require('./ctrl');


const login = (e) => {
    e.preventDefault()
    const body = {
        email: email.value,
        password: password.value,
    };
    axios.post(`http://localhost:4500/api/user`, body).then(res =>{
        if(res.status === 200) {
            window.location.replace("../welcome/welcome.html")
        }
})
};

form.addEventListener("submit", login);