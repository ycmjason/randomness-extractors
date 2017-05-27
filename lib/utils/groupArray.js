var groupArray = module.exports = (arr, n) => {
  var newArr = [];
  var temp = [];
  arr.forEach(e => {
    temp.push(e);
    if(temp.length === n){
      newArr.push(temp);
      temp = [];
    }
  });
  return newArr;
};
