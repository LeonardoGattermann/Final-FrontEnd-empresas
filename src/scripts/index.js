async function requestSectors(){
await fetch("http://localhost:3333/categories/readAll")
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('sectores',JSON.stringify(data))
        })
    .catch(error => console.log(error))
    if(sectoresStorage == null){
      location.reload()
    }
}
requestSectors()
const sectoresStorage = JSON.parse(localStorage.getItem('sectores'))

async function requestCompanies(){
  await fetch("http://localhost:3333/companies/readAll")
  .then(response => response.json())
  .then(data => {
      localStorage.setItem('companies',JSON.stringify(data))
      })
  .catch(error => console.log(error))
  if(sectoresStorage == null){
    location.reload()
  }
}
requestCompanies()
const companiesStorage = JSON.parse(localStorage.getItem('companies'))

function renderSectores(arr){
    const select = document.querySelector('#Sector__companies')
    arr.forEach(element => {
      const createOption = document.createElement('option')

      createOption.innerHTML = element.name
      createOption.value = element.id
      select.appendChild(createOption)
    });

  }

  renderSectores(sectoresStorage)

function verifyChange(){
  const select = document.querySelector('#Sector__companies')
  let change ;
  select.addEventListener('change', ()=> {
    change = select.value
    if(change == "All"){
          renderCompanies(companiesStorage)
    }else{
          separateCompanies(change)
    }
  })};
    
    verifyChange()

function separateCompanies(change){
  let companiesChanges = [];
  companiesStorage.forEach(element => {
    if(element.category_id == change){
      companiesChanges.push(element)
    }
  })
    renderCompanies(companiesChanges)
}   

function renderCompanies(arr){ 
   const list = document.querySelector(".list--companies");
    if (list && list.childNodes.length > 0) {//verifica se tem algo na ul
    for (let i = list.childNodes.length - 1; i >= 0; i--) {
      list.removeChild(list.childNodes[i]);
    }
  }
console.log(companiesStorage)
console.log(sectoresStorage)

  arr.forEach(element => {
    const listItem = document.createElement("li");
    listItem.classList.add("list__item");
    
    const heading = document.createElement("h3");
    heading.textContent = element.name;
       
    const category = document.createElement("span");
    category.classList.add("company__category");
      sectoresStorage.forEach(sectorElement =>{
       if(sectorElement.id == element.category_id){
        console.log(sectorElement.name)
      category.textContent = sectorElement.name
       }
      
      });
    
    listItem.appendChild(heading);
    listItem.appendChild(category);
    list.appendChild(listItem);
    })
  };


renderCompanies(companiesStorage)



function renderList(arr) {
  const ul = document.querySelector('ul')
  arr.forEach(company => {
      // const sector = department.filter(element => {
      //     const filterBySector = element.id === company.category_id
      //     return filterBySector
      // })

      const li = document.createElement('li')
      const liContainer = document.createElement('div')
      const companyName = document.createElement('h2')
      const departmentSpan = document.createElement('span')

      li.id = `${company.category_id}`
      liContainer.className = 'li__container'

      companyName.innerHTML = company.name
      // departmentSpan.innerHTML = sector[0].name
      liContainer.append(companyName, departmentSpan)
      li.appendChild(liContainer)
      ul.appendChild(li)
  });
}