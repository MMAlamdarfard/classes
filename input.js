  const fs =require('fs')
  var inputdata =[]
  // Example usage

  const startTime = new Date();
  for(var i=0;i<2000;i++){
   
    
    var randomString = generateRandomString(20);
    inputdata.push({
        class:randomString,
        group:1,
        lessonNumber:(i+1000).toString(),
        unit:3,
        teacher:"سعید دهنوی آرانی",
        firstSession:"یکشنبه ساعت 18",
        secondSession:"سه شنبه ساعت 18"
      })
  }
  const endTime = new Date();
  const timeTaken = endTime - startTime;

  console.log("Time taken:", timeTaken, "milliseconds");
  writeJsonDataInput(inputdata,"class")


  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
  
    return result;
}
  function writeJsonDataInput(jsonData,path){
    
    const jsonString = JSON.stringify(jsonData, null, 2);
   
    
   const filePath = `./data/${path}.json`;
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
  