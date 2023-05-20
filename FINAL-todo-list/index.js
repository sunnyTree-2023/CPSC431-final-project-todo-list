// Porject name: CPSC 431 Final Project - ToDo List 
// File name:  index.js
// Date : May 19 2023
// Author: Jiu Lin 

import { WebApp, Component, EventManager } from './modules/app.js';

// Required to initialize our web app
const app = new WebApp();

// Example of creating a new component with dummy data
// And rendering it to the page
const main = app.component({
    name: "Main",
    selector: "#DemoArea",
    template: "#FooBar",
    data: {
        title: "CPSC431 Final Demo Page",
        buttons: [
            { msg: "Hello", displayText: "Say Hi" },
            { msg: "Goodbye my firend", displayText: "Say Bye" }
        ]
    }
});

main.render("replace");


//fetchApiDemo
// Example of rendering a component with an async click event
app.events.click("fetchApiDemo", async (e) => {
    let fakeData = await app.GET("api/test.php");

    let comp = app.component({
        name: "ApiDemoComp",
        selector: "#ApiArea",
        template: "#ApiTemplate", 
        data: fakeData
    });

    comp.render();

    let src = e.target;
    src.dataset.click = "toggleFetch"; 
});

app.events.click("toggleFetch", (e)=>{

    let target = document.querySelector("#fetchButtonTemplate");

    target.classList.toggle("hidden");

});


//Example of using a template that has to be downloaded first
//**Dynamically download the template */
(async () => {

    let dynamicTemplate = await app.GET("templates/demo.html", "text");

    let dynamicData = {
        title: "Dynamic Template and Content $$$$$",
        message: "This is all very dynamic! $$$$$"
    };

    let options = {
        name: "DynamicDemo",
        selector: "#DynamicArea",
        template: dynamicTemplate,
        data: dynamicData
    };

    let comp = app.component(options);

    comp.render();

})(); // Self-Executing function as we can use async/await more easily. 




// Helper function to refresh the page
// And get information from DB again by calling the GET function again 
// refresh/render the page again 
function refreshPage(){
    (async () => {

        // JS object get back from PHP code 
        let dataFromDb = await app.GET("api/test.php");
    
        let comp = app.component({
            name: "GetDataFromDB",  //DB return something  [ {"name":"bob", "created" : "2022-02-02"} , {"name":"bob", "created" : "2022-02-02"}]
            selector: "#get_data",
            template: "#getDataTemplate", 
            data: dataFromDb
        });
        comp.render();
    })();
}


//#1
// Using GET method, get all lists to display on cnosole
(async () => {

    //get data from DB, turn in javascript object
    let data = await app.GET("api/test.php");

    console.log(data);
})();

//**************************************  GET LIST Tempalte  ******************************** */  GOOD
//#1 
// Click a button with id = "getData"  
// and use GET method, compnents class and render()
// to get all lists to display on webpage
app.events.click("getData", async () => {

    // JS object get back from PHP code 
    let dataFromDb = await app.GET("api/test.php");

    //dataFromDb.parse();

    let comp = app.component({
        name: "GetDataFromDB",  //DB return something  [ {"name":"bob", "created" : "2022-02-02"} , {"name":"bob", "created" : "2022-02-02"}]
        selector: "#get_data",
        template: "#getDataTemplate", 
        data: dataFromDb
    });

    comp.render();
});


