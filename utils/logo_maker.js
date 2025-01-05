

function logoMaker(logo) {

  if(logo.length === 0) return '';

  // split logo into an array
  const logoArray = logo.split(' ');

  console.log(logoArray);

  // for each word in the array, get the first letter
  const firstLetter = logoArray.map(word => word[0]);

  console.log(firstLetter);

  // concatenate the first letters to form a new word
  const newWord = firstLetter.join('');

  console.log(newWord);

  return newWord;
}

export { logoMaker };