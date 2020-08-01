const musicDirectory = require('./src/musicDirectory');
const appView = require('./src/appView');
const { app } = require('electron');

const filename = "music.json";

var musicLibraryArray = [];
var nowPlaying = {};

// onstart up
function onStartUp(){
  document.getElementById("scanMusicDiv").style.visibility = "hidden";
  getMusicFile();
}

// check if music file "filename" exist. If file exist then read contents and parse into 'jsonArry' 
async function getMusicFile(){
  try{
    let md = new musicDirectory();
    musicLibraryArray = await md.retrieveMusicData(filename)
  
    if(musicLibraryArray != null){
      playMusic(1);
      let av = new appView();
      displayMusicLibrary(0,av);
    }

    else{
      //tell user to scan for music
      alert("Need to scan for music.");
      document.getElementById("scanMusicDiv").style.visibility = "visible";
    }
  }
  catch(err){
    console.error("Error is: "+err);
  }
}

// Gets info from musicLibraryArray and input html list items into the DOM 
function displayMusicLibrary(arrayIndex,av){

  if (arrayIndex < musicLibraryArray.length){

    var musicId = musicLibraryArray[arrayIndex]["id"];
    var musicName = musicLibraryArray[arrayIndex]["name"];

    av.renderContentForMusicListDiv(musicId,musicName);

    arrayIndex = arrayIndex + 1;

    window.requestAnimationFrame(function(){
      displayMusicLibrary(arrayIndex,av);
    })
  }
  else{
    return;
  }

} 

// takes musicId parameter and find an object in musicLibraryArray to input info in musicPlayerInfoDiv and play the song
async function playMusic(musicId){
  try{
    let item = await musicLibraryArray.find(element => element["id"] == musicId)
    let musicName = await item["name"];
    let musicPath = "file://" + item["path"] + "/" + musicName;
    //replace spaces with '%20'
    musicPath = await musicPath.split(' ').join('%20');

    // generate html for musicPlayerInfo Div
    let av = new appView();
    av.renderMusicPlayer(musicName,musicPath);
    
    nowPlaying.id = await musicId;
    nowPlaying.name = await musicName;
    nowPlaying.path = await musicPath;
    
    console.log(nowPlaying);
    //play song
    playOrPause();

  }
  catch(err){
    console.error("Error is: "+err);
  }
}

//********************************************************************************
//
// Function below are for looking up music files in a directory path provided
// by the user
//
//********************************************************************************

// entry point for 'Scan for Music' button
async function scanForMusic(){
  try{
    var directoryPath = document.getElementById('textMusicDirectory').value;
    if (directoryPath != null){
      let md = new musicDirectory();
      var messageResult = await md.startSearch(directoryPath);
      alert(messageResult);
    }
    else{
      alert("Enter a directory path");
    }

  }
  catch(err){
    console.log("Error is: " +err);
  }
}

//********************************************************************************
//
// Functions below are for media controls (play, pause, next, previous)
//
//********************************************************************************

// this function will play audio if it is paused or pause audio if its playing 
function playOrPause(){
  var audioPlayer = document.getElementById("audioPlayerId");

  if(audioPlayer.paused){
    audioPlayer.play();
  }
  else{
    audioPlayer.pause();
  }
}

// Entry point for next song icon and previous song icon. If num is 1 then 'next song' icon has been initiated by user
function nextOrPreviousSong(num){
  
  let musicId = parseInt(nowPlaying.id);

  if (num == 1){
    //next song
    musicId = musicId + 1;
  }
  else{
    //previous song
    musicId = musicId - 1;
  }

  findNextOrPerviousSong(musicId);
}

function findNextOrPerviousSong(id){
  let item = musicLibraryArray.find(element => element["id"] == id)
  if(item != null){
    playMusic(id);
  }
  else{
    //if next or previous song can't be found then play the first song in jsonArry
    id = parseInt(musicLibraryArray[0]["id"]);
    playMusic(id);
  }
}

function showHideSettingsDiv(){
  var settingDiv = document.getElementById("scanMusicDiv").style.visibility;
  if(settingDiv == "hidden"){
    document.getElementById("scanMusicDiv").style.visibility = "visible";
  }
  else{
    document.getElementById("scanMusicDiv").style.visibility = "hidden";
  }
  console.log(document.getElementById("scanMusicDiv").style.visibility);
}