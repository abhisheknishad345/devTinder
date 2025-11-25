
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

// document.getElementById("demo").innerHTML = person.fullName();

let arr = ["2","1","+","3","*"]
console.log(arr);
console.log(arr.length);
console.log(arr[4]);

let a= 10, b=4;
console.log(Math.trunc(b/a));

console.log(Function("return 2 * 10 + 3")());
let mid = 5
console.log(mid+mid);






