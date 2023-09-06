// import { getFormData } from './generatedForm.html';
// تابع ایجاد سوال تک انتخابی
function createSingleChoiceQuestion(title, options) {
  let questionHTML = `
      <div class="form-part">
      <h2>${title}</h2>
  `;
  options.forEach((option, index) => {
      questionHTML += `
          <input type="radio" id="option${index}" name="answer" value="${option}">
          <label for="option${index}">${option}</label><br>
      `;
  });
  questionHTML += `
      </div>
  `;
  return questionHTML;
}

// تابع ایجاد سوال چند انتخابی
function createMultipleChoiceQuestion(title, options) {
  let questionHTML = `
      <div class="form-part">
      <h2>${title}</h2>
  `;
  options.forEach((option, index) => {
      questionHTML += `
          <input type="checkbox" id="option${index}" name="answer" value="${option}">
          <label for="option${index}">${option}</label><br>
      `;
  });
  questionHTML += `
          
      </div>
  `;
  return questionHTML;
}

// تابع ایجاد سوال تشریحی
function createEssayQuestion(title) {
  let questionHTML = `
      <div class="form-part">
      <h2>${title}</h2>
          <textarea id="answer" name="answer" rows="4" cols="50"></textarea>
      </div>
  `;
  return questionHTML;
}

// تابع ایجاد سوال دراپ داون
function createDropdownQuestion(title, options) {
  let questionHTML = `
      <div class="form-part">
      <h2>${title}</h2>
          <select id="options" name="answer">
  `;
  options.forEach((option, index) => {
      questionHTML += `
              <option value="${option}">${option}</option>
      `;
  });
  questionHTML += `
          </select>
      </div>
  `;
  return questionHTML;
}

// // // نمونه‌های سوالات
// // const question1 = createSingleChoiceQuestion("سوال تک انتخابی", ["گزینه 1", "گزینه 2", "گزینه 3"]);
// // const question2 = createMultipleChoiceQuestion("سوال چند انتخابی", ["گزینه 1", "گزینه 2", "گزینه 3"]);
// // const question3 = createEssayQuestion("سوال تشریحی");
// // const question4 = createDropdownQuestion("سوال انتخاب از لیست", ["گزینه 1", "گزینه 2", "گزینه 3"]);

// // // نمایش سوالات در صفحه
// // document.getElementById("questionContainer").innerHTML = question1 + question2 + question3 + question4;

// const questions = [ createSingleChoiceQuestion("شرح سوال تک انتخابی", ["گزینه 1", "گزینه 2", "گزینه 3"]),
 
//   createMultipleChoiceQuestion("شرح سوال چند انتخابی", ["گزینه 1", "گزینه 2", "گزینه 3"]),
//   createEssayQuestion("شرح سوال تشریحی"),
//   createDropdownQuestion("شرح سوال انتخاب از لیست", ["گزینه 1", "گزینه 2", "گزینه 3"]),
//   createSingleChoiceQuestion("شرح سوال تک انتخابی", ["گزینه 1", "گزینه 2", "گزینه 3"]),
 
// ];



// ذخیره تعداد صفحات
let numberOfPages = 0;
let pageIndex=null;

const form = document.getElementById('mainForm');
const questionsInputContainer = document.getElementById('questionsInputContainer');
const pagesData = [];
const submit=document.getElementById('submit');
let formDataCollection = [];
const nextButton = document.querySelector('#nextButton');
let optionCounter = 1;
let currentFormDataIndex;
let formValues = []; // برای ذخیره اطلاعات هرصفحه سوال
let selectedOptions=[];
let formResponses = ['a'];

// تابع افزودن فیلدهای متنی برای عنوان صفحات
function addPageTitles() {
  document.querySelector('.firstForm').classList.add('dnon');
  const numberOfPagesInput = document.getElementById('totalPages');
  const numberOfPages = parseInt(numberOfPagesInput.value, 10);

  if (!isNaN(numberOfPages) && numberOfPages > 0) {
    
      // ایجاد فیلدهای متنی برای عنوان صفحات
    for (let i = 1; i <= numberOfPages; i++) {
     // اضافه کردن صفحه به آرایه اطلاعات صفحات
      pagesData.push({
        pageTitle: `صفحه ${i}`,
        questions: []
      });
    }

 // نمایش صفحه اول
 showPage(0);
  }
}


// تابع نمایش صفحه موردنظر
function showPage(pageIndex) {
  if (pageIndex === null) 
    pageIndex = 0;
//pageIndex--; // اندیس را از 1 کاهش دهید تا از 0 شروع شود
  console.log(pageIndex);
  const pagesContainer = document.getElementById('pages'); 
  const questionsInputContainer=document.getElementById('questionsInputContainer')
  pagesContainer.innerHTML = ''; // پاک کردن صفحات قبل
  while (questionsInputContainer.firstChild) {
    questionsInputContainer.removeChild(questionsInputContainer.firstChild); // حذف اجزاء قبلی
  }
  //pagesContainer.innerHTML = ""; // پاک کردن صفحات قبل
  let pageData = pagesData[pageIndex]; 

//  const destroyfast=pagesContainer => {
//   const e1=document.getElementById('pages'); 
//   while (e1.firstChild) e1.removeChild(e1.firstChild);}

// ذخیره داده‌های صفحه جدید به عنوان داده‌های فعلی
currentPageData = pagesData[pageIndex];

  // ایجاد questionsInputContainer برای صفحه
  document.querySelector('.questionsForm').classList.remove('dnon');

  // دکمه بعدی
  if (pageIndex < pagesData.length - 1) {
    nextButton.onclick = () => {  
      // destroyfast(); 
      savePageDataToJson(pageIndex); 
      pageIndex++;
      showPage(pageIndex );};
    nextButton.style.display = 'block';
  } else {
    nextButton.style.display = 'none';
    //savePageDataToJson(pageIndex); 
    submit.style.display='block';
  }
  // مخفی کردن تمام فیلدهای عنوان صفحه
  const pageTitlesContainer = document.getElementById('pageTitles');
  const pageTitleFields = pageTitlesContainer.querySelectorAll('input[type="text"]');
  pageTitleFields.forEach(field => field.style.display = 'none');
  // مخفی کردن تمام لیبل‌های عنوان صفحه
  const pageTitleLabels = pageTitlesContainer.querySelectorAll('label');
  pageTitleLabels.forEach(label => label.style.display = 'none');
  
 
  // نمایش فیلد عنوان صفحه مربوط به این صفحه
  const pageTitleInput = document.createElement('div');
  pageTitleInput.classList.add('active'); // اضافه کردن کلاس active به فیلد عنوان صفحه فعلی
  pageTitlesContainer.insertBefore(pageTitleInput, pageTitlesContainer.firstChild);
  pageTitleInput.innerHTML = `
    <label for="pageTitle${pageIndex+1}">عنوان صفحه ${pageIndex+1}:</label>
    <input type="text" id="pageTitle${pageIndex+1}" name="pageTitle${pageIndex+1}" ><br>`;

  
  // نمایش لیبل و فیلد عنوان صفحه مربوط به این صفحه
  const pageTitleLabel = pageTitlesContainer.querySelector(`label[for="pageTitle${pageIndex+1}"]`);
  const pageTitleField = document.getElementById(`pageTitle${pageIndex+1}`);
  pageTitleLabel.style.display = 'block';
  pageTitleField.style.display = 'block';

 

  // ایجاد عنوان صفحه
  const pageTitleElement = document.createElement('h1');
  pageTitleElement.textContent = pageData.pageTitle;
  pagesContainer.appendChild(pageTitleElement);

  // اضافه کردن کلاس dnon به تمام سوالات و گزینه‌ها
  const allQuestionContainers = questionsInputContainer.querySelectorAll('.question-container');

  allQuestionContainers.forEach(container => container.classList.add('dnon'));
  const allInputFields = document.querySelectorAll('input[type="text"], input[type="number"], select');
  allInputFields.forEach(inputField => {
    inputField.value = ""; // یا می‌توانید به جای "" مقدار پیشفرض خود را قرار دهید
  });

  // مخفی کردن تمام گزینه‌ها
  const allOptions = document.querySelectorAll('.option-container');
  allOptions.forEach(option => option.classList.add('dnon'));
 
  // مخفی کردن تمام سوالات به جز سوال اول
  allQuestionContainers.forEach(container => {
    container.classList.add('dnon');
  });
}

