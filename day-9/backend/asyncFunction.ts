function delay(ms: number): Promise<string> {
  return new Promise(resolve => setTimeout(() => {
    resolve(`Resolved after ${ms}ms`);
  }, ms));
}

async function fetchAndProcessData(): Promise<string>{
    console.log("starting data fetch")
    try{
        const result = await delay(2000)
        console.log('result: ', result);
        return result
        
    }catch(error){
        console.error("An error occured:", error)
    throw error;
    }
}
async function main() {
  console.log("Before calling fetchAndProcessData");
  const data = await fetchAndProcessData(); // 'await' pauses main until fetchAndProcessData resolves
  console.log("Processed data in main:", data);
  console.log("After calling fetchAndProcessData");
}
main();
