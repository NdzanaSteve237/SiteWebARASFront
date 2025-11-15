import { Component, OnInit, AfterViewInit, HostListener,
          ChangeDetectorRef, ChangeDetectionStrategy,  
          ElementRef,
          ViewChild,
          OnDestroy,
          QueryList
        } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule, Router} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

//import { SwiperModule } from 'swiper/angular';

  interface ActivityPayload {
    title: string;
    description: string;
    image: string;
  }
  
  interface GalleryItem {
    title: string;
    location: string;
    image: string;
  }

  interface AgendaItem {
    id: string;
    date: Date;
    dayLabel: string;      // ex : "15"
    monthLabel: string;    // ex : "MAI", "JUIN", "OCT"
    titleLines: string[];  // lignes normales du titre
    titleEmphasis?: string; // partie en <em> optionnelle
    location: string;
    cssClass: string;      // ex : "agenda-festival", "agenda-meeting"
    timeLabel?: string;    // ex : "15h00"
    isMeeting?: boolean;   // true pour les rencontres Retour Aux Sources
    theme?: string;        // thème complet pour les rencontres
    withPerson?: string;   // pour "Avec: EKORO", "Avec: Annick MO"
  }

  interface ContactPopupConfig {
    visible: boolean;
    title: string;
    message: string;
    whatsappLink: string;
    mailtoLink: string;
  }

  @Component({
    standalone: true,
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    imports: [CommonModule, RouterModule, MatIconModule],//SwiperModule
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
      trigger('zoomFade', [
        transition(':enter', [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          animate('160ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
        ]),
        transition(':leave', [
          animate('120ms ease-in', style({ opacity: 0, transform: 'scale(0.98)' })),
        ]),
      ])
    ]
  })

