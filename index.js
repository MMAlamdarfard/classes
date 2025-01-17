

const jalaliMoment = require('jalali-moment');
const fs =require('fs')
//require('./input')
const halfterm = JSON.parse(fs.readFileSync("./data/halfterm.json"))
const startClassTerm = halfterm["start-class-half-term"]
const endClassTerm = halfterm["end-class-half-term"]
const holidays = halfterm["holidays"]
const classes =  JSON.parse(fs.readFileSync("./data/class.json"))
const allDays = getAllDaysBetween(startClassTerm, endClassTerm);
const prepareClassData=[]


const startTime = new Date();
for (var i=0;i<classes.length;i++){
  let clas = classes[i] 
  let dayClasses = []
  let sessions =[]
  let sessionCount = 1
  sessions.push(findPersianWeekDayIndex(clas.firstSession))
  if(clas.secondSession){
    sessions.push(findPersianWeekDayIndex(clas.secondSession))
  }

  for (var j=0;j<allDays.length;j++){
    let day = allDays[j]
    let date = jalaliMoment(day, 'jYYYY/jM/jD'); 
    date.locale('fa')
    let weekDay = date.weekday()
    sessions.forEach((session) =>{
        let weekDayClassSplit =session[1].split(":")
        let startDate = date.clone().hour(weekDayClassSplit[0]).minute(weekDayClassSplit[1]??0)
        startDate.locale('fa')
        if(weekDay == session[2]){
          if(holidays.includes(day)){
            dayClasses.push({
             
              isHoliday: true,
              date: day,
             })
          }else{
             dayClasses.push({ 
               is_Closure:false,
               MasterPresence:false,    
               date: day,
               isHoliday: false,
               MasterPresence:false,
               session:sessionCount,
               student:[
                {
                  id:1234,
                  is_absent:false,
                  type:"Qrcode"
                }
               ]
             
            })
          sessionCount++
          }
           
          
        }
    })
   
  }
  prepareClassData.push({
    ...clas,
    dayClasses:dayClasses,
    
  }) 
}
const endTime = new Date();
const timeTaken = endTime - startTime;
var classCount = 0;
prepareClassData.forEach((e)=>{
  var length = e.dayClasses.length
  console.log(e.lessonNumber+"  "+length)
  classCount +=  length
})
console.log(classCount)
console.log("Time taken:", timeTaken, "milliseconds");
writeJsonData(prepareClassData,"data3")
// for (var i=0;i<allDays.length;i++){
//    let day = allDays[i]
  
//    if(!holidays.includes(day)){
//        let date = jalaliMoment(day, 'jYYYY/jM/jD'); 
//        date.locale('fa')
//        let weekDay = date.weekday()
//        for (var j=0;j<classes.length;j++){
//           let clas = classes[j] 
//           let weekDayClass = findPersianWeekDayIndex(clas.firstSession)
//           let weekDayClassSplit =weekDayClass[1].split(":")
        
//           let startDate = date.clone().hour(weekDayClassSplit[0]).minute(weekDayClassSplit[1]??0)
//           startDate.locale('fa')
//           if(weekDay == weekDayClass[2]){
//             prepareClassData.push({
//               date:startDate.format('jYYYY/jMM/jDD'),
//               start:startDate.format('HH:mm'),
//               end:startDate.clone().add(1.5,'hour').format('HH:mm'),
//               weekDay:startDate.format('dddd'),
//               type:0,
//               description:{},
//               ...clas,
//               student:{
//                 absenceList:[]
//               }
//             })
//           }
//           if(clas.secondSession){
//             let weekDayClass = findPersianWeekDayIndex(clas.secondSession)
//             let weekDayClassSplit =weekDayClass[1].split(":")
//             let startDate = date.clone().hour(weekDayClassSplit[0]).minute(weekDayClassSplit[1]??0)
//             startDate.locale('fa')
//             if(weekDay == weekDayClass[2]){
//               prepareClassData.push({
//                 date:startDate.format('jYYYY/jMM/jDD'),
//                 start:startDate.format('HH:mm'),
//                 end:startDate.clone().add(1.5,'hour').format('HH:mm'),
//                 weekDay:startDate.format('dddd'),
//                 type:0,
//                 description:{},
//                 ...clas,
                
//                 student:{
//                   absenceList:[]
//                 }
//               })
//             }
//          }
//           }
          
//    }
   

//   }
// type  1 
//writeJsonData(prepareClassData,"data1")


// type  2
// const groupedData = prepareClassData.reduce((acc, obj) => {
//   const date = obj.date;
//   if (!acc[date]) {
//       acc[date] = [];
//   }
//   delete obj.date
//   acc[date].push(obj);
//   return acc;
// }, {});

// Convert grouped data object to array of objects
// const result = Object.entries(groupedData).map(([date, classes]) => {
//   return { date, classes };
// });


//writeJsonData(result,'data2')



























function findPersianWeekDayIndex(inputString) {
  const persianWeekDays = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سهشنبه',
    'چهارشنبه',
    'پنج‌شنبه',
    'جمعه'
  ];
  let data=inputString.split("ساعت").map((value)=>value.replace(/\s/g, ''))
  return [
    ...data,
    persianWeekDays.indexOf(data[0])
  ]  
  
}
function getAllDaysBetween(startDate, endDate) {
  const dates = [];
  let startDateFormat = jalaliMoment(startDate, 'jYYYY/jM/jD');
  let endDateFormat = jalaliMoment(endDate,'jYYYY/jM/jD')
  while (startDateFormat.isSameOrBefore(endDateFormat)) {
    dates.push(startDateFormat.format('jYYYY/jM/jD'));
    currentDate = startDateFormat.add(1, 'days');
  }

  return dates;
}
function writeJsonData(jsonData,path){
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  
  const filePath = `./result/${path}.json`;
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log('Existing file has been deleted successfully!');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return;
    }
    console.log('JSON file has been created successfully!');
  });
}


// function writeJsonDataInput(jsonData,path){
//   const jsonString = JSON.stringify(jsonData, null, 2);
  
  
//   const filePath = `./data/${path}.json`;
//   if (fs.existsSync(filePath)) {
//     try {
//       fs.unlinkSync(filePath);
//       console.log('Existing file has been deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting file:', err);
//     }
//   }
//   fs.writeFile(filePath, jsonString, 'utf8', (err) => {
//     if (err) {
//       console.error('Error writing JSON file:', err);
//       return;
//     }
//     console.log('JSON file has been created successfully!');
//   });
// }

