import e from "express"
export const EVENTS: Event[] = 

[
  {
    "day": "15",
    "month": "MAI",
    "title": "Festival de Musique Africaine",
    "location": "Abidjan",
    "class": "agenda-festival"
  },
  {
    "day": "22",
    "month": "JUIN",
    "title": "Conférence sur l'Innovation",
    "location": "Yaoundé",
    "class": "agenda-conference"
  },
  {
    "day": "10",
    "month": "JUIL",
    "title": "Gastronomie Africaine",
    "location": "Douala",
    "class": "agenda-salon"
  },
  {
    "day": "15",
    "month": "MAI",
    "title": "Marché des arts et de l'artisanat",
    "location": "Abidjan",
    "class": "agenda-festival"
  },
  {
    "day": "28",
    "month": "JUIN",
    "title": "Spectacle de danse",
    "location": "Yaoundé",
    "class": "agenda-conference"
  },
  {
    "day": "05",
    "month": "JUIL",
    "title": "Histoire & Traditions",
    "location": "Bamako",
    "class": "agenda-salon"
  }
];

export interface Event {
  day: string;
  month: string;
  title: string;
  location: string;
  class: string;
}
