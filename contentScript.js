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
    $("[formcontrolname=mobile_number]").val(phone_number_9_digits);
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
    $('.register-btn').trigger('click');
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
const keep_focusing = () => {
  setInterval(()=>{
    focus_ids.forEach(element => {
      if($(element).length!==0) $(element).focus();
    });
    
  }, 1000);  
}

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

keep_focusing();