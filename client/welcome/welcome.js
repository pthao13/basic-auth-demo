const getUser = () => {
  axios
    .get("http://localhost:4500/api/session")
    .then((res) => {})
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        window.location.replace("../login/login.html");
      }
    });
};

getUser();
