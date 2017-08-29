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
