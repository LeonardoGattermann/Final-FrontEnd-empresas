const tokenUser = localStorage.getItem('authToken')
const storageCompanies = JSON.parse(localStorage.getItem('companies'))


function selectCompany(arr){
    const select = document.querySelector('.select__companhia')
    arr.forEach(element => {
       
        const optCreate = document.createElement('option')
         
        optCreate.innerHTML = element.name
        optCreate.value = element.id
        select.appendChild(optCreate)

    })

    select.addEventListener('change',()=>{
        requestDepartments(select.value)
    })

}

function requestCompanys(){
    fetch("http://localhost:3333/companies/readAll")
    .then(response => response.json())
    .then(data => {
        selectCompany(data)
    })
    .catch()
}

requestCompanys()

async function requestDepartments(id){
    const url = `http://localhost:3333/departments/readByCompany/${id}`
    await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenUser}`
        },
        
      })
        .then(response => response.json())
        .then(data =>{
            renderDepartment(data)} )
        .catch(error => console.error(error));
  
}

async function renderDepartment(arr){

    const list = document.querySelector(".list__departments-list");
    if (list && list.childNodes.length > 0) {//verifica se tem algo na ul
    for (let i = list.childNodes.length - 1; i >= 0; i--) {
      list.removeChild(list.childNodes[i]);
    }
  }

arr.forEach(element  => {
const departmentsList = document.querySelector('.list__departments-list');

const departmentItem = document.createElement('li');
departmentItem.classList.add('list__departments-item');

const departmentInfo = document.createElement('div');
departmentInfo.classList.add('list__departments-info');

const departmentName = document.createElement('h1');
departmentName.classList.add('list__departments-title');
departmentName.textContent = element.name;
const departmentDescription = document.createElement('h2');
departmentDescription.classList.add('list__departments-description');
departmentDescription.textContent = element.description;

const companyName = document.createElement('h3');
companyName.classList.add('list__departments-description');
storageCompanies.forEach(elements => {
    if(element.company_id == elements.id){
        companyName.textContent = elements.name;
    }
});


departmentInfo.appendChild(departmentName);
departmentInfo.appendChild(departmentDescription);
departmentInfo.appendChild(companyName);

const departmentActions = document.createElement('aside');
departmentActions.classList.add('list__departments-actions');

const visibilityIcon = document.createElement('span');
visibilityIcon.classList.add('list__departments-icon', 'list__departments-icon--visibility', 'material-symbols-outlined');
visibilityIcon.textContent = 'visibility';
visibilityIcon.addEventListener('click',async ()=>{
  const departamentView = document.querySelector('.department__view')
  const departamentViewClose = document.querySelector('.department__close')

  departamentView.showModal()
  renderInfoModalView(element)
  renderEmployedDepartament(element)
  departamentViewClose.addEventListener('click',()=>{//fecha modal
  departamentView.close()
  })
  
    const url = `http://localhost:3333/employees/outOfWork`
   await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenUser}`
    }
  })
    .then(response => response.json())
    .then(data =>{
        renderSelectOutWork(data)})
    .catch(error => console.error(error));
    
    function renderSelectOutWork(arr){
      const select = document.querySelector('.department__select')
      const newEmployerBtn = document.querySelector('#addNewEmployeer')
      
      let outWorkSelected ;
      const newOptionz = document.createElement('option')
   
      select.innerHTML = ''
      newOptionz.innerHTML = 'Selecione um usuario!'
      newOptionz.value = 'teste'
      select.appendChild(newOptionz)

      arr.forEach(element => {
        const newOption = document.createElement('option')
        
        newOption.value = element.id
        newOption.innerHTML = element.name
        select.appendChild(newOption)

        
      });//renderiza options dee desempregados
          select.addEventListener('change',()=>{
            outWorkSelected = select.value
            })
            newEmployerBtn.addEventListener('click',()=>{
              console.log(outWorkSelected)
              if(outWorkSelected == undefined|| outWorkSelected == "teste"){
                toast('Selecione um usuario!')
              }else{
                hireEmployee(outWorkSelected,element.id)
              }
            })
      }

})

const editIcon = document.createElement('span');
editIcon.classList.add('list__departments-icon', 'list__departments-icon--edit', 'material-symbols-outlined');
editIcon.textContent = 'edit';

const deleteIcon = document.createElement('span');
deleteIcon.classList.add('list__departments-icon', 'list__departments-icon--delete', 'material-symbols-outlined');
deleteIcon.textContent = 'delete';

departmentActions.appendChild(visibilityIcon);
departmentActions.appendChild(editIcon);
departmentActions.appendChild(deleteIcon);
departmentItem.appendChild(departmentInfo);
departmentItem.appendChild(departmentActions);
departmentsList.appendChild(departmentItem);
});

}

async function newDepartament(){

const newDepartamentBtn = document.querySelector('.new__departments')
const newDepartamentDialogClose = document.querySelector('.new-close')
newDepartamentDialogClose.addEventListener('click',()=>{
  const newDepartamentDialog = document.querySelector('.new-department')
        newDepartamentDialog.close()
})
  newDepartamentBtn.addEventListener('click',()=>{
  const newDepartamentDialog = document.querySelector('.new-department')
  newDepartamentDialog.showModal()
  renderNewDepartament()
})
}

newDepartament()

function renderNewDepartament(){
  const selectNewDialog = document.querySelector('.new-department__select')
  const newDepartamentButton = document.querySelector('.new-department__button')
  let companiesSelected ;
  storageCompanies.forEach(element => {//renderia o select do modal
    const newOption = document.createElement('option')
    
    newOption.value = element.id
    newOption.innerHTML = element.name
    
    selectNewDialog.appendChild(newOption)
  });

  selectNewDialog.addEventListener('change',()=>{
    companiesSelected = selectNewDialog.value
  })

  newDepartamentButton.addEventListener('click',async ()=>{
    const departamentInputName = document.querySelector('#name_department').value
    const departamentInputDescription = document.querySelector('#description_department').value
     
    if(companiesSelected != undefined){
   const url = `http://localhost:3333/departments/create`
   const data = {
    "name":departamentInputName,
    "description": departamentInputDescription,
    "company_id": companiesSelected
   }
   console.log(data)
   await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenUser}`
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data =>{
        console.log(data)} )
    .catch(error => console.error(error));
    }

  })
    
}

async function hireEmployee(idEmploy,idDepartament){
  const url = `http://localhost:3333/employees/hireEmployee/${idEmploy}`
  const data = {
    "department_id": idDepartament
  };
  await fetch(url, {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${tokenUser}`
   },
   body: JSON.stringify(data)
 })
   .then(response => response.json())
   .then(data =>{console.log(data)})
   .catch(error => console.error(error));
   
}

async function renderEmployedDepartament(departament){
  const url = `http://localhost:3333/employees/readAll`
  await fetch(url, {
   method: 'GET',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${tokenUser}`
   },
 })
   .then(response => response.json())
   .then(data =>{
    renderEmployedDepartamentFilter(data,departament)})
   .catch(error => console.error(error));
   
  function renderEmployedDepartamentFilter(users,departament){
    let arrEmployInCompany = []
    users.forEach(element => {
      if(element.department_id == departament.id){
        arrEmployInCompany.push(element)
      }
    });
    renderEmployesInCompany(arrEmployInCompany)
   }
}

function renderInfoModalView(element){
  const title = document.querySelector('.department__title')
  const description = document.querySelector('.department__description')
  const company = document.querySelector('.department__company')

  title.innerHTML = element.name
  description.innerHTML = element.description
  storageCompanies.forEach(elementz => {
      if(elementz.id == element.company_id){
        company.innerHTML = elementz.name
      }
  });
}

function  renderEmployesInCompany(arr){
  console.log(arr)
 arr.forEach(element => {
const departmentList = document.querySelector('.department__list');

const newListItem = document.createElement('li');
newListItem.classList.add('department__list-item');

const newUsername = document.createElement('h1');
newUsername.classList.add('department__username');
newUsername.textContent = element.name;

const newCompanyName = document.createElement('h2');
newCompanyName.classList.add('department__company-name');
storageCompanies.forEach(elementz => {
  if(element.company_id  == elementz.id){
    newCompanyName.textContent = elementz.name;
  }
});

const newButton = document.createElement('input');
newButton.classList.add('department__button--off');
newButton.id = element.id
newButton.setAttribute('type', 'button');
newButton.setAttribute('value', 'Desligar');
newButton.addEventListener("click",(event)=>{
  dismissEmployee(event.target)
})

newListItem.appendChild(newUsername);
newListItem.appendChild(newCompanyName);
newListItem.appendChild(newButton);

departmentList.appendChild(newListItem);

 });
}

async function dismissEmployee(txt){
console.log(txt.id)
const url = `http://localhost:3333/employees/dismissEmployee/${txt.id}`
  await fetch(url, {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${tokenUser}`
   },
 })
   .then(response => response.json())
   .then(data =>{console.log(data)})
   .catch(error => console.error(error));


}


function toast(txt){
  const body = document.querySelector(".body");
  const divAnimation = document.createElement("div");
  const textAnimation = document.createElement("p");

  divAnimation.classList.add("toast__container", "toastadd");
  textAnimation.className = "textAnimation";

  divAnimation.style.backgroundColor = "#D7443E";

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
