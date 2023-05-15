const red = "#D7443E";
const green = "#36B37E";


const tokenUser = localStorage.getItem("authToken");
const isAdm = localStorage.getItem('isAdm')
function routeProtect(){
  if(tokenUser){
      if(isAdm == "true"){
        window.location.href = "./adminPage.html";
      }else if(isAdm == "false"){
        window.location.href = "./user.html";
      }
  }else if(!tokenUser){
  }
}

routeProtect()

function takeLogin(){
    
    const btnLogin = document.querySelector('#btnLogin')
    btnLogin.addEventListener('click',()=>{
        const email = document.querySelector('#email-login').value
        const password = document.querySelector('#password-login').value
        console.log(password,email)
        if(email.length == 0 || password.length == 0 ){
            toast("Insira email ou senha!")
          }else{
   requestLogin(email,password)
}})
}

takeLogin()

async function requestLogin(email,password){
    const url = 'http://localhost:3333/auth/login';
    const data = {
      email: email,
      password: password
    };
    console.log(data)
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data =>{
        if(data.message == "Email ou senha inválidos"){
          toast(data.message,red)
        }else{
          verifyUser(data)
          toast(data.message,green)
        }
        } )
      .catch(error => console.error(error));

}

function verifyUser(data){
    console.log(data)
      
    if(data.message == 'Email ou senha inválidos'){
    toast("Email ou senha inválidos")
  }else if(data.isAdm == true){
    localStorage.setItem('isAdm', data.isAdm)
    localStorage.setItem('authToken', data.authToken)
    window.location.href = "./adminPage.html";
  }
  else{
    localStorage.setItem('isAdm', data.isAdm)
    localStorage.setItem('authToken', data.authToken)
    window.location.href = "./user.html";
  }
}
function toast(txt,color){
  const body = document.querySelector(".body");
  const divAnimation = document.createElement("div");
  const textAnimation = document.createElement("p");

  divAnimation.classList.add("toast__container", "toastadd");
  textAnimation.className = "textAnimation";

  divAnimation.style.backgroundColor = color

  textAnimation.innerHTML =txt;

  divAnimation.appendChild(textAnimation);
  body.appendChild(divAnimation);

  setTimeout(() => {
    divAnimation.classList.add("toast__remove");
  }, 3000);

  setTimeout(() => {
    body.removeChild(divAnimation);
  }, 3000);
}

