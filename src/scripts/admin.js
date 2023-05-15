const tokenUser = localStorage.getItem("authToken");
const isAdm = localStorage.getItem('isAdm')
const storageCompanies = JSON.parse(localStorage.getItem("companies"));
const storageUser = JSON.parse(localStorage.getItem("users"));
const red = "#D7443E";
const green = "#36B37E";

function routeProtect(){
  if(tokenUser){
      if(isAdm == "true"){
      }else if(isAdm == "false"){
        window.location.href = "./user.html";
      }
  }else if(!tokenUser){
    window.location.href = '../../index.html';
  }
}

routeProtect()

function logoutClearStorage(){
  const logoutBtn = document.querySelector('#logoutButton')
  logoutBtn.addEventListener('click',()=>{
    localStorage.clear()
    window.location = '/index.html'
  })
}
logoutClearStorage()

let companySelectedRender = "ALL"
let departmentOpenCompany ;
function selectCompany(arr) {  //renderiza options de empresas

  const select = document.querySelector(".select__companhia");
  arr.forEach((element) => {
    const optCreate = document.createElement("option");

    optCreate.className = 'option__select'
    optCreate.innerHTML = element.name;
    optCreate.value = element.id;
    select.appendChild(optCreate);
  });

  select.addEventListener("change", () => {
    if (select.value == "ALL") {
      renderAllDepartaments();
      companySelectedRender = "ALL"
      console.log(companySelectedRender)
    } else {
      requestDepartments(select.value);
      companySelectedRender = select.className
      console.log(companySelectedRender)
    }
  });
}

async function renderAllDepartaments() {
  const url = `http://localhost:3333/departments/readAll`;
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderDepartment(data);
    })
    .catch((error) => console.log(error));
}
renderAllDepartaments(); //chamada para renderizar todos departamentos de primeira

function requestCompanys() {
  //solicita empresas
  fetch("http://localhost:3333/companies/readAll")
    .then((response) => response.json())
    .then((data) => {
      selectCompany(data);
    })
    .catch();
}

requestCompanys();

async function requestDepartments(id) {
  const url = `http://localhost:3333/departments/readByCompany/${id}`;
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      renderDepartment(data);
    })
    .catch((error) => console.error(error));
}

async function newDepartament() {
  const newDepartamentBtn = document.querySelector(".new__departments");
  const newDepartamentDialogClose = document.querySelector(".new-close");
  const newDepartamentDialog = document.querySelector(".new-department");

  newDepartamentDialogClose.addEventListener("click", () => {
    newDepartamentDialog.close();
  });
  newDepartamentBtn.addEventListener("click", () => {
    newDepartamentDialog.showModal();
    renderNewDepartamentDialog();
  });
}

newDepartament();

function renderNewDepartamentDialog() {
  const selectNewDialog = document.querySelector(".new-department__select");
  const newDepartamentButton = document.querySelector(
    ".new-department__button"
  );

  let companiesSelected;

  storageCompanies.forEach((element) => {
    //renderia o select do modal
    const newOption = document.createElement("option");

    newOption.value = element.id;
    newOption.innerHTML = element.name;

    selectNewDialog.appendChild(newOption);
  });

  selectNewDialog.addEventListener("change", () => {
    //salva a compania selecionada na let
    companiesSelected = selectNewDialog.value;
  });

  newDepartamentButton.addEventListener("click", async () => {
    const departamentInputName =
      document.querySelector("#name_department").value;
    const departamentInputDescription = document.querySelector(
      "#description_department"
    ).value;
    if (
      companiesSelected == undefined ||
      departamentInputName == "" ||
      departamentInputDescription == ""
    ) {
      toast("Insira Todos os dados do departamento.", red);
    } else if (companiesSelected != undefined) {
      const url = `http://localhost:3333/departments/create`;
      const data = {
        name: departamentInputName,
        description: departamentInputDescription,
        company_id: companiesSelected,
      };
      
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUser}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          toast(`${data.name}, Criado`,green)
          const newDepartamentDialog = document.querySelector(".new-department");
          newDepartamentDialog.close()
          console.log(companySelectedRender)
          if(companySelectedRender == "ALL"){
          renderAllDepartaments()
          }
        })
        .catch((error) => console.error(error));

    }
  });
}