export class MainLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('testimonialSlider') testimonialSliderRef!: ElementRef<HTMLElement>;
  testimonialSlider?: KeenSliderInstance;

  @ViewChild('sliderRef', { static: false }) sliderRef!: ElementRef<HTMLDivElement>;
  slider: any;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  activeIndex: number | null = null;

  // configuration globale (modifiable) :
  private readonly contactEmail = 'contact@associationretourauxsources.org';
  private readonly whatsappNumber = '+237679971708'; //

  contactPopup: ContactPopupConfig = {
    visible: false,
    title: '',
    message: '',
    whatsappLink: '',
    mailtoLink: ''
  };

  // Ouvrir le pop-up avec un "contexte"
  openContactPopup(context: 'projects' | 'community' | 'membership' | string): void {
    let title = 'Contacter notre équipe';
    let message = "Dis-nous comment tu souhaites t’engager et nous te répondrons rapidement.";
    let subject = 'Demande de contact';

    switch (context) {
      case 'projects':
        title = 'Découvrir nos projets';
        message = "Tu souhaites en savoir plus sur nos expositions, ateliers et festivals ? Écris-nous, nous t’enverrons les prochaines dates et modalités.";
        subject = 'Demande - Découvrir les projets';
        break;

      case 'community':
        title = 'Rejoindre un projet communautaire';
        message = "Tu veux participer à un projet local ou communautaire ? Explique-nous ton profil et le type de projet qui t’intéresse.";
        subject = 'Demande - Rejoindre un projet communautaire';
        break;

      case 'membership':
        title = 'Devenir membre / sympathisant';
        message = "Tu souhaites devenir membre ou bénévole ? Présente-toi en quelques lignes et nous t’expliquerons la démarche.";
        subject = 'Demande - Devenir membre / sympathisant';
        break;

      default:
        // autres sections du site pourront passer leur propre context string,
        // tu peux ajouter des cases ici plus tard
        break;
    }

    const encodedText = encodeURIComponent(message);
    const encodedSubject = encodeURIComponent(subject);

    const whatsappBase = `https://wa.me/${this.whatsappNumber}?text=${encodedText}`;
    const mailtoBase = `mailto:${this.contactEmail}?subject=${encodedSubject}&body=${encodedText}`;

    this.contactPopup = {
      visible: true,
      title,
      message,
      whatsappLink: whatsappBase,
      mailtoLink: mailtoBase
    };

    document.body.style.overflow = 'hidden'; // bloque le scroll derrière le pop-up
  }

  // Fermer le pop-up
  closeContactPopup(): void {
    this.contactPopup.visible = false;
    document.body.style.overflow = '';
  }
  
  //Témoignages
  activeTestimonialIndex = 0;
  testimonialSlides: number[] = [0, 1, 2]; // adapte si tu ajoutes des témoignages

  agendaItems: AgendaItem[] = [
    // 1) RENCONTRES RETOUR AUX SOURCES (triées avec toute la liste)

    {
      id: 'renc-esprits-14h',
      date: new Date('2025-02-16T14:00:00'),
      dayLabel: '16',
      monthLabel: 'FÉV',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'Les esprits dans la vie d\'un initié Bwiti',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '14h00',
      theme: "LES ESPRITS DANS LA VIE D'UN INITIÉ BWITI: RÔLES ET FONCTIONS."
    },
    {
      id: 'renc-esprits-17h-ekoro',
      date: new Date('2025-02-16T17:00:00'),
      dayLabel: '16',
      monthLabel: 'FÉV',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'Avec EKORO',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '17h00',
      theme: "LES ESPRITS DANS LA VIE D'UN INITIÉ BWITI: RÔLES ET FONCTIONS.",
      withPerson: 'EKORO'
    },

    // 2) Festival de Musique Africaine – 15 MAI
    {
      id: 'festival-musique',
      date: new Date('2025-05-15T00:00:00'),
      dayLabel: '15',
      monthLabel: 'MAI',
      titleLines: ['Festival', 'de Musique'],
      titleEmphasis: 'Africaine',
      location: 'Abidjan',
      cssClass: 'warm-orange'
    },

    // 3) Exposition d'Art Africain – 10 JUIN
    {
      id: 'expo-art-africain',
      date: new Date('2025-06-10T00:00:00'),
      dayLabel: '10',
      monthLabel: 'JUIN',
      titleLines: ["Exposition", "d'Art Africain"],
      location: 'Dakar',
      cssClass: 'golden-yellow'
    },

    // 4) Rencontre – Sexualité – 15/06/2025
    {
      id: 'renc-sexualite',
      date: new Date('2025-06-15T15:00:00'),
      dayLabel: '15',
      monthLabel: 'JUIN',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'SEXUALITÉ',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '15h00',
      theme: 'SEXUALITÉ'
    },

    // 5) Atelier de Percussions – 25 JUIN
    {
      id: 'atelier-percussions',
      date: new Date('2025-06-25T00:00:00'),
      dayLabel: '25',
      monthLabel: 'JUIN',
      titleLines: ['Atelier', 'de Percussions'],
      location: 'Abidjan',
      cssClass: 'warm-orange'
    },

    // 6) Rencontre – Sexe et Pouvoir – 29/06/2025
    {
      id: 'renc-sexe-pouvoir',
      date: new Date('2025-06-29T15:00:00'),
      dayLabel: '29',
      monthLabel: 'JUIN',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'SEXE ET POUVOIR',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '15h00',
      theme: 'SEXE ET POUVOIR'
    },

    // 7) Conférence Histoire & Traditions – 05 JUIL
    {
      id: 'conf-histoire-traditions',
      date: new Date('2025-07-05T00:00:00'),
      dayLabel: '05',
      monthLabel: 'JUIL',
      titleLines: ['Conférence'],
      titleEmphasis: 'Histoire & Traditions',
      location: 'Bamako',
      cssClass: 'nature-green'
    },

    // 8) Spectacle de Danses Traditionnelles – 18 JUIL
    {
      id: 'spectacle-danses',
      date: new Date('2025-07-18T00:00:00'),
      dayLabel: '18',
      monthLabel: 'JUIL',
      titleLines: ['Spectacle', 'de Danses'],
      titleEmphasis: 'Traditionnelles',
      location: 'Ouagadougou',
      cssClass: 'warm-orange'
    },

    // 9) Marché des Arts & Artisanat – 02 AOÛT
    {
      id: 'marche-arts-artisanat',
      date: new Date('2025-08-02T00:00:00'),
      dayLabel: '02',
      monthLabel: 'AOÛT',
      titleLines: ['Marché', 'des Arts &'],
      titleEmphasis: 'Artisanat',
      location: 'Accra',
      cssClass: 'golden-yellow'
    },

    // 10) Atelier Cuisine Africaine – 20 AOÛT
    {
      id: 'atelier-cuisine-africaine',
      date: new Date('2025-08-20T00:00:00'),
      dayLabel: '20',
      monthLabel: 'AOÛT',
      titleLines: ['Atelier', 'Cuisine'],
      titleEmphasis: 'Africaine',
      location: 'Lomé',
      cssClass: 'nature-green'
    },

    // 11) Soirée Poésie & Contes – 12 SEPT
    {
      id: 'soiree-poesie-contes',
      date: new Date('2025-09-12T00:00:00'),
      dayLabel: '12',
      monthLabel: 'SEPT',
      titleLines: ['Soirée'],
      titleEmphasis: 'Poésie & Contes',
      location: 'Cotonou',
      cssClass: 'golden-yellow'
    },

    // 12) Festival de Cinéma Africain – 28 SEPT
    {
      id: 'festival-cinema-africain',
      date: new Date('2025-09-28T00:00:00'),
      dayLabel: '28',
      monthLabel: 'SEPT',
      titleLines: ['Festival', 'de Cinéma'],
      titleEmphasis: 'Africain',
      location: 'Lagos',
      cssClass: 'warm-orange'
    },

    // 13) Rencontre – Philo occidentale – 12/10/2025
    {
      id: 'renc-philo-occidentale',
      date: new Date('2025-10-12T15:00:00'),
      dayLabel: '12',
      monthLabel: 'OCT',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'Philosophie occidentale et chute de l\'homme',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '15h00',
      theme:
        "LA PHILOSOPHIE OCCIDENTALE SUR LA CHUTE DE L'HOMME, SA CORRÉLATION AVEC LE MANICHÉISME FACE À LA PENSÉE DE L'INVOLUTION COSMIQUE PRÔNÉ EN AFRIQUE, ENTRE CRÉDIBILITÉ, DIVERGENCE ET POSSIBILITÉ D'ANALOGIE"
    },

    // 14) Rencontre – Annick MO – 26/10/2025
    {
      id: 'renc-annick-mo',
      date: new Date('2025-10-26T14:00:00'),
      dayLabel: '26',
      monthLabel: 'OCT',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: "Avec Annick MO",
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '14h00',
      theme: "L'IMPACT DE L'ANCESTRALITÉ DANS LE QUOTIDIEN",
      withPerson: 'Annick MO'
    },

    // 15) Rencontre – Kémitisme & anniversaire – 09/11/2025
    {
      id: 'renc-kemitisme-anniversaire',
      date: new Date('2025-11-09T15:00:00'),
      dayLabel: '09',
      monthLabel: 'NOV',
      titleLines: ['Rencontre', 'Retour Aux Sources'],
      titleEmphasis: 'Kémitisme et célébration d\'anniversaire',
      location: 'Retour Aux Sources',
      cssClass: 'primary-red',
      isMeeting: true,
      timeLabel: '15h00',
      theme: "KEMITISME ET CELEBRATION D'ANNIVERSAIRE"
    }
  ];

  //Liste des questions/réponses
  faqs = [
    {
      question: 'Comment puis-je rejoindre l\'association ?',
      answer:
        'Pour rejoindre notre association, vous pouvez nous contacter par téléphone, email ou venir directement à notre local. Nous organisons des réunions d\'information mensuelles pour présenter nos activités et projets.'
    },
    {
      question: 'Quels sont les horaires des ateliers ?',
      answer:
        'En devenant membre, vous bénéficiez de formations, d\'un réseau actif et de la possibilité de participer à nos projets locaux et internationaux.'
    },
    {
      question: 'Puis-je participer sans être membre ?',
      answer:
        'Oui, vous pouvez nous soutenir en tant que bénévole, partenaire financier ou en partageant nos actions sur vos réseaux.'
    },
    {
      question: 'Comment puis-je soutenir l\'association ?',
      answer:
        'Nous proposons une variété d\'activités, y compris des ateliers de formation, des événements communautaires, des campagnes de sensibilisation et des projets de développement local.'
    },
    {
      question: 'Organisez-vous des événements pour les enfants ?',
      answer:
        'Nos ateliers ont lieu les soirs en semaine et certains samedis. Consultez notre calendrier en ligne pour les horaires spécifiques.'
    }
  ];

  // Fonction de toggle
  toggleFaq(index: number): void {
    if (this.activeIndex === index) {
      this.activeIndex = null;
    } else {
      this.activeIndex = index;
    }
  }

  galleryItems: GalleryItem[] = [
    {
      title: 'Match de foot',
      location: 'Yaoundé',
      image: 'assets/images/ARAS/Foot2.jpg'
    },
    {
      title: 'Jolie membre de notre association',
      location: 'Yaoundé',
      image: 'assets/images/ARAS/woman.jpg'
    },
    {
      title: 'Symbole de l\'association',
      location: 'Bamako',
      image: 'assets/images/ARAS/statut.jpg'
    },
    {
      title: 'Rencontre conviviale avec le CREPS',
      location: 'Yaoundé',
      image: 'assets/images/ARAS/creps2.jpg'
    },
    {
      title: 'Cadeau à sa majesté NJI BOCCACE',
      location: 'Yaoundé',
      image: 'assets/images/ARAS/cadeau.jpg'
    },
    {
      title: 'Remise de prix à l\'une de nos plus grandes fans',
      location: 'Yaoundé, Hôtel Franco',
      image: 'assets/images/ARAS/remise.jpg'
    },
    {
      title: 'Nouvel An kamite 6262',
      location: 'Yaoundé, Hôtel Franco',
      image: 'assets/images/ARAS/conference.jpg'
    },
    {
      title: 'Visite du musée national',
      location: 'Yaoundé',
      image: 'assets/images/ARAS/museum.jpg'
    },
    {
      title: 'Transmission du flambeau à Ambam',
      location: 'Ambam, Sud Cameroun',
      image: 'assets/images/ARAS/transmission.jpg'
    },
    {
      title: 'Rencontre Retour Aux sources avec Thot',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/thot.jpg'
    },
    {
      title: 'Célébration au temple des lumières',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/temple.jpg'
    },
    {
      title: 'Randonnée avec vue imprenable sur Yaoundé',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/randonnee_vue_arriere.jpg'
    },
    {
      title: 'Joyeuse randonnée en montagne',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/joie_randonnee.jpg'
    },
    {
      title: 'Scienty Ekoro, artiste musicien, formateur à Retour Aux Sources',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/musica.jpg'
    },
    {
      title: 'Danseurs traditionnels lors du nouvel an kamite 6262',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/danseurs_traditionnels.jpg'
    },
    {
      title: 'Communication avec un masque artisanal',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/communication_masque.jpg'
    },
    {
      title: 'Notre 2-0',
      location: 'Yaoundé, Cameroun',
      image: 'assets/images/ARAS/foot.jpg'
    }
  ];

  selectedImage: GalleryItem | null = null;


  
  selectedActivity: ActivityPayload | null = null;
  showModal = false;

  constructor(private cdr: ChangeDetectorRef) {}

  openActivity(payload: ActivityPayload) {
    this.selectedActivity = payload; // d’abord les données
    this.showModal = true;           // puis on affiche
    document.body.style.overflow = 'hidden';
  }


  closePopup() {
    this.showModal = false;
    this.selectedActivity = null;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  openImage(item: GalleryItem): void {
    this.selectedImage = item;
    document.body.style.overflow = 'hidden';
  }

  closeImage(event: Event): void {
    event.stopPropagation();
    this.selectedImage = null;
    document.body.style.overflow = '';
  }


  applyTo(activity: ActivityPayload) {
    console.log('Postuler pour :', activity.title);
    this.closePopup();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    const autoPlay = (interval = 3500) => {
      return (slider: KeenSliderInstance) => {
        let timer: any;
        const clear = () => {
          if (timer) { clearInterval(timer); timer = null; }
        };
        const start = () => {
          clear();
          timer = setInterval(() => slider.next(), interval);
        };
        slider.on('created', () => {
          start();
          slider.container.addEventListener('mouseover', clear);
          slider.container.addEventListener('mouseout', start);
        });
        slider.on('dragStarted', clear);
        slider.on('animationEnded', start);
        slider.on('destroyed', clear);
      };
    };

    // 👉 Slider 1 : celui que tu as déjà
    this.slider = new KeenSlider(
      this.sliderRef.nativeElement,
      {
        loop: true,
        slides: { perView: 1 },
        // duration: 800
      },
      [autoPlay(3500)]            // autoplay 3,5 s
    );

    // 👉 Slider 2 : testimonials
    this.testimonialSlider = new KeenSlider(
      this.testimonialSliderRef.nativeElement,
      {
        loop: true,
        slides: {
          perView: 1,
          spacing: 24,
        },
        breakpoints: {
          '(min-width: 768px)': {
            slides: { perView: 2, spacing: 32 }
          },
          '(min-width: 1024px)': {
            slides: { perView: 3, spacing: 32 }
          }
        }
      },
      [autoPlay(5000)]            // autoplay 5 s (par ex.)
    );

  }

    nextTestimonial(): void {
      this.testimonialSlider?.next();
    }

    prevTestimonial(): void {
      this.testimonialSlider?.prev();
    }

    goToTestimonial(index: number): void {
      this.testimonialSlider?.moveToIdx(index);
      this.activeTestimonialIndex = index;
    }

    ngOnDestroy(): void {
      //this.slider?.destroy();
      //this.testimonialSlider?.destroy();
    }

  private initializeFAQ(): void {
    // Sélectionner tous les éléments FAQ
    if (typeof document !== 'undefined') {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
          question.addEventListener('click', () => {
            // Fermer toutes les autres questions
            faqItems.forEach((otherItem) => {
              if (otherItem !== item) {
                otherItem.classList.remove('active');
              }
            });
            
            // Basculer l'état de la question actuelle
            item.classList.toggle('active');
          });
        }
      });
    }
  }

  // Méthode pour ouvrir/fermer une question spécifique (optionnel)
  toggleFAQ(index: number): void {
    if (typeof document !== 'undefined') {
      const faqItems = document.querySelectorAll('.faq-item');
      const targetItem = faqItems[index] as HTMLElement;
      
      if (targetItem) {
        // Fermer toutes les autres questions
        faqItems.forEach((item, i) => {
          if (i !== index) {
            item.classList.remove('active');
          }
        });
        
        // Basculer l'état de la question ciblée
        targetItem.classList.toggle('active');
      }
    }
  }

  // Accessibilité : touche Échap pour fermer
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.selectedActivity) this.closePopup();
  }
}
