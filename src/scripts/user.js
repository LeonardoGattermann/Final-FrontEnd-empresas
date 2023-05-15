const tokenUser = localStorage.getItem('authToken')
const isAdm = localStorage.getItem('isAdm')

function routeProtect(){
  if(tokenUser){
      if(isAdm == "true"){
        window.location.href = "./adminPage.html";
      }
  }else if(!tokenUser){
    window.location.href = '../../index.html';
  }
}

routeProtect()
function getInfoUserLogged(){
    
    fetch("http://localhost:3333/employees/profile", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
        },
      })
      .then(response =>response.json())
      .then(data =>{
        if(data.company_id == null || data.department_id == null){
            renderUserInfo(data.name,data.email)
        }else if(data.company_id == !null || data.department_id !== null){
            renderUserInfo(data.name,data.email)
            setCompany(data)
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

function setCompany(data){
    const desempregado = document.querySelector('.person__job')
    const empregado = document.querySelector('.person__job2')

    desempregado.style.display = 'none'
    empregado.style.display = 'flex'
    renderCompanyEmployees(data)
}

async function renderCompanyEmployees(data){
  console.log(data)
  let companyInfos;
  let departmentInfos;
  const Company = `http://localhost:3333/companies/readById/${data.company_id}`
  await fetch(Company, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenUser}`,
    },})
  .then(res => res.json())
  .then(response =>{
      console.log(response)
      companyInfos = response
  })
  .catch(error =>console.log(error))
  
  const urlDepart = `http://localhost:3333/departments/readById/${data.department_id}`
  await fetch(urlDepart, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenUser}`,
    },})
  .then(res => res.json())
  .then(response =>{
      console.log(response)
      departmentInfos = response

      renderEmployes(response.employees)
      const companyName = document.querySelector('.companhnia__name') //seleciona para por compania e department
        companyName.innerHTML =  `${companyInfos.name}  -  ${departmentInfos.name}`
  })
  .catch(error =>console.log(error))
}

function renderEmployes(employes){
  const ulEmployes = document.querySelector('.companhnia__employee')
  ulEmployes.innerHTML = ''
  employes.forEach(element => {
    const liCreate = document.createElement('li')
    liCreate.className = 'employee__info'
    liCreate.innerText = element.name

    ulEmployes.appendChild(liCreate)
    
  })
}