async function renderDepartment(arr) {
  const list = document.querySelector(".list__departments-list");
  if (list && list.childNodes.length > 0) { //verifica se tem algo na ul
    for (let i = list.childNodes.length - 1; i >= 0; i--) {
      list.removeChild(list.childNodes[i]);
    }
  }

  arr.forEach((element) => {
    const departmentsList = document.querySelector(".list__departments-list");

    const departmentItem = document.createElement("li");
    departmentItem.classList.add("list__departments-item");

    const departmentInfo = document.createElement("div");
    departmentInfo.classList.add("list__departments-info");

    const departmentName = document.createElement("h1");
    departmentName.classList.add("list__departments-title");
    departmentName.textContent = element.name;
    const departmentDescription = document.createElement("h2");
    departmentDescription.classList.add("list__departments-description");
    departmentDescription.textContent = element.description;

    const companyName = document.createElement("h3");
    companyName.classList.add("list__departments-description");
    storageCompanies.forEach((elements) => {
      if (element.company_id == elements.id) {
        companyName.textContent = elements.name;
      }
    });

    departmentInfo.appendChild(departmentName);
    departmentInfo.appendChild(departmentDescription);
    departmentInfo.appendChild(companyName);

    const departmentActions = document.createElement("aside");
    departmentActions.classList.add("list__departments-actions");

    const visibilityIcon = document.createElement("span");
    visibilityIcon.classList.add(
      "list__departments-icon",
      "list__departments-icon--visibility",
      "material-symbols-outlined"
    );
    visibilityIcon.textContent = "visibility";
    visibilityIcon.addEventListener("click", async () => {
      const departamentView = document.querySelector(".department__view");
      const departamentViewClose = document.querySelector(".department__close");
      departamentViewClose.addEventListener("click", () => {
        //fecha modal
        departamentView.close();
      });
      departmentOpenCompany = element
      departamentView.showModal();
      renderInfoModalView(element);
      renderEmployedDepartament(element);
 

  
      requestOutWork()

      async function requestOutWork(){
        const url = `http://localhost:3333/employees/outOfWork`;
            await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenUser}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                renderSelectOutWork(data);
              })
              .catch((error) => console.error(error));
      
      }

    function renderSelectOutWork(arr) {
        const select = document.querySelector(".department__select");
        const newEmployerBtn = document.querySelector("#addNewEmployeer");

        let outWorkSelected;
        const newOptionz = document.createElement("option");

        select.innerHTML = "";
        newOptionz.innerHTML = "Selecione um usuario!";
        newOptionz.value = "teste";
        select.appendChild(newOptionz);

        arr.forEach((element) => {
          const newOption = document.createElement("option");

          newOption.value = element.id;
          newOption.innerHTML = element.name;
          select.appendChild(newOption);
        }); //renderiza options dee desempregados
        select.addEventListener("change", () => {
          outWorkSelected = select.value;
        });
        newEmployerBtn.addEventListener("click", () => {
          
          if (outWorkSelected == undefined || outWorkSelected == "teste") {
            toast("Selecione um usuario!", red);
          } else {
            hireEmployee(outWorkSelected, element.id,element);
          }
        });
      }
    });


    const editIcon = document.createElement("span");
    editIcon.classList.add(
      "list__departments-icon",
      "list__departments-icon--edit",
      "material-symbols-outlined"
    );
    editIcon.textContent = "edit";

    editIcon.addEventListener("click", () => {
      const editDepartament = document.querySelector(".edit-department");//modal
      const newEdit = document.querySelector(".edit-department__input");//input texto
      const newEditCloSE = document.querySelector(".edit-department__close");//X
      newEdit.placeholder = element.description;
      editDepartament.showModal();
      const btnConfirmEdit = document.querySelector('.edit-department__button')
      btnConfirmEdit.id = element.id
      newEditCloSE.addEventListener("click", () => {
        editDepartament.close();
      });
      editDepartmentSave(element);
    });

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add(
      "list__departments-icon",
      "list__departments-icon--delete",
      "material-symbols-outlined"
    );
    deleteIcon.textContent = "delete";
    deleteIcon.addEventListener("click", () => {
      deletDepartment(element);
    });

    departmentActions.appendChild(visibilityIcon);
    departmentActions.appendChild(editIcon);
    departmentActions.appendChild(deleteIcon);
    departmentItem.appendChild(departmentInfo);
    departmentItem.appendChild(departmentActions);
    departmentsList.appendChild(departmentItem);
  });
}

async function hireEmployee(idEmploy, idDepartament,element) {
  const url = `http://localhost:3333/employees/hireEmployee/${idEmploy}`;
  const data = {
    department_id: idDepartament,
  };
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      toast(data.message, green);
      requestOutWork()
      renderEmployedDepartament(element)
      verifyUserContrated()
    })
    .catch((error) => console.error(error));
}

