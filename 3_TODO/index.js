let allFilters = document.querySelectorAll(".filter");
let openModal = document.querySelector(".open-modal");
let closeModal = document.querySelector(".close-modal");
let allFilterClasses = ["red", "blue", "green", "yellow", "black"];
let ticketsContainer = document.querySelector(".tickets-container");
let myDB = window.localStorage;

let ticketModalOpen = false;
let isTextTyped = false;

let doingEdit=false;

openModal.addEventListener("click", openTicketModal); //step1
closeModal.addEventListener("click", closeTicketModal);

//step 1
function openTicketModal(e) {
  // console.log(e);
  if (ticketModalOpen  || doingEdit) {
    return;
  }

  let ticketModal = document.createElement("div");
  ticketModal.classList.add("ticket-modal");
  ticketModal.innerHTML = `
    
        <div class="ticket-text" contenteditable="true" spellcheck="false" >Enter your text
        </div>
    
        <div class="ticket-filters">
            <div class="ticket-filter2 red selected-filter"></div>
            <div class="ticket-filter2 blue"></div>
            <div class="ticket-filter2 green"></div>
            <div class="ticket-filter2 yellow"></div>
            <div class="ticket-filter2 black"></div>
        </div>
    `;
  document.querySelector("body").append(ticketModal);
  ticketModalOpen = true;
  isTextTyped = false;
  let tickettextDiv = ticketModal.querySelector(".ticket-text");

  tickettextDiv.addEventListener("keypress", handleKeyPress);

  let ticketFilters = ticketModal.querySelectorAll(".ticket-filter2");

  for (let i = 0; i < ticketFilters.length; i++) {
    ticketFilters[i].addEventListener("click", function (e) {
      if (e.target.classList.contains("selected-filter")) {
        return;
      }
      document
        .querySelector(".selected-filter")
        .classList.remove("selected-filter");
      e.target.classList.add("selected-filter");
    });
  }
}

//step2

function handleKeyPress(e) {
  if (e.key == "Enter" && isTextTyped && e.target.textContent) {
    let filterSelected =
      document.querySelector(".selected-filter").classList[1];
    let ticketId = uuid();
    let ticketInfoObject = {
      ticketFilter: filterSelected,
      ticketValue: e.target.textContent,
      ticketId: ticketId,
    };
    appendTicket(ticketInfoObject);
    closeModal.click();
    saveTicketToDb(ticketInfoObject);
  }
  if (!isTextTyped) {
    isTextTyped = true;
    e.target.textContent = "";
  }
}

//step3
function appendTicket(ticketInfoObject) {
  let { ticketFilter, ticketValue, ticketId } = ticketInfoObject;
  console.log(ticketFilter);
  let ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticket");
  ticketDiv.innerHTML = `
         <div class="ticket-header ${ticketFilter}"></div>
            <div class="ticket-content">
                <div class="ticket-info">
                    <div class="ticket-id">${ticketId}</div>
                    
          <div class="rewrite">  <i class="fa-regular fa-pen-to-square"></i> </div>    
                    <div class="ticket-delete"><i class="fa-solid fa-trash"></i></div>
                </div>
                
                <div class="ticket-value">
                        ${ticketValue}
                </div>
            </div>
    `;

  console.log(ticketDiv);
  let ticketHeader = ticketDiv.querySelector(".ticket-header");

  ticketHeader.addEventListener("click", function (e) {
    let currentFilter = e.target.classList[1]; // yellow
    let indexOfCurrFilter = allFilterClasses.indexOf(currentFilter); // 3
    let newIndex = (indexOfCurrFilter + 1) % allFilterClasses.length;
    let newFilter = allFilterClasses[newIndex];
    console.log({ currentFilter, newFilter });
    console.log(ticketHeader);
    //ticketHeader.style.backgroundColor = newFilter;
    ticketHeader.classList.remove(currentFilter);
    ticketHeader.classList.add(newFilter);
    ticketInfoObject.ticketFilter=newFilter;
    let allTickets = JSON.parse(myDB.getItem("allTickets"));

    for (let i = 0; i < allTickets.length; i++) {
      if (allTickets[i].ticketId == ticketId) {
        allTickets[i].ticketFilter = newFilter;
      }
    }

    myDB.setItem("allTickets", JSON.stringify(allTickets));
  });

  let deleteTicketBtn = ticketDiv.querySelector(".ticket-delete");

  deleteTicketBtn.addEventListener("click", function (e) {
    ticketDiv.remove();
    let allTickets = JSON.parse(myDB.getItem("allTickets"));

    let updatedTicket = allTickets.filter(function (ticketObject) {
      if (ticketObject.ticketId == ticketId) {
        return false;
      }
      return true;
    });

    myDB.setItem("allTickets", JSON.stringify(updatedTicket));
  });

  ticketsContainer.append(ticketDiv);

  let Rewrite = ticketDiv.querySelector(".rewrite");/////////////////////////////////////// //////////////////
   

  Rewrite.addEventListener("click", function(e){
       ticketDiv.remove();
       let allTickets = JSON.parse(myDB.getItem("allTickets"));

       let updatedTicket = allTickets.filter(function (ticketObject) {
         if (ticketObject.ticketId == ticketId) {
           return false;
         }
         return true;
       });

       myDB.setItem("allTickets", JSON.stringify(updatedTicket));
       reOpenModalHelp(e, ticketInfoObject);
  });///////////////////////////////////////////
}

