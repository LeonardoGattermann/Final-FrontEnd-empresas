function getInfoUserLogged(){
    const tokenUser = localStorage.getItem('authToken')
    
    fetch("http://localhost:3333/employees/profile", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
        },
      })
      .then(response =>response.json())
      .then(data =>{
        console.log(data)
        
        if(data.company_id == null || data.department_id == null){
            renderUserInfo(data.name,data.email)
        }else if(!data.company_id == null || !data.department_id == null){
            renderUserInfo(data.name,data.email)
            setCompany()
        }

      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
}
getInfoUserLogged()

function renderUserInfo(name,email){

    const sectionUserInfo = document.querySelector('.person__info')
    const h1 = document.createElement("h1");
    const h3 = document.createElement("h3");

    h1.setAttribute("class", "person__name");
    h3.setAttribute("class", "person__email");

    h1.textContent = name;
    h3.textContent = email;

    sectionUserInfo.appendChild(h1);
    sectionUserInfo.appendChild(h3);

}

function setCompany(){
    const desempregado = document.querySelector('.person__job')
    const empregado = document.querySelector('.person__job2')

    desempregado.style.display = 'none'
    empregado.style.display = 'flex'
}