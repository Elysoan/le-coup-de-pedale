/* ---------- NOMS DE COUREURS (générés aléatoirement par nationalité) ---------- */

const NAME_POOLS = {
  FR:{first:['Julien','Romain','Thibault','Antoine','Clément','Maxime','Baptiste','Matthieu','Arnaud'], last:['Vasseur','Moreau','Girard','Lefèvre','Rousseau','Perrin','Fournier','Stapor','Jollivet']},
  BE:{first:['Wout','Tim','Jasper','Yves','Dries','Kobe','Arnaud','Antoine'], last:['Van Damme','Vermeulen','Claeys','De Backer','Peeters','Willems','De Lie','Dusoulier']},
  IT:{first:['Matteo','Alessandro','Davide','Giulio','Lorenzo','Filippo','Simone','Lucca'], last:['Ferrari','Bianchi','Colombo','Moretti','Ricci','Conti','Marchetti','Buido']},
  NL:{first:['Mathieu','Bram','Sven','Daan','Thijs','Niels','Koen'], last:['de Groot','Bakker','Visser','Jansen','Smit','Mulder','Dekker']},
  ES:{first:['Alejandro','Pablo','Iñaki','Marc','Rubén','Óscar','Enrique'], last:['García','Fernández','Pérez','Martínez','Sánchez','Romero','Navarro']},
  DE:{first:['Lukas','Jonas','Felix','Tobias','Maximilian','Jan','Simon'], last:['Müller','Schneider','Becker','Hoffmann','Wagner','Richter','Zimmermann']},
  AU:{first:['Jack','Ryan','Cameron','Luke','Nathan','Ben','Harrison'], last:['Mitchell','Turner','Walsh','Coleman','Hughes','Baxter','Sinclair']},
  GB:{first:['Oliver','Thomas','George','Harry','Jack','Charlie','Daniel'], last:['Bennett','Carter','Foster','Whitfield','Hughes','Marsh','Doyle']},
  CO:{first:['Andrés','Camilo','Sebastián','Juan','Nairo','Esteban','Diego'], last:['Ramírez','Gómez','Torres','Vargas','Castro','Herrera','Molina']},
  DK:{first:['Mikkel','Jonas','Magnus','Anders','Kasper','Emil','Frederik'], last:['Nielsen','Jensen','Hansen','Andersen','Christensen','Pedersen','Mortensen']},
  CH:{first:['Marc','Lukas','Nino','Stefan','Reto','Silvan','Gino'], last:['Roth','Baumann','Keller','Meier','Steiner','Brunner','Zurbriggen']},
  SI:{first:['Tadej','Primož','Jan','Matej','Luka','Domen','Žiga'], last:['Novak','Kovač','Horvat','Zupan','Krajnc','Potočnik','Vidmar']},
  US:{first:['Tyler','Brandon','Sean','Kyle','Chris','Alex','Grant'], last:['Anderson','Miller','Reynolds','Coleman','Parker','Bishop','Harding']},
  NO:{first:['Kristoffer','Magnus','Sindre','Odd','Vegard','Tobias','Erlend'], last:['Hansen','Olsen','Johansen','Berg','Haugen','Solberg','Dahl']},
  LU:{first:['Bob','Laurent','Kevin','Michel','Pit','Nicolas','Tom'], last:['Weber','Kirsch','Schmit','Wagner','Muller','Thill','Braun']},
  PT:{first:['João','Rui','Nuno','Tiago','Miguel','Bruno','André'], last:['Silva','Costa','Ferreira','Oliveira','Sousa','Rodrigues','Carvalho']},
  PL:{first:['Michał','Kamil','Paweł','Piotr','Wojciech','Adam','Marcin'], last:['Kowalski','Nowak','Wiśniewski','Wójcik','Kamiński','Lewandowski','Zieliński']},
  IE:{first:['Sean','Conor','Liam','Cian','Darragh','Eoin','Ronan'], last:['Murphy','Kelly',"O'Brien",'Ryan','Byrne','Doyle','Walsh']},
  ER:{first:['Daniel','Natnael','Merhawi','Amanuel','Henok','Yonas','Robel'], last:['Tesfay','Ghebremedhin','Kidane','Weldu','Habte','Solomon','Mengistu']},
  RW:{first:['Jean','Eric','Joseph','Emmanuel','Patrick','Moise','Bonaventure'], last:['Uwimana','Nkurunziza','Habimana','Nsengimana','Mugisha','Niyonzima','Bizimana']},
};