// // تابع حذف سوال
// function deleteQuestion(pageIndex, questionIndex) {
//   const pageData = pagesData[pageIndex];
//   //const questionInput = document.getElementById(`question${questionIndex}`);
//   //const questionDataElement = document.getElementById(`question${questionIndex}`);
//   const questionTitleElement = document.getElementById(`questionTitle${questionIndex}`);
//   const optionsElement = document.getElementById(`options${questionIndex}`);

//   //questionDataElement.style.display = 'none';
//   questionTitleElement.style.display = 'none';
//   optionsElement.style.display = 'none';
//   if (pageData && pageData.questions[questionIndex]) {
//     pageData.questions[questionIndex - 1] = null;
//    // questionInput.remove();
//     pageData.questions.splice(questionIndex, 1); // حذف سوال از آرایه
//     showPage(pageIndex); // نمایش صفحه با تغییرات جدید
//   }
// }

//<button onclick="deleteQuestion(${pageIndex}, ${questionNumber})">حذف سوال</button>

// تابع افزودن ورودی‌های سوال به فرم
function addQuestionInput() {
  const questionNumber = questionsInputContainer.children.length + 1;
  optionCounter=1; 

  const questionInput = document.createElement('div');
  questionInput.innerHTML = `
  <h3>سوال ${questionNumber}</h3>
  <label for="questionType${questionNumber}">نوع سوال:</label>
  <select id="questionType${questionNumber}" name="questionType${questionNumber}" onchange="showQuestionTitleField(${questionNumber})">
  <option ></option>
    <option value="radio">تک انتخابی</option>
    <option value="checkbox">چند انتخابی</option>
    <option value="essay">تشریحی</option>
    <option value="dropdown">دراپ‌داون</option>
  </select><br>
  <div id="questionTitle${questionNumber}" style="display: none;">
    <label for="questionTitleField${questionNumber}">عنوان سوال:</label>
    <input type="text" id="questionTitleField${questionNumber}" name="questionTitle${questionNumber}" ><br>
  </div>
  <div id="options${questionNumber}" style="display: none;">
    <button type="button" style="background-color:#e4decd; color:#1d1145; border-color: #1d1145; border-style: solid; border-width: 1.5px;" onclick="addOptionInput(${questionNumber})">افزودن گزینه</button><br>
  </div>
  <br>
`;

  questionsInputContainer.appendChild(questionInput);
}


// تابع نمایش یا مخفی کردن فیلد عنوان سوال و دکمه انتخاب گزینه
function showQuestionTitleField(questionNumber) {
  const questionTypeInput = document.getElementById(`questionType${questionNumber}`);
  const questionTitleField = document.getElementById(`questionTitle${questionNumber}`);
  const optionsField = document.getElementById(`options${questionNumber}`);

  if (questionTypeInput.value === 'essay') {
    questionTitleField.style.display = 'block';
    optionsField.style.display = 'none';
  } else if (questionTypeInput.value === 'dropdown' || questionTypeInput.value === 'checkbox' || questionTypeInput.value === 'radio') {
    questionTitleField.style.display = 'block';
    optionsField.style.display = 'block';
  } 
}


// تابع افزودن ورودی‌های گزینه به فرم
function addOptionInput(questionNumber) {
  const optionsContainer = document.getElementById(`options${questionNumber}`);
  const optionInput = document.createElement('div');
  optionInput.innerHTML = `
  <label for="option${optionCounter}${questionNumber}">گزینه ${optionCounter}:</label>
  <input type="text" id="option${optionCounter}${questionNumber}" name="option${optionCounter}${questionNumber}"><br`;
  optionsContainer.appendChild(optionInput);
  optionCounter++;
}
// تابع افزودن فیلد گزینه 
function addOptionField(questionNumber) {
  const questionTypeInput = document.getElementById(`questionType${questionNumber}`);
  const selectedQuestionType = questionTypeInput.value;

  if (selectedQuestionType === 'essay' )  document.getElementById('addOption').classList.add('dnon'); 
  else {
    const optionsContainer = document.getElementById(`options${questionNumber}`);
    const optionNumber = optionsContainer.children.length + 1;

    const optionInput = document.createElement('div');
    optionInput.innerHTML = `
      <label for="option${optionNumber}${questionNumber}">گزینه ${optionNumber}:</label>
      <input type="text" id="option${optionNumber}${questionNumber}" name="option${optionNumber}${questionNumber}"><br>`;

    optionsContainer.appendChild(optionInput);
  }
}

// افزودن یک سوال اولیه به فرم
addQuestionInput();


// // تابع ذخیره اطلاعات فرم به صورت JSON
// function saveFormData() {
//   const currentPageForm = document.querySelectorAll('#questionsInputContainer input, #questionsInputContainer select, #questionsInputContainer textarea');
//   const formData = {
//     pageTitle: document.getElementById(`pageTitle${pageIndex + 1}`).value,
//     questions: []
//   };

//   currentPageForm.forEach(inputElement => {
//     const questionNumber = parseInt(inputElement.dataset.questionNumber);
//     const questionData = {};

