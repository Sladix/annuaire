export default function(){
  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

  // Des noms
  const prenoms = ["Gabriel","Alexandre","Arthur","Adam","Raphaël","Louis","Paul","Antoine","Maxime","Thomas","Victor","Lucas","Jules","Nathan","Hugo","Sacha","Mohamed","Enzo","Gaspard","Clement","Samuel","Ethan","Leo","Adrien","Martin","Rayan","Baptiste","Yanis","Simon","Joseph","Mathis","Oscar","Alexis","Pierre","Noah","Axel","Theo","Romain","Valentin","Augustin","Julien","Nicolas","Maxence","Noe","Benjamin","Quentin","Tom","Charles","David","Jean","Eliott","Aaron","Elias","Matthieu","Tristan","Timothee","Mathieu","Matteo","William","Amine","Felix","Côme","Ruben","Ulysse","Antonin","Guillaume","Aurelien","Robin","Maël","Kevin","Mehdi","Ismaël","Liam","Gabin","Noam","Evan","Marius","Mathias","Isaac","Samy","Ibrahim","Basile","Daniel","Emile","Lucien","Louise","Camille","Emma","Inès","Chloe","Sarah","Alice","Lea","Juliette","Jeanne","Eva","Clara","Lina","Anna","Charlotte","Mathilde","Marie","Manon","Lucie","Anaïs","Jade","Zoe","Nina","Lou","Clemence","Pauline","Lisa","Adèle","Gabrielle","Romane","Julia","Victoria","Emilie","Rose","Julie","Margaux","Lena","Victoire","Lola","Valentine","Agathe","Alix","Elisa","Elise","Margot","Yasmine","Laura","Noa","Sofia","Noemie","Heloïse","Sara","Apolline","Salome","Diane","Maya","Ambre","Elsa","Josephine","Capucine","Ava","Sasha","Eleonore","Iris","Fatoumata","Alicia","Eden","Mila","Nour","Andrea","Garance","Aya","Violette","Constance","Justine","Melissa","Oceane","Olivia"];
  const noms = ["Tremblay","Gagnon","Roy","Côté","Bouchard","Gauthier","Morin","Lavoie","Fortin","Gagné","Ouellet","Pelletier","Bélanger","Lévesque","Bergeron","Leblanc","Paquette","Girard","Simard","Boucher","Caron","Beaulieu","Cloutier","Dubé","Poirier","Fournier","Lapointe","Leclerc","Lefebvre","Poulin","Thibault","St-Pierre","Nadeau","Martin","Landry","Martel","Bédard","Grenier","Lessard","Bernier","Richard","Michaud","Hébert","Desjardins","Couture","Turcotte","Lachance","Parent","Blais","Gosselin","Savard","Proulx","Beaudoin","Demers","Perreault","Boudreau","Lemieux","Cyr","Perron","Dufour","Dion","Mercier","Bolduc","Bérubé","Boisvert","Langlois","Ménard","Therrien","Plante","Bilodeau"];

  function generateNumber(){
    let num = "0"+getRandomArbitrary(1,7);
    for (var i = 0; i < 8; i++) {
      num += getRandomArbitrary(0,9);
    }
    return num;
  }

  return {
    firstName: prenoms[getRandomArbitrary(0,prenoms.length-1)],
    lastName: noms[getRandomArbitrary(0,noms.length-1)],
    phone: generateNumber()
  };
}
