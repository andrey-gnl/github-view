export const formatDate = (date) => {
  let tmpDate = new Date(date);
  let year = tmpDate.getFullYear();
  let month = tmpDate.getMonth()+1;
  let dt = tmpDate.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return year+'-' + month + '-'+dt;
};

export const formSerialize = (form) => {
  let obj = {};
  let elements = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    let element = elements[i];
    let name = element.name;
    let value = element.getAttribute('type') === 'checkbox' ? element.checked : element.value;

    if (name) {
      obj[name] = value;
    }
  }

  return obj;
};

export const getArrayOfFieldsValue = (array, fieldName) => {
  return array.reduce((newArray, item) => {

    if (!newArray.includes(item[fieldName]) && item[fieldName]) {
      return [...newArray, item[fieldName]];
    } else {
      return newArray;
    }
  }, []);
};

export const uniqueArray = (array) => array.filter((el, i, a) => i === a.indexOf(el));

export const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export const roundNum = (number, floats = 2) => {
  var abbrev = [ 'k', 'm', 'b', 't' ];
  floats = Math.pow(10,floats);

  for (let i = abbrev.length-1; i >= 0; i--) {

    let size = Math.pow(10,(i+1)*3);

    if(size <= number) {
      number = Math.round(number*floats/size)/floats;

      if((+number === 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }

  return number;
};

export const convertBytes  = (bytes) => {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';

  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) return bytes + ' ' + sizes[i];

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

export const objectIsEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;
