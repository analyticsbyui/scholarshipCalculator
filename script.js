let gpaCols = {"4.00": 0, "3.95": 1,"3.90": 2, "3.85": 3, "3.80": 4, "3.75": 5,"3.70": 6, "3.65": 7, "3.60": 8, "3.55": 9, "3.50": 10}
let actRows= {"36": 0, "35": 1, "34": 2, "33": 3, "32": 4, "31": 5, "30": 6, "29": 7, "28": 8, "27": 9, "26": 10,"25": 11}

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

function getPercentages(GPA, ACT){
  let row = actRows[ACT]
  let col = gpaCols[GPA]
  
  return scholarshipMatrix[row][col]
}

function setCSSAnimation(meritPercentage, rmPercentage){
  
  const styleSheet = document.styleSheets[1]; 

  // Remove any existing keyframes rule with the same name
  debugger
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

function alternateView(){
    document.querySelector('#calculate').addEventListener("click", ()=>{
    document.querySelector(".calculator").style.display = "none"
    document.querySelector(".results").style.display = "block"  
  })


  document.querySelector('#startOver').addEventListener("click", ()=>{
    document.querySelector(".calculator").style.display = "block"
    document.querySelector(".results").style.display = "none"  
  })
}

function calculateScholarship(GPA, ACT){
  const member = document.querySelector(".member").checked
  const missionary = document.querySelector('.missionary').checked

  
  const tuition = (member) ? 2400 : 4800
  const tuitionPercentage = 100
  const meritPercentage = getPercentages(GPA,ACT)
  const merit =  (meritPercentage * tuition)/tuitionPercentage
  const rMissionary = (missionary) ? 1000 : 0
  const rmPercentage = (rMissionary * tuitionPercentage)/tuition

  let totalPay = tuition - merit - rMissionary
  let otherSemesters = tuition - merit
  
  
  const circle = document.querySelector('.circle');
  circle.style.setProperty('--tuition', `${meritPercentage}%`);
  circle.style.setProperty('--merit', `${meritPercentage}%`);
  circle.style.setProperty('--RM', `${rmPercentage}%`);

  setCSSAnimation(meritPercentage, rmPercentage)

  document.querySelector(".tuition").innerText = `$${tuition}`
  document.querySelector(".merit").innerText = `$${merit}`
  document.querySelector(".rMissionary").innerText = `$${rMissionary}`
  document.querySelector(".firstSemester").innerText = `$${totalPay}`
  document.querySelector(".otherSemesters").innerText = `$${otherSemesters}`


}

document.querySelector('#calculate').addEventListener('click',()=>{
  const GPA = document.querySelector('#GPA').value;
  const ACT = document.querySelector('#ACT').value;
  const results =  document.querySelector('.results')
  const{display} = window.getComputedStyle(results, null)
  calculateScholarship(GPA, ACT)
  if (display != 'block'){
    alternateView()
  }
})