//     if (inputElement.type === 'radio') {
//       if (inputElement.checked) {
//         questionData.type = inputElement.value;
//       }
//     } else if (inputElement.type === 'checkbox') {
//       if (!questionData.options) {
//         questionData.options = [];
//       }
//       if (inputElement.checked) {
//         questionData.options.push(inputElement.value);
//       }
//     } else if (inputElement.tagName === 'TEXTAREA') {
//       questionData.title = inputElement.value;
//     }

//     if (Object.keys(questionData).length > 0) {
//       formData.questions[questionNumber - 1] = questionData;
//     }
//   });

//   pagesData[currentPageIndex] = formData;
// }



// تابع ذخیره اطلاعات هر صفحه به صورت JSON
function savePageDataToJson(pageIndex) {
pageIndex=1+pageIndex;
  const pageTitleInput = document.getElementById(`pageTitle${pageIndex}`);
  const pageTitle = pageTitleInput.value; // گرفتن مقدار فیلد pageTitleInput
  const formData = new FormData(form); 
  const data = { 
 pageIndex,
    pageTitle, // افزودن مقدار فیلد pageTitle به داده‌ها
    questions: []
  };

  for (const [name] of formData.entries()) {
    const questionNumberMatch = name.match(/^questionTitle(\d+)$/);
    if (questionNumberMatch) {
      const questionNumber = parseInt(questionNumberMatch[1]);
      const questionTypeInput = formData.get(`questionType${questionNumber}`);
      const questionTitle = formData.get(`questionTitle${questionNumber}`);
      const questionData = {
        type: questionTypeInput,
        title: questionTitle
      };

      if (questionTypeInput === 'radio' || questionTypeInput === 'checkbox' || questionTypeInput === 'dropdown') {
        const options = [];
        let optionNumber = 1;
        while (formData.has(`option${optionNumber}${questionNumber}`)) {
          const option = formData.get(`option${optionNumber}${questionNumber}`);
          options.push(option);
          optionNumber++;
        }
        questionData.options = options;
      }

      data.questions.push(questionData);
    }
  }

  // تبدیل اطلاعات به JSON و نمایش آن در کنسول
  const jsonData = data;
  formDataCollection.push(jsonData);
  console.log(jsonData);
}


// function submitForm() {
//   // const currentPageForm = document.querySelectorAll('#questionsInputContainer input, #questionsInputContainer select, #questionsInputContainer textarea');
//   // const formData = {
//   //   pageTitle: document.getElementById(`pageTitle${pageIndex + 1}`).value,
//   //   questions: []
//   // };

//   // currentPageForm.forEach(inputElement => {
//   //   const questionNumber = parseInt(inputElement.dataset.questionNumber);
//   //   const questionData = {};

//   //   if (inputElement.type === 'singleChoice') {
//   //     if (inputElement.checked) {
//   //       questionData.type = inputElement.value;
//   //     }
//   //   } else if (inputElement.type === 'multipleChoice') {
//   //     if (!questionData.options) {
//   //       questionData.options = [];
//   //     }
//   //     if (inputElement.checked) {
//   //       questionData.options.push(inputElement.value);
//   //     }
//   //   } else if (inputElement.tagName === 'essay') {
//   //     questionData.title = inputElement.value;
//   //   }

//   //   if (Object.keys(questionData).length > 0) {
//   //     formData.questions[questionNumber - 1] = questionData;
//   //   }
//   // });

//   // formDataCollection.push(formData);

// }



//   const formData = new FormData(form);
//   const data = {};

//   for (const [name, value] of formData.entries()) {
//     data[name] = value;
//   }

//   console.log(data);
// }); 

function submitForm() {
  pageIndex = pagesData.length - 1;
  savePageDataToJson(pageIndex); 
  console.log(formDataCollection);
     
  const jsonContent = JSON.stringify(formDataCollection, null, 2); // تب‌های فرمت‌بندی برای خوانایی
  const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
  
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = 'questionData.json';
  downloadLink.textContent = 'دانلود اطلاعات فرم';
  downloadLink.style.textDecoration='none';
  downloadLink.style.color='#1d1145';
  
  const downloadContainer = document.getElementById('download-container');
  //downloadContainer.innerHTML = '';
  downloadContainer.appendChild(downloadLink);

  downloadFormAsHtml(); 
  


  const pagesContainer = document.getElementById('pages');
  document.getElementById('questionsInputContainer').classList.add('dnon');
  //document.querySelector('.btn1').classList.add('dnon');
  document.querySelector('.active').classList.remove('active');
  pagesContainer.classList.remove('dnon');
  pagesContainer.innerHTML = ''; // پاک کردن صفحات قبلی
  const x = document.getElementById('show-button');

    x.addEventListener('click', (e) =>  {
      e.preventDefault();
      const sharedData = localStorage.getItem("sharedData");
      if (sharedData) {
        const parsedData = JSON.parse(sharedData);
       console.log(`x from parent: ${parsedData.x}`);
      } else {
       console.log("No data available.");
      }
    });
   
  
currentFormDataIndex = 0; // تنظیم اندیس فرم فعلی به صفر
  displayPageData(currentFormDataIndex); // نمایش اطلاعات صفحه اول
  }

  

