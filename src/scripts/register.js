function getUser(){
    const btnRegister = document.querySelector('#btn-register')
    btnRegister.addEventListener('click',()=>{
        const name = document.querySelector('#name-register').value
        const password = document.querySelector('#password-register').value
        const email = document.querySelector('#email-register').value
        if(name.length != 0){
            if(verifyEmail(email)){
                if(password.length > 7){
                    createUser(name,email,password)
                }else{
                    toast("Insira uma senha com 8 ou mais caracteres.!")
                }
            }else{ 
                toast("Insira um email Valido")
            }
        }else{
            toast("Insira um Nome")
        }
    })
}
getUser()

function verifyEmail(email){
  if (!email) {
    return false;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return false;
  }
  
  return true;
}



async function createUser(nome,email,password){
    const url = 'http://localhost:3333/employees/create';
const data = {
  "name": nome,
  "email": email,
  "password": password
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
  .then(data => {
    console.log(data)
    if(data.message == "Email já cadastrado, por favor informe outro ou faça login"){
      toast(data.message)
      
    }else{
      toast("Email criado, Logue-se");
        window.location.href = "./login.html";
    }
    
})
  .catch(error => console.error(error));
}

function toast(txt){
    const body = document.querySelector(".body");
    const divAnimation = document.createElement("div");
    const textAnimation = document.createElement("p");

    divAnimation.classList.add("toast__container", "toastadd");
    textAnimation.className = "textAnimation";

    divAnimation.style.backgroundColor = "#D7443E";

    textAnimation.innerHTML = txt;

    divAnimation.appendChild(textAnimation);
    body.appendChild(divAnimation);

    setTimeout(() => {
      divAnimation.classList.add("toast__remove");
    }, 3000);

    setTimeout(() => {
      body.removeChild(divAnimation);
    }, 3000);
}