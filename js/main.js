import {clearNode, saveToFile, saveToGithub, loadFromGithub} from './common.js';

var Content;
var Notes = [];

window.onload = doOnWindowLoad;
//doOnWindowLoad();
function doOnWindowLoad(e){
  window.alert('Hello!');
  document.querySelector('#btnCreateNote').onclick = createNote;
  document.querySelector('#btnShowNoteList').onclick = showNoteList;
  document.querySelector('#btnSave').onclick = doOnSave;
  document.querySelector('#btnLoadFromGithub').onclick = doOnLoadFromGithub;
  document.querySelector('#inpLoadFromFile').onchange = doOnLoadFromFile;
  Content = document.getElementById('content');
  let nl = window.localStorage.getItem('Noter.NoteList');if (nl) {
    Notes = JSON.parse(nl);
    showNoteList()
  }else{
    createNote()
  }
  //Content.innerHTML = 'Hello! You are welcome.';
}

function doOnLoadFromFile(e){
  let files = e.target.files;
  if(files.length <=0){
    console.log('there are no files');
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e){
    //Notes = JSON.parse(e.target.result);
    StringToNotes(e.target.result);
    showNoteList();
  }
  reader.readAsText(files[0])
}

function createNote() {
  let note = {Text: 'New Note'};
  i = 0;while(true){if(!Notes.list['note'+i]){break}; i++}
  let i = 'note'+i;
  Notes.list[i] = note;
  showNote(i);
}

function showNoteList() {
  clearNode(Content);
  let ListNode = document.createElement('ul');
  for (let k in Notes.list) {
    let node = document.querySelector('#tmplNoteListButton').cloneNode(true);
    node.setAttribute('class','NoteListButton');
    let a = node.querySelector('a');
    a.innerHTML = Notes.list[k].Text.split("\n",2)[0];
    a.onclick = function(e){showNote(k)}
    ListNode.appendChild(node);
  }
  Content.appendChild(ListNode);
}

function formatNote(index) {
  let result = '';
  let Note = Notes.list[index]
  Note = Note.Text.split("\n");
  for(let i=0;i<Note.length;i++){
    result += `<p>${Note[i]}</p>`;
  }
  return result;
}

function showNote(index) {
  let node = document.querySelector('#tmplNote').cloneNode(true);
  node.querySelector('.btnNoteEdit').onclick = doOnNoteEdit;
  node.querySelector('.btnNoteDelete').onclick = function(){deleteNote(index)};
  node.NoteIndex = index;
  node.setAttribute('class','NoteShow');
  node.querySelector('.NoteContent').innerHTML = formatNote(index);
  clearNode(Content);Content.appendChild(node)
}

function doOnShowLocalStorage(e){
  let s = '';Content.innerHTML = s;
  for(let i=0;i<window.localStorage.length;i++){
    let k = window.localStorage.key(i);
    s = s + `<br>${k} = ${window.localStorage.getItem(k)}`;
  }
  Content.innerHTML = s;
}

function deleteNote(index){
  delete(Notes.splice(index,1));
  showNoteList();
}

function doOnNoteEdit(e){
  let node = document.querySelector('.NoteContent');
  let index = node.parentElement.NoteIndex;
  if (node.getAttribute('contenteditable') == 'true') {
  Notes[index].Text = node.innerText;
  node.innerHTML = formatNote(index);
  node.setAttribute('contenteditable','false');
  } else {
  node.innerText = Notes[index].Text;
  node.setAttribute('contenteditable','true');
  node.focus();
  }
}

function NotesToString(){
  return JSON.stringify(Notes);
  let Result = {version: '0.0.0', list: {}}
  Notes.forEach((v,i) => {
    Result.list[`note${i}`] = v;
  })
  return JSON.stringify(Result);
}

function StringToNotes(str){
  Notes = JSON.parse(str);return;
  let Obj = JSON.parse(str);
  Notes = [];
  for(let k in Obj.list){Notes.push(Obj.list[k])}
}

function doOnSave(e) {
  let Data = NotesToString(Notes);
  window.localStorage.setItem('Noter.NoteList',Data);
  saveToFile(Data,'NoterData.json');
  saveToGithub(Data,localStorage.getItem('Noter.optionGitUser'),localStorage.getItem('Noter.optionGitRepo'),'test001.txt',localStorage.getItem('Noter.optionGitToken'));
}

function doOnLoadFromGithub(e){
  loadFromGithub(localStorage.getItem('Noter.optionGitUser'),localStorage.getItem('Noter.optionGitRepo'),'test001.txt',localStorage.getItem('Noter.optionGitToken'))
  .then((Data) => {
    StringToNotes(Data);
    //Notes = JSON.parse(Data);
    showNoteList();
  })
}