//step4
function saveTicketToDb(ticketInfoObject) {
  let allTickets = myDB.getItem("allTickets");
  if (allTickets) {
    allTickets = JSON.parse(allTickets);
    allTickets.push(ticketInfoObject);
    myDB.setItem("allTickets", JSON.stringify(allTickets));
  } else {
    let allTickets = [ticketInfoObject];
    myDB.setItem("allTickets", JSON.stringify(allTickets));
  }
}

//step5
function closeTicketModal(e) {
  if (ticketModalOpen) {
    document.querySelector(".ticket-modal").remove();
    ticketModalOpen = false;
  }
}

//step6

loadTickets();

function loadTickets() {
  let allTickets = localStorage.getItem("allTickets");
  if (allTickets) {
    allTickets = JSON.parse(allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      let ticketobj = allTickets[i];
      appendTicket(ticketobj);
    }
  }
}

//step 7

function loadSelectedTickets(filter) {
  let allTickets = myDB.getItem("allTickets");
  if (allTickets) {
    allTickets = JSON.parse(allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      let ticketobj = allTickets[i];
      if (ticketobj.ticketFilter == filter) {
        appendTicket(ticketobj);
      }
    }
  }
}

//step 8

function selectFilter(e) {
  // console.log(e);
  if (e.target.classList.contains("active-filter")) {
    e.target.classList.remove("active-filter");
    ticketsContainer.innerHTML = "";
    loadTickets();
  } else {
    if (document.querySelector(".active-filter")) {
      document
        .querySelector(".active-filter")
        .classList.remove("active-filter");
    }
    e.target.classList.add("active-filter");
    ticketsContainer.innerHTML = "";
    let filterClicked = e.target.classList[1];
    loadSelectedTickets(filterClicked);
  }
}

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", selectFilter);
}











///................task 5 started  ..............

let Rewrite = ticketDiv.querySelector(".rewrite");

 Rewrite.addEventListener("click", reOpenModal);



function reOpenModalHelp(e,ticketInfoObject) {
  if (ticketModalOpen || doingEdit) {
    return;
  }
  doingEdit=true;
 ticketModalOpen=true;
   newticobj=ticketInfoObject;
     let ticketModal = document.createElement("div");
     ticketModal.classList.add("ticket-modal");
     ticketModal.innerHTML = `
    
        <div class="ticket-text" contenteditable="true" spellcheck="false" >${ticketInfoObject.ticketValue}
        </div>
    
        <div class="ticket-filters">
            <div class="ticket-filter2 red selected-filter"></div>
            <div class="ticket-filter2 blue"></div>
            <div class="ticket-filter2 green"></div>
            <div class="ticket-filter2 yellow"></div>
            <div class="ticket-filter2 black"></div>
        </div>
    `;
     document.querySelector("body").append(ticketModal);
     
 document.querySelector(".selected-filter").classList.remove("selected-filter");
         let allFilters=ticketModal.querySelectorAll(".ticket-filter2");
         //console.log(allFilters[0].classList[1]);
         for(let i=0; i< allFilters.length; i++){
             if(allFilters[i].classList[1]==ticketInfoObject.ticketFilter){
               allFilters[i].classList.add("selected-filter");
             }
         }
      let tickettextDiv = ticketModal.querySelector(".ticket-text");
      
      
      
      let ticketFilters = ticketModal.querySelectorAll(".ticket-filter2");
      
      for (let i = 0; i < ticketFilters.length; i++) {
        ticketFilters[i].addEventListener("click", function (e) {
          if (e.target.classList.contains("selected-filter")) {
            return;
          }
          document
          .querySelector(".selected-filter")
          .classList.remove("selected-filter");
          e.target.classList.add("selected-filter");
        });
      }
      
      tickettextDiv.addEventListener("keypress", function(e){
         handleKeyPress2(e,ticketInfoObject);
      });
     doingEdit=false;
}

function handleKeyPress2(e, ticketInfoObject){
  if (e.key == "Enter" && isTextTyped && e.target.textContent) {
    console.log(e.target.textContent);
    console.log(isTextTyped);
   let filterSelected =
      document.querySelector(".selected-filter").classList[1];
  
    let NewticketInfoObject = {
      ticketFilter: filterSelected,
      ticketValue: e.target.textContent,
      ticketId: ticketInfoObject.ticketId,
    };
    appendTicket(NewticketInfoObject);
      closeModal.click();
      saveTicketToDb(NewticketInfoObject);
  }
    if (!isTextTyped) {
      isTextTyped = true;
   
    }
}