function displayPageData(index) {
  const pagesContainer = document.getElementById('pages');
  const formData = formDataCollection[index];
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page-container');
  const pageContainers = pagesContainer.querySelectorAll('.page-container');

  const currentPageForm = pageContainer.querySelectorAll('input, select, textarea');
  
  currentPageForm.forEach(inputElement => {
    inputElement.value = ''; // پاک کردن مقادیر ورودی‌ها
  });
  pageContainers.forEach((pageContainer, pageIndex) => {
    pageContainer.classList.add('dnon'); // اضافه کردن کلاس dnon به همه صفحه‌ه
    if (pageIndex === index) {
      pageContainer.classList.remove('dnon');
    } 
  });

  const pageTitle = formData.pageTitle;
  const questionsData = formData.questions;
  const pageHeader = document.createElement('h1');
  pageHeader.textContent = pageTitle;
  pageContainer.appendChild(pageHeader);

  questionsData.forEach(questionData => {
    const questionType = questionData.type;
    const questionTitle = questionData.title;
    const questionOptions = questionData.options || [];
    let questionElement = document.createElement('div');

    if (questionType === 'essay') {
      questionElement.innerHTML = createEssayQuestion(questionTitle);
    } else if (questionType === 'radio') {
      questionElement.innerHTML = createSingleChoiceQuestion(questionTitle, questionOptions);
    } else if (questionType === 'checkbox') {
      questionElement.innerHTML = createMultipleChoiceQuestion(questionTitle, questionOptions);
    } else if (questionType === 'dropdown') {
      questionElement.innerHTML = createDropdownQuestion(questionTitle, questionOptions);
    }

    pageContainer.appendChild(questionElement);
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'بعدی';
  nextButton.style.color='#e4decd';
  nextButton.style.backgroundColor='#82716e';
  if (index < pagesData.length - 1) {
    pageContainer.appendChild(nextButton);
    nextButton.addEventListener('click', () => showNextPage());
  } else {
    nextButton.style.display = 'none';
  }


  // const previousButton = document.createElement('button');
  // previousButton.textContent = 'Previous';
  // if (index >0) {
  //   pageContainer.appendChild(previousButton);
  //   previousButton.addEventListener('click', () => showPreviousPage());
  // } else {
  //   previousButton.style.display = 'none';
  // }

  const submitButton = document.createElement('button');
  submitButton.textContent = 'ارسال';
  submitButton.style.backgroundColor=' #1d1145';
  submitButton.style.color='#e4decd';

  if (index == pagesData.length - 1) {
    pageContainer.appendChild(submitButton);
    submitButton.addEventListener('click', () => submitForm2());
  } else {
    submitButton.style.display = 'none';
  }
  
  pagesContainer.appendChild(pageContainer);
}


function showPreviousPage() {
  //saveFormData(); 
  currentFormDataIndex--; 
  displayPageData(currentFormDataIndex); // نمایش اطلاعات صفحه قبلی
}

function showNextPage() {
  //saveFormData(); 
  currentFormDataIndex++; // افزایش اندیس فرم فعلی
    displayPageData(currentFormDataIndex); // نمایش صفحه بعدی
}


// ایجاد رویداد ارسال فرم
form.addEventListener('submit', function (e) {
  e.preventDefault();
});


function submitForm2(){  
  saveFormData();
    var jsonData = JSON.stringify(formValues, null, 2);
    console.log(jsonData); // نمایش در کنسول
    // اینجا می‌توانید کدی برای ارسال JSON به سرور یا ذخیره در دیتابیس بنویسید
  }
 

  function saveFormData() {
    const formParts = document.querySelectorAll('.form-part');
    const formData = {}; // استفاده از یک متغیر برای ذخیره داده‌های فرم
  
    formParts.forEach((formPart, index) => {
      const inputs = formPart.querySelectorAll('input, select, textarea');
      const questionData = {}; // داده‌های هر سوال
  
      inputs.forEach(inputElement => {
        const inputType = inputElement.type;
        const inputName = inputElement.name;
        const inputValue = inputElement.value;
  
        if (inputType === 'radio') {
          if (inputElement.checked) {
            questionData[inputName] = inputValue;
          }
        } else if (inputType === 'checkbox') {
          if (inputElement.checked) {
            if (!questionData[inputName]) {
              questionData[inputName] = [];
            }
            questionData[inputName].push(inputValue);
          }
        } else {
          questionData[inputName] = inputValue;
        }
      });
  
      formData[`سوال ${index + 1}`] = questionData; // اضافه کردن داده‌های سوال به داده‌های فرم
    });
  
    formValues[currentFormDataIndex] = formData; // ذخیره داده‌های فرم در مجموعه‌ای از داده‌های فرم
    console.log(formValues); // نمایش در کنسول
    // اینجا می‌توانید کدی برای ارسال JSON به سرور یا ذخیره در دیتابیس بنویسید
  }
  
// function saveFormData() {
//   const formParts = document.querySelectorAll('.form-part');
//   //const formValues = {};
//   const questionData = new FormData(form);


//   formParts.forEach((formPart, index) => {
//     const inputs = formPart.querySelectorAll('input, select, textarea');
   
//     inputs.forEach(inputElement => {
//       const inputType = inputElement.type;
//      // const inputName = inputElement.name;
//       const inputValue = inputElement.value;

//       if (inputType === 'radio') {
//         if (inputElement.checked) {
//           questionData[`سوال ${index + 1}`] = inputValue;
//         }
//       } else if (inputType === 'checkbox') {
//         if (inputElement.checked) {
//           if (!questionData[`سوال ${index + 1}`]) {
//             questionData[`سوال ${index + 1}`] = [];
//           }
//           questionData[`سوال ${index + 1}`].push(inputValue);
//         }
//       } else {
//         questionData[`سوال ${index + 1}`] = inputValue;
//       }
//     });
// console.log(questionData);
//     formValues[`سوال ${index + 1}`] = questionData;
//   });
//   console.log(questionData);
//   formValues[currentFormDataIndex] = questionData;
//   console.log(formValues); // نمایش در کنسول
//   // اینجا می‌توانید کدی برای ارسال JSON به سرور یا ذخیره در دیتابیس بنویسید
// }


  

//   // ذخیره پاسخ‌های انتخاب شده در جدول انتخاب‌ها
//  selectedOptions = currentPageForm.length > 0 ? Array.from(currentPageForm).filter(input => input.checked || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT').map(input => {
//     if (input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
//       return input.value ;
//     } else {
//       return input.value;
//     }
//   }) : [];
//   //  selections[currentQuestionIndex] = selectedOptions;
//    console.log(selectedOptions);

 


// // بازیابی گزینه‌های انتخاب شده در سوال قبلی
// function restoreSelectedOptions() {
//   const inputElements = document.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea, select');

//   inputElements.forEach(inputElement => {
//     // const questionNumber = currentQuestionIndex + 1;
//     // const selectedOptions = Array.from(selections[currentQuestionIndex]);
    
//     // بازیابی گزینه‌های انتخاب شده از جدول انتخاب‌ها
//     if (inputElement.type === 'radio' || inputElement.type === 'checkbox') {
//       inputElement.checked = selectedOptions.includes(inputElement.value);
//     } else if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'SELECT') 
//       inputElement.value = selectedOptions;
//   });
// }

function generateHtmlContent(formDataCollection) {
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Form</title>
      <style>
      form {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        }
        
        @font-face {
          font-family: 'B Nazanin';
          src: url('fonts/BNazanin.ttf'); /* For IE9 and earlier */
          src: local('B Nazanin'),
               url('fonts/B-Nazanin.ttf') format('truetype'); /* For Safari, Android, iOS */
        }
        
        body {
          font-family: 'B Nazanin', sans-serif;
          text-align: right;
          direction: rtl;
        }
      
        h2 {
          text-align:right;
          font-size: medium;
        }
        
        label {
          display: block;
          margin: 0px 30px;
          
        }
      
        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }
        
        input[type="text"],
        input[type="email"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
          margin-top: 5px;
          margin-bottom: 20px;
          font-size: 16px;
      
        }
      
        input[type="checkbox"],
        input[type="radio"]{
          float: right;
          margin-top:auto;
        }
        
        .rating-group {
          display: flex;
          flex-direction: row-reverse; 
          flex-wrap: wrap;
        }
        
        .rating-group label {
          flex-basis: 25%;
          margin-right: 10px;
          margin-bottom: 10px;
          /* text-align: right; تغییر محل برچسب‌ها به راست */
        }
        
        .rating-group input[type="range"] {
          width: 100%;
          margin-bottom: 5px;
          /* direction: rtl; تغییر جهت به چپ به راست */
        }
      
        .buttons{
          text-align: center;
        }
        
        button {
          font-family: 'B Nazanin', sans-serif;
          font-weight: bold;
          background-color: #4CAF50;
          color: white;
          padding: 7px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 15px;
          margin: 10px 3px;
        }
        
        button:hover {
          background-color: #45a049;
        }
        .form-part {
          margin-bottom: 20px;
          
        }
       .dnon{
        display:none;
       }
       /* استایل برای فیلدهای عنوان صفحه */
      #pageTitles {
        display: flex;
        flex-direction: column;
      }
      
      #pageTitles > div {
        display: none;
      }
      
      #pageTitles > div.active {
        display: block;
      }
      
      /* استایل برای فیلد عنوان صفحه فعلی */
      #pageTitles input[type="text"] {
        margin-bottom: 8px;
      }
      .active {
        display: block;
      } 
      
      .current_page{
        display: block;
      }
      </style>
    </head>
    <body style="background-color:#acb7ae;">
    <form id="mainForm" style="background-color:#e4decd;border-radius: 1em; ">
    <div id="pages">
  `; 

  formDataCollection.forEach((formData, pageIndex) => {
    htmlContent += `
      <div class="page-container" >
        <h1>${formData.pageTitle}</h1>
        <script> 
        console.log(${JSON.stringify(formData)});</script>
    `;

  
    formData.questions.forEach((question, questionIndex) => {
      htmlContent += `
        <div class="question form-part">
          <h2>${question.title}</h2>
      `;

      if (question.type === 'radio' || question.type === 'checkbox') {
        question.options.forEach((option, optionIndex) => {
          htmlContent += `
            <input type="${question.type}" id="option${questionIndex}" name="answer"  value="${option}">
            <label for="option${questionIndex}">${option}</label><br>
          `;
        });
      } else if (question.type === 'essay') {
        htmlContent += `
          <textarea id="answer" name="answer" rows="4" cols="50"></textarea>
        `;
      } else if (question.type === 'dropdown') {
        htmlContent += `
          <select id="options" name="answer">
        `;
        question.options.forEach((option, optionIndex) => {
          htmlContent += `
            <option value="${option}">${option}</option>
          `;
        });
        htmlContent += `
          </select>
        `;
      }

      htmlContent += ` 
        </div>
      `; 
    });
 
    htmlContent += `
      </div>
    `;
  }); 

  htmlContent += `
  <button type='button' class='nextButton' style="background-color:#82716e; color:#e4decd;  " onclick='showNextPage()'>بعدی</button>
  <button type='button' class='submitButton dnon' style="background-color:#e4decd; color:#82716e; border-color: #82716e; border-style: solid; border-width: 1.5px;" onclick='submitForm2()'>ارسال</button>
  <button type='button' class='againButton dnon' style="background-color:#82716e; color:#e4decd;  ">پاسخگویی مجدد</button>
  <a class='downloadLink dnon' style="color:#1d1145; text-decoration:none">دانلود فایل پاسخ های نهایی</a>
  </div>
