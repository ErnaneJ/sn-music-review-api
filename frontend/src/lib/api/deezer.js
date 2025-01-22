export async function deezerSearch(term='BR') {
  try{
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${term}&order=RANKING`);
    const rawData = await response.json();
    console.log(rawData);
    return rawData.data;
  }catch(error){
    console.error(error);
  }
} 

deezerSearch('BR').then(console.log);