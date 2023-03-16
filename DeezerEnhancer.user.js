// ==UserScript==
// @name        Deezer enhance
// @namespace   github.com/fonfano
// @match       https://www.deezer.com/fr/*
// @grant       none
// @version     0.5.2
// @author      Lt Ripley
// @description Ajoute une image (album/artiste/avatar perso) et du texte en bas a gauche et augmente la taille de la seekbar en bas
// ==/UserScript==



// Historique
//  16/03/2023  Correction  v 0.5.2 Adaptation au nouveau nom d'un élément
//  03/06/2022  Correction  v 0.5.1 Fonctionne avec les nouveaux noms d'éléments
//  26/02/2022  Upgrade     v 0.5   Ajout des numéros de titres dans les coups de coeur (fonction deezer qui a disparu)
//  26/08/2021  Upgrade     v 0.4.1 Ajout texte : pseudo perso ou nom artiste dans page d'artiste
//  25/08/2021  Upgrade     v 0.4   Ajout texte : nom artist et album
//  22/08/2021  Upgrade     v 0.3   Ajout avatar perso dans les pages persos et avatar artiste dans les pages artistes
//  21/08/2021  Upgrade     v 0.2   Ajout augmentation de la taille de la seekbar en bas
//  12/08/2021  Création    v 0.1



// Options :
var delay = 5000; // augmenter si problèmes (6000, 8000...) 1000 = 1seconde
var seekbarHeight = "8px"; // taille en hauteur de la barre de progression dans le morceau
var displayTitleNumber = true;  // ajoute le numéro des titres dans les coups de coeur
//var seekbarHeight = "40%";   // OLD
// fin des options



var art;  // pochette de l'album / avatar perso / avatar artiste
var artClone;
var leftBar;
var seekbar;  // barre de progression dans le morceau, en bas.
var textDiv = document.createElement("div" );  // divs pour le texte en dessous image
var artistTextDiv = document.createElement("div" );
var albumTextDiv = document.createElement("div" );





function numberTheTitles() {

  if (displayTitleNumber && window.location.href.indexOf("loved") > -1 )  {

    //let titres = document.querySelectorAll(".JoTQr"); // OLD
    let titres = document.querySelectorAll("._2OACy");

    console.log(titres.length);

    console.log('numberTheTitles est appelé')

    for (let titre of titres)  {

      let number = titre.getAttribute('aria-rowindex');

      let monSpan = document.createElement("span");
      monSpan.appendChild(document.createTextNode(number.toString()));

      let maDiv = document.createElement("div");
      maDiv.style.marginLeft="2px";
      maDiv.setAttribute('id', 'maDivVR');

      try {

        titre.querySelector("#maDivVR").remove();

      } catch(error) {

        console.log(error);
      }

      maDiv.appendChild(monSpan);

      //titre.querySelector(".ZLI1L").appendChild(maDiv);  // OLD
      titre.querySelector("._1caJL").appendChild(maDiv);

    }

  }

}






window.onload = (event) => { // quand la page est chargée (mais faut quand même un setTimeout)

  console.log('window.onload passe');

  double(); // en dehors du timeout

  setTimeout(() => {

      // Partie seekbar (barre de progression en bas dans le morceau en cours)
      seekbar = document.querySelector("#page_player > div > div.player-track > div > div.track-seekbar > div > div.slider-track");
      seekbar.style.minHeight = seekbarHeight;

      // ajout du numero de titre
      numberTheTitles();


  }, delay);

};





// partie mutation observer pour la numerotation des titres

window.addEventListener('load', (event) => { // autre façon que window.onload ci dessus

  console.log('partie mutation observer titres');

  setTimeout(() => {

    let elementToObserve2 = document.querySelector("#page_profile");

    let observer2 = new MutationObserver(numberTheTitles); // déclaration avec appel fonction

    let options2 = {
      //childList: true,
      attributes: true,
      //characterData: true,
      subtree: true

    };

    observer2.observe(elementToObserve2, options2);

  }, delay);

});





// partie mutation observer pour les arts (avatars...), detecte un changement dans la page

window.addEventListener('load', (event) => { // autre façon que window.onload ci dessus

  console.log('partie mutation observer');

  setTimeout(() => {

    let elementToObserve = document.querySelector("#page_content"); //#page_content

    let observer = new MutationObserver(double); // appel fonction ci dessous

    let options = {
      childList: true,
      //attributes: true,
      //characterData: true,
      //subtree: true

    };

    observer.observe(elementToObserve, options);

  }, delay);

});




function double() {   // Appelée au 1er chargement et aussi par l'observer quand un changement est détecté.
                      // Lance 2 fois cloneArt() : tenter une fois 2sec après le chargement de page puis une nouvelle fois à 4s par sécurité car 2s est parfois trop court
  setTimeout(() => {

    cloneArt();

  }, (delay/2));


  setTimeout(() => {

    cloneArt();

  }, delay);

}



