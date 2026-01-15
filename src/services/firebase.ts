import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'

/**
 * Firebase Configuration
 * 
 * Este arquivo gerencia a inicialização do Firebase para diferentes ambientes.
 * As credenciais são carregadas de variáveis de ambiente (.env files).
 */

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

/**
 * Carrega a configuração do Firebase das variáveis de ambiente
 */
const getFirebaseConfig = (): FirebaseConfig => {
  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  // measurementId é opcional (apenas para produção)
  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  }

  // Validação básica
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'databaseURL',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ]

  const missingFields = requiredFields.filter((field) => !config[field])

  if (missingFields.length > 0) {
    throw new Error(
      `Firebase configuration is incomplete. Missing fields: ${missingFields.join(', ')}. ` +
        `Please check your .env file.`
    )
  }

  return config
}

/**
 * Inicializa o Firebase App
 */
let firebaseApp: FirebaseApp
let firebaseDatabase: Database

try {
  const config = getFirebaseConfig()
  firebaseApp = initializeApp(config)
  firebaseDatabase = getDatabase(firebaseApp)

  // Log em desenvolvimento
  if (import.meta.env.DEV) {
    console.log(
      '[Firebase] Initialized with project:',
      config.projectId,
      `(${import.meta.env.VITE_ENVIRONMENT || 'unknown'})`
    )
  }
} catch (error) {
  console.error('[Firebase] Initialization error:', error)
  throw error
}

export { firebaseApp, firebaseDatabase }
export type { FirebaseConfig }
