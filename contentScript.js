let mobilenumber = window.localStorage.getItem("mobile");
let state_name = window.localStorage.getItem("state");
let district_name = window.localStorage.getItem("district");
let first_5_pin_digits = "";
let allow_multiple = window.localStorage.getItem("allow_multiple")==="true"?true:false;
console.log(typeof(allow_multiple));

var waitForEl = function(selector, callback) {
  if ($(selector).length) {
    callback();
    
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

var waitForElAgain = function(selector, callback) {
  if ($(selector).length) {
    callback();
    waitForElAgain(selector, callback);
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

const repFun = () => {
  waitForEl("[formcontrolname=mobile_number]", function() {
    $("[formcontrolname=mobile_number]").val(mobilenumber);
    $("[formcontrolname=mobile_number]").on('input', (e) => {
      if(e.target.value.length===10){
        $('.login-btn').trigger('click');
      }
    })
  });
  
  waitForEl("[formcontrolname=otp]", function() {
    $("[formcontrolname=otp]").on('input', (e) => {
      if(e.target.value.length===6){
        $('.vac-btn').trigger('click');
      }
    })
  });
  
  waitForEl(".register-btn", () => {
    if(!!!allow_multiple) $('.register-btn').trigger('click');
  })

  waitForEl("[formcontrolname=searchType]", function() {
    setTimeout(()=>$("[formcontrolname=searchType]").trigger('click'), 500);
    $("[formcontrolname=pincode]").on('input', (e) => {
      if(e.target.value.length===6){
        $('.pin-search-btn').trigger('click');
      }
    })
    
    $("[formcontrolname=searchType]").on('change', () => {
      let searchByDistrict = $("[formcontrolname=searchType]")[0].checked;
      if(searchByDistrict){
        $("[formcontrolname=state_id]").trigger('click');
        $(`span:contains(${state_name})`).trigger('click');
        setTimeout(()=>{
          $("[formcontrolname=district_id]").trigger('click');
          $(`span:contains(${district_name})`).trigger('click');
          setTimeout(()=>{
            $('.pin-search-btn').trigger('click');
          }, 500);
          setTimeout(()=>{
            $("label:contains(Age 18+)").trigger('click');
          }, 500);
        }, 500);
      } else {
        $("[formcontrolname=pincode]").val(first_5_pin_digits);
        $("[formcontrolname=pincode]").on('input', (e) => {
          if(e.target.value.length===6){
            $('.pin-search-btn').trigger('click');
            setTimeout(()=>{
              $("label:contains(Age 18+)").trigger('click');
            }, 500);
          }
        })
      
      }
  
    })
  })

}

$(window).on("load", () => {
  console.log("loaded");
  repFun();
});

let focus_ids = ["[formcontrolname=otp]", "[formcontrolname=mobile_number]", "[formcontrolname=pincode]"];

if (window.location.hash) {
  $(window).trigger('hashchange')
}
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const get_mins = (tm) => {
  let mins = Math.floor(tm/60);
  let secs = Math.floor(tm - mins * 60);
  return `${mins}:${secs}`
}

const expirationUpdate = () => {
  let token = window.sessionStorage["userToken"];
  if(token===undefined){
    return;
  }
  let parsed = parseJwt(token);
  if(!!!parsed){
    return;
  }
  let exp = parsed.exp;
  let curr = new Date();
  let expd = new Date(0);
  expd.setUTCSeconds(exp);
  document.title = get_mins((expd - curr)/1000);
}

setInterval(expirationUpdate, 5000);


var current_href = location.href;
setInterval(function(){
    if(current_href !== location.href){
        repFun();
        current_href = location.href;
    }else{
    }
},100);


const keep_focusing = () => {

  setInterval(()=>{
    focus_ids.forEach(element => {
      
      if($("#formWrapper").is(":hidden")) if($(element).length!==0) $(element).focus();
    });
    
  }, 1000);  
}


keep_focusing();

const createForm = () => {
  let wrapperDiv = document.createElement("div");
  let mobileInput = document.createElement("input");
  let mobileLabel = document.createTextNode("Mobile number (first 9 digits): ");
  let stateInput = document.createElement("input");
  let stateLabel = document.createTextNode("Name of the state: ");
  let districInput = document.createElement("input");
  let districLabel = document.createTextNode("District name: ");

  let allowMultipleInput = document.createElement("input");
  allowMultipleInput.type = "checkbox";
  allowMultipleInput.id = "allowMultiple";
  let allowMultipleInputLabel = document.createTextNode("Allow multiple members");
  let allowMultipleWarn = document.createElement('p');
  let mobileNumberWarn = document.createElement('p');
  mobileNumberWarn.appendChild(document.createTextNode("You will have to enter the 10th digit in the input box to proceed with automation."));
  allowMultipleWarn.appendChild(document.createTextNode("This will prevent automatic click on the Schedule Now button"));
  allowMultipleWarn.style = "color: red;"
  mobileNumberWarn.style = "color: red;"

  wrapperDiv.id = "formWrapper";
  mobileInput.id = "data-mob";
  stateInput.id = "data-state";
  stateInput.value = state_name;
  districInput.id = "data-district";
  districInput.value = district_name;
  mobileInput.type = "number";
  mobileInput.value = mobilenumber;
  allowMultipleInput.checked = allow_multiple;

  let submitButton = document.createElement("button");
  submitButton.id = "data-submit";
  submitButton.appendChild(document.createTextNode("Save inputs"));
  
  wrapperDiv.style = "position: fixed; background: white; top: 12.5%; width: 75%; height: 75%; left: 12.5%; border: 3px solid #73AD21;"

  wrapperDiv.appendChild(mobileLabel);
  wrapperDiv.appendChild(mobileInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(mobileNumberWarn);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));

  wrapperDiv.appendChild(stateLabel);
  wrapperDiv.appendChild(stateInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));

  wrapperDiv.appendChild(districLabel);
  wrapperDiv.appendChild(districInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(allowMultipleInputLabel);
  wrapperDiv.appendChild(allowMultipleInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(allowMultipleWarn);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(submitButton);


  document.body.appendChild(wrapperDiv);
}

const createHideShowButton = () => {
  $("#formWrapper").hide();
  let formShowHide = document.createElement("button");
  formShowHide.id = "formshowhidebutton";
  formShowHide.appendChild(document.createTextNode("click to edit the autofill inputs"));
  formShowHide.style = "background: red; position: sticky; top:0; left: 35%";
  document.body.appendChild(formShowHide);
  $('#formshowhidebutton').on('click', ()=>{
    $("#formWrapper").toggle();
  })
}

const bindSubmitButtonToSaveInfo = () => {
  let submitbtn = document.getElementById("data-submit");
  submitbtn.addEventListener("click", () => {
    mobilenumber = document.getElementById("data-mob").value;
    state_name = document.getElementById("data-state").value;
    district_name = document.getElementById("data-district").value;
    allow_multiple = document.getElementById("allowMultiple").checked;

    console.log(allow_multiple);
    $("#formWrapper").hide();
    window.localStorage.setItem("mobile", mobilenumber);
    window.localStorage.setItem("state", state_name);
    window.localStorage.setItem("district", district_name);
    window.localStorage.setItem("allow_multiple", allow_multiple);
    window.location.reload();
  })
}

const createFormAndOthers = () => {
  createForm();
  createHideShowButton();
  bindSubmitButtonToSaveInfo();
}

createFormAndOthers();