</form>
    <script>

    let numberOfPages = 0;
let pageIndex=null;
let a=[];

const form = document.getElementById('mainForm');
const questionsInputContainer = document.getElementById('questionsInputContainer');
const pagesData = [];
const submit=document.getElementById('submit');

// const nextButton = document.querySelector('#nextButton');
let optionCounter = 1; 
let formData={}; 
let formValues = []; // برای ذخیره اطلاعات هرصفحه سوال
let selectedOptions=[];
let currentFormDataIndex = 0; // تنظیم اندیس فرم فعلی به صفر
const pagesContainer = document.getElementById('pages');
const pageContainers = pagesContainer.querySelectorAll('.page-container');
const jsonArray = ${JSON.stringify(formDataCollection)}; // همه صفحات
const downloadLink = document.querySelector('.downloadLink');


displayPageData(currentFormDataIndex); // نمایش اطلاعات صفحه اول






function displayPageData(index) {
  const formData = jsonArray[index]; // یک صفحه
  const pageContainer = pageContainers[index];
  pageContainers.forEach((pageContainer, pageIndex) => {
    pageContainer.classList.add('dnon'); // اضافه کردن کلاس dnon به همه صفحه‌ها
  });
  pageContainer.classList.remove('dnon');

  const currentPageForm = pageContainer.querySelectorAll('input, select, textarea');
  currentPageForm.forEach(inputElement => {
    //inputElement.value = ''; // پاک کردن مقادیر ورودی‌ها
  });

  
  // const pageTitle = formData.pageTitle;
  // const questionsData = formData.questions;
  // const pageHeader = document.createElement('h1');
  // pageHeader.textContent = pageTitle;
  // pageContainer.appendChild(pageHeader);

  
  //pageContainer.appendChild(nextButton);
  // if (index < jsonArray.length - 1 && pageContainer.lastChild.tagName !== 'button') {
  //   console.log(currentFormDataIndex );
  //   pageContainer.appendChild(nextButton);
  //   nextButton.addEventListener('click', () => showNextPage());
  // } 
  // else {
  //   nextButton.style.display = 'none';
  // }





  // const nextButton = document.createElement('button');
  // nextButton.textContent = 'Next';
  // nextButton.type = 'button';
  // nextButton.addEventListener('click', () => showNextPage());

  // if ( pageContainer.lastChild.tagName !== 'button') {
  //   if(index === jsonArray.length - 1){
  //   console.log('1');
  //   pageContainer.appendChild(submitButton);
  //   pageContainer.appendChild(againButton);}
  //   else if(index < jsonArray.length - 1){
  //     console.log('second');
  //     pageContainer.appendChild(nextButton);
  //   } else  pageContainer.lastChild.classList.add('dnon');
 
  
  //  else {
  //   submitButton.style.display = 'none';
  //   againButton.style.display = 'none';
  // }


  submitButton=document.querySelector('.submitButton');
  againButton=document.querySelector('.againButton');
  
  againButton.addEventListener('click', () =>  { currentFormDataIndex = 0;
  displayPageData(currentFormDataIndex);}
  );

  if (index < jsonArray.length - 1)  {
     downloadLink.classList.add('dnon');
     againButton.classList.add('dnon');
     submitButton.classList.add('dnon');}

  if (index === jsonArray.length - 1 && pageContainer.lastChild.tagName !== 'button') {
    console.log('1');
  
   againButton.classList.remove('dnon');
   submitButton.classList.remove('dnon');
    document.querySelector('.nextButton').classList.add('dnon');
 
  }
else    document.querySelector('.nextButton').classList.remove('dnon');

}
//   //  else {
//   //   submitButton.style.display = 'none';
//   //   againButton.style.display = 'none';
//   // }
// }

