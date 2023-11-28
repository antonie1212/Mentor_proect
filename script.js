const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    return response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

const handleFormSubmit = async (formId) => {
  const form = document.getElementById(formId);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectElements = form.querySelectorAll('select'); // Get all select elements within the form
    const valuesArray = [];

    selectElements.forEach(selectElement => {
      const selectValues = [...selectElement.selectedOptions].map(option => option.value); // Get all selected values from each select element
      valuesArray.push(...selectValues); // Push the values to the array
    });

    // Create an object with all the extracted values
    const postDataObject = {
      selectValues: valuesArray // Assuming the values are related and can be sent together as an array
    };

    try {
      const json = JSON.stringify(postDataObject);
      console.log('Data to be sent:', json);

      // Post the data to the specified URL
      const response = await postData('http://localhost:3000/fruits', json);
      console.log('Response from server:', response);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
    }
  });
};




// Event listener for the Excel button click

// ----------------------multi select----------------------------------



function MultiSelectTag (el, customs = {shadow: false, rounded:true}) {
  var element = null
  var options = null
  var customSelectContainer = null
  var wrapper = null
  var btnContainer = null
  var body = null
  var inputContainer = null
  var inputBody = null
  var input = null
  var button = null
  var drawer = null
  var ul = null
  var tagColor = customs.tagColor || {}
  var domParser = new DOMParser()
  init()

  function init() {
      element = document.getElementById(el)
      createElements()
      initOptions()
      enableItemSelection()
      setValues(false)

      button.addEventListener('click', () => {
          if(drawer.classList.contains('hidden')) {
              initOptions()
              enableItemSelection()
              drawer.classList.remove('hidden')
              input.focus()
          }
      })

      input.addEventListener('keyup', (e) => {
              initOptions(e.target.value)
              enableItemSelection()
      })

      input.addEventListener('keydown', (e) => {
          if(e.key === 'Backspace' && !e.target.value && inputContainer.childElementCount > 1) {
              const child = body.children[inputContainer.childElementCount - 2].firstChild
              const option = options.find((op) => op.value == child.dataset.value)
              option.selected = false
              removeTag(child.dataset.value)
              setValues()
          }
          
      })
      
      window.addEventListener('click', (e) => {   
          if (!customSelectContainer.contains(e.target)){
              drawer.classList.add('hidden')
          }
      });

  }

  function createElements() {
      // Create custom elements
      options = getOptions();
      element.classList.add('hidden')
      
      // .multi-select-tag
      customSelectContainer = document.createElement('div')
      customSelectContainer.classList.add('mult-select-tag')

      // .container
      wrapper = document.createElement('div')
      wrapper.classList.add('wrapper')

      // body
      body = document.createElement('div')
      body.classList.add('body')
      if(customs.shadow) {
          body.classList.add('shadow')
      }
      if(customs.rounded) {
          body.classList.add('rounded')
      }
      
      // .input-container
      inputContainer = document.createElement('div')
      inputContainer.classList.add('input-container')

      // input
      input = document.createElement('input')
      input.classList.add('input')
      input.placeholder = `${customs.placeholder || 'Search...'}`

      inputBody = document.createElement('inputBody')
      inputBody.classList.add('input-body')
      inputBody.append(input)

      body.append(inputContainer)

      // .btn-container
      btnContainer = document.createElement('div')
      btnContainer.classList.add('btn-container')

      // button
      button = document.createElement('button')
      button.type = 'button'
      btnContainer.append(button)

      const icon = domParser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 21 6 15"></polyline></svg>`, 'image/svg+xml').documentElement
      button.append(icon)


      body.append(btnContainer)
      wrapper.append(body)

      drawer = document.createElement('div');
      drawer.classList.add(...['drawer', 'hidden'])
      if(customs.shadow) {
          drawer.classList.add('shadow')
      }
      if(customs.rounded) {
          drawer.classList.add('rounded')
      }
      drawer.append(inputBody)
      ul = document.createElement('ul');
      
      drawer.appendChild(ul)
  
      customSelectContainer.appendChild(wrapper)
      customSelectContainer.appendChild(drawer)

      // Place TailwindTagSelection after the element
      if (element.nextSibling) {
          element.parentNode.insertBefore(customSelectContainer, element.nextSibling)
      }
      else {
          element.parentNode.appendChild(customSelectContainer);
      }
  }

  function initOptions(val = null) {
      ul.innerHTML = ''
      for (var option of options) {
          if (option.selected) {
              !isTagSelected(option.value) && createTag(option)
          }
          else {
              const li = document.createElement('li')
              li.innerHTML = option.label
              li.dataset.value = option.value
              
              // For search
              if(val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
                  ul.appendChild(li)
              }
              else if(!val) {
                  ul.appendChild(li)
              }
          }
      }
  }

  function createTag(option) {
      // Create and show selected item as tag
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-container');
      itemDiv.style.color = tagColor.textColor || '#2c7a7b'
      itemDiv.style.borderColor = tagColor.borderColor || '#81e6d9'
      itemDiv.style.background = tagColor.bgColor || '#e6fffa'
      const itemLabel = document.createElement('div');
      itemLabel.classList.add('item-label');
      itemLabel.style.color = tagColor.textColor || '#2c7a7b'
      itemLabel.innerHTML = option.label
      itemLabel.dataset.value = option.value 
      const itemClose = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>`, 'image/svg+xml').documentElement

      itemClose.addEventListener('click', (e) => {
          const unselectOption = options.find((op) => op.value == option.value)
          unselectOption.selected = false
          removeTag(option.value)
          initOptions()
          setValues()
      })
  
      itemDiv.appendChild(itemLabel)
      itemDiv.appendChild(itemClose)
      inputContainer.append(itemDiv)
  }

  function enableItemSelection() {
      // Add click listener to the list items
      for(var li of ul.children) {
          li.addEventListener('click', (e) => {
              options.find((o) => o.value == e.target.dataset.value).selected = true
              input.value = null
              initOptions()
              setValues()
              input.focus()
          })
      }
  }

  function isTagSelected(val) {
      // If the item is already selected
      for(var child of inputContainer.children) {
          if(!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
              return true
          }
      }
      return false
  }
  function removeTag(val) {
      // Remove selected item
      for(var child of inputContainer.children) {
          if(!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
              inputContainer.removeChild(child)
          }
      }
  }

  function setValues(fireEvent=true) {
      // Update element final values
      selected_values = []
      for(var i = 0; i < options.length; i++) {
          element.options[i].selected = options[i].selected
          if(options[i].selected) {
              selected_values.push({label: options[i].label, value: options[i].value})
          }
      }
      if (fireEvent && customs.hasOwnProperty('onChange')) {
          customs.onChange(selected_values)
      }
  }
  function getOptions() {
      // Map element options
      return [...element.options].map((op) => {
          return {
              value: op.value,
              label: op.label,
              selected: op.selected,
          }
      })
  }
}

new MultiSelectTag('countries', {
  rounded: true,    // default true
  shadow: true,      // default false
  placeholder: 'Search',  // default Search...
  tagColor: {
      textColor: '#327b2c',
      borderColor: '#92e681',
      bgColor: '#eaffe6',
  }

})

handleFormSubmit('selection1'); // Change 'userForm1' to the ID of your first form
handleFormSubmit('selection2'); // Change 'userForm2' to the ID of your second form
handleFormSubmit('selection3'); // Change 'userForm3' to the ID



// ..................................EXCEL DOWNLOAD.....................................................


const workbookToExcelBlob = (workbook) => {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

const generateExcelFile = (valuesArray) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(valuesArray);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBlob = workbookToExcelBlob(workbook);

  const excelFileLink = document.createElement('a');
  excelFileLink.href = URL.createObjectURL(excelBlob);
  excelFileLink.download = 'form_data.xlsx';
  excelFileLink.click();
};

// Function to handle button click event for generating Excel file
const handleExcelButtonClick = () => {
  

    const excelData = [
      handleFormSubmit('selection1'),
      handleFormSubmit('selection2'),
    handleFormSubmit('selection3')
      // Add more form submissions as needed
    ];

    generateExcelFile(excelData);
}

const excelButton = document.getElementById('excelButton');
excelButton.addEventListener('click', handleExcelButtonClick);