async function renderEmployedDepartament(departament) {
  const url = `http://localhost:3333/employees/readAll`;
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      renderEmployedDepartamentFilter(data, departament);
    })
    .catch((error) => console.error(error));

  function renderEmployedDepartamentFilter(users, departament) {
    let arrEmployInCompany = [];
    users.forEach((element) => {
      if (element.department_id == departament.id) {
        arrEmployInCompany.push(element);
      }
    });
    renderEmployesInCompany(arrEmployInCompany);
  }
}

function renderInfoModalView(element) {
  const title = document.querySelector(".department__title");
  const description = document.querySelector(".department__description");
  const company = document.querySelector(".department__company");

  title.innerHTML = element.name;
  description.innerHTML = element.description;
  storageCompanies.forEach((elementz) => {
    if (elementz.id == element.company_id) {
      company.innerHTML = elementz.name;
    }
  });
}

function renderEmployesInCompany(arr) {
  const departmentList = document.querySelector(".department__list");
  departmentList.innerHTML = "";
  arr.forEach((element) => {
    const newListItem = document.createElement("li");
    newListItem.classList.add("department__list-item");

    const newUsername = document.createElement("h1");
    newUsername.classList.add("department__username");
    newUsername.textContent = element.name;

    const newCompanyName = document.createElement("h2");
    newCompanyName.classList.add("department__company-name");
    storageCompanies.forEach((elementz) => {
      if (element.company_id == elementz.id) {
        newCompanyName.textContent = elementz.name;
      }
    });

    const newButtonDismiss = document.createElement("input");
    newButtonDismiss.classList.add("department__button--off");
    newButtonDismiss.id = element.id;
    newButtonDismiss.setAttribute("type", "button");
    newButtonDismiss.setAttribute("value", "Desligar");
    newButtonDismiss.addEventListener("click", (event) => {
      dismissEmployee(event.target, element,arr);
    });

    newListItem.appendChild(newUsername);
    newListItem.appendChild(newCompanyName);
    newListItem.appendChild(newButtonDismiss);

    departmentList.appendChild(newListItem);
  });
}

async function dismissEmployee(txt, element,arr) {
  const realyRemoved = document.querySelector(".remove-user");
  const removedName = document.querySelector("#nameDismiss");
  const dismisEmployeBtn = document.querySelector("#dismissEmployee");
  const closeModalEmploy = document.querySelector(".remove-employee-close");
  realyRemoved.showModal();
  removedName.innerHTML = element.name;

  dismisEmployeBtn.addEventListener("click", async () => {
    const url = `http://localhost:3333/employees/dismissEmployee/${txt.id}`;
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenUser}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        realyRemoved.close()
        requestOutWork()
      renderEmployedDepartament(departmentOpenCompany)
      verifyUserContrated()
      })
      .catch((error) => console.error(error));
  });
  closeModalEmploy.addEventListener("click", () => {
    realyRemoved.close();
  });
}

async function editDepartmentSave(element) {
  const btnConfirmEdit = document.querySelector('.edit-department__button')
  btnConfirmEdit.addEventListener('click',async ()=>{
    const newEdit = document.querySelector(".edit-department__input").value;
        if(newEdit.length == 0){
          toast('Insira uma descrição' ,red)
        }
        else{
          const url = `http://localhost:3333/departments/update/${element.id}`;
  const data = {
    "description": `${newEdit}`,
    "name": `${element.name}`
  }

  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      toast(data.message,green)
      const editDepartament = document.querySelector(".edit-department");
      editDepartament.close()
      location.reload()
    })
    .catch((error) => console.error(error));
        }
  })
  
}

