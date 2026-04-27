// Official Porezna uprava source: https://porezna-uprava.gov.hr/UserDocsImages/arhiva/Dokumenti%20vijesti/naselje_opcine.xlsx
// Extracted from unique "opcina (3)" + "naziv općine" pairs in naselje_opcine.xlsx.

export type Opcina = {
  naziv: string;
  sifra: string;
};

export const OPCINE: Opcina[] = [
  {
    naziv: 'ANDRIJAŠEVCI',
    sifra: '001',
  },
  {
    naziv: 'ANTUNOVAC',
    sifra: '002',
  },
  {
    naziv: 'BABINA GREDA',
    sifra: '003',
  },
  {
    naziv: 'BAKAR',
    sifra: '004',
  },
  {
    naziv: 'BALE',
    sifra: '005',
  },
  {
    naziv: 'BARBAN',
    sifra: '006',
  },
  {
    naziv: 'BARILOVIĆI',
    sifra: '007',
  },
  {
    naziv: 'BAŠKA',
    sifra: '008',
  },
  {
    naziv: 'BAŠKA VODA',
    sifra: '009',
  },
  {
    naziv: 'BEBRINA',
    sifra: '010',
  },
  {
    naziv: 'BEDEKOVČINA',
    sifra: '011',
  },
  {
    naziv: 'BEDENICA',
    sifra: '550',
  },
  {
    naziv: 'BEDNJA',
    sifra: '012',
  },
  {
    naziv: 'BELI MANASTIR',
    sifra: '013',
  },
  {
    naziv: 'BELICA',
    sifra: '015',
  },
  {
    naziv: 'BELIŠĆE',
    sifra: '016',
  },
  {
    naziv: 'BENKOVAC',
    sifra: '017',
  },
  {
    naziv: 'BEREK',
    sifra: '018',
  },
  {
    naziv: 'BERETINEC',
    sifra: '019',
  },
  {
    naziv: 'BIBINJE',
    sifra: '020',
  },
  {
    naziv: 'BILICE',
    sifra: '621',
  },
  {
    naziv: 'BILJE',
    sifra: '021',
  },
  {
    naziv: 'BIOGRAD NA MORU',
    sifra: '022',
  },
  {
    naziv: 'BISKUPIJA',
    sifra: '310',
  },
  {
    naziv: 'BISTRA',
    sifra: '547',
  },
  {
    naziv: 'BIZOVAC',
    sifra: '023',
  },
  {
    naziv: 'BJELOVAR',
    sifra: '024',
  },
  {
    naziv: 'BLATO',
    sifra: '025',
  },
  {
    naziv: 'BOGDANOVCI',
    sifra: '026',
  },
  {
    naziv: 'BOL',
    sifra: '027',
  },
  {
    naziv: 'BOROVO',
    sifra: '029',
  },
  {
    naziv: 'BOSILJEVO',
    sifra: '030',
  },
  {
    naziv: 'BOŠNJACI',
    sifra: '032',
  },
  {
    naziv: 'BRCKOVLJANI',
    sifra: '033',
  },
  {
    naziv: 'BRDOVEC',
    sifra: '034',
  },
  {
    naziv: 'BRELA',
    sifra: '077',
  },
  {
    naziv: 'BRESTOVAC',
    sifra: '035',
  },
  {
    naziv: 'BREZNICA',
    sifra: '036',
  },
  {
    naziv: 'BREZNIČKI HUM',
    sifra: '151',
  },
  {
    naziv: 'BRINJE',
    sifra: '037',
  },
  {
    naziv: 'BROD MORAVICE',
    sifra: '038',
  },
  {
    naziv: 'BRODSKI STUPNIK',
    sifra: '039',
  },
  {
    naziv: 'BRTONIGLA',
    sifra: '040',
  },
  {
    naziv: 'BUDINŠČINA',
    sifra: '041',
  },
  {
    naziv: 'BUJE',
    sifra: '042',
  },
  {
    naziv: 'BUKOVLJE',
    sifra: '567',
  },
  {
    naziv: 'BUZET',
    sifra: '043',
  },
  {
    naziv: 'CERNA',
    sifra: '044',
  },
  {
    naziv: 'CERNIK',
    sifra: '046',
  },
  {
    naziv: 'CEROVLJE',
    sifra: '047',
  },
  {
    naziv: 'CESTICA',
    sifra: '048',
  },
  {
    naziv: 'CETINGRAD',
    sifra: '049',
  },
  {
    naziv: 'CISTA PROVO',
    sifra: '050',
  },
  {
    naziv: 'CIVLJANE',
    sifra: '051',
  },
  {
    naziv: 'CRES',
    sifra: '052',
  },
  {
    naziv: 'CRIKVENICA',
    sifra: '053',
  },
  {
    naziv: 'CRNAC',
    sifra: '054',
  },
  {
    naziv: 'ČABAR',
    sifra: '055',
  },
  {
    naziv: 'ČAČINCI',
    sifra: '056',
  },
  {
    naziv: 'ČAĐAVICA',
    sifra: '057',
  },
  {
    naziv: 'ČAGLIN',
    sifra: '058',
  },
  {
    naziv: 'ČAKOVEC',
    sifra: '060',
  },
  {
    naziv: 'ČAVLE',
    sifra: '061',
  },
  {
    naziv: 'ČAZMA',
    sifra: '063',
  },
  {
    naziv: 'ČEMINAC',
    sifra: '064',
  },
  {
    naziv: 'ČEPIN',
    sifra: '065',
  },
  {
    naziv: 'DARDA',
    sifra: '066',
  },
  {
    naziv: 'DARUVAR',
    sifra: '067',
  },
  {
    naziv: 'DAVOR',
    sifra: '068',
  },
  {
    naziv: 'DEKANOVEC',
    sifra: '603',
  },
  {
    naziv: 'DELNICE',
    sifra: '069',
  },
  {
    naziv: 'DESINIĆ',
    sifra: '070',
  },
  {
    naziv: 'DEŽANOVAC',
    sifra: '071',
  },
  {
    naziv: 'DICMO',
    sifra: '072',
  },
  {
    naziv: 'DOBRINJ',
    sifra: '074',
  },
  {
    naziv: 'DOMAŠINEC',
    sifra: '075',
  },
  {
    naziv: 'DONJA DUBRAVA',
    sifra: '078',
  },
  {
    naziv: 'DONJA MOTIČINA',
    sifra: '576',
  },
  {
    naziv: 'DONJA STUBICA',
    sifra: '079',
  },
  {
    naziv: 'DONJA VOĆA',
    sifra: '080',
  },
  {
    naziv: 'DONJI ANDRIJEVCI',
    sifra: '081',
  },
  {
    naziv: 'DONJI KRALJEVEC',
    sifra: '082',
  },
  {
    naziv: 'DONJI KUKURUZARI',
    sifra: '083',
  },
  {
    naziv: 'DONJI LAPAC',
    sifra: '084',
  },
  {
    naziv: 'DONJI MARTIJANEC',
    sifra: '085',
  },
  {
    naziv: 'DONJI MIHOLJAC',
    sifra: '086',
  },
  {
    naziv: 'DONJI VIDOVEC',
    sifra: '089',
  },
  {
    naziv: 'DRAGALIĆ',
    sifra: '568',
  },
  {
    naziv: 'DRAGANIĆ',
    sifra: '090',
  },
  {
    naziv: 'DRAŽ',
    sifra: '091',
  },
  {
    naziv: 'DRENOVCI',
    sifra: '092',
  },
  {
    naziv: 'DRENJE',
    sifra: '094',
  },
  {
    naziv: 'DRNIŠ',
    sifra: '095',
  },
  {
    naziv: 'DRNJE',
    sifra: '096',
  },
  {
    naziv: 'DUBRAVA',
    sifra: '097',
  },
  {
    naziv: 'DUBRAVICA',
    sifra: '549',
  },
  {
    naziv: 'DUBROVAČKO PRIMORJE',
    sifra: '598',
  },
  {
    naziv: 'DUBROVNIK',
    sifra: '098',
  },
  {
    naziv: 'DUGA RESA',
    sifra: '099',
  },
  {
    naziv: 'DUGI RAT',
    sifra: '100',
  },
  {
    naziv: 'DUGO SELO',
    sifra: '101',
  },
  {
    naziv: 'DUGOPOLJE',
    sifra: '585',
  },
  {
    naziv: 'DVOR',
    sifra: '102',
  },
  {
    naziv: 'ĐAKOVO',
    sifra: '103',
  },
  {
    naziv: 'ĐELEKOVEC',
    sifra: '104',
  },
  {
    naziv: 'ĐULOVAC',
    sifra: '105',
  },
  {
    naziv: 'ĐURĐENOVAC',
    sifra: '106',
  },
  {
    naziv: 'ĐURĐEVAC',
    sifra: '107',
  },
  {
    naziv: 'ĐURMANEC',
    sifra: '108',
  },
  {
    naziv: 'ERDUT',
    sifra: '110',
  },
  {
    naziv: 'ERNESTINOVO',
    sifra: '111',
  },
  {
    naziv: 'ERVENIK',
    sifra: '113',
  },
  {
    naziv: 'FARKAŠEVAC',
    sifra: '114',
  },
  {
    naziv: 'FAŽANA',
    sifra: '619',
  },
  {
    naziv: 'FERDINANDOVAC',
    sifra: '115',
  },
  {
    naziv: 'FERIČANCI',
    sifra: '116',
  },
  {
    naziv: 'FUNTANA',
    sifra: '629',
  },
  {
    naziv: 'FUŽINE',
    sifra: '117',
  },
  {
    naziv: 'GALOVAC',
    sifra: '571',
  },
  {
    naziv: 'GARČIN',
    sifra: '118',
  },
  {
    naziv: 'GAREŠNICA',
    sifra: '119',
  },
  {
    naziv: 'GENERALSKI STOL',
    sifra: '120',
  },
  {
    naziv: 'GLINA',
    sifra: '121',
  },
  {
    naziv: 'GOLA',
    sifra: '122',
  },
  {
    naziv: 'GORIČAN',
    sifra: '123',
  },
  {
    naziv: 'GORJANI',
    sifra: '124',
  },
  {
    naziv: 'GORNJA RIJEKA',
    sifra: '618',
  },
  {
    naziv: 'GORNJA STUBICA',
    sifra: '125',
  },
  {
    naziv: 'GORNJA VRBA',
    sifra: '569',
  },
  {
    naziv: 'GORNJI BOGIĆEVCI',
    sifra: '127',
  },
  {
    naziv: 'GORNJI KNEGINEC',
    sifra: '129',
  },
  {
    naziv: 'GORNJI MIHALJEVEC',
    sifra: '604',
  },
  {
    naziv: 'GOSPIĆ',
    sifra: '130',
  },
  {
    naziv: 'GRAČAC',
    sifra: '131',
  },
  {
    naziv: 'GRAČIŠĆE',
    sifra: '132',
  },
  {
    naziv: 'GRAD ZAGREB',
    sifra: '133',
  },
  {
    naziv: 'GRADAC',
    sifra: '134',
  },
  {
    naziv: 'GRADEC',
    sifra: '135',
  },
  {
    naziv: 'GRADINA',
    sifra: '136',
  },
  {
    naziv: 'GRADIŠTE',
    sifra: '137',
  },
  {
    naziv: 'GROŽNJAN',
    sifra: '138',
  },
  {
    naziv: 'GRUBIŠNO POLJE',
    sifra: '139',
  },
  {
    naziv: 'GUNDINCI',
    sifra: '140',
  },
  {
    naziv: 'GUNJA',
    sifra: '141',
  },
  {
    naziv: 'GVOZD',
    sifra: '510',
  },
  {
    naziv: 'HERCEGOVAC',
    sifra: '144',
  },
  {
    naziv: 'HLEBINE',
    sifra: '145',
  },
  {
    naziv: 'HRAŠĆINA',
    sifra: '146',
  },
  {
    naziv: 'HRVACE',
    sifra: '148',
  },
  {
    naziv: 'HRVATSKA DUBICA',
    sifra: '149',
  },
  {
    naziv: 'HRVATSKA KOSTAJNICA',
    sifra: '150',
  },
  {
    naziv: 'HUM NA SUTLI',
    sifra: '152',
  },
  {
    naziv: 'HVAR',
    sifra: '153',
  },
  {
    naziv: 'ILOK',
    sifra: '154',
  },
  {
    naziv: 'IMOTSKI',
    sifra: '155',
  },
  {
    naziv: 'IVANEC',
    sifra: '156',
  },
  {
    naziv: 'IVANIĆ-GRAD',
    sifra: '158',
  },
  {
    naziv: 'IVANKOVO',
    sifra: '159',
  },
  {
    naziv: 'IVANSKA',
    sifra: '161',
  },
  {
    naziv: 'JAGODNJAK',
    sifra: '609',
  },
  {
    naziv: 'JAKOVLJE',
    sifra: '163',
  },
  {
    naziv: 'JAKŠIĆ',
    sifra: '164',
  },
  {
    naziv: 'JALŽABET',
    sifra: '165',
  },
  {
    naziv: 'JANJINA',
    sifra: '599',
  },
  {
    naziv: 'JARMINA',
    sifra: '166',
  },
  {
    naziv: 'JASENICE',
    sifra: '167',
  },
  {
    naziv: 'JASENOVAC',
    sifra: '168',
  },
  {
    naziv: 'JASTREBARSKO',
    sifra: '169',
  },
  {
    naziv: 'JELENJE',
    sifra: '170',
  },
  {
    naziv: 'JELSA',
    sifra: '171',
  },
  {
    naziv: 'JESENJE',
    sifra: '552',
  },
  {
    naziv: 'JOSIPDOL',
    sifra: '172',
  },
  {
    naziv: 'KALI',
    sifra: '173',
  },
  {
    naziv: 'KALINOVAC',
    sifra: '559',
  },
  {
    naziv: 'KALNIK',
    sifra: '560',
  },
  {
    naziv: 'KAMANJE',
    sifra: '623',
  },
  {
    naziv: 'KANFANAR',
    sifra: '175',
  },
  {
    naziv: 'KAPELA',
    sifra: '176',
  },
  {
    naziv: 'KAPTOL',
    sifra: '177',
  },
  {
    naziv: 'KARLOBAG',
    sifra: '178',
  },
  {
    naziv: 'KARLOVAC',
    sifra: '179',
  },
  {
    naziv: 'KAROJBA',
    sifra: '596',
  },
  {
    naziv: 'KASTAV',
    sifra: '180',
  },
  {
    naziv: 'KAŠTELA',
    sifra: '181',
  },
  {
    naziv: 'KAŠTELIR - LABINCI',
    sifra: '597',
  },
  {
    naziv: 'KIJEVO',
    sifra: '183',
  },
  {
    naziv: 'KISTANJE',
    sifra: '184',
  },
  {
    naziv: 'KLAKAR',
    sifra: '185',
  },
  {
    naziv: 'KLANA',
    sifra: '186',
  },
  {
    naziv: 'KLANJEC',
    sifra: '187',
  },
  {
    naziv: 'KLENOVNIK',
    sifra: '189',
  },
  {
    naziv: 'KLINČA SELA',
    sifra: '190',
  },
  {
    naziv: 'KLIS',
    sifra: '192',
  },
  {
    naziv: 'KLOŠTAR IVANIĆ',
    sifra: '193',
  },
  {
    naziv: 'KLOŠTAR PODRAVSKI',
    sifra: '194',
  },
  {
    naziv: 'KNEŽEVI VINOGRADI',
    sifra: '195',
  },
  {
    naziv: 'KNIN',
    sifra: '196',
  },
  {
    naziv: 'KOLAN',
    sifra: '622',
  },
  {
    naziv: 'KOMIŽA',
    sifra: '197',
  },
  {
    naziv: 'KONAVLE',
    sifra: '198',
  },
  {
    naziv: 'KONČANICA',
    sifra: '199',
  },
  {
    naziv: 'KONJŠČINA',
    sifra: '200',
  },
  {
    naziv: 'KOPRIVNICA',
    sifra: '201',
  },
  {
    naziv: 'KOPRIVNIČKI BREGI',
    sifra: '202',
  },
  {
    naziv: 'KOPRIVNIČKI IVANEC',
    sifra: '203',
  },
  {
    naziv: 'KORČULA',
    sifra: '204',
  },
  {
    naziv: 'KOSTRENA',
    sifra: '538',
  },
  {
    naziv: 'KOŠKA',
    sifra: '205',
  },
  {
    naziv: 'KOTORIBA',
    sifra: '206',
  },
  {
    naziv: 'KRALJEVEC NA SUTLI',
    sifra: '208',
  },
  {
    naziv: 'KRALJEVICA',
    sifra: '209',
  },
  {
    naziv: 'KRAPINA',
    sifra: '211',
  },
  {
    naziv: 'KRAPINSKE TOPLICE',
    sifra: '212',
  },
  {
    naziv: 'KRAŠIĆ',
    sifra: '533',
  },
  {
    naziv: 'KRAVARSKO',
    sifra: '545',
  },
  {
    naziv: 'KRIŽ',
    sifra: '213',
  },
  {
    naziv: 'KRIŽEVCI',
    sifra: '214',
  },
  {
    naziv: 'KRK',
    sifra: '215',
  },
  {
    naziv: 'KRNJAK',
    sifra: '216',
  },
  {
    naziv: 'KRŠAN',
    sifra: '217',
  },
  {
    naziv: 'KUKLJICA',
    sifra: '572',
  },
  {
    naziv: 'KULA NORINSKA',
    sifra: '219',
  },
  {
    naziv: 'KUMROVEC',
    sifra: '553',
  },
  {
    naziv: 'KUTINA',
    sifra: '220',
  },
  {
    naziv: 'KUTJEVO',
    sifra: '221',
  },
  {
    naziv: 'LABIN',
    sifra: '222',
  },
  {
    naziv: 'LANIŠĆE',
    sifra: '223',
  },
  {
    naziv: 'LASINJA',
    sifra: '225',
  },
  {
    naziv: 'LASTOVO',
    sifra: '226',
  },
  {
    naziv: 'LEĆEVICA',
    sifra: '586',
  },
  {
    naziv: 'LEGRAD',
    sifra: '227',
  },
  {
    naziv: 'LEKENIK',
    sifra: '228',
  },
  {
    naziv: 'LEPOGLAVA',
    sifra: '229',
  },
  {
    naziv: 'LEVANJSKA VAROŠ',
    sifra: '230',
  },
  {
    naziv: 'LIPIK',
    sifra: '231',
  },
  {
    naziv: 'LIPOVLJANI',
    sifra: '232',
  },
  {
    naziv: 'LIŠANE OSTROVIČKE',
    sifra: '234',
  },
  {
    naziv: 'LIŽNJAN',
    sifra: '235',
  },
  {
    naziv: 'LOBOR',
    sifra: '236',
  },
  {
    naziv: 'LOKVE',
    sifra: '237',
  },
  {
    naziv: 'LOKVIČIĆI',
    sifra: '587',
  },
  {
    naziv: 'LOPAR',
    sifra: '624',
  },
  {
    naziv: 'LOVAS',
    sifra: '239',
  },
  {
    naziv: 'LOVINAC',
    sifra: '240',
  },
  {
    naziv: 'LOVRAN',
    sifra: '242',
  },
  {
    naziv: 'LOVREĆ',
    sifra: '243',
  },
  {
    naziv: 'LUDBREG',
    sifra: '244',
  },
  {
    naziv: 'LUKA',
    sifra: '548',
  },
  {
    naziv: 'LUKAČ',
    sifra: '245',
  },
  {
    naziv: 'LUMBARDA',
    sifra: '600',
  },
  {
    naziv: 'LUPOGLAV',
    sifra: '246',
  },
  {
    naziv: 'LJUBEŠĆICA',
    sifra: '247',
  },
  {
    naziv: 'MAČE',
    sifra: '248',
  },
  {
    naziv: 'MAGADENOVAC',
    sifra: '578',
  },
  {
    naziv: 'MAJUR',
    sifra: '555',
  },
  {
    naziv: 'MAKARSKA',
    sifra: '249',
  },
  {
    naziv: 'MALA SUBOTICA',
    sifra: '250',
  },
  {
    naziv: 'MALI BUKOVEC',
    sifra: '251',
  },
  {
    naziv: 'MALI LOŠINJ',
    sifra: '252',
  },
  {
    naziv: 'MALINSKA-DUBAŠNICA',
    sifra: '253',
  },
  {
    naziv: 'MARČANA',
    sifra: '254',
  },
  {
    naziv: 'MARIJA BISTRICA',
    sifra: '256',
  },
  {
    naziv: 'MARIJA GORICA',
    sifra: '539',
  },
  {
    naziv: 'MARIJANCI',
    sifra: '257',
  },
  {
    naziv: 'MARINA',
    sifra: '258',
  },
  {
    naziv: 'MARKUŠICA',
    sifra: '610',
  },
  {
    naziv: 'MARTINSKA VES',
    sifra: '259',
  },
  {
    naziv: 'MARUŠEVEC',
    sifra: '260',
  },
  {
    naziv: 'MATULJI',
    sifra: '261',
  },
  {
    naziv: 'MEDULIN',
    sifra: '263',
  },
  {
    naziv: 'METKOVIĆ',
    sifra: '264',
  },
  {
    naziv: 'MIHOVLJAN',
    sifra: '265',
  },
  {
    naziv: 'MIKLEUŠ',
    sifra: '266',
  },
  {
    naziv: 'MILNA',
    sifra: '267',
  },
  {
    naziv: 'MLJET',
    sifra: '268',
  },
  {
    naziv: 'MOLVE',
    sifra: '270',
  },
  {
    naziv: 'MOŠĆENIČKA DRAGA',
    sifra: '273',
  },
  {
    naziv: 'MOTOVUN',
    sifra: '274',
  },
  {
    naziv: 'MRKOPALJ',
    sifra: '275',
  },
  {
    naziv: 'MUĆ',
    sifra: '087',
  },
  {
    naziv: 'MURSKO SREDIŠĆE',
    sifra: '276',
  },
  {
    naziv: 'MURTER - KORNATI',
    sifra: '617',
  },
  {
    naziv: 'NAŠICE',
    sifra: '278',
  },
  {
    naziv: 'NEDELIŠĆE',
    sifra: '279',
  },
  {
    naziv: 'NEGOSLAVCI',
    sifra: '612',
  },
  {
    naziv: 'NEREŽIŠĆA',
    sifra: '280',
  },
  {
    naziv: 'NETRETIĆ',
    sifra: '281',
  },
  {
    naziv: 'NIJEMCI',
    sifra: '295',
  },
  {
    naziv: 'NIN',
    sifra: '282',
  },
  {
    naziv: 'NOVA BUKOVICA',
    sifra: '283',
  },
  {
    naziv: 'NOVA GRADIŠKA',
    sifra: '284',
  },
  {
    naziv: 'NOVA KAPELA',
    sifra: '285',
  },
  {
    naziv: 'NOVA RAČA',
    sifra: '287',
  },
  {
    naziv: 'NOVALJA',
    sifra: '288',
  },
  {
    naziv: 'NOVI GOLUBOVEC',
    sifra: '554',
  },
  {
    naziv: 'NOVI MAROF',
    sifra: '289',
  },
  {
    naziv: 'NOVI VINODOLSKI',
    sifra: '290',
  },
  {
    naziv: 'NOVIGRAD',
    sifra: '291',
  },
  {
    naziv: 'NOVIGRAD',
    sifra: '537',
  },
  {
    naziv: 'NOVIGRAD PODRAVSKI',
    sifra: '292',
  },
  {
    naziv: 'NOVO VIRJE',
    sifra: '561',
  },
  {
    naziv: 'NOVSKA',
    sifra: '293',
  },
  {
    naziv: 'NUŠTAR',
    sifra: '294',
  },
  {
    naziv: 'OBROVAC',
    sifra: '296',
  },
  {
    naziv: 'OGULIN',
    sifra: '297',
  },
  {
    naziv: 'OKRUG',
    sifra: '588',
  },
  {
    naziv: 'OKUČANI',
    sifra: '299',
  },
  {
    naziv: 'OMIŠ',
    sifra: '300',
  },
  {
    naziv: 'OMIŠALJ',
    sifra: '301',
  },
  {
    naziv: 'OPATIJA',
    sifra: '302',
  },
  {
    naziv: 'OPRISAVCI',
    sifra: '303',
  },
  {
    naziv: 'OPRTALJ',
    sifra: '304',
  },
  {
    naziv: 'OPUZEN',
    sifra: '306',
  },
  {
    naziv: 'ORAHOVICA',
    sifra: '307',
  },
  {
    naziv: 'OREBIĆ',
    sifra: '308',
  },
  {
    naziv: 'OREHOVICA',
    sifra: '605',
  },
  {
    naziv: 'ORIOVAC',
    sifra: '309',
  },
  {
    naziv: 'ORLE',
    sifra: '542',
  },
  {
    naziv: 'OROSLAVJE',
    sifra: '311',
  },
  {
    naziv: 'OSIJEK',
    sifra: '312',
  },
  {
    naziv: 'OTOČAC',
    sifra: '313',
  },
  {
    naziv: 'OTOK',
    sifra: '314',
  },
  {
    naziv: 'OTOK (VINKOVCI)',
    sifra: '535',
  },
  {
    naziv: 'OZALJ',
    sifra: '315',
  },
  {
    naziv: 'PAG',
    sifra: '316',
  },
  {
    naziv: 'PAKOŠTANE',
    sifra: '317',
  },
  {
    naziv: 'PAKRAC',
    sifra: '318',
  },
  {
    naziv: 'PAŠMAN',
    sifra: '320',
  },
  {
    naziv: 'PAZIN',
    sifra: '321',
  },
  {
    naziv: 'PERUŠIĆ',
    sifra: '323',
  },
  {
    naziv: 'PETERANEC',
    sifra: '324',
  },
  {
    naziv: 'PETLOVAC',
    sifra: '325',
  },
  {
    naziv: 'PETRIJANEC',
    sifra: '326',
  },
  {
    naziv: 'PETRIJEVCI',
    sifra: '327',
  },
  {
    naziv: 'PETRINJA',
    sifra: '328',
  },
  {
    naziv: 'PETROVSKO',
    sifra: '329',
  },
  {
    naziv: 'PIĆAN',
    sifra: '330',
  },
  {
    naziv: 'PIROVAC',
    sifra: '581',
  },
  {
    naziv: 'PISAROVINA',
    sifra: '331',
  },
  {
    naziv: 'PITOMAČA',
    sifra: '332',
  },
  {
    naziv: 'PLAŠKI',
    sifra: '333',
  },
  {
    naziv: 'PLETERNICA',
    sifra: '334',
  },
  {
    naziv: 'PLITVIČKA JEZERA',
    sifra: '455',
  },
  {
    naziv: 'PLOČE',
    sifra: '335',
  },
  {
    naziv: 'PODBABLJE',
    sifra: '337',
  },
  {
    naziv: 'PODCRKAVLJE',
    sifra: '338',
  },
  {
    naziv: 'PODGORA',
    sifra: '339',
  },
  {
    naziv: 'PODGORAČ',
    sifra: '340',
  },
  {
    naziv: 'PODRAVSKA MOSLAVINA',
    sifra: '271',
  },
  {
    naziv: 'PODRAVSKE SESVETE',
    sifra: '616',
  },
  {
    naziv: 'PODSTRANA',
    sifra: '341',
  },
  {
    naziv: 'PODTUREN',
    sifra: '342',
  },
  {
    naziv: 'POJEZERJE',
    sifra: '343',
  },
  {
    naziv: 'POKUPSKO',
    sifra: '544',
  },
  {
    naziv: 'POLAČA',
    sifra: '344',
  },
  {
    naziv: 'POLIČNIK',
    sifra: '345',
  },
  {
    naziv: 'POPOVAC',
    sifra: '346',
  },
  {
    naziv: 'POPOVAČA',
    sifra: '347',
  },
  {
    naziv: 'POREČ',
    sifra: '348',
  },
  {
    naziv: 'POSEDARJE',
    sifra: '349',
  },
  {
    naziv: 'POSTIRA',
    sifra: '350',
  },
  {
    naziv: 'POVLJANA',
    sifra: '573',
  },
  {
    naziv: 'POŽEGA',
    sifra: '351',
  },
  {
    naziv: 'PREGRADA',
    sifra: '352',
  },
  {
    naziv: 'PREKO',
    sifra: '354',
  },
  {
    naziv: 'PRELOG',
    sifra: '355',
  },
  {
    naziv: 'PRESEKA',
    sifra: '356',
  },
  {
    naziv: 'PRGOMET',
    sifra: '589',
  },
  {
    naziv: 'PRIBISLAVEC',
    sifra: '620',
  },
  {
    naziv: 'PRIMORSKI DOLAC',
    sifra: '590',
  },
  {
    naziv: 'PRIMOŠTEN',
    sifra: '357',
  },
  {
    naziv: 'PRIVLAKA',
    sifra: '574',
  },
  {
    naziv: 'PRIVLAKA',
    sifra: '583',
  },
  {
    naziv: 'PROLOŽAC',
    sifra: '088',
  },
  {
    naziv: 'PROMINA',
    sifra: '298',
  },
  {
    naziv: 'PUČIŠĆA',
    sifra: '358',
  },
  {
    naziv: 'PULA',
    sifra: '359',
  },
  {
    naziv: 'PUNAT',
    sifra: '360',
  },
  {
    naziv: 'PUNITOVCI',
    sifra: '361',
  },
  {
    naziv: 'PUŠĆA',
    sifra: '362',
  },
  {
    naziv: 'RAB',
    sifra: '363',
  },
  {
    naziv: 'RADOBOJ',
    sifra: '364',
  },
  {
    naziv: 'RAKOVEC',
    sifra: '536',
  },
  {
    naziv: 'RAKOVICA',
    sifra: '365',
  },
  {
    naziv: 'RASINJA',
    sifra: '366',
  },
  {
    naziv: 'RAŠA',
    sifra: '368',
  },
  {
    naziv: 'RAVNA GORA',
    sifra: '369',
  },
  {
    naziv: 'RAŽANAC',
    sifra: '371',
  },
  {
    naziv: 'REŠETARI',
    sifra: '372',
  },
  {
    naziv: 'RIBNIK',
    sifra: '556',
  },
  {
    naziv: 'RIJEKA',
    sifra: '373',
  },
  {
    naziv: 'ROGOZNICA',
    sifra: '582',
  },
  {
    naziv: 'ROVINJ',
    sifra: '374',
  },
  {
    naziv: 'ROVIŠĆE',
    sifra: '375',
  },
  {
    naziv: 'RUGVICA',
    sifra: '376',
  },
  {
    naziv: 'RUNOVIĆI',
    sifra: '591',
  },
  {
    naziv: 'RUŽIĆ',
    sifra: '377',
  },
  {
    naziv: 'SABORSKO',
    sifra: '378',
  },
  {
    naziv: 'SALI',
    sifra: '379',
  },
  {
    naziv: 'SAMOBOR',
    sifra: '380',
  },
  {
    naziv: 'SATNICA ĐAKOVAČKA',
    sifra: '381',
  },
  {
    naziv: 'SEGET',
    sifra: '382',
  },
  {
    naziv: 'SELCA',
    sifra: '383',
  },
  {
    naziv: 'SELNICA',
    sifra: '385',
  },
  {
    naziv: 'SEMELJCI',
    sifra: '386',
  },
  {
    naziv: 'SENJ',
    sifra: '387',
  },
  {
    naziv: 'SEVERIN',
    sifra: '562',
  },
  {
    naziv: 'SIBINJ',
    sifra: '388',
  },
  {
    naziv: 'SIKIREVCI',
    sifra: '570',
  },
  {
    naziv: 'SINJ',
    sifra: '389',
  },
  {
    naziv: 'SIRAČ',
    sifra: '390',
  },
  {
    naziv: 'SISAK',
    sifra: '391',
  },
  {
    naziv: 'SKRAD',
    sifra: '393',
  },
  {
    naziv: 'SKRADIN',
    sifra: '394',
  },
  {
    naziv: 'SLATINA',
    sifra: '395',
  },
  {
    naziv: 'SLAVONSKI BROD',
    sifra: '396',
  },
  {
    naziv: 'SLAVONSKI ŠAMAC',
    sifra: '397',
  },
  {
    naziv: 'SLIVNO',
    sifra: '399',
  },
  {
    naziv: 'SLUNJ',
    sifra: '400',
  },
  {
    naziv: 'SMOKVICA',
    sifra: '402',
  },
  {
    naziv: 'SOKOLOVAC',
    sifra: '405',
  },
  {
    naziv: 'SOLIN',
    sifra: '406',
  },
  {
    naziv: 'SOPJE',
    sifra: '407',
  },
  {
    naziv: 'SPLIT',
    sifra: '409',
  },
  {
    naziv: 'SRAČINEC',
    sifra: '410',
  },
  {
    naziv: 'STANKOVCI',
    sifra: '411',
  },
  {
    naziv: 'STARA GRADIŠKA',
    sifra: '412',
  },
  {
    naziv: 'STARI GRAD',
    sifra: '413',
  },
  {
    naziv: 'STARI JANKOVCI',
    sifra: '414',
  },
  {
    naziv: 'STARI MIKANOVCI',
    sifra: '415',
  },
  {
    naziv: 'STARIGRAD',
    sifra: '416',
  },
  {
    naziv: 'STARO PETROVO SELO',
    sifra: '418',
  },
  {
    naziv: 'STON',
    sifra: '419',
  },
  {
    naziv: 'STRAHONINEC',
    sifra: '606',
  },
  {
    naziv: 'STRIZIVOJNA',
    sifra: '421',
  },
  {
    naziv: 'STUBIČKE TOPLICE',
    sifra: '422',
  },
  {
    naziv: 'STUPNIK',
    sifra: '551',
  },
  {
    naziv: 'SUĆURAJ',
    sifra: '423',
  },
  {
    naziv: 'SUHOPOLJE',
    sifra: '424',
  },
  {
    naziv: 'SUKOŠAN',
    sifra: '425',
  },
  {
    naziv: 'SUNJA',
    sifra: '426',
  },
  {
    naziv: 'SUPETAR',
    sifra: '427',
  },
  {
    naziv: 'SUTIVAN',
    sifra: '592',
  },
  {
    naziv: 'SVETA MARIJA',
    sifra: '607',
  },
  {
    naziv: 'SVETA NEDELJA',
    sifra: '432',
  },
  {
    naziv: 'SVETA NEDJELJA',
    sifra: '436',
  },
  {
    naziv: 'SVETI ĐURĐ',
    sifra: '437',
  },
  {
    naziv: 'SVETI FILIP I JAKOV',
    sifra: '428',
  },
  {
    naziv: 'SVETI ILIJA',
    sifra: '438',
  },
  {
    naziv: 'SVETI IVAN ZELINA',
    sifra: '429',
  },
  {
    naziv: 'SVETI IVAN ŽABNO',
    sifra: '439',
  },
  {
    naziv: 'SVETI JURAJ NA BREGU',
    sifra: '440',
  },
  {
    naziv: 'SVETI KRIŽ ZAČRETJE',
    sifra: '430',
  },
  {
    naziv: 'SVETI LOVREČ',
    sifra: '431',
  },
  {
    naziv: 'SVETI MARTIN NA MURI',
    sifra: '441',
  },
  {
    naziv: 'SVETI PETAR OREHOVEC',
    sifra: '442',
  },
  {
    naziv: 'SVETI PETAR U ŠUMI',
    sifra: '433',
  },
  {
    naziv: 'SVETVINČENAT',
    sifra: '435',
  },
  {
    naziv: 'ŠANDROVAC',
    sifra: '564',
  },
  {
    naziv: 'ŠENKOVEC',
    sifra: '608',
  },
  {
    naziv: 'ŠESTANOVAC',
    sifra: '443',
  },
  {
    naziv: 'ŠIBENIK',
    sifra: '444',
  },
  {
    naziv: 'ŠKABRNJE',
    sifra: '445',
  },
  {
    naziv: 'ŠODOLOVCI',
    sifra: '614',
  },
  {
    naziv: 'ŠOLTA',
    sifra: '447',
  },
  {
    naziv: 'ŠPIŠIĆ BUKOVICA',
    sifra: '449',
  },
  {
    naziv: 'ŠTEFANJE',
    sifra: '450',
  },
  {
    naziv: 'ŠTITAR',
    sifra: '628',
  },
  {
    naziv: 'ŠTRIGOVA',
    sifra: '452',
  },
  {
    naziv: 'TAR-VABRIGA',
    sifra: '631',
  },
  {
    naziv: 'TINJAN',
    sifra: '453',
  },
  {
    naziv: 'TISNO',
    sifra: '454',
  },
  {
    naziv: 'TKON',
    sifra: '575',
  },
  {
    naziv: 'TOMPOJEVCI',
    sifra: '456',
  },
  {
    naziv: 'TOPUSKO',
    sifra: '457',
  },
  {
    naziv: 'TORDINCI',
    sifra: '458',
  },
  {
    naziv: 'TOUNJ',
    sifra: '557',
  },
  {
    naziv: 'TOVARNIK',
    sifra: '459',
  },
  {
    naziv: 'TRIBUNJ',
    sifra: '626',
  },
  {
    naziv: 'TRILJ',
    sifra: '460',
  },
  {
    naziv: 'TRNAVA',
    sifra: '461',
  },
  {
    naziv: 'TRNOVEC BARTOLOVEČKI',
    sifra: '462',
  },
  {
    naziv: 'TROGIR',
    sifra: '463',
  },
  {
    naziv: 'TRPANJ',
    sifra: '601',
  },
  {
    naziv: 'TRPINJA',
    sifra: '464',
  },
  {
    naziv: 'TUČEPI',
    sifra: '593',
  },
  {
    naziv: 'TUHELJ',
    sifra: '466',
  },
  {
    naziv: 'UDBINA',
    sifra: '467',
  },
  {
    naziv: 'UMAG',
    sifra: '468',
  },
  {
    naziv: 'UNEŠIĆ',
    sifra: '469',
  },
  {
    naziv: 'VALPOVO',
    sifra: '471',
  },
  {
    naziv: 'VARAŽDIN',
    sifra: '472',
  },
  {
    naziv: 'VARAŽDINSKE TOPLICE',
    sifra: '473',
  },
  {
    naziv: 'VELA LUKA',
    sifra: '474',
  },
  {
    naziv: 'VELIKA',
    sifra: '475',
  },
  {
    naziv: 'VELIKA GORICA',
    sifra: '541',
  },
  {
    naziv: 'VELIKA KOPANICA',
    sifra: '476',
  },
  {
    naziv: 'VELIKA LUDINA',
    sifra: '477',
  },
  {
    naziv: 'VELIKA PISANICA',
    sifra: '478',
  },
  {
    naziv: 'VELIKA TRNOVITICA',
    sifra: '565',
  },
  {
    naziv: 'VELIKI BUKOVEC',
    sifra: '558',
  },
  {
    naziv: 'VELIKI GRĐEVAC',
    sifra: '480',
  },
  {
    naziv: 'VELIKO TRGOVIŠĆE',
    sifra: '481',
  },
  {
    naziv: 'VELIKO TROJSTVO',
    sifra: '483',
  },
  {
    naziv: 'VIDOVEC',
    sifra: '484',
  },
  {
    naziv: 'VILJEVO',
    sifra: '485',
  },
  {
    naziv: 'VINICA',
    sifra: '486',
  },
  {
    naziv: 'VINKOVCI',
    sifra: '487',
  },
  {
    naziv: 'VINODOLSKA 2',
    sifra: '488',
  },
  {
    naziv: 'VIR',
    sifra: '489',
  },
  {
    naziv: 'VIRJE',
    sifra: '490',
  },
  {
    naziv: 'VIROVITICA',
    sifra: '491',
  },
  {
    naziv: 'VIS',
    sifra: '492',
  },
  {
    naziv: 'VISOKO',
    sifra: '493',
  },
  {
    naziv: 'VIŠKOVCI',
    sifra: '494',
  },
  {
    naziv: 'VIŠKOVO',
    sifra: '495',
  },
  {
    naziv: 'VIŠNJAN',
    sifra: '497',
  },
  {
    naziv: 'VIŽINADA',
    sifra: '498',
  },
  {
    naziv: 'VLADISLAVCI',
    sifra: '579',
  },
  {
    naziv: 'VOĆIN',
    sifra: '499',
  },
  {
    naziv: 'VODICE',
    sifra: '500',
  },
  {
    naziv: 'VODNJAN',
    sifra: '502',
  },
  {
    naziv: 'VOĐINCI',
    sifra: '584',
  },
  {
    naziv: 'VOJNIĆ',
    sifra: '503',
  },
  {
    naziv: 'VRATIŠINEC',
    sifra: '504',
  },
  {
    naziv: 'VRBANJA',
    sifra: '505',
  },
  {
    naziv: 'VRBJE',
    sifra: '506',
  },
  {
    naziv: 'VRBNIK',
    sifra: '507',
  },
  {
    naziv: 'VRBOVEC',
    sifra: '508',
  },
  {
    naziv: 'VRBOVSKO',
    sifra: '509',
  },
  {
    naziv: 'VRGORAC',
    sifra: '511',
  },
  {
    naziv: 'VRHOVINE',
    sifra: '512',
  },
  {
    naziv: 'VRLIKA',
    sifra: '513',
  },
  {
    naziv: 'VRPOLJE',
    sifra: '514',
  },
  {
    naziv: 'VRSAR',
    sifra: '516',
  },
  {
    naziv: 'VRSI',
    sifra: '625',
  },
  {
    naziv: 'VUKA',
    sifra: '517',
  },
  {
    naziv: 'VUKOVAR',
    sifra: '518',
  },
  {
    naziv: 'ZABOK',
    sifra: '519',
  },
  {
    naziv: 'ZADAR',
    sifra: '520',
  },
  {
    naziv: 'ZADVARJE',
    sifra: '595',
  },
  {
    naziv: 'ZAGORSKA SELA',
    sifra: '521',
  },
  {
    naziv: 'ZAGVOZD',
    sifra: '522',
  },
  {
    naziv: 'ZAPREŠIĆ',
    sifra: '543',
  },
  {
    naziv: 'ZAŽABLJE',
    sifra: '523',
  },
  {
    naziv: 'ZDENCI',
    sifra: '524',
  },
  {
    naziv: 'ZEMUNIK DONJI',
    sifra: '525',
  },
  {
    naziv: 'ZLATAR',
    sifra: '526',
  },
  {
    naziv: 'ZLATAR-BISTRICA',
    sifra: '527',
  },
  {
    naziv: 'ZMIJAVCI',
    sifra: '528',
  },
  {
    naziv: 'ZRINSKI TOPOLOVAC',
    sifra: '566',
  },
  {
    naziv: 'ŽAKANJE',
    sifra: '530',
  },
  {
    naziv: 'ŽMINJ',
    sifra: '531',
  },
  {
    naziv: 'ŽUMBERAK',
    sifra: '540',
  },
  {
    naziv: 'ŽUPA DUBROVAČKA',
    sifra: '602',
  },
  {
    naziv: 'ŽUPANJA',
    sifra: '534',
  },
];

export function findOpcinaBySifra(sifra: string | null | undefined): Opcina | undefined {
  const normalized = sifra?.trim().padStart(3, '0');
  return OPCINE.find((opcina) => opcina.sifra === normalized);
}
