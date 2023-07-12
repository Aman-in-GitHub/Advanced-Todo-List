import { stringify, v4 as uuidv4 } from 'uuid';

const inputs = document.querySelector('#add-todo');
const form = document.querySelector('form');
const list = document.querySelector('#list');
const template = document.querySelector('template');
const toggle = document.querySelectorAll('.toggle');

const arr = JSON.parse(localStorage.getItem('TODO')) || [];

arr.forEach((item) => {
  showTodo(item);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const uid = uuidv4();
  const value = inputs.value;
  if (value == '') return;
  const info = {
    name: value,
    status: false,
    id: uid
  };
  arr.push(info);
  showTodo(info);
  saveTodo(JSON.stringify(arr));
  form.reset();
});

function showTodo(info) {
  const templateClone = template.content.cloneNode(true);
  const todo = templateClone.querySelector('input[type="text"]');
  todo.value = info.name;
  todo.setAttribute('for', info.id);
  const checkBox = templateClone.querySelector('input');
  checkBox.checked = info.status;
  checkBox.setAttribute('id', info.id);

  todo.addEventListener('click', () => {
    const parent = todo.closest('.parent');
    const checkbox = parent.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
      checkbox.checked = false;
      todo.style.textDecoration = 'none';
    } else {
      checkbox.checked = true;
      todo.style.textDecoration = 'line-through';
    }

    const find = arr.find((item) => {
      return checkbox.id === item.id;
    });

    find.status = checkbox.checked;

    saveTodo(JSON.stringify(arr));
  });

  if (checkBox.checked) {
    todo.style.textDecoration = 'line-through';
  }

  list.prepend(templateClone);

  document.querySelector('#all').click();
}

document.addEventListener('click', (e) => {
  if (!e.target.matches("input[type ='checkbox']")) return;
  const box = e.target;

  const parent = box.closest('.parent');
  const input = parent.querySelector('input[type="text"]');

  const find = arr.find((item) => {
    return box.id === item.id;
  });

  find.status = !find.status;

  if (find.status) {
    input.style.textDecoration = 'line-through';
  } else {
    input.style.textDecoration = 'none';
  }

  saveTodo(JSON.stringify(arr));
});

function saveTodo(val) {
  localStorage.setItem('TODO', val);
}

document.addEventListener('click', (e) => {
  if (!e.target.matches('#delete')) return;
  const del = e.target;
  const parent = del.closest('.parent');
  const input = parent.querySelector('input[type="text"]');

  const find = arr.filter((item) => {
    return input.value == item.name;
  });

  const index = arr.indexOf(find[0]);

  arr.splice(index, 1);

  saveTodo(JSON.stringify(arr));

  parent.remove();
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#edit')) return;
  const edit = e.target;
  const parent = edit.closest('.parent');
  const input = parent.querySelector('input[type="text"]');
  input.removeAttribute('readonly');
  input.focus();
  const div = edit.closest('div');
  div.classList.add('hidden');
  const save = parent.querySelector('.save');
  save.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('.fa-floppy-disk')) return;
  const save = e.target;
  const parent = save.closest('.parent');
  const input = parent.querySelector('input[type="text"]');
  const check = parent.querySelector("input[type='checkbox']");
  input.setAttribute('readonly', 'readonly');

  const saveIcon = parent.querySelector('.save');
  saveIcon.classList.add('hidden');

  const edit = parent.querySelector('.edited');
  edit.classList.remove('hidden');

  const find = arr.find((item) => {
    return check.id === item.id;
  });
  find.name = input.value;
  saveTodo(JSON.stringify(arr));
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#clear')) return;
  arr.length = 0;
  saveTodo(JSON.stringify(arr));
  document.querySelectorAll('.parent').forEach((item) => {
    item.remove();
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#all')) return;
  toggle.forEach((item) => {
    item.classList.remove('active');
  });
  e.target.classList.add('active');

  const parents = Array.from(document.querySelectorAll('.parent'));
  parents.forEach((item) => {
    item.classList.remove('hidden');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#pending')) return;
  toggle.forEach((item) => {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
  const parents = Array.from(document.querySelectorAll('.parent'));
  parents.forEach((item) => {
    item.classList.remove('hidden');
  });

  const newArr = parents.filter((item) => {
    const input = item.querySelector("input[type='checkbox']");
    return input.checked != false;
  });
  newArr.forEach((item) => {
    item.classList.add('hidden');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#completed')) return;
  toggle.forEach((item) => {
    item.classList.remove('active');
  });
  e.target.classList.add('active');

  const parents = Array.from(document.querySelectorAll('.parent'));
  parents.forEach((item) => {
    item.classList.remove('hidden');
  });

  const newArr = parents.filter((item) => {
    const input = item.querySelector("input[type='checkbox']");
    return input.checked == false;
  });
  newArr.forEach((item) => {
    item.classList.add('hidden');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#search')) return;
  document.querySelector('#add-todo').classList.add('hidden');

  document.querySelector('.searching').classList.add('hidden');

  document.querySelector('.back').classList.remove('hidden');

  const search = document.querySelector('#search-todo');

  search.classList.remove('hidden');
  search.addEventListener('input', () => {
    document.querySelector('#all').click();

    const inputs = Array.from(
      document.querySelectorAll(".todo input[type='text']")
    );

    inputs.forEach((item) => {
      const val = search.value.toLowerCase();
      const isVisible = item.value.toLowerCase().includes(val);
      item.closest('.parent').classList.toggle('hidden', !isVisible);
    });
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.matches('#back')) return;
  document.querySelector('#add-todo').classList.remove('hidden');

  document.querySelector('#search-todo').classList.add('hidden');

  document.querySelector('.searching').classList.remove('hidden');

  document.querySelector('.back').classList.add('hidden');
});
