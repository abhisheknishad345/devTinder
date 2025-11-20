
/* ======= This keyword ======= */
// "use strict";

function myFunction() {

  return this;
}

const person = {
  firstName: "John",
  lastName : "Doe",
  id       : 5566,
  fullName : function() {
    // return this.firstName + " " + this.lastName +" "+ this.id;
    return this;
  }
};

document.getElementById("demo").innerHTML = person.fullName();