//*#1**************   downlaodList Button Not Work // for GET LIST GET ITEMS *****************************/ GOOD
//************** downlaodList Button Not Work ! **************  downlaodList not work  ***** GET ITEMS
// Download list from the list button 
// click the buttons with id = "downlaodList"
// items in the list will be poped up 
app.events.click("downlaodList", async (e) => {

    let src = e.target;
    let idx = src.dataset.idx ?? 0 ;

    if (idx < 1 ) return false;

    //let items = await app.GET(`api/items?list_idx=${idx}`);
    // this function can work is because of test.php file 

    //let items = await app.GET(`api/test.php?idx=${idx}`);   // list_idx is the attribute in the items table 
    let items = await app.GET(`api/items.php?anyListIdxNameHereInUrlForListButton=${idx}`); 

    console.log(items);

    // We got the whole <ul> by "list_idx", idx is different depends on the button click 
    let list = document.querySelector(`#list_${idx}`);
    console.log(list);

    list.classList.remove("hidden");

    items.forEach((item, index)=> {
        // for each items we fetch back from the DB, we using <li> to display it agian and again 
        // display text and adding delete button to each text 
        let listItemTemplate = `
        <li>
            <form id="${item.list_idx}"  data-itemCheckedFormId = "${item.idx}" > 

                <input type="checkbox" name="checked" data-click="checkItem" data-checkitemidx = "${item.idx}">  
                ${item.text}

                <input type="hidden" name="checkitemidx" value="${item.idx}">

                <input type="text" name="text" value = "New Item Name "  placeholder="text value" >

                <button type="button"  name = "newItemName" data-click="putItem" data-checkitemidx = "${item.idx}"> changeItemName </button>  
                
                <button type='button' data-deleteitemidx="${item.idx}" data-click='deleteOneItem' >  Delete index ${item.idx} </button>
        
            </form> 
        </li>`;

        // Appending each item to the button with id = "toggleList",
        // "beforeend" to display the <li>
       // const myDiv = document.getElementById (`#list_${idx}`);
        list.insertAdjacentHTML ("beforeend",  listItemTemplate );
    } );
    // what this for ?  to clean GET error ? 
    // what this attributes for ? 

        src.dataset.click = "toggleList"; 
});

// click the button agian , so the list close 
app.events.click("toggleList", (e)=>{
    let idx = e.target.dataset.idx ?? 0;

    if (idx < 2 ) return false; 

    let selector = `#list_${idx}` ;

    let target = document.querySelector(selector);

    target.classList.toggle("hidden");

});



//**#2***********************  POST/CREATE A NEW LIST Modal Windown  **************************  GOOD MODEL WINDOW
app.events.click("addList", async (e) => {

    // JS object get back from PHP code 
    let src = e.target;

    let formId = "AddListForm";

    let comp = app.component({
        name: "AddListComponet",  
        selector: "body",
        template: "#AddListInterface", 
        data: {}
    });

    document.addEventListener(formId, (e)=> {

        let entries = e.detail; 

        closeModal(); 

    }), ({once: true});

    comp.render("add", "beforeend");
});

// close modal window button 
const closeModal = () => {
    document.querySelector(".modal").remove();

};

app.events.click ("closeModal", ()=>{
    //  alert("!"); 
    closeModal();
});

// submit button 
app.events.click("submit", async (e) => {
    
    e.preventDefault();

    let formId = e.target.idx ?? "noid" ;  // e.target is the from itself

    let formData = new FormData(e.target); // turn from data to nice JS object 

    let entries = Object.fromEntries(formData.entries());

    let submitted = new CustomEvent(formId, {detail: entries}); // detail is optional , we have lisener of this form 

    document.dispatchEvent(submitted);
});


//*#2 **************************************  POST/CREATE A NEW LIST   ******************************** List POST GOOD 
app.events.click("postList", async () => {

    // get form id , and return js object 
    let listFormData = getFormData("postListForm");
   
    // using  POST(url, data, returnType) from app.js
    // POST method can send listFrom js object to database
    const listData = await app.POST("api/test.php", listFormData);
    console.log(listData); 
    //alert("You Add a New List, After Close the Window. Please click the `**  SHOW ALL LIST NAME ! **` Button to See Latest Lists ! ");

    // Get a reference to the parent element where you want to add the new p tag
    let modalTextParentElt = document.getElementById("modalText");
    
    // Create a new p element
    const newParagraph = document.createElement('p');

    // Get the input box 
    const inputElement = document.getElementById('input_list');

    // Set the text content of the p tag
    newParagraph.textContent = "You are a list: " + inputElement.value;

    // Append the p tag to the parent element
    modalTextParentElt.appendChild(newParagraph);
});

//************* Wrapping Data from Form into an JSON Object ***************
// Give this the "id" value of any HTML form and it will return
// a native JavaScript object with all the form inputs. 
function getFormData(formId) {
    const form = document.querySelector(`#${formId}`);

    const formData = new FormData(form);

    const entries = Object.fromEntries(formData.entries());

    return entries;
}


//*#3 *************************   UPDATE LIST NAME Modal Windown  **************************** GOOD
//Updata list name modal window
app.events.click("updateList", async (e) => {

    // JS object get back from PHP code 
    let src = e.target;

    let formId = "AddListForm";

    let comp = app.component({
        name: "updateListComponet",  
        selector: "body",
        template: "#updateListInterface", 
        data: {}
    });

    document.addEventListener(formId, (e)=> {

        let entries = e.detail; 

        closeModal(); 

    }), ({once: true});

    comp.render("add", "beforeend");
});



