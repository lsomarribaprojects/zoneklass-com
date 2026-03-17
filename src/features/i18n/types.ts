export type Locale = 'es' | 'en'
export const LOCALES: Locale[] = ['es', 'en']
export const DEFAULT_LOCALE: Locale = 'es'

export interface Dictionary {
  nav: {
    home: string
    courses: string
    myCourses: string
    exploreCourses: string
    community: string
    leaderboard: string
    messages: string
    profile: string
    settings: string
    adminPanel: string
    ranking: string
    menu: string
    changeTheme: string
    logout: string
    user: string
  }
  auth: {
    welcomeBack: string
    signInTo: string
    continueWithGoogle: string
    signUpWithGoogle: string
    or: string
    email: string
    emailPlaceholder: string
    password: string
    showPassword: string
    hidePassword: string
    signIn: string
    signUp: string
    createAccount: string
    createYourAccount: string
    joinAndLearn: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
    fullName: string
    fullNamePlaceholder: string
    minChars: string
    allFieldsRequired: string
    passwordMinLength: string
    recoverPassword: string
    recoverSubtitle: string
    sendLink: string
    checkEmail: string
    emailSentMessage: string
    backToLogin: string
  }
  dashboard: {
    greeting: string
    welcome: string
    level: string
    totalXp: string
    streak: string
    days: string
    courses: string
  }
  course: {
    lessons: string
    modules: string
    duration: string
    enrolled: string
    free: string
    enrollFree: string
    enrollPrice: string
    enrolling: string
    alreadyEnrolled: string
    continueCourse: string
    startCourse: string
    backToCatalog: string
    courseNotFound: string
    yourProgress: string
    lessonsCompleted: string
    courseContent: string
    ofContent: string
    of: string
    exploreCourses: string
    exploreSubtitle: string
    myCoursesTitle: string
    noEnrolledYet: string
    noEnrolledSubtitle: string
    viewAll: string
  }
  lesson: {
    estimatedDuration: string
    minutes: string
    lessonCompleted: string
    completeLesson: string
    saving: string
    previous: string
    next: string
    finish: string
    back: string
    lessonOf: string
    lessonNotFound: string
    loadError: string
    loadErrorMessage: string
    completeError: string
    backToCourse: string
    videoTitle: string
    summaryInfographic: string
  }
  completion: {
    congratulations: string
    courseCompleted: string
    backToCourse: string
    goToDashboard: string
  }
  settings: {
    title: string
    subtitle: string
    profile: string
    fullName: string
    yourName: string
    emailLabel: string
    emailCannotChange: string
    saveProfile: string
    profileUpdated: string
    emailNotifications: string
    welcome: string
    welcomeDesc: string
    enrollments: string
    enrollmentsDesc: string
    coursesCompleted: string
    coursesCompletedDesc: string
    badges: string
    badgesDesc: string
    weeklyDigest: string
    weeklyDigestDesc: string
    news: string
    newsDesc: string
    savePreferences: string
    preferencesSaved: string
    couldNotLoad: string
    language: string
    languageDesc: string
  }
  community: {
    title: string
    subtitle: string
    createPost: string
    noPosts: string
    beFirst: string
    all: string
    general: string
    questions: string
    resources: string
    achievements: string
    introductions: string
  }
  leaderboard: {
    title: string
    subtitle: string
    weekly: string
    monthly: string
    total: string
    classification: string
    noData: string
    noDataDesc: string
    you: string
    period: string
    top3: string
    positions4to20: string
    position: string
    lvl: string
    badges: string
    user: string
  }
  hanna: {
    openAssistant: string
    chatTitle: string
    newConversation: string
    hideHistory: string
    viewHistory: string
    history: string
    closeChat: string
    conversationHistory: string
    messagesLabel: string
    greeting: string
    greetingMessage: string
    errorMessage: string
    selectMode: string
    modes: Record<string, string>
    modeDescriptions: Record<string, string>
  }
  catalog: {
    searchPlaceholder: string
    allCategories: string
    allLevels: string
    clear: string
    noCoursesFound: string
    adjustFilters: string
  }
  categories: Record<string, string>
  levels: Record<string, string>
}
