
const callDeleteEndpoint = async (event) => {
  const id = event.target.name; 

  await fetch(`/products/${id}`, {method: "DELETE"}).then(window.location.replace('/products'))
}

const callEditEndpoint = async (event) => {
  const id = event.target.name; 

  window.location.replace(`/products/${id}/update`)
}

const callEditCat = async (event) => {
  const id = event.target.name; 
  window.location.replace(`/categories/${id}/update`)
}

const callDeleteCat = async (event) => {
  const id = event.target.name; 
  const request = await fetch(`/categories/${id}`, {method: "DELETE"})

  if (request.status === 409) {
    const response = await request.json();
    const errorDialog = document.getElementById('cat-error');
    errorDialog.innerText = response.error;
  } else {
    window.location.replace(`/categories`)
  }

  
}

const deleteBtn = document.getElementById('delete');
const editBtn = document.getElementById('edit')

const catDelete = document.getElementById('delete-cat')
const catEdit = document.getElementById('edit-cat')

if (deleteBtn) {
  deleteBtn.addEventListener('click', callDeleteEndpoint)
  editBtn.addEventListener('click', callEditEndpoint)
}

if (catDelete) {
  catDelete.addEventListener('click', callDeleteCat)
  catEdit.addEventListener('click', callEditCat)
}