function cloneArt() { // appelé par double().  Fait le boulot (image) et lance text()

  console.log('cloneArt est appelé');

  let artFound = false;


  leftBar = document.querySelector("#page_sidebar");
  //leftBar = document.querySelector("#page_sidebar > div.sidebar-nav.nano.has-scrollbar > div.nano-content > div");

  try {
    leftBar.removeChild(artClone);
  }
  catch (error) {
    console.error(error);
  }

  // Si pochette
  if (document.querySelector("#page_naboo_album > div:nth-child(1) > div > div._5BJsj > div > div._2Rv6Z._2j25R"))  {
    art = document.querySelector("#page_naboo_album > div:nth-child(1) > div > div._5BJsj > div > div._2Rv6Z._2j25R");
    artFound = true;
  }

  // Si avatar perso au lieu de pochette (coups de coeurs etc)
  if (document.querySelector("#page_profile > div.profile-header-container > div > div > div > div._2Rv6Z._2j25R._2w27N._2L8AT"))  {
    art = document.querySelector("#page_profile > div.profile-header-container > div > div > div > div._2Rv6Z._2j25R._2w27N._2L8AT");
    artFound = true;
  }

  // Si artiste au lieu pochette ou avatar
  if (document.querySelector("#page_naboo_artist > div._5BJsj.container > div > div._2Rv6Z._2j25R._2w27N._2L8AT"))  {
    art = document.querySelector("#page_naboo_artist > div._5BJsj.container > div > div._2Rv6Z._2j25R._2w27N._2L8AT");
    artFound = true;
  }


  if (artFound)  {

    artClone = art.cloneNode(true);
    artClone.style.marginLeft = "10px";
    leftBar.appendChild(artClone);

  }


  addText();  // partie texte en dessous de l'image
                // je le mets ici sinon pour le mettre dans double() faudrait un timeout car il arrive avant l'image

}



function addText() {  // ajouter sous l'image nom artiste et album ou nom artiste ou pseudo perso

  try {
    albumTextDiv.innerHTML="";
    artistTextDiv.innerHTML="";
  }
  catch (error) {
    console.error(error);
  }


  // Artiste + album
  if (document.querySelector("#page_naboo_album > div:nth-child(1) > div > div._5BJsj > div > div._2Rv6Z._2j25R"))  {

    let artist = document.querySelector("#page_naboo_album > div:nth-child(1) > div > div._5BJsj > div > div._2yyo6 > div > h2").innerText;
    let album = document.querySelector("#page_naboo_album > div:nth-child(1) > div > div._5BJsj > div > div._2yyo6 > h1").innerText;

    console.log(artist);
    console.log(album);

    artistTextDiv.appendChild(document.createTextNode(artist));
    albumTextDiv.appendChild(document.createTextNode(album));

    artistTextDiv.style.fontSize = "20px";
    artistTextDiv.style.marginLeft = "10px";
    artistTextDiv.style.marginRight = "10px";
    artistTextDiv.style.textAlign = "left";

    albumTextDiv.style.fontSize = "15px";
    albumTextDiv.style.marginLeft = "10px";
    albumTextDiv.style.marginRight = "10px";

    textDiv.appendChild(artistTextDiv);
    textDiv.appendChild(albumTextDiv);

    leftBar.appendChild(textDiv);

  }


  // Artiste seul
  if (document.querySelector("#page_naboo_artist > div._5BJsj.container > div > div._2Rv6Z._2j25R._2w27N._2L8AT"))  {

    let artist = document.querySelector("#page_naboo_artist > div._5BJsj.container > div > div._2yyo6._3Ppj- > h1").innerText;

    artistTextDiv.appendChild(document.createTextNode(artist));
    artistTextDiv.style.fontSize = "20px";
    artistTextDiv.style.marginLeft = "10px";
    artistTextDiv.style.marginRight = "10px";
    artistTextDiv.style.textAlign = "center";

    textDiv.appendChild(artistTextDiv);

    leftBar.appendChild(textDiv);

  }


  // Pseudo perso
  if (document.querySelector("#page_profile > div.profile-header-container > div > div > div > div._2Rv6Z._2j25R._2w27N._2L8AT"))  {

    let pseudo = document.querySelector("#page_profile > div.profile-header-container > div > div > div > div._2yyo6.profile-header-info > h1").innerText;
    // je mets le pseudo dans le div artiste pour pas me faire chier
    artistTextDiv.appendChild(document.createTextNode(pseudo));
    artistTextDiv.style.fontSize = "20px";
    artistTextDiv.style.marginLeft = "10px";
    artistTextDiv.style.marginRight = "10px";
    artistTextDiv.style.textAlign = "center";

    textDiv.appendChild(artistTextDiv);

    leftBar.appendChild(textDiv);


  }


}

