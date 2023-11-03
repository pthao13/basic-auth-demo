const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("#signup");

const createUser = (e) => {
  e.preventDefault();

  const body = {
    email: email.value,
    password: password.value,
  };

  axios.post("http://localhost:4500/api/user", body).then((res) => {
    const message = document.querySelector("#message");
    message.innerHTML = res.data;
  });
};

form.addEventListener("submit", createUser);
