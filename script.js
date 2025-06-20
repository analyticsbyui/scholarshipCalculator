let memberTuition = 2400; //Amount in USD
let nonMemberTuition = 4800; //Amount in USD
let missionaryScholarship = 1000; //Amount in USD

let scholarshipMatrix = [ 
  //  0   1   2   3   4   5   6   7   8   9  10
    [100,100,100,100,100,100,100,100,100,100,100], //0
    [100,100,100,100,100,100,100,100,100,50, 50],  //1
    [100,100,100,100,100,100,100,100,50, 50, 50],  //2
    [100,100,100,100,100,100,100,50, 50, 50, 50],  //3
    [100,100,100,100,100,100,50, 50, 50, 50, 25],  //4
    [100,100,100,100,100,50, 50, 50, 50, 25, 25],  //5
    [100,100,100,100,50, 50, 50, 50, 25, 25, 25],  //6
    [100,50, 50, 50, 50, 50, 50, 25, 25, 25, 25],  //7
    [50, 50, 50, 50, 50, 50, 25, 25, 25, 25, 25],  //8
    [50, 50, 50, 50, 50, 25, 25, 25, 25, 25, 25],  //9
    [50, 50, 50, 50, 25, 25, 25, 25, 25, 25, 25],  //10
    [50, 50, 50, 25, 25, 25, 25, 25, 25, 25, 25],  //11
    [25, 25, 25, 25, 25,  0,  0,  0,  0,  0,  0]   //12
]

let gpaCols = {
  "4.00": 0, 
  "3.95": 1,
  "3.90": 2, 
  "3.85": 3,
  "3.80": 4,
  "3.75": 5,
  "3.70": 6,
  "3.65": 7,
  "3.60": 8,
  "3.55": 9,
  "3.50": 10
}

let actRows= {
  "36": 0,
  "35": 1,
  "34": 2,
  "33": 3,
  "32": 4,
  "31": 5,
  "30": 6,
  "29": 7,
  "28": 8,
  "27": 9,
  "26": 10,
  "25": 11,
  "24": 12
}


let scholarshipTransferStudents = [
// 0,  1,  2
  100, 50, 25
]

let gpaColsTransfer = {
  "3.75 - 3.899": 2, 
  "3.90 - 3.95": 1,
  "3.95 - 4.0": 0, 
}

function getPercentages(GPA, ACT){
  let row = actRows[ACT]
  let col = gpaCols[GPA]
  
  return scholarshipMatrix[row][col]
}
function getPercentagesTransfer(GPA){
  let index = gpaColsTransfer[GPA]
  
  return scholarshipTransferStudents[index]
}

function setCSSAnimation(meritPercentage, rmPercentage){
  
  const styleSheet = document.styleSheets[2]; 

  // Remove any existing keyframes rule with the same name
  for (let i = 0; i < styleSheet.cssRules.length; i++) {
    if (styleSheet.cssRules[i].name === 'progress') {
      styleSheet.deleteRule(i);
      break;
    }
  }

  // Create the new keyframes rule
  const keyframesRule = `
    @keyframes progress {
      from {
        --merit: 0%;
        --RM: 0%;
      }
      to {
        --merit: ${meritPercentage}%;
        --RM: ${meritPercentage + rmPercentage}%;
      }
    }
  `;

  // Inject the new keyframes rule
  styleSheet.insertRule(keyframesRule, styleSheet.cssRules.length);

}

function resetAnimation(element) {
  element.style.animation = 'none'; 
  element.offsetHeight; 
  element.style.setProperty('--tuition', '0%');
  element.style.setProperty('--merit', '0%');
  element.style.setProperty('--RM', '0%');
  document.querySelector(".results").style.height = ""


}