function showNextPage() {
  console.log(currentFormDataIndex );
  console.log(jsonArray.length - 1);
  if (currentFormDataIndex < jsonArray.length - 1) {
    currentFormDataIndex++;
    displayPageData(currentFormDataIndex);
  }
}

    
    function showPreviousPage() {
      //saveFormData(); 
      currentFormDataIndex--; 
      displayPageData(currentFormDataIndex); // نمایش اطلاعات صفحه قبلی
    }
    
    function showNextPage() {
      //saveFormData(); 
      currentFormDataIndex++; // افزایش اندیس فرم فعلی
        displayPageData(currentFormDataIndex); // نمایش صفحه بعدی
    }
    
    
  //   // ایجاد رویداد ارسال فرم
  //   document.querySelector('form').addEventListener('submit', function (e) {
  //     e.preventDefault();
  //   });
  //   //let a= ['${formResponses}'];
    


  downloadLink.download = 'userResponses.json';
  //downloadLink.textContent = 'stop';
    function submitForm2(){  
      saveFormData();
        // var jsonData = JSON.stringify(formValues, null, 2);
        console.log(formValues); // نمایش در کنسول
        // اینجا می‌توانید کدی برای ارسال JSON به سرور یا ذخیره در دیتابیس بنویسید
        console.log( a);
     
  const copiedFormValues = [...formValues]; // ایجاد یک کپی از formValues
  a.push(copiedFormValues); // اضافه کردن کپی به آرایه a
   
        console.log( a);
        // const sharedData = localStorage.getItem(JSON.stringify(a));
        
        // if (sharedData) {
        //   const parsedData = JSON.parse(sharedData);
        //   const receivedDataElement = document.createElement("div");
        //   receivedDataElement.textContent = \`x from parent: \${parsedData.x}\`;
        //   document.body.appendChild(receivedDataElement);
        // }

        // const pagesContainer = document.getElementById('pages');
       
  const jsonContent = JSON.stringify(a, null, 0);// تب‌های فرمت‌بندی برای خوانایی

  const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
  
  //console.log(downloadContainer.lastChild );
  //console.log(downloadLink);
  // در صورت وجود، حذف دکمه قبلی
  if ( pagesContainer.lastChild.tagName === 'a'){
    //console.log('rr');
    //downloadContainer.removeChild(downloadLink);
    downloadContainer.lastChild.classList.add('dnon');
  }

  downloadLink.href = URL.createObjectURL(jsonBlob);

  //downloadContainer.innerHTML = '';

  downloadLink.classList.remove('dnon');
  pagesContainer.appendChild(downloadLink);

  if(currentFormDataIndex < jsonArray.length - 1)
  downloadLink.classList.add('dnon');
        clearForm();
      }
    

  
    
      function saveFormData() {
        let formParts = document.querySelectorAll('.form-part');
       let formData = {}; // استفاده از یک متغیر برای ذخیره داده‌های فرم
      
        formParts.forEach((formPart, index) => {
          const inputs = formPart.querySelectorAll('input, select, textarea');
          const questionData = {}; // داده‌های هر سوال
      
          inputs.forEach(inputElement => {
            const inputType = inputElement.type;
            const inputName = inputElement.name;
            const inputValue = inputElement.value;
      
            if (inputType === 'radio') {
              if (inputElement.checked) {
                console.log(inputValue);
                questionData[inputName] = inputValue;
              }
            } else if (inputType === 'checkbox') {
              if (inputElement.checked) {
                console.log(inputValue);
                if (!questionData[inputName]) {
                  questionData[inputName] = [];
                }
                questionData[inputName].push(inputValue);
              }
            } else {
              questionData[inputName] = inputValue;
            }
          });
      
          formData[\`سوال \${index + 1}\`] = questionData; // اضافه کردن داده‌های سوال به داده‌های فرم
          console.log(questionData);
        });

      console.log(formData);
        formValues[currentFormDataIndex] = formData; // ذخیره داده‌های فرم در مجموعه‌ای از داده‌های فرم
        console.log(formValues); // نمایش در کنسول
     

      }







      // پاک کردن مقادیر ورودی‌های فرم برای آماده‌سازی برای ورودی فرم بعدی
function clearForm() {
  const formParts = document.querySelectorAll('.form-part');
  
  formParts.forEach(formPart => {
    const inputs = formPart.querySelectorAll('input, select, textarea');
  
    inputs.forEach(inputElement => {
      if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
        inputElement.checked = false; // پاک کردن گزینه‌های انتخاب شده
      } else {
        //inputElement.value = ''; // پاک کردن مقدار ورودی
      }
    });
  });
}


    </script>
    </body>
    </html>
  `;

  return htmlContent;
}

// var cssContent='';
// var jsContent=``;


// function downloadFormAsZip() {
//   const zip = new JSZip();
  
//   // اضافه کردن فایل‌های HTML، CSS و JavaScript به ZIP
//   const htmlContent = generateHtmlContent(formDataCollection); // از تابع generateHtmlContent خود استفاده کنید
//   zip.file('generatedForm.html', htmlContent);

//   // افزودن فایل‌های واقعی CSS و JavaScript به پوشه assets
//   // zip.file('style.css', cssContent);
//   // zip.file('script.js', jsContent);

//   // تولید فایل ZIP
//   zip.generateAsync({ type: 'blob' }).then(function (content) {
//     // ایجاد لینک دانلود
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(content);
//     link.download = 'form.zip';
//     link.textContent = 'دانلود فرم';

//     // اضافه کردن لینک دانلود به صفحه
//     const downloadContainer = document.getElementById('download-container');
//     downloadContainer.innerHTML = '';
//     downloadContainer.appendChild(link);
//   });
// }
function downloadFormAsHtml() {

  const htmlContent = generateHtmlContent(formDataCollection);
  // const downloadButton = document.createElement('button');
  
  // downloadButton.addEventListener('click', (event) => {
  //   event.preventDefault();
const download_button=document.getElementById('download-button');
//download_button.classList.remove('dnon');
 
  download_button.addEventListener('click', (event) => {
    event.preventDefault();

  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(htmlBlob);
  downloadLink.download = 'generatedForm.html';
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);

});

// const downloadContainer = document.getElementById('download-container');
// downloadContainer.innerHTML = '';
// downloadContainer.appendChild(link);   

  // کدهای تولید نمودار و محاسبات نمودار

}


// function downloadFormAsHtml() {
//   const htmlContent = generateHtmlContent(formDataCollection);
//   const blob = new Blob([htmlContent], { type: 'text/html' });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'generatedForm.html';
//   link.textContent = 'Download Form';

//   const downloadContainer = document.getElementById('download-container');
//   downloadContainer.innerHTML = '';
//   downloadContainer.appendChild(link);
// } 

// const questionData = [
//   {
//     pageIndex: 1,
//     pageTitle: "صفحه 1",
//     questions: [
//       { type: 'singleChoice', title: 'نتنتتن', options: ['es', 'wr', 'erc'] },
//       { type: 'multipleChoice', title: 'dwde', options: ['jj', 'kk'] },
//       { type: 'dropdown', title: 'نتنتتن', options: ['ee', 'er'] },

//       //{ type: 'essay', title: 'یث۲' }
//     ]
//   },
//   // {
//   //   pageIndex: 2,
//   //   pageTitle: "صفحه 2",
//   //   questions: [
//   //     { type: 'singleChoice', title: 'نتنتتن', options: ['es', 'wr', 'erc'] },
//   //     { type: 'singleChoice', title: 'dwde', options: ['jj', 'kk'] },
//   //     { type: 'dropdown', title: 'نتنتتن', options: ['ee', 'er'] },

//   //     //{ type: 'essay', title: 'یث۲' }
//   //   ]
//   // }
//   // ... دیگر داده‌ها
// ];

// const userResponses = [
//   { "سوال 1": { answer: 'es' }, "سوال 2": { answer: 'jj' } ,"سوال 3": { answer: 'er' }},
//   { "سوال 1": { answer: 'wr' }, "سوال 2": { answer: ['kk', 'jj'] } ,"سوال 3": { answer: 'er' }},
//   { "سوال 1": { answer: 'erc' }, "سوال 2": { answer: 'kk' },"سوال 3": { answer: 'ee' } }
//   // ... دیگر پاسخ‌ها
// ]; 






function countResponses(questionIndex, optionIndex) {
  return userResponses.filter(response => {
    const question = questionData[0].questions[questionIndex];
    //console.log(question);
    const selectedOption = response[0][`سوال ${questionIndex + 1}`].answer;
    if(question.type==='essay')
return 0;
    if (Array.isArray(selectedOption)) {
      // اگر پاسخ یک آرایه باشد، تعداد گزینه‌هایی که مطابق با گزینه‌های سوال هستند را حساب کنید
      return selectedOption.includes(question.options[optionIndex]);
    } else {
      //console.log(question);
      // در غیر این صورت با پاسخ مستقیم مقایسه کنید
      return selectedOption === question.options[optionIndex];
    }
  }).length;
}

// function countResponses(questionIndex, optionIndex) {
//   return userResponses.filter(response => {
//     const selectedOption = response[`سوال ${questionIndex + 1}`].answer;
    
//     // بررسی نوع پاسخ
//     if (Array.isArray(selectedOption)) {
//       // اگر پاسخ یک آرایه باشد، به تعداد گزینه‌ها آن را افزایش دهید
//       return selectedOption.includes(questionData[questionIndex].questions[0].options[optionIndex]);
//     } else {
//       // در غیر این صورت با پاسخ مستقیم مقایسه کنید
//       return selectedOption === questionData[questionIndex].questions[0].options[optionIndex];
//     }
//   }).length;}



// function countResponses(questionIndex, optionIndex) {
//   return userResponses.filter(response => {
//     const question = questionData[0].questions[questionIndex];
//     const selectedOption = response[0][`سوال ${questionIndex + 1}`].answer;
//     return selectedOption === question.options[optionIndex];
//   }).length;
// }

// function countResponses(questionIndex, optionIndex) {
//   // userResponses = JSON.stringify(userResponses).slice(2);
//   // //userResponses=
//   // userResponses=userResponses.filter(a => a.filter(response => response !== null));
//   userResponses = userResponses.map(a => a.filter(response => response !== null));

//   console.log(JSON.stringify(userResponses));
//   return userResponses.filter(response => {
//     const question = questionData[0].questions[questionIndex];
//     const selectedOption = response[0][`سوال ${questionIndex + 1}`].answer;
//     return selectedOption === question.options[optionIndex];
//   }).length;
// }



// datasets: questionData[0].questions.flatMap((question, questionIndex) =>
// question.options.map((option, optionIndex) => ({
//   data: [countResponses(questionIndex, optionIndex)],
//   backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
//   borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
//   borderWidth: 1
// }))
// )
// };
// const chartData = {
//   labels: questionData[0].questions.flatMap((question, questionIndex) =>
//     question.options.map((option, optionIndex) =>
//       `گزینه ${optionIndex + 1}`
//     )
//   ),
//   datasets: questionData[0].questions.flatMap((question, questionIndex) =>
//     question.options.map((option, optionIndex) => ({
//       data: [countResponses(questionIndex, optionIndex)],
//       backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
//       borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
//       borderWidth: 1
//     }))
//   ) 
// };
// تنظیمات نمودار
// const chartData = {
//   labels: questionData[0].questions.map((question, index) => `سوال ${index + 1}`),
//   datasets: questionData[0].questions[0].options.map((option, optionIndex) => ({
//     data: questionData[0].questions.map((_, questionIndex) => countResponses(questionIndex, optionIndex)),
//     label: ` گزینه ${optionIndex + 1}`,
//     backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
//     borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
//     borderWidth: 1
//   }))
// };

// // تابع تبدیل اعداد به عناوین گزینه‌ها
// function formatOptionLabel(value, index) {
//   const questionIndex = index % questionData[0].questions[0].options.length;
//   const optionIndex = Math.floor(index / questionData[0].questions[0].options.length);
//   const option = questionData[0].questions[0].options[questionIndex];
//   return `سوال ${questionIndex + 1} - گزینه ${optionIndex + 1}: ${option}`;
// }
// function formatOptionLabel(value, index) {
//   const questionIndex = Math.floor(index / questionData[0].questions[0].options.length);
//   const optionIndex = index % questionData[0].questions[0].options.length;
//   const question = questionData[0].questions[questionIndex];
//   const option = question.options[optionIndex];
//   return `سوال ${questionIndex + 1} - گزینه ${optionIndex + 1}: ${option}`;
// }


 
// // ایجاد نمودار با استفاده از تنظیمات فوق
// const ctx = document.getElementById('chartCanvas').getContext('2d');
// new Chart(ctx, chartConfig); 


async function fetchJSONData(file) {
  try {
    const response = await fetch(file);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
  }
} 
let questionData;
let userResponses;
async function loadChartData() {
 questionData = await fetchJSONData('questionData.json'); // مسیر فایل JSON
  // انجام پردازش دیگر بر روی داده‌های دریافتی (مانند تولید نمودارها)
 userResponses = await fetchJSONData('userResponses.json');
  // مثال: چاپ داده‌ها در کنسول
 
console.log(questionData,userResponses);
// ایجاد یک جدول برای سوالات تشریحی
const essayTable = document.createElement('table');
essayTable.style.border = '1px solid black';




// ایجاد سطر اولیه برای شماره سوال
const headerRow = essayTable.insertRow(0);
const indexCell = headerRow.insertCell(0);
indexCell.textContent = 'شماره سوال';

const numEssayQuestions = questionData[0].questions.filter(question => question.type === 'essay').length;
questionData[0].questions.forEach((q,j)=>{
  if (q.type==='essay'){
    // for (let i = 0; i < numEssayQuestions; i++) {
       const questionCell = headerRow.insertCell();
       questionCell.textContent = `${j + 1}`;}});

// افزودن پاسخ‌های کاربر به جدول
userResponses.forEach((userResponse, userIndex) => {
  const row = essayTable.insertRow(userIndex + 1);
  const indexCell = row.insertCell(0);

  indexCell.textContent = `کاربر ${userIndex+1}`;
  questionData[0].questions.forEach((q,j)=>{
 if (q.type==='essay'){

   
      const responseCell = row.insertCell();
      const questionIndex = j+1;
      const response = userResponse[0][`سوال ${j + 1}`].answer;
      responseCell.textContent = response;
    

}});
  // ایجاد سلول‌های خالی برای پاسخ‌ها

});


if (essayTable) {
  const rows = essayTable.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          const text = cell.textContent;
          if (text.length > 15) {
              const newText = text.replace(/(.{15})/g, '$1\n');
              cell.textContent = '';
              const lines = newText.split('\n');
              for (let k = 0; k < lines.length; k++) {
                  cell.appendChild(document.createTextNode(lines[k]));
                  if (k < lines.length - 1) {
                      cell.appendChild(document.createElement('br'));
                  }
              }
          }
      }
  }
}
// ایجاد آرایه‌ای برای نام سوال‌های غیر تشریحی
// تعداد سوالات غیر تشریحی
const numNonEssayQuestions = questionData[0].questions.filter(q => q.type !== 'essay').length;

// تمام سوالات غیر تشریحی
const nonEssayQuestions = questionData[0].questions.filter(q => q.type !== 'essay');

// آرایه‌ای برای نگهداری تعداد رای‌های هر گزینه در هر سوال
const votesData = [];

// برای هر سوال غیر تشریحی
nonEssayQuestions.forEach((question, questionIndex) => {
  const options = question.options;
  const votesForOptions = Array(options.length).fill(0); // آرایه‌ای برای نگهداری تعداد رای‌ها به هر گزینه

  // برای هر کاربر
  userResponses.forEach(userResponse => {
    // برای هر گزینه
    options.forEach((option, optionIndex) => {
      // اگر کاربر به این گزینه رای داده باشد، تعداد رای آن را افزایش می‌دهیم
      if (userResponse[`سوال ${questionIndex + 1}`].answer === option) {
        votesForOptions[optionIndex]++;
      }
    });
  });

  // تعداد رای‌ها برای این سوال به آرایه votesData اضافه می‌شود
  votesData.push({
    label: `سوال ${questionIndex + 1}`,
    data: votesForOptions,
    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
    borderWidth: 1,
  });
});

// ایجاد داده‌های نمودار
const chartData = {
  labels: nonEssayQuestions[0].options, // تمام گزینه‌های سوال اول به عنوان لیبل‌های محور x
  datasets: votesData,
};

// حالا می‌توانید از این داده‌ها برای ساخت نمودار استفاده کنید


const chartConfig = {

  type: 'bar',
  data: chartData,
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'سوال‌ها',
          //labels: chartData.data
        }
      },
      y: {
        beginAtZero: true, 
        title: {
          display: true,
          text: 'تعداد پاسخ‌ها'
        },
        //indexLabel:chartData.datasets.in,
     
        stepSize: 1,
        precision: 0,
        ticks: {
          callback: (value) => (Number.isInteger(value) ? value : ''),
          precision: 0
        }
      }
    },
    plugins: {
      // tooltip: {
      //   callbacks: {
      //     label: (context) => context.parsed.y,
      //   },
      // },
      legend: {
        display:true
      }
    }
  }
};

