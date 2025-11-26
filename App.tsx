
import React, { useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import LanguageToggle from './components/LanguageToggle';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import { LocaleContext } from './contexts/LocaleContext';
import { AuthContext } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { GlobeAltIcon, HomeIcon, PlusCircleIcon, MagnifyingGlassCircleIcon, ChartBarIcon, UserGroupIcon, SparklesIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from './constants';
import AboutUsPage from './pages/AboutUsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SubmitComplaintPage = lazy(() => import('./pages/SubmitComplaintPage'));
const TrackStatusPage = lazy(() => import('./pages/TrackStatusPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const PredictionPage = lazy(() => import('./pages/PredictionPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));


// Simple Localization Context

const translations: Record<string, Record<string, string>> = {
  es: {
    home: "Inicio",
    submitComplaint: "Enviar incidencia",
    trackStatus: "Seguir estado",
    adminDashboard: "Panel de administración",
    analytics: "Analítica",
    prediction: "Predicción",
    portalTitle: "Participa - Buzón Cívico",
    trackCivicComplaints: "Sigue las incidencias ciudadanas",
    landingTitle: "Tu voz, nuestra acción rápida",
    landingSubtitle: "Informa fácilmente de problemas municipales, sigue su progreso y comprueba el impacto de tus aportes.",
    processedLastMonth: "Incidencias gestionadas en los últimos 30 días",
    averageResolution: "Tiempo medio de resolución",
    citizenSatisfaction: "Satisfacción ciudadana",
    submitNewComplaint: "Enviar nueva incidencia",
    trackMyComplaint: "Consultar mi incidencia",
    ourImpact: "Nuestro impacto",
    howItWorks: "Cómo funciona",
    howItWorksDesc: "Recogemos tu aviso, lo derivamos al área correcta y te mantenemos informado.",
    submitSimple: "Envía con facilidad",
    aiProcesses: "Clasificación y envío inteligente",
    quickResolution: "Resolución ágil",
    selectCategory: "--- Selecciona una categoría ---",
    wasteManagement: "Gestión de residuos",
    roadMaintenance: "Mantenimiento de calles",
    waterSupply: "Suministro de agua",
    streetLighting: "Alumbrado público",
    publicSafety: "Seguridad ciudadana",
    other: "Otra",
    categoryRequired: "La categoría es obligatoria.",
    descriptionMinLength: "La descripción debe tener al menos 10 caracteres.",
    locationRequired: "La ubicación es obligatoria.",
    validMobileRequired: "Introduce un número de móvil válido.",
    photoSizeError: "La foto debe pesar menos de 10MB.",
    unsupportedPhotoType: "Formato no admitido. Sube una imagen JPEG, PNG o WEBP.",
    complaintSubmittedSuccess: "¡Incidencia enviada con éxito!",
    yourComplaintIDIs: "El ID de tu incidencia es:",
    youWillReceiveSMS: "Recibirás avisos con las actualizaciones.",
    backToHome: "Volver al inicio",
    complaintCategory: "Categoría de la incidencia",
    complaintDescription: "Describe el problema",
    descriptionPlaceholder: "Cuéntanos con detalle qué ocurre...",
    exactLocation: "Ubicación exacta / punto de referencia",
    locationPlaceholder: "Ej.: junto al parque central",
    detectMyLocation: "Detectar mi ubicación",
    yourMobileNumber: "Tu número de móvil (para avisos)",
    uploadPhotoOptional: "Subir foto (opcional)",
    chooseFile: "Elegir archivo",
    photoSelected: "Foto seleccionada",
    submit: "Enviar incidencia",
    locationNotFound: "No se pudo obtener la dirección. Escríbela manualmente.",
    locationFetchError: "Error al obtener la ubicación.",
    locationPermissionDenied: "Permiso de ubicación denegado.",
    geolocationNotSupported: "La geolocalización no está disponible en tu navegador.",
    contactUs: "Contáctanos",
    helpline: "Teléfono:",
    emailSupport: "Correo:",
    quickLinks: "Enlaces rápidos",
    privacyPolicy: "Política de privacidad",
    termsOfService: "Términos de servicio",
    aboutUs: "Sobre nosotros",
    disclaimer: "Plataforma demostrativa para participación ciudadana.",
    chatbotWelcome: "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?",
    chatbotChoose: "Elige una opción:",
    chatbotNewComplaint: "Nueva incidencia",
    chatbotTrack: "Consultar incidencia",
    chatbotAskCategory: "Perfecto. Indica la categoría (residuos, calles, agua...).",
    chatbotAskDescription: "Entendido. Describe el problema con detalle.",
    chatbotAskLocation: "Gracias. Añade la ubicación o una referencia cercana.",
    chatbotAskContact: "Por último, ¿qué número de móvil podemos usar para avisarte?",
    chatbotConfirm: "Revisa los datos. ¿Todo correcto?",
    chatbotConfirmComplaint: "Confirmar",
    chatbotCancel: "Cancelar",
    chatbotSubmitting: "Enviando tu incidencia...",
    chatbotSuccess: "Incidencia registrada. Tu ID es",
    chatbotAskTrackID: "Introduce el ID para comprobar su estado.",
    chatbotInvalidTrackID: "El ID no es válido. Vuelve a intentarlo.",
    chatbotComplaintNotFound: "No encontramos una incidencia con ese ID.",
    chatbotStatusIs: "El estado de tu incidencia es:",
    chatbotAnythingElse: "¿Necesitas algo más?",
    chatbotBye: "¡Hasta pronto!",
    chatbotRestart: "Dímelo si vuelves a necesitar ayuda.",
    chatbotInvalidInput: "No he entendido la respuesta. Usa las opciones o describe el problema.",
    termsTitle: "Términos de servicio",
    termsLastUpdated: "Última actualización:",
    termsAcceptance: "Al usar Participa aceptas estas condiciones y el uso responsable de la plataforma.",
    termsUsagePolicyTitle: "Uso permitido",
    termsUsagePolicyContent1: "Utiliza el portal para incidencias reales relacionadas con servicios municipales.",
    termsUsagePolicyContent2: "No está permitido:",
    termsUsagePolicyItem1: "Publicidad o comunicaciones comerciales.",
    termsUsagePolicyItem2: "Contenido ofensivo, difamatorio o engañoso.",
    termsUsagePolicyItem3: "Avisos falsos con intención maliciosa.",
    termsUsagePolicyItem4: "Actividades ilegales o contrarias a la normativa.",
    termsUserResponsibilitiesTitle: "Responsabilidades de la persona usuaria",
    termsUserResponsibilitiesContent1: "Garantizar la veracidad de la información enviada.",
    termsUserResponsibilitiesContent2: "Facilitar un contacto válido para las notificaciones.",
    termsUserResponsibilitiesContent3: "Respetar la privacidad y derechos de terceros.",
    termsDataPrivacyTitle: "Privacidad y datos",
    termsDataPrivacyContent: "Solo usamos tus datos para gestionar la incidencia y protegeremos tu información conforme a la normativa vigente.",
    termsVisibilityTitle: "Transparencia",
    termsVisibilityContent: "Podremos mostrar datos anonimizados de incidencias para fines estadísticos.",
    termsDisclaimersTitle: "Aviso",
    termsDisclaimersContent: "El portal canaliza avisos hacia las áreas municipales; los plazos pueden variar según cada caso.",
    termsGoverningLawTitle: "Ley aplicable",
    termsGoverningLawContent: "El uso del servicio se rige por la normativa local vigente.",
    termsContactUsTitle: "Contacto",
    termsContactUsContent: "Escríbenos mediante los datos indicados en el pie de página.",
    aboutTitle: "Sobre la plataforma",
    aboutIntro: "Herramienta digital para acercar a la ciudadanía y al ayuntamiento.",
    aboutMissionTitle: "Nuestra misión",
    aboutMissionContent: "Facilitar que cualquier persona pueda comunicar incidencias y recibir respuesta con transparencia.",
    aboutWhatWeDoTitle: "Qué hacemos",
    aboutWhatWeDoContent: "Recogemos avisos, los clasificamos y ofrecemos seguimiento en tiempo real con analítica para los equipos municipales.",
    aboutFeaturesTitle: "Características clave",
    aboutFeatureAI: "Clasificación inteligente que envía cada aviso al departamento adecuado.",
    aboutFeatureMultilingual: "Interfaz bilingüe en castellano y euskera.",
    aboutFeatureTracking: "Seguimiento en tiempo real desde el envío hasta la resolución.",
    aboutFeatureAnalytics: "Indicadores para detectar patrones y priorizar recursos.",
    aboutFeatureAccessibility: "Diseño accesible y fácil de usar.",
    aboutCommitmentTitle: "Nuestro compromiso",
    aboutCommitmentContent: "Trabajamos con valores de servicio público, seguridad y protección de datos.",
    aboutJoinUsTitle: "Participa con nosotros",
    aboutJoinUsContent: "Tus sugerencias importan. Comparte ideas para mejorar el servicio.",
    contactSupport: "Contactar soporte",
    supportTitle: "Contacto y soporte",
    supportIntro: "Estamos disponibles para dudas, incidencias técnicas o sugerencias.",
    supportContactInfo: "Información de contacto",
    supportSendMessage: "Envíanos un mensaje",
    yourName: "Tu nombre",
    yourEmail: "Tu correo",
    ticketIdOptional: "ID de incidencia (opcional)",
    yourMessage: "Tu mensaje",
    sendMessage: "Enviar mensaje",
    messageSentSuccess: "Mensaje enviado. Te responderemos pronto.",
    nameRequired: "El nombre es obligatorio.",
    emailRequired: "Introduce un correo válido.",
    messageRequired: "El mensaje no puede estar vacío.",
    predictionTitle: "Analítica predictiva con IA",
    predictionSubtitle: "Prevé incidencias y planifica recursos de forma proactiva.",
    dateRange: "Selecciona el periodo de previsión:",
    cityWideRisk: "Nivel de riesgo en la ciudad",
    topCriticalAreas: "5 zonas críticas",
    predictedIssue: "Problema previsto",
    severity: "Severidad",
    expectedComplaints: "Distribución esperada",
    geospatialRisk: "Mapa de riesgo geoespacial",
    actionableRecs: "Recomendaciones",
    downloadReport: "Descargar informe",
    predictedTrafficCongestion: "Congestión de tráfico prevista",
    waterShortageRisk: "Riesgo de falta de agua",
    municipalityLogin: "Acceso municipal",
    logout: "Cerrar sesión",
    municipalityName: "Municipio",
    email: "Correo",
    password: "Contraseña",
    login: "Entrar",
    allFieldsRequired: "Selecciona un municipio e introduce la contraseña.",
    selectMunicipality: "--- Selecciona tu municipio ---",
  },
  eu: {
    home: "Hasiera",
    submitComplaint: "Arazoa bidali",
    trackStatus: "Egoera jarraitu",
    adminDashboard: "Kudeaketa panela",
    analytics: "Analitika",
    prediction: "Iragarpena",
    portalTitle: "Participa - Herritarren kexa gunea",
    trackCivicComplaints: "Herritarren kexak jarraitu",
    landingTitle: "Zure ahotsa, gure ekintza azkarra",
    landingSubtitle: "Udal arazoak erraz jakinarazi, aurrerapena jarraitu eta zure ekarpenen eragina ikusi.",
    processedLastMonth: "Azken 30 egunetan kudeatutako kexak",
    averageResolution: "Batez besteko konponketa denbora",
    citizenSatisfaction: "Herritarren gogobetetasuna",
    submitNewComplaint: "Kexa berria bidali",
    trackMyComplaint: "Nire kexa kontsultatu",
    ourImpact: "Gure eragina",
    howItWorks: "Nola funtzionatzen du",
    howItWorksDesc: "Zure abisua jasotzen dugu, sail egokira bidaltzen dugu eta informatuta mantentzen zaitugu.",
    submitSimple: "Erraztasunez bidali",
    aiProcesses: "Sailkapen adimenduna",
    quickResolution: "Ebazpen arina",
    selectCategory: "--- Aukeratu kategoria ---",
    wasteManagement: "Hondakinen kudeaketa",
    roadMaintenance: "Kaleen mantentzea",
    waterSupply: "Ura hornidura",
    streetLighting: "Argiteria publikoa",
    publicSafety: "Segurtasun publikoa",
    other: "Beste bat",
    categoryRequired: "Kategoriak beharrezkoa da.",
    descriptionMinLength: "Deskribapenak gutxienez 10 karaktere izan behar ditu.",
    locationRequired: "Kokalekua beharrezkoa da.",
    validMobileRequired: "Baliozko mugikor zenbaki bat sartu.",
    photoSizeError: "Argazkiak 10MB baino gutxiago pisatu behar du.",
    unsupportedPhotoType: "Formatu ez onartua. JPEG, PNG edo WEBP igo.",
    complaintSubmittedSuccess: "Kexa ongi bidali da!",
    yourComplaintIDIs: "Zure kexaren IDa:",
    youWillReceiveSMS: "Egoeraren berri jasoko duzu.",
    backToHome: "Itzuli hasierara",
    complaintCategory: "Kexaren kategoria",
    complaintDescription: "Arazoa deskribatu",
    descriptionPlaceholder: "Kontatu xehetasunak...",
    exactLocation: "Helbide zehatza / erreferentzia",
    locationPlaceholder: "Adib.: parke nagusiaren ondoan",
    detectMyLocation: "Nire kokalekua bilatu",
    yourMobileNumber: "Zure mugikorra (abisatzeko)",
    uploadPhotoOptional: "Argazkia igo (aukerakoa)",
    chooseFile: "Fitxategia aukeratu",
    photoSelected: "Argazkia aukeratuta",
    submit: "Bidali kexa",
    locationNotFound: "Ezin izan da helbidea lortu. Idatzi eskuz.",
    locationFetchError: "Errorea kokalekua lortzean.",
    locationPermissionDenied: "Kokaleku baimena ukatua.",
    geolocationNotSupported: "Geolokalizazioa ez dago eskuragarri zure arakatzailean.",
    contactUs: "Jarri gurekin harremanetan",
    helpline: "Telefonoa:",
    emailSupport: "Posta:",
    quickLinks: "Esteka azkarrak",
    privacyPolicy: "Pribatutasun politika",
    termsOfService: "Zerbitzu baldintzak",
    aboutUs: "Guri buruz",
    disclaimer: "Herri parte-hartzerako demoa.",
    chatbotWelcome: "Kaixo! Laguntzailea naiz. Nola lagundu zaitzaket?",
    chatbotChoose: "Aukeratu aukera bat:",
    chatbotNewComplaint: "Kexa berria",
    chatbotTrack: "Kexa kontsultatu",
    chatbotAskCategory: "Ongi. Zein kategoria? (hondakinak, kaleak, ura...).",
    chatbotAskDescription: "Ados. Azaldu arazoa xehetasunez.",
    chatbotAskLocation: "Eskerrik asko. Gehitu kokalekua edo erreferentzia bat.",
    chatbotAskContact: "Azkenik, zein mugikor erabil dezakegu jakinarazteko?",
    chatbotConfirm: "Datuak berrikusi. Zuzen al daude?",
    chatbotConfirmComplaint: "Berretsi",
    chatbotCancel: "Utzi",
    chatbotSubmitting: "Zure kexa bidaltzen...",
    chatbotSuccess: "Kexa erregistratua. Zure IDa",
    chatbotAskTrackID: "Sartu IDa egoera ikusteko.",
    chatbotInvalidTrackID: "ID hori ez da zuzena. Saiatu berriro.",
    chatbotComplaintNotFound: "Ez dugu aurkitu ID horrekin kexarik.",
    chatbotStatusIs: "Zure kexaren egoera:",
    chatbotAnythingElse: "Beste zerbait behar duzu?",
    chatbotBye: "Ondo izan!",
    chatbotRestart: "Behar badidazu, esan lasai.",
    chatbotInvalidInput: "Ez dut ulertu. Erabili aukerak edo azaldu arazoa.",
    termsTitle: "Zerbitzu baldintzak",
    termsLastUpdated: "Azken eguneraketa:",
    termsAcceptance: "Participa erabiltzean baldintza hauek onartzen dituzu eta erabilera arduratsua egiten duzu.",
    termsUsagePolicyTitle: "Erabilera egokia",
    termsUsagePolicyContent1: "Ataria benetako udal arazoak jakinarazteko da.",
    termsUsagePolicyContent2: "Ez da onartzen:",
    termsUsagePolicyItem1: "Publizitatea edo merkataritza mezuak.",
    termsUsagePolicyItem2: "Eduki iraingarria edo engainagarria.",
    termsUsagePolicyItem3: "Nahita egindako kexa faltsuak.",
    termsUsagePolicyItem4: "Legearen aurkako jarduerak.",
    termsUserResponsibilitiesTitle: "Erantzukizunak",
    termsUserResponsibilitiesContent1: "Bidalitako informazioa egiazkoa dela bermatu.",
    termsUserResponsibilitiesContent2: "Harremanetarako datu baliodunak eman jakinarazpenetarako.",
    termsUserResponsibilitiesContent3: "Hirugarrenen pribatutasuna eta eskubideak errespetatu.",
    termsDataPrivacyTitle: "Pribatutasuna eta datuak",
    termsDataPrivacyContent: "Zure datuak kexa kudeatzeko soilik erabiliko dira eta indarreko araudiari jarraituz babestuko dira.",
    termsVisibilityTitle: "Gardentasuna",
    termsVisibilityContent: "Kexa anonimizatuen datu estatistikoak erakutsi daitezke.",
    termsDisclaimersTitle: "Oharra",
    termsDisclaimersContent: "Atariak abisuak bideratzen ditu; epeak kasu bakoitzaren arabera alda daitezke.",
    termsGoverningLawTitle: "Aplikatutako legea",
    termsGoverningLawContent: "Zerbitzuaren erabilera tokiko araudiek gidatzen dute.",
    termsContactUsTitle: "Kontaktua",
    termsContactUsContent: "Idatzi oinetako datuak erabiliz.",
    aboutTitle: "Plataformari buruz",
    aboutIntro: "Herritarrak eta udala hurbiltzeko tresna digitala.",
    aboutMissionTitle: "Gure misioa",
    aboutMissionContent: "Edozeinek arazoak erraz jakinarazi eta erantzun gardenak jasotzea.",
    aboutWhatWeDoTitle: "Zer egiten dugu",
    aboutWhatWeDoContent: "Abisuak jasotzen ditugu, sailkatzen eta denbora errealean jarraipena eskaintzen dugu, analitikarekin batera.",
    aboutFeaturesTitle: "Ezaugarri nagusiak",
    aboutFeatureAI: "Sailkapen adimenduna departamentu egokira bideratzeko.",
    aboutFeatureMultilingual: "Bi hizkuntzako interfazea: gaztelania eta euskara.",
    aboutFeatureTracking: "Denbora errealeko jarraipena bidalketatik konponketara.",
    aboutFeatureAnalytics: "Adierazleak joerak antzemateko eta baliabideak lehentasuna emateko.",
    aboutFeatureAccessibility: "Erabilerraza eta irisgarria.",
    aboutCommitmentTitle: "Gure konpromisoa",
    aboutCommitmentContent: "Zerbitzu publikoaren balioekin, segurtasunarekin eta datuen babesarekin lan egiten dugu.",
    aboutJoinUsTitle: "Parte hartu gurekin",
    aboutJoinUsContent: "Zure iradokizunek balio dute. Bidali ideia berriak.",
    contactSupport: "Laguntza teknikora jo",
    supportTitle: "Kontaktua eta laguntza",
    supportIntro: "Hemen gaude zalantzak, arazo teknikoak edo iruzkinak jasotzeko.",
    supportContactInfo: "Kontakturako informazioa",
    supportSendMessage: "Bidali mezu bat",
    yourName: "Zure izena",
    yourEmail: "Zure posta",
    ticketIdOptional: "Kexa IDa (aukerakoa)",
    yourMessage: "Zure mezua",
    sendMessage: "Bidali",
    messageSentSuccess: "Mezua bidalia. Laster erantzungo dugu.",
    nameRequired: "Izena beharrezkoa da.",
    emailRequired: "Posta elektroniko balioduna sartu.",
    messageRequired: "Mezua ezin da hutsik egon.",
    predictionTitle: "IAren analitika prediktiboa",
    predictionSubtitle: "Aurreikusi arazoak eta planifikatu baliabideak modu proaktiboan.",
    dateRange: "Aukeratu aurreikuspen epea:",
    cityWideRisk: "Hiri mailako arrisku maila",
    topCriticalAreas: "5 gune kritiko",
    predictedIssue: "Aurreikusitako arazoa",
    severity: "Larritasuna",
    expectedComplaints: "Espero den banaketa",
    geospatialRisk: "Arriskuaren mapa geoespaziala",
    actionableRecs: "Gomendioak",
    downloadReport: "Txostena deskargatu",
    predictedTrafficCongestion: "Trafiko pilaketa aurreikusita",
    waterShortageRisk: "Ur faltaren arriskua",
    municipalityLogin: "Udal sarbidea",
    logout: "Saioa itxi",
    municipalityName: "Udalerria",
    email: "Posta",
    password: "Pasahitza",
    login: "Sartu",
    allFieldsRequired: "Aukeratu udalerria eta idatzi pasahitza.",
    selectMunicipality: "--- Aukeratu zure udalerria ---",
  },
};
const Header: React.FC<{ currentLang: string, onToggleLang: (lang: string) => void, t: (key: string) => string }> = ({ currentLang, onToggleLang, t }) => {
  return (
    <header className="bg-neutral-white shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center text-xl md:text-2xl font-bold text-gov-blue-900 gap-3">
          <img
            src="https://ccasa.eus/image/layout_set_logo?img_id=1611483&t=1763637683076"
            alt="Participa logo"
            className="h-10 w-auto object-contain rounded-sm"
          />
          <span className="leading-tight">{t('portalTitle')}</span>
        </Link>
        <div className="flex items-center space-x-4">
          <LanguageToggle currentLang={currentLang} onToggle={onToggleLang} />
        </div>
      </div>
    </header>
  );
};

const Navbar: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const location = useLocation();
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: t('home'), path: '/', icon: HomeIcon, visible: true },
        { name: t('submitComplaint'), path: '/submit', icon: PlusCircleIcon, visible: true },
        { name: t('trackStatus'), path: '/track', icon: MagnifyingGlassCircleIcon, visible: true },
        { name: t('adminDashboard'), path: '/admin', icon: UserGroupIcon, visible: isLoggedIn },
        { name: t('analytics'), path: '/analytics', icon: ChartBarIcon, visible: true },
        { name: t('prediction'), path: '/prediction', icon: SparklesIcon, visible: isLoggedIn },
    ];

    const visibleNavItems = navItems.filter(item => item.visible);

    return (
        <nav className="bg-gov-blue-900 text-neutral-white py-3 shadow-md sticky top-[80px] z-40">
            <div className="container mx-auto flex flex-wrap justify-between items-center gap-x-4 gap-y-2 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
                    {visibleNavItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gov-blue-500 transition-colors duration-150 ${location.pathname === item.path ? 'bg-gov-blue-500' : ''} button-link`}
                            aria-current={location.pathname === item.path ? "page" : undefined}
                        >
                            <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gov-blue-500 transition-colors duration-150 button-link"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                            {t('logout')}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gov-blue-500 transition-colors duration-150 ${location.pathname === '/login' ? 'bg-gov-blue-500' : ''} button-link`}
                            aria-current={location.pathname === '/login' ? "page" : undefined}
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                            {t('municipalityLogin')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <div key={location.pathname} className="page-transition-container">
            <Suspense fallback={<Spinner />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/submit" element={<SubmitComplaintPage />} />
                    <Route path="/track" element={<TrackStatusPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/prediction" element={<ProtectedRoute><PredictionPage /></ProtectedRoute>} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/support" element={<SupportPage />} />
                </Routes>
            </Suspense>
        </div>
    );
};

function App() {
  const [lang, setLang] = useState('es');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = (key: string) => translations[lang]?.[key] || key;
  
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          <HashRouter>
            <div className="flex flex-col min-h-screen font-sans">
                <Header currentLang={lang} onToggleLang={setLang} t={t} />
                <Navbar t={t} />
                <main className="container mx-auto p-4 sm:p-6 lg:p-8 main-content">
                  <AnimatedRoutes />
                </main>
                <Footer />
                <Chatbot />
            </div>
          </HashRouter>
      </AuthContext.Provider>
    </LocaleContext.Provider>
  );
}

export default App;