import { useSettings } from './SettingsContext';
import { enUS, fr } from 'date-fns/locale';

type Lang = 'en' | 'fr';

type Translations = Record<Lang, Record<string, any>>;

const translations: Translations = {
  en: {
    settings: {
      title: 'Settings',
      darkMode: 'Dark mode',
      timeFormat: 'Time format',
      timeFormat24: '24-hour',
      timeFormat12: '12-hour',
      language: 'Language',
      english: 'English',
      french: 'French',
    },
    schedule: {
      loading: 'Loading your schedule...',
      tag: 'Daily Schedule',
      title: 'Your Day Plan',
      description: 'Plan your week and view each day with an intuitive schedule and clear visualizations',
      entriesCountLabel: 'Schedule Entries',
      searchPlaceholder: 'Search activities...',
      searchButton: 'Search',
      startDatePlaceholder: 'Start date',
      endDatePlaceholder: 'End date',
      tagsPlaceholder: 'Tags (comma separated)',
      emptyTitle: 'Your Schedule Awaits',
      emptyDescription: 'Use the selector above to create a timetable, then add your first entry in the Admin Panel.',
    },
    admin: {
      tag: 'Admin Panel',
      title: 'Schedule Control',
      description: 'Add new items to your daily schedule. Each item will automatically position itself based on date.',
      success: 'Schedule item added successfully!',
      recentEntries: 'Recent Entries',
      noEntries: 'No entries yet',
      featureTitle: 'Intelligent Positioning',
      featureDesc: 'Your schedule automatically sorts and positions entries by date, creating an easy-to-follow plan.',
    },
    entryForm: {
      title: 'Add Schedule Item',
      fields: {
        title: 'Title',
        titlePlaceholder: 'Enter event title...',
        date: 'Date',
        precision: 'Precision',
        description: 'Description',
        descriptionPlaceholder: 'Describe this scheduled activity...',
      },
      precision: {
        year: 'Year',
        month: 'Month',
        day: 'Day',
        hour: 'Hour',
        minute: 'Minute',
      },
      submitting: 'Adding to Schedule...',
      submit: 'Add to Schedule',
      update: 'Update Entry',
    },
    importEntries: {
      title: 'Import JSON',
      import: 'Import',
      importing: 'Importing...'
    },
    timetableManager: {
      selectPlaceholder: 'Select timetable',
      newPlaceholder: 'New timetable',
      create: 'Create',
      renamePlaceholder: 'Rename timetable',
      rename: 'Rename',
      delete: 'Delete',
      deleteAll: 'Delete All',
      deletingIn: 'Deleting in',
      confirmNow: 'Confirm now',
      cancel: 'Cancel',
    },
    calendarEditor: {
      eventPrompt: 'Event title',
      deleteConfirm: 'Delete this event?'
    },
    nav: {
      schedule: 'Schedule',
      admin: 'Admin Panel',
      settings: 'Settings',
      navigation: 'Navigation',
    }
  },
  fr: {
    settings: {
      title: 'Paramètres',
      darkMode: 'Mode sombre',
      timeFormat: "Format de l'heure",
      timeFormat24: '24 heures',
      timeFormat12: '12 heures',
      language: 'Langue',
      english: 'Anglais',
      french: 'Français',
    },
    schedule: {
      loading: 'Chargement de votre emploi du temps...',
      tag: 'Agenda quotidien',
      title: 'Planifier votre journée',
      description: 'Planifiez votre semaine et visualisez chaque jour avec un emploi du temps intuitif et des visualisations claires',
      entriesCountLabel: "Entrées d'emploi du temps",
      searchPlaceholder: 'Rechercher des activités...',
      searchButton: 'Rechercher',
      startDatePlaceholder: 'Date de début',
      endDatePlaceholder: 'Date de fin',
      tagsPlaceholder: 'Étiquettes (séparées par des virgules)',
      emptyTitle: 'Votre emploi du temps vous attend',
      emptyDescription: "Utilisez le sélecteur ci-dessus pour créer un emploi du temps, puis ajoutez votre première entrée dans le panneau d’administration.",
    },
    admin: {
      tag: "Panneau d'administration",
      title: 'Contrôle du programme',
      description: 'Ajoutez de nouveaux éléments à votre emploi du temps quotidien. Chaque élément se positionne automatiquement en fonction de la date.',
      success: 'Élément ajouté avec succès !',
      recentEntries: 'Entrées récentes',
      noEntries: "Aucune entrée pour l'instant",
      featureTitle: 'Positionnement intelligent',
      featureDesc: "Votre emploi du temps trie et positionne automatiquement les entrées par date, pour un plan facile à suivre.",
    },
    entryForm: {
      title: 'Ajouter un élément',
      fields: {
        title: 'Titre',
        titlePlaceholder: "Entrez le titre de l'événement...",
        date: 'Date',
        precision: 'Précision',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez cette activité...',
      },
      precision: {
        year: 'Année',
        month: 'Mois',
        day: 'Jour',
        hour: 'Heure',
        minute: 'Minute',
      },
      submitting: 'Ajout en cours...',
      submit: 'Ajouter au programme',
      update: 'Mettre à jour',
    },
    importEntries: {
      title: 'Importer JSON',
      import: 'Importer',
      importing: 'Importation en cours...'
    },
    timetableManager: {
      selectPlaceholder: "Sélectionner un emploi du temps",
      newPlaceholder: 'Nouvel emploi du temps',
      create: 'Créer',
      renamePlaceholder: "Renommer l'emploi du temps",
      rename: 'Renommer',
      delete: 'Supprimer',
      deleteAll: 'Tout supprimer',
      deletingIn: 'Suppression dans',
      confirmNow: 'Confirmer maintenant',
      cancel: 'Annuler',
    },
    calendarEditor: {
      eventPrompt: "Titre de l'événement",
      deleteConfirm: 'Supprimer cet événement ?'
    },
    nav: {
      schedule: 'Agenda',
      admin: "Panneau d'administration",
      settings: 'Paramètres',
      navigation: 'Navigation',
    }
  }
};

const dateLocales: Record<Lang, Locale> = { en: enUS, fr };

export function useTranslation() {
  const { language } = useSettings();
  const t = (key: string): string => {
    const parts = key.split('.');
    let result: any = translations[language];
    for (const p of parts) {
      result = result?.[p];
    }
    return result ?? key;
  };
  return { t, locale: dateLocales[language], language };
}

export default translations;
