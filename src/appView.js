// generates html

module.exports = class appView{
    constructor(){
      }
      
      async renderContentForMusicListDiv(musicId,musicName){
        let currentContent = document.getElementById('musicList').innerHTML;
        let htmlString = '<li><a onclick="playMusic('+musicId+')">' + musicName + '</a></li>';
        document.getElementById('musicList').innerHTML = currentContent + htmlString;
      }
      
      async renderMusicPlayer(musicName,musicPath){
        let htmlString = '<p>'+musicName+'</p><audio controls id="audioPlayerId"><source src="'+musicPath+'"/></audio>';
        document.getElementById("musicPlayerInfoDiv").innerHTML = htmlString;
    }
}