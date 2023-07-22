
const partNumbers = [1, 2, 3,4];
let currentPartIndex = 1;
const formParts = document.querySelectorAll('.form-part');

function showPart(partNumber) {
  for (let i = 0; i < formParts.length; i++) {
    formParts[i].classList.add('dnon');
  }
  document.querySelector(`#part${partNumber}`).classList.remove('dnon');
  currentPartIndex = partNumbers.indexOf(partNumber);
}

function nextPart() {
  if (currentPartIndex < partNumbers.length - 1) {
    showPart(partNumbers[currentPartIndex + 1]);
  }
}

function prevPart() {
  if (currentPartIndex > 0) {
    showPart(partNumbers[currentPartIndex - 1]);
  }
}

function submitForm() {
  // جمع آوری اطلاعات ورودی و ارسال به سرور
}

showPart(partNumbers[currentPartIndex]);


const form = document.querySelector('form');


form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent HTML refresh
  // Handle form with JavaScript here
  if (currentPartIndex === partNumbers.length - 1){
  const formData = new FormData(form);
  const data = {};
  console.log(data);

  for (const [name, value] of formData.entries()) {
    data[name] = value;
  } // Array of arrays to object
}
});