async function deletDepartment(element) {
  console.log(element);
  const removeDepartmentModal = document.querySelector(".remove-department");

  removeDepartmentModal.addEventListener('click',()=>{
      removeDepartmentModal.close()
  })

  const removeAproved = document.querySelector(".remove-department__button");
  const removedCompanieName = document.querySelector(
    ".remove-department__name"
  );
  removedCompanieName.innerHTML = element.name;

  removeAproved.addEventListener("click", async () => {
    const url = `http://localhost:3333/departments/delete/${element.id}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenUser}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast(data.message,green)
        renderAllDepartaments()
        verifyUserContrated()
      })
      .catch((error) => console.error(error));
  });

  removeDepartmentModal.showModal();
}

async function verifyUserContrated(){
  let arrUserContrateds = []
  const url = `http://localhost:3333/employees/readAll`;
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(element => {
      arrUserContrateds.push(element)
      });
      
    })
    .catch((error) => console.error(error));
  renderUserCadastred(arrUserContrateds)
}
verifyUserContrated()
function renderUserCadastred(arr) {
  const usersList = document.querySelector(".users__list");
  usersList.innerHTML = ''
  arr.forEach((element) => {
    

    const listItem = document.createElement("li");
    listItem.classList.add("users__list-item");

    const userInfo = document.createElement("div");
    userInfo.classList.add("users__info");

    const username = document.createElement("h1");
    username.classList.add("users__username");
    username.textContent = element.name;

    const companyName = document.createElement("h3");
    companyName.classList.add("users__company-name");

    storageCompanies.forEach((companie) => {
      if(element.company_id == null || element.department_id == null){
        companyName.textContent = "Usuario Desempregado"
      }else if (companie.id == element.company_id) {
        companyName.textContent = companie.name;
      }
      
      
    });

    userInfo.appendChild(username);
    userInfo.appendChild(companyName);

    const userActions = document.createElement("aside");
    userActions.classList.add("users__actions");

    const editIcon = document.createElement("span");
    editIcon.classList.add(
      "list__departments-icon--edit",
      "material-symbols-outlined"
    );
    editIcon.textContent = "edit";
    editIcon.addEventListener("click", () => {
      const editUserModal = document.querySelector(".edit-user");
      const editUserBtnSave = document.querySelector(".edit-user__button");
      const modalEditClose = document.querySelector(".edit-user__close-button");

      modalEditClose.addEventListener("click", () => {
        editUserModal.close();
      });
      editUserModal.showModal();
      editUserBtnSave.addEventListener("click", () => {
        const editUserName = document.querySelector(
          ".edit-user__input--name"
        ).value;
        const editUserEmail = document.querySelector(
          ".edit-user__input--email"
        ).value;

        editUserSave(editUserName, editUserEmail, element.id);
      });
    });

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add(
      "list__departments-icon--delete",
      "material-symbols-outlined"
    );
    deleteIcon.textContent = "delete";
    deleteIcon.addEventListener("click", () => {
      const modalRealyDelete = document.querySelector("#removedUserRealy");
      const modalClose = document.querySelector(".remove-employee-close");
      const nameModalDelete = document.querySelector("#nameDismiss");
      const aprovedDelet = document.querySelector("#dismissEmployee");

      modalClose.addEventListener("click", () => {
        modalRealyDelete.close();
      });
      modalRealyDelete.showModal();
      nameModalDelete.innerHTML = element.name;
      aprovedDelet.addEventListener("click", async () => {
        const url = `http://localhost:3333/employees/deleteEmployee/${element.id}`;
        await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUser}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            toast(data.message,green)
            verifyUserContrated()
            modalRealyDelete.close();
          })
          .catch((error) => console.error(error));
      });
    });

    userActions.appendChild(editIcon);
    userActions.appendChild(deleteIcon);

    listItem.appendChild(userInfo);
    listItem.appendChild(userActions);

    usersList.appendChild(listItem);
  });
}

async function editUserSave(name, email, employe) {
  const editUserModal = document.querySelector(".edit-user");
  const url = `http://localhost:3333/employees/updateEmployee/${employe}`;
  const data = {
    name: name,
    email: email,
  };
  console.log(data);
  console.log(employe);
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.message == undefined){
        toast("Usuario alterado",green)
        verifyUserContrated()
        editUserModal.close()
      }else {
        toast(data.message, red)
      }
      
    })
    .catch((error) => console.error(error));
}

function toast(txt, color) {
  // Referência(função de toast): Demo do bertoldo
  const toastContainer = document.querySelector(".toast__container");
  const toastParagraph = document.querySelector(".toast__container > p");

  toastParagraph.innerText = txt;

  toastContainer.style = `background-color: ${color}; border-color: ${color}`;

  toastContainer.classList.remove("hidden");

  setTimeout(() => {
    toastContainer.classList.add("toast__fadeOut");
  }, 3000);

  setTimeout(() => {
    toastContainer.classList.remove("toast__fadeOut");
    toastContainer.classList.add("hidden");
  }, 3990);
}

async function requestOutWork(){
  const url = `http://localhost:3333/employees/outOfWork`;
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUser}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          renderSelectOutWork(data);
        })
        .catch((error) => console.error(error));

}

function renderSelectOutWork(arr) {
    const select = document.querySelector(".department__select");
    const newEmployerBtn = document.querySelector("#addNewEmployeer");

    let outWorkSelected;
    const newOptionz = document.createElement("option");

    select.innerHTML = "";
    newOptionz.innerHTML = "Selecione um usuario!";
    newOptionz.value = "teste";
    select.appendChild(newOptionz);

    arr.forEach((element) => {
      const newOption = document.createElement("option");

      newOption.value = element.id;
      newOption.innerHTML = element.name;
      select.appendChild(newOption);
    }); //renderiza options dee desempregados
    select.addEventListener("change", () => {
      outWorkSelected = select.value;
    });
  
  }