// UPDATE LIST NAME  FUNCTION 
app.events.click("changeListName", async () => {

    // alert("update a list name");

    //make an JS object to pass key-value pair to PHP 
    const newListForm = document.getElementById("updateListForm");

    // const src = e.target;
    // const itemForm = src.form;
    // if (idx < 1 ) return false;

    // Get data form a new form 
    const listFormData = new FormData(newListForm);

    // convert form data to a JS object 
    const listFormDataJSObj = Object.fromEntries(listFormData.entries());

    // Go back from the DB
    const listNewData = await app.PUT("api/test.php", listFormDataJSObj);

    console.log(listNewData);

    alert("You update the list name successfully! Click SHOW ALL LIST NAME button ot get the latest lists and items!   : ) ");
   
});


//*#4***************************************   DELETE LIST  ****************************** List DELETE data GOOD
app.events.click("deleteList", async (e) => {


    let src = e.target;

    // get delete button's idx, by dataset
    let idx_js_num = src.dataset.idxhtml;  
                      
    // using async DELETE(url, data, returnType), delete from app.js
    let listData = await app.DELETE(`api/test.php?idx=${idx_js_num}`);  

    if(listData.status == "ok"){
        alert("Deleted Successfully !");
    }

    //refresh the page
    refreshPage();
});

function askingWindow () {
        // Create a new div element
    const div = document.createElement('div');

    // Create a new text node with the desired text content
    const text = document.createTextNode('Hello, world!');

    // Append the text node to the div element
    div.appendChild(text);

    // Append the div element to the body of the HTML document
    document.body.appendChild(div);
}
   


//======================================  Item DELETE ============================== DELETE ITEM GOOD
// DELETE item
app.events.click("deleteOneItem", async (e) => {

    let src = e.target;

    // get delete button's idx, by dataset
    let idx_item_num_js = src.dataset.deleteitemidx;  
    //let idx_item_num_js = src.dataset.deleteOneItemIdx; YOU CAN NOT USE CAMEL CASE FOR THE VARIABLE NAME 
   
    // using async DELETE(url, data, returnType), delete from app.js
    let oneItem = await app.DELETE(`api/items.php?delete_one_Item_idx_url=${idx_item_num_js}`);  
    //alert("You successfully delete one item !");

    console.log(oneItem);
    // if(oneItem.status == "ok"){
    //     alert(" Successfully cancel one item !  Click SHOW ALL LIST NAME button ot get the latest lists and items! ");
    // }

    //refresh the page
    //refreshPage();
});



////======================================  Item POST  ================================= WORKING
// Item POST ======== working
// There are two ways to grabe form data #1 formData()    #2 JS predefined function  
app.events.click("postOneItem", async (e) => {

    // After user click the "Add Item " button 
    // Get the form element
    // Way2 of writting it
    let src = e.target;
    let idx = src.dataset.idx ?? 0 ;
    const itemForm = document.getElementById(`list_${idx}_add`);

    // const src = e.target;
    // const itemForm = src.form;

   // if (idx < 1 ) return false;

    const itemFormData = new FormData(itemForm);

    const itemPostData = Object.fromEntries(itemFormData.entries());

    const itemData = await app.POST("api/items.php", itemPostData);

    console.log(itemData);

    //alert("You add one new item to the item table.  Click SHOW ALL LIST NAME button ot get the latest lists and items!   : ) ");
});


//======================================  Item CHECKED  ================================ WORKING
app.events.click("checkItem", async (e) => {

    let src = e.target;
    const checkedItemFormId = src.form;

    // get delete button's idx, by dataset
    // let check_idx_item_js = src.dataset.checkitemidx;  
    // let checkedFormIdx = src.dataset.itemcheckedformid;
    //let idx_item_num_js = src.dataset.deleteOneItemIdx; YOU CAN NOT USE CAMEL CASE FOR THE VARIABLE NAME 

    //make an JS object to pass value
   // const itemForm = document.getElementById(checkedItemFormId);

    // const src = e.target;
    // const itemForm = src.form;

   // if (idx < 1 ) return false;

    const itemFormData = new FormData(checkedItemFormId);

    const itemPostData = Object.fromEntries(itemFormData.entries());

    const itemData = await app.PUT("api/items.php", itemPostData);

    console.log(itemData);

});