function calculateScholarship(GPA, ACT){
  if (document.querySelector('.resultsTop').classList.contains('hidden')){
    document.querySelector('.noScholarshipScreen').classList.add('hidden')
    document.querySelector('.resultsTop').classList.remove('hidden')
  }

  const member = document.querySelector(".member").checked
  const missionary = document.querySelector('.missionary').checked
  
  document.querySelector(".rMissionaryLabel").style.display = (!missionary)? 'none': 'flex'
  document.querySelector(".excessLabel").style.display = (!missionary)? 'none': 'flex'
 

  const tuition = (member) ? 2400 : 4800
  const tuitionPercentage = 100
  const meritPercentage = getPercentages(GPA,ACT)
  if (meritPercentage == 0 && !missionary){
    document.querySelector('.resultsTop').classList.add('hidden')
    document.querySelector('.noScholarshipScreen').classList.remove('hidden')
    document.querySelector(".balance").innerText = `$${tuition.toLocaleString()}`
    
  } else {

    const merit =  (meritPercentage * tuition)/tuitionPercentage
    const rMissionary = (missionary) ? 1000 : 0
    const rmPercentage = (rMissionary * tuitionPercentage)/tuition

    let totalPay = tuition - merit - rMissionary
    let balance = (totalPay > 0) ? totalPay : 0
    let excess = (totalPay < 0) ? totalPay * -1 : 0
    
    
    const circle = document.querySelector('.circle');
    circle.style.setProperty('--tuition', `${meritPercentage}%`);
    circle.style.setProperty('--merit', `${meritPercentage}%`);
    circle.style.setProperty('--RM', `${rmPercentage}%`);
    circle.style.animation = ''; 

    setCSSAnimation(meritPercentage, rmPercentage)

    document.querySelector(".tuition").innerText = `$${tuition.toLocaleString()}`
    document.querySelector(".merit").innerText = `$${merit.toLocaleString()}`
    document.querySelector(".rMissionary").innerText = `$${rMissionary.toLocaleString()}`
    document.querySelector(".balance").innerText = `$${balance.toLocaleString()}`
    if (excess){
      document.querySelector(".excessLabel").style.display = 'flex'
      document.querySelector(".excess").innerText = `$${excess.toLocaleString()}`
    }else{
      document.querySelector(".excessLabel").style.display = "none";
    }
    document.querySelector(".totalScholarships").innerText = `$${(merit + rMissionary).toLocaleString()}`
  }


}
function calculateScholarshipTransfer(GPA){

  if (document.querySelector('.resultsTop').classList.contains('hidden')){
    document.querySelector('.noScholarshipScreen').classList.add('hidden')
    document.querySelector('.resultsTop').classList.remove('hidden')
  }

  const member = document.querySelector(".memberTransfer").checked
  const missionary = document.querySelector('.missionaryTransfer').checked
  
  document.querySelector(".rMissionaryLabel").style.display = (!missionary)? 'none': 'flex'
  document.querySelector(".excessLabel").style.display = (!missionary)? 'none': 'flex'
 

  const tuition = (member) ? memberTuition : nonMemberTuition
  const tuitionPercentage = 100
  const meritPercentage = getPercentagesTransfer(GPA,ACT)
  const merit =  (meritPercentage * tuition)/tuitionPercentage
  const rMissionary = (missionary) ? missionaryScholarship : 0
  const rmPercentage = (rMissionary * tuitionPercentage)/tuition

  let totalPay = tuition - merit - rMissionary
  let balance = (totalPay > 0) ? totalPay : 0
  let excess = (totalPay < 0) ? totalPay * -1 : 0
  
  
  const circle = document.querySelector('.circle');
  circle.style.setProperty('--tuition', `${meritPercentage}%`);
  circle.style.setProperty('--merit', `${meritPercentage}%`);
  circle.style.setProperty('--RM', `${rmPercentage}%`);
  circle.style.animation = ''; 

  setCSSAnimation(meritPercentage, rmPercentage)

  document.querySelector(".tuition").innerText = `$${tuition.toLocaleString()}`
  document.querySelector(".merit").innerText = `$${merit.toLocaleString()}`
  document.querySelector(".rMissionary").innerText = `$${rMissionary.toLocaleString()}`
  document.querySelector(".balance").innerText = `$${balance.toLocaleString()}`
  if (excess){
    document.querySelector(".excessLabel").style.display = 'flex'
    document.querySelector(".excess").innerText = `$${excess.toLocaleString()}`
  }else{
    document.querySelector(".excessLabel").style.display = "none";
  }
  document.querySelector(".totalScholarships").innerText = `$${(merit + rMissionary).toLocaleString()}`



}



