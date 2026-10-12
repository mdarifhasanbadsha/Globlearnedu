// Country names and international calling codes adapted from intl-tel-input's country data.
// Source: https://github.com/jackocnr/intl-tel-input (MIT-licensed project).
export type PhoneCountry = { iso2: string; name: string; dialCode: string };

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    "iso2": "bd",
    "name": "Bangladesh",
    "dialCode": "880"
  },
  {
    "iso2": "cn",
    "name": "China",
    "dialCode": "86"
  },
  {
    "iso2": "af",
    "name": "Afghanistan",
    "dialCode": "93"
  },
  {
    "iso2": "ax",
    "name": "Åland Islands",
    "dialCode": "358"
  },
  {
    "iso2": "al",
    "name": "Albania",
    "dialCode": "355"
  },
  {
    "iso2": "dz",
    "name": "Algeria",
    "dialCode": "213"
  },
  {
    "iso2": "as",
    "name": "American Samoa",
    "dialCode": "1"
  },
  {
    "iso2": "ad",
    "name": "Andorra",
    "dialCode": "376"
  },
  {
    "iso2": "ao",
    "name": "Angola",
    "dialCode": "244"
  },
  {
    "iso2": "ai",
    "name": "Anguilla",
    "dialCode": "1"
  },
  {
    "iso2": "ag",
    "name": "Antigua and Barbuda",
    "dialCode": "1"
  },
  {
    "iso2": "ar",
    "name": "Argentina",
    "dialCode": "54"
  },
  {
    "iso2": "am",
    "name": "Armenia",
    "dialCode": "374"
  },
  {
    "iso2": "aw",
    "name": "Aruba",
    "dialCode": "297"
  },
  {
    "iso2": "ac",
    "name": "Ascension Island",
    "dialCode": "247"
  },
  {
    "iso2": "au",
    "name": "Australia",
    "dialCode": "61"
  },
  {
    "iso2": "at",
    "name": "Austria",
    "dialCode": "43"
  },
  {
    "iso2": "az",
    "name": "Azerbaijan",
    "dialCode": "994"
  },
  {
    "iso2": "bs",
    "name": "Bahamas",
    "dialCode": "1"
  },
  {
    "iso2": "bh",
    "name": "Bahrain",
    "dialCode": "973"
  },
  {
    "iso2": "bb",
    "name": "Barbados",
    "dialCode": "1"
  },
  {
    "iso2": "by",
    "name": "Belarus",
    "dialCode": "375"
  },
  {
    "iso2": "be",
    "name": "Belgium",
    "dialCode": "32"
  },
  {
    "iso2": "bz",
    "name": "Belize",
    "dialCode": "501"
  },
  {
    "iso2": "bj",
    "name": "Benin",
    "dialCode": "229"
  },
  {
    "iso2": "bm",
    "name": "Bermuda",
    "dialCode": "1"
  },
  {
    "iso2": "bt",
    "name": "Bhutan",
    "dialCode": "975"
  },
  {
    "iso2": "bo",
    "name": "Bolivia",
    "dialCode": "591"
  },
  {
    "iso2": "ba",
    "name": "Bosnia and Herzegovina",
    "dialCode": "387"
  },
  {
    "iso2": "bw",
    "name": "Botswana",
    "dialCode": "267"
  },
  {
    "iso2": "br",
    "name": "Brazil",
    "dialCode": "55"
  },
  {
    "iso2": "io",
    "name": "British Indian Ocean Territory",
    "dialCode": "246"
  },
  {
    "iso2": "vg",
    "name": "British Virgin Islands",
    "dialCode": "1"
  },
  {
    "iso2": "bn",
    "name": "Brunei",
    "dialCode": "673"
  },
  {
    "iso2": "bg",
    "name": "Bulgaria",
    "dialCode": "359"
  },
  {
    "iso2": "bf",
    "name": "Burkina Faso",
    "dialCode": "226"
  },
  {
    "iso2": "bi",
    "name": "Burundi",
    "dialCode": "257"
  },
  {
    "iso2": "kh",
    "name": "Cambodia",
    "dialCode": "855"
  },
  {
    "iso2": "cm",
    "name": "Cameroon",
    "dialCode": "237"
  },
  {
    "iso2": "ca",
    "name": "Canada",
    "dialCode": "1"
  },
  {
    "iso2": "cv",
    "name": "Cape Verde",
    "dialCode": "238"
  },
  {
    "iso2": "bq",
    "name": "Caribbean Netherlands",
    "dialCode": "599"
  },
  {
    "iso2": "ky",
    "name": "Cayman Islands",
    "dialCode": "1"
  },
  {
    "iso2": "cf",
    "name": "Central African Republic",
    "dialCode": "236"
  },
  {
    "iso2": "td",
    "name": "Chad",
    "dialCode": "235"
  },
  {
    "iso2": "cl",
    "name": "Chile",
    "dialCode": "56"
  },
  {
    "iso2": "cx",
    "name": "Christmas Island",
    "dialCode": "61"
  },
  {
    "iso2": "cc",
    "name": "Cocos (Keeling) Islands",
    "dialCode": "61"
  },
  {
    "iso2": "co",
    "name": "Colombia",
    "dialCode": "57"
  },
  {
    "iso2": "km",
    "name": "Comoros",
    "dialCode": "269"
  },
  {
    "iso2": "ck",
    "name": "Cook Islands",
    "dialCode": "682"
  },
  {
    "iso2": "cr",
    "name": "Costa Rica",
    "dialCode": "506"
  },
  {
    "iso2": "ci",
    "name": "Côte d'Ivoire",
    "dialCode": "225"
  },
  {
    "iso2": "hr",
    "name": "Croatia",
    "dialCode": "385"
  },
  {
    "iso2": "cu",
    "name": "Cuba",
    "dialCode": "53"
  },
  {
    "iso2": "cw",
    "name": "Curaçao",
    "dialCode": "599"
  },
  {
    "iso2": "cy",
    "name": "Cyprus",
    "dialCode": "357"
  },
  {
    "iso2": "cz",
    "name": "Czech Republic",
    "dialCode": "420"
  },
  {
    "iso2": "cd",
    "name": "Democratic Republic of the Congo",
    "dialCode": "243"
  },
  {
    "iso2": "dk",
    "name": "Denmark",
    "dialCode": "45"
  },
  {
    "iso2": "dj",
    "name": "Djibouti",
    "dialCode": "253"
  },
  {
    "iso2": "dm",
    "name": "Dominica",
    "dialCode": "1"
  },
  {
    "iso2": "do",
    "name": "Dominican Republic",
    "dialCode": "1"
  },
  {
    "iso2": "ec",
    "name": "Ecuador",
    "dialCode": "593"
  },
  {
    "iso2": "eg",
    "name": "Egypt",
    "dialCode": "20"
  },
  {
    "iso2": "sv",
    "name": "El Salvador",
    "dialCode": "503"
  },
  {
    "iso2": "gq",
    "name": "Equatorial Guinea",
    "dialCode": "240"
  },
  {
    "iso2": "er",
    "name": "Eritrea",
    "dialCode": "291"
  },
  {
    "iso2": "ee",
    "name": "Estonia",
    "dialCode": "372"
  },
  {
    "iso2": "sz",
    "name": "Eswatini",
    "dialCode": "268"
  },
  {
    "iso2": "et",
    "name": "Ethiopia",
    "dialCode": "251"
  },
  {
    "iso2": "fk",
    "name": "Falkland Islands (Malvinas)",
    "dialCode": "500"
  },
  {
    "iso2": "fo",
    "name": "Faroe Islands",
    "dialCode": "298"
  },
  {
    "iso2": "fj",
    "name": "Fiji",
    "dialCode": "679"
  },
  {
    "iso2": "fi",
    "name": "Finland",
    "dialCode": "358"
  },
  {
    "iso2": "fr",
    "name": "France",
    "dialCode": "33"
  },
  {
    "iso2": "gf",
    "name": "French Guiana",
    "dialCode": "594"
  },
  {
    "iso2": "pf",
    "name": "French Polynesia",
    "dialCode": "689"
  },
  {
    "iso2": "ga",
    "name": "Gabon",
    "dialCode": "241"
  },
  {
    "iso2": "gm",
    "name": "Gambia",
    "dialCode": "220"
  },
  {
    "iso2": "ge",
    "name": "Georgia",
    "dialCode": "995"
  },
  {
    "iso2": "de",
    "name": "Germany",
    "dialCode": "49"
  },
  {
    "iso2": "gh",
    "name": "Ghana",
    "dialCode": "233"
  },
  {
    "iso2": "gi",
    "name": "Gibraltar",
    "dialCode": "350"
  },
  {
    "iso2": "gr",
    "name": "Greece",
    "dialCode": "30"
  },
  {
    "iso2": "gl",
    "name": "Greenland",
    "dialCode": "299"
  },
  {
    "iso2": "gd",
    "name": "Grenada",
    "dialCode": "1"
  },
  {
    "iso2": "gp",
    "name": "Guadeloupe",
    "dialCode": "590"
  },
  {
    "iso2": "gu",
    "name": "Guam",
    "dialCode": "1"
  },
  {
    "iso2": "gt",
    "name": "Guatemala",
    "dialCode": "502"
  },
  {
    "iso2": "gg",
    "name": "Guernsey",
    "dialCode": "44"
  },
  {
    "iso2": "gn",
    "name": "Guinea",
    "dialCode": "224"
  },
  {
    "iso2": "gw",
    "name": "Guinea-Bissau",
    "dialCode": "245"
  },
  {
    "iso2": "gy",
    "name": "Guyana",
    "dialCode": "592"
  },
  {
    "iso2": "ht",
    "name": "Haiti",
    "dialCode": "509"
  },
  {
    "iso2": "hn",
    "name": "Honduras",
    "dialCode": "504"
  },
  {
    "iso2": "hk",
    "name": "Hong Kong",
    "dialCode": "852"
  },
  {
    "iso2": "hu",
    "name": "Hungary",
    "dialCode": "36"
  },
  {
    "iso2": "is",
    "name": "Iceland",
    "dialCode": "354"
  },
  {
    "iso2": "in",
    "name": "India",
    "dialCode": "91"
  },
  {
    "iso2": "id",
    "name": "Indonesia",
    "dialCode": "62"
  },
  {
    "iso2": "ir",
    "name": "Iran",
    "dialCode": "98"
  },
  {
    "iso2": "iq",
    "name": "Iraq",
    "dialCode": "964"
  },
  {
    "iso2": "ie",
    "name": "Ireland",
    "dialCode": "353"
  },
  {
    "iso2": "im",
    "name": "Isle of Man",
    "dialCode": "44"
  },
  {
    "iso2": "il",
    "name": "Israel",
    "dialCode": "972"
  },
  {
    "iso2": "it",
    "name": "Italy",
    "dialCode": "39"
  },
  {
    "iso2": "jm",
    "name": "Jamaica",
    "dialCode": "1"
  },
  {
    "iso2": "jp",
    "name": "Japan",
    "dialCode": "81"
  },
  {
    "iso2": "je",
    "name": "Jersey",
    "dialCode": "44"
  },
  {
    "iso2": "jo",
    "name": "Jordan",
    "dialCode": "962"
  },
  {
    "iso2": "kz",
    "name": "Kazakhstan",
    "dialCode": "7"
  },
  {
    "iso2": "ke",
    "name": "Kenya",
    "dialCode": "254"
  },
  {
    "iso2": "ki",
    "name": "Kiribati",
    "dialCode": "686"
  },
  {
    "iso2": "xk",
    "name": "Kosovo",
    "dialCode": "383"
  },
  {
    "iso2": "kw",
    "name": "Kuwait",
    "dialCode": "965"
  },
  {
    "iso2": "kg",
    "name": "Kyrgyzstan",
    "dialCode": "996"
  },
  {
    "iso2": "la",
    "name": "Laos",
    "dialCode": "856"
  },
  {
    "iso2": "lv",
    "name": "Latvia",
    "dialCode": "371"
  },
  {
    "iso2": "lb",
    "name": "Lebanon",
    "dialCode": "961"
  },
  {
    "iso2": "ls",
    "name": "Lesotho",
    "dialCode": "266"
  },
  {
    "iso2": "lr",
    "name": "Liberia",
    "dialCode": "231"
  },
  {
    "iso2": "ly",
    "name": "Libya",
    "dialCode": "218"
  },
  {
    "iso2": "li",
    "name": "Liechtenstein",
    "dialCode": "423"
  },
  {
    "iso2": "lt",
    "name": "Lithuania",
    "dialCode": "370"
  },
  {
    "iso2": "lu",
    "name": "Luxembourg",
    "dialCode": "352"
  },
  {
    "iso2": "mo",
    "name": "Macao",
    "dialCode": "853"
  },
  {
    "iso2": "mg",
    "name": "Madagascar",
    "dialCode": "261"
  },
  {
    "iso2": "mw",
    "name": "Malawi",
    "dialCode": "265"
  },
  {
    "iso2": "my",
    "name": "Malaysia",
    "dialCode": "60"
  },
  {
    "iso2": "mv",
    "name": "Maldives",
    "dialCode": "960"
  },
  {
    "iso2": "ml",
    "name": "Mali",
    "dialCode": "223"
  },
  {
    "iso2": "mt",
    "name": "Malta",
    "dialCode": "356"
  },
  {
    "iso2": "mh",
    "name": "Marshall Islands",
    "dialCode": "692"
  },
  {
    "iso2": "mq",
    "name": "Martinique",
    "dialCode": "596"
  },
  {
    "iso2": "mr",
    "name": "Mauritania",
    "dialCode": "222"
  },
  {
    "iso2": "mu",
    "name": "Mauritius",
    "dialCode": "230"
  },
  {
    "iso2": "yt",
    "name": "Mayotte",
    "dialCode": "262"
  },
  {
    "iso2": "mx",
    "name": "Mexico",
    "dialCode": "52"
  },
  {
    "iso2": "fm",
    "name": "Micronesia",
    "dialCode": "691"
  },
  {
    "iso2": "md",
    "name": "Moldova",
    "dialCode": "373"
  },
  {
    "iso2": "mc",
    "name": "Monaco",
    "dialCode": "377"
  },
  {
    "iso2": "mn",
    "name": "Mongolia",
    "dialCode": "976"
  },
  {
    "iso2": "me",
    "name": "Montenegro",
    "dialCode": "382"
  },
  {
    "iso2": "ms",
    "name": "Montserrat",
    "dialCode": "1"
  },
  {
    "iso2": "ma",
    "name": "Morocco",
    "dialCode": "212"
  },
  {
    "iso2": "mz",
    "name": "Mozambique",
    "dialCode": "258"
  },
  {
    "iso2": "mm",
    "name": "Myanmar (Burma)",
    "dialCode": "95"
  },
  {
    "iso2": "na",
    "name": "Namibia",
    "dialCode": "264"
  },
  {
    "iso2": "nr",
    "name": "Nauru",
    "dialCode": "674"
  },
  {
    "iso2": "np",
    "name": "Nepal",
    "dialCode": "977"
  },
  {
    "iso2": "nl",
    "name": "Netherlands",
    "dialCode": "31"
  },
  {
    "iso2": "nc",
    "name": "New Caledonia",
    "dialCode": "687"
  },
  {
    "iso2": "nz",
    "name": "New Zealand",
    "dialCode": "64"
  },
  {
    "iso2": "ni",
    "name": "Nicaragua",
    "dialCode": "505"
  },
  {
    "iso2": "ne",
    "name": "Niger",
    "dialCode": "227"
  },
  {
    "iso2": "ng",
    "name": "Nigeria",
    "dialCode": "234"
  },
  {
    "iso2": "nu",
    "name": "Niue",
    "dialCode": "683"
  },
  {
    "iso2": "nf",
    "name": "Norfolk Island",
    "dialCode": "672"
  },
  {
    "iso2": "kp",
    "name": "North Korea",
    "dialCode": "850"
  },
  {
    "iso2": "mk",
    "name": "North Macedonia",
    "dialCode": "389"
  },
  {
    "iso2": "mp",
    "name": "Northern Mariana Islands",
    "dialCode": "1"
  },
  {
    "iso2": "no",
    "name": "Norway",
    "dialCode": "47"
  },
  {
    "iso2": "om",
    "name": "Oman",
    "dialCode": "968"
  },
  {
    "iso2": "pk",
    "name": "Pakistan",
    "dialCode": "92"
  },
  {
    "iso2": "pw",
    "name": "Palau",
    "dialCode": "680"
  },
  {
    "iso2": "ps",
    "name": "Palestine",
    "dialCode": "970"
  },
  {
    "iso2": "pa",
    "name": "Panama",
    "dialCode": "507"
  },
  {
    "iso2": "pg",
    "name": "Papua New Guinea",
    "dialCode": "675"
  },
  {
    "iso2": "py",
    "name": "Paraguay",
    "dialCode": "595"
  },
  {
    "iso2": "pe",
    "name": "Peru",
    "dialCode": "51"
  },
  {
    "iso2": "ph",
    "name": "Philippines",
    "dialCode": "63"
  },
  {
    "iso2": "pl",
    "name": "Poland",
    "dialCode": "48"
  },
  {
    "iso2": "pt",
    "name": "Portugal",
    "dialCode": "351"
  },
  {
    "iso2": "pr",
    "name": "Puerto Rico",
    "dialCode": "1"
  },
  {
    "iso2": "qa",
    "name": "Qatar",
    "dialCode": "974"
  },
  {
    "iso2": "cg",
    "name": "Republic of the Congo",
    "dialCode": "242"
  },
  {
    "iso2": "re",
    "name": "Réunion",
    "dialCode": "262"
  },
  {
    "iso2": "ro",
    "name": "Romania",
    "dialCode": "40"
  },
  {
    "iso2": "ru",
    "name": "Russia",
    "dialCode": "7"
  },
  {
    "iso2": "rw",
    "name": "Rwanda",
    "dialCode": "250"
  },
  {
    "iso2": "ws",
    "name": "Samoa",
    "dialCode": "685"
  },
  {
    "iso2": "sm",
    "name": "San Marino",
    "dialCode": "378"
  },
  {
    "iso2": "st",
    "name": "São Tomé & Príncipe",
    "dialCode": "239"
  },
  {
    "iso2": "sa",
    "name": "Saudi Arabia",
    "dialCode": "966"
  },
  {
    "iso2": "sn",
    "name": "Senegal",
    "dialCode": "221"
  },
  {
    "iso2": "rs",
    "name": "Serbia",
    "dialCode": "381"
  },
  {
    "iso2": "sc",
    "name": "Seychelles",
    "dialCode": "248"
  },
  {
    "iso2": "sl",
    "name": "Sierra Leone",
    "dialCode": "232"
  },
  {
    "iso2": "sg",
    "name": "Singapore",
    "dialCode": "65"
  },
  {
    "iso2": "sx",
    "name": "Sint Maarten",
    "dialCode": "1"
  },
  {
    "iso2": "sk",
    "name": "Slovakia",
    "dialCode": "421"
  },
  {
    "iso2": "si",
    "name": "Slovenia",
    "dialCode": "386"
  },
  {
    "iso2": "sb",
    "name": "Solomon Islands",
    "dialCode": "677"
  },
  {
    "iso2": "so",
    "name": "Somalia",
    "dialCode": "252"
  },
  {
    "iso2": "za",
    "name": "South Africa",
    "dialCode": "27"
  },
  {
    "iso2": "kr",
    "name": "South Korea",
    "dialCode": "82"
  },
  {
    "iso2": "ss",
    "name": "South Sudan",
    "dialCode": "211"
  },
  {
    "iso2": "es",
    "name": "Spain",
    "dialCode": "34"
  },
  {
    "iso2": "lk",
    "name": "Sri Lanka",
    "dialCode": "94"
  },
  {
    "iso2": "bl",
    "name": "St. Barthélemy",
    "dialCode": "590"
  },
  {
    "iso2": "sh",
    "name": "St. Helena",
    "dialCode": "290"
  },
  {
    "iso2": "kn",
    "name": "St. Kitts & Nevis",
    "dialCode": "1"
  },
  {
    "iso2": "lc",
    "name": "St. Lucia",
    "dialCode": "1"
  },
  {
    "iso2": "mf",
    "name": "St. Martin",
    "dialCode": "590"
  },
  {
    "iso2": "pm",
    "name": "St. Pierre & Miquelon",
    "dialCode": "508"
  },
  {
    "iso2": "vc",
    "name": "St. Vincent & Grenadines",
    "dialCode": "1"
  },
  {
    "iso2": "sd",
    "name": "Sudan",
    "dialCode": "249"
  },
  {
    "iso2": "sr",
    "name": "Suriname",
    "dialCode": "597"
  },
  {
    "iso2": "sj",
    "name": "Svalbard & Jan Mayen",
    "dialCode": "47"
  },
  {
    "iso2": "se",
    "name": "Sweden",
    "dialCode": "46"
  },
  {
    "iso2": "ch",
    "name": "Switzerland",
    "dialCode": "41"
  },
  {
    "iso2": "sy",
    "name": "Syria",
    "dialCode": "963"
  },
  {
    "iso2": "tw",
    "name": "Taiwan",
    "dialCode": "886"
  },
  {
    "iso2": "tj",
    "name": "Tajikistan",
    "dialCode": "992"
  },
  {
    "iso2": "tz",
    "name": "Tanzania",
    "dialCode": "255"
  },
  {
    "iso2": "th",
    "name": "Thailand",
    "dialCode": "66"
  },
  {
    "iso2": "tl",
    "name": "Timor-Leste",
    "dialCode": "670"
  },
  {
    "iso2": "tg",
    "name": "Togo",
    "dialCode": "228"
  },
  {
    "iso2": "tk",
    "name": "Tokelau",
    "dialCode": "690"
  },
  {
    "iso2": "to",
    "name": "Tonga",
    "dialCode": "676"
  },
  {
    "iso2": "tt",
    "name": "Trinidad & Tobago",
    "dialCode": "1"
  },
  {
    "iso2": "tn",
    "name": "Tunisia",
    "dialCode": "216"
  },
  {
    "iso2": "tr",
    "name": "Türkiye",
    "dialCode": "90"
  },
  {
    "iso2": "tm",
    "name": "Turkmenistan",
    "dialCode": "993"
  },
  {
    "iso2": "tc",
    "name": "Turks & Caicos Islands",
    "dialCode": "1"
  },
  {
    "iso2": "tv",
    "name": "Tuvalu",
    "dialCode": "688"
  },
  {
    "iso2": "vi",
    "name": "U.S. Virgin Islands",
    "dialCode": "1"
  },
  {
    "iso2": "ug",
    "name": "Uganda",
    "dialCode": "256"
  },
  {
    "iso2": "ua",
    "name": "Ukraine",
    "dialCode": "380"
  },
  {
    "iso2": "ae",
    "name": "United Arab Emirates",
    "dialCode": "971"
  },
  {
    "iso2": "gb",
    "name": "United Kingdom",
    "dialCode": "44"
  },
  {
    "iso2": "us",
    "name": "United States",
    "dialCode": "1"
  },
  {
    "iso2": "uy",
    "name": "Uruguay",
    "dialCode": "598"
  },
  {
    "iso2": "uz",
    "name": "Uzbekistan",
    "dialCode": "998"
  },
  {
    "iso2": "vu",
    "name": "Vanuatu",
    "dialCode": "678"
  },
  {
    "iso2": "va",
    "name": "Vatican City",
    "dialCode": "39"
  },
  {
    "iso2": "ve",
    "name": "Venezuela",
    "dialCode": "58"
  },
  {
    "iso2": "vn",
    "name": "Vietnam",
    "dialCode": "84"
  },
  {
    "iso2": "wf",
    "name": "Wallis & Futuna",
    "dialCode": "681"
  },
  {
    "iso2": "eh",
    "name": "Western Sahara",
    "dialCode": "212"
  },
  {
    "iso2": "ye",
    "name": "Yemen",
    "dialCode": "967"
  },
  {
    "iso2": "zm",
    "name": "Zambia",
    "dialCode": "260"
  },
  {
    "iso2": "zw",
    "name": "Zimbabwe",
    "dialCode": "263"
  }
];