const ctx = document.getElementById('chartCanvas').getContext('2d');
new Chart(ctx, chartConfig); 
  // در اینجا می‌توانید کدهای تولید نمودارها یا پردازش دیگر داده‌ها را انجام دهید



const resultsElement = document.getElementById('results');
resultsElement.appendChild(essayTable);
}
// تابعی برای رسم نمودار برای یک سوال خاص
// function drawChartForQuestion(questionIndex) {
  
//   // // محاسبه داده‌های مربوط به سوال با استفاده از داده‌های سوالات و پاسخ‌ها
//   const question = questionData[questionIndex];
//   const questionTitle = question.title; // عنوان سوال
//   const questionOptions = question.options; // گزینه‌های سوال
//   // const responseData = userResponses.map(userResponse => {
//   //   return userResponse[questionIndex]['سوال'][questionTitle]['answer'];
//   // });

//   // // محاسبه تعداد پاسخ‌های هر گزینه
//   // const responseCounts = {};
//   // questionOptions.forEach(option => {
//   //   responseCounts[option] = responseData.filter(response => response === option).length;
//   // });

//   // تنظیمات نمودار
//   const chartData = {
//     labels: questionOptions,
//     datasets: questionOptions.map((_, optionIndex) => ({
//       data: questionOptions.map((_, questionIndex) => countResponses(questionIndex, optionIndex)),
//       label: ` گزینه ${optionIndex + 1}`,
//       backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
//       borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
//       borderWidth: 1
//     }))
//   };

//   const chartConfig = {
//     type: 'bar',
//     data: chartData,
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'تعداد پاسخ‌ها'
//           }
//         }
//       },
//       plugins: {
//         legend: {
//           display: false
//         }
//       }
//     }
//   };

//   // ایجاد محل قرارگیری برای نمودار
//   const chartCanvas = document.createElement('canvas');
//   chartCanvas.width = 400;
//   chartCanvas.height = 200;
//   document.body.appendChild(chartCanvas);

//   // ایجاد نمودار
//   const ctx = chartCanvas.getContext('2d');
//   new Chart(ctx, chartConfig);
// }