function handleSmallWindowStartOver(){

  calculator.classList.add('hidden')
  resultsContainer.classList.remove('hidden')
  resultsContainer.style.height = '46em';
  resultsContainer.style.width = '26em';
  resultsContainer.style.visibility = 'visible'

}

const results =  document.querySelector('.results')
const pending =  document.querySelector('.pending')
const resultsContainer = document.querySelector(".resultsContainer")
const calculator = document.querySelector(".calculator")

document.querySelector('.calculate').addEventListener('click',()=>{
  resetAnimation(document.querySelector('.circle'))
  const GPA = document.querySelector('#GPA').value;
  const ACT = document.querySelector('#ACT').value;

  if (ACT == '' || GPA == ''){
    return
  }

  pending.classList.add('hidden')
  results.classList.remove('hidden')
  document.querySelector(".results").style.height = "100%"
  document.querySelector(".results").style.width = "100%"
  calculateScholarship(GPA, ACT)

  if (resultsContainer.classList.contains('hidden')){
    calculator.classList.add('hidden')
    resultsContainer.classList.remove('hidden')
  }
  if(window.innerWidth < 1000){
    handleSmallWindowStartOver()
  }
})


document.querySelector('.calculateTransfer').addEventListener('click',()=>{
  resetAnimation(document.querySelector('.circle'))
  const GPA = document.querySelector('#GPATransfer').value;

  if ( GPA == ''){
    return
  }

  pending.classList.add('hidden')
  results.classList.remove('hidden')
  document.querySelector(".results").style.height = "100%"
  document.querySelector(".results").style.width = "100%"
  calculateScholarshipTransfer(GPA)

  if (resultsContainer.classList.contains('hidden')){
    calculator.classList.add('hidden')
    resultsContainer.classList.remove('hidden')
  }
  if(window.innerWidth < 1000){
    handleSmallWindowStartOver()
  }
})




document.querySelector('#startOver').addEventListener("click", ()=>{

  document.getElementById('calculatorForm').reset()
  resetAnimation(document.querySelector('.circle'))

  if (calculator.classList.contains('hidden')){
    calculator.classList.remove('hidden')
    resultsContainer.classList.add('hidden')
  }else{
    results.classList.add('hidden')
    pending.classList.remove('hidden')
  }

  if ( document.querySelector('.resultsTop').classList.contains('hidden')){
    document.querySelector('.resultsTop').classList.remove('hidden')
    document.querySelector('.noScholarshipScreen').classList.add('hidden')
  }    

  if(window.innerWidth < 1000){
    resultsContainer.style.visibility = 'hidden' 
    resultsContainer.style.height = '0';
    resultsContainer.style.width = '0';
  }
})

const freshmanCalculator = document.querySelector('.freshman')
const transferCalculator = document.querySelector('.transfer')


let freshmanOpt = document.querySelector('.freshmanOpt')
let transferOpt = document.querySelector('.transferOpt')


transferOpt.addEventListener('click', ()=>{
  

 if (!freshmanCalculator.classList.contains('hidden')){

  transferOpt.classList.add('current')
  freshmanOpt.classList.add('underline')
  freshmanOpt.classList.remove('current')
  transferOpt.classList.remove('underline')

  freshmanCalculator.classList.add('hidden')
  transferCalculator.classList.remove('hidden')

 }

})


freshmanOpt.addEventListener('click', ()=>{
  freshmanOpt.classList.add('current')
  transferOpt.classList.add('underline')
  transferOpt.classList.remove('current')
  freshmanOpt.classList.remove('underline')


  transferCalculator.classList.add('hidden')
  freshmanCalculator.classList.remove('hidden')
})

const date = new Date().getFullYear();
document.querySelector('.rmYear').innerText = date - 1
