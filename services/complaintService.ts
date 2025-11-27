import { Complaint, ComplaintStatus, AnalyticsStats, DashboardStats, PredictionData, RiskLevel } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { fileToBase64 } from '../utils/fileUtils';

const complaints: Complaint[] = [
  {
    id: 'TKT-01001',
    category: 'Gestión de residuos',
    description: 'Los contenedores marrones de orgánico llevan tres días sin recogerse y el olor es muy fuerte.',
    location: 'Plaza de la Virgen Blanca, Vitoria-Gasteiz',
    contact: '945000001',
    status: ComplaintStatus.IN_PROGRESS,
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días, posible incumplimiento de SLA
    photoBeforeUrl: 'https://picsum.photos/seed/before1/400/300',
    aiConfidence: 92,
    escalationDept: 'Limpieza y residuos urbanos',
    assignedOfficial: { name: 'Ane Garate', photoUrl: 'https://i.pravatar.cc/150?u=anegarate' },
    aiPriority: 'Medium',
    aiJustification: "Prioridad media por retraso de 3 días en la recogida de orgánico en el centro.",
    aiSummary: "Retraso de tres días en la recogida de orgánico en la Virgen Blanca con olores fuertes.",
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Reforzar la ruta de recogida esta noche y confirmar limpieza de la zona.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), notes: 'Incidencia registrada por la ciudadanía.', actor: 'Citizen' },
      { status: ComplaintStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: 'Asignada a Limpieza y residuos urbanos en Vitoria-Gasteiz.', actor: 'Admin' },
    ]
  },
  {
    id: 'TKT-01042',
    category: 'Mantenimiento de vías',
    description: 'Bache grande en el carril bici que cruza el puente de Abetxuko, peligroso para las bicis.',
    location: 'Puente de Abetxuko, Vitoria-Gasteiz',
    contact: '945000002',
    status: ComplaintStatus.CLOSED,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    photoBeforeUrl: 'https://picsum.photos/seed/before2/400/300',
    photoAfterUrl: 'https://picsum.photos/seed/after2/400/300',
    citizenSatisfactionScore: 5,
    aiConfidence: 98,
    escalationDept: 'Obras públicas y mantenimiento viario',
    assignedOfficial: { name: 'Mikel Arriaga', photoUrl: 'https://i.pravatar.cc/150?u=mikelarriaga' },
    aiPriority: 'High',
    aiJustification: "Prioridad alta por riesgo para ciclistas en un punto muy transitado.",
    aiSummary: "Bache peligroso en el carril bici del puente de Abetxuko que genera riesgo de caída.",
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Reparar de urgencia y señalizar de forma provisional el tramo.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'Incidencia registrada por la ciudadanía.', actor: 'Citizen' },
      { status: ComplaintStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), notes: 'Orden de obra creada y asignada a contrata municipal.', actor: 'Admin' },
      { status: ComplaintStatus.RESOLVED, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Bache reparado y señalización revisada.', actor: 'Admin' },
      { status: ComplaintStatus.CLOSED, timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), notes: 'Valoración ciudadana 5/5. Ticket cerrado automáticamente.', actor: 'System' },
    ]
  },
  {
    id: 'TKT-01087',
    category: 'Alumbrado público',
    description: 'Farola apagada desde hace una semana en la calle Portal de Foronda, la zona queda muy oscura.',
    location: 'Portal de Foronda, Lakua-Arriaga (Vitoria-Gasteiz)',
    contact: '945000003',
    status: ComplaintStatus.PENDING,
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    aiConfidence: 85,
    isDuplicateOf: 'TKT-01080',
    escalationDept: 'Alumbrado y eficiencia energética',
    assignedOfficial: { name: 'Jon Ibarra', photoUrl: 'https://i.pravatar.cc/150?u=jonibarra' },
    aiPriority: 'Medium',
    aiJustification: "Prioridad media por riesgo de seguridad en un barrio residencial.",
    aiSummary: "Farola apagada en Portal de Foronda desde hace una semana, la calle queda a oscuras.",
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Comprobar posible duplicado y programar reparación en la siguiente ronda.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), notes: 'Incidencia registrada y marcada como posible duplicado.', actor: 'System' },
    ]
  },
  {
    id: 'TKT-01115',
    category: 'Gestión de residuos',
    description: 'Punto de reciclaje de vidrio lleno junto al frontón; las botellas ya se acumulan fuera.',
    location: 'Frontón de Salburua, Vitoria-Gasteiz',
    contact: '945000004',
    status: ComplaintStatus.PENDING,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    aiConfidence: 95,
    escalationDept: 'Limpieza y residuos urbanos',
    assignedOfficial: { name: 'Ane Garate', photoUrl: 'https://i.pravatar.cc/150?u=anegarate' },
    aiPriority: 'Low',
    aiJustification: "Prioridad estándar para llenado de contenedor de vidrio sin riesgo inmediato.",
    aiSummary: "Contenedor de vidrio saturado en Salburua con acumulación exterior de botellas.",
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Incluir en la siguiente ruta de recogida y limpiar el entorno.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Incidencia registrada por la ciudadanía, pendiente de revisión.', actor: 'Citizen' },
    ]
  },
  {
    id: 'TKT-01163',
    category: 'Abastecimiento de agua',
    description: 'Fuga de agua visible en la acera, se forma un charco constante junto a la parada de tranvía.',
    location: 'Parada de tranvía de Hegoalde, Vitoria-Gasteiz',
    contact: '945000005',
    status: ComplaintStatus.IN_PROGRESS,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    photoBeforeUrl: 'https://picsum.photos/seed/before3/400/300',
    aiConfidence: 96,
    escalationDept: 'Aguas municipales',
    assignedOfficial: { name: 'Leire Urrutia', photoUrl: 'https://i.pravatar.cc/150?u=leireurrutia' },
    aiPriority: 'High',
    aiJustification: "Prioridad alta por fuga continua en vía pública con consumo y riesgo de resbalón.",
    aiSummary: "Fuga de agua junto a la parada de tranvía de Hegoalde que genera un charco constante.",
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Enviar equipo de emergencia para cerrar la fuga y señalizar la zona.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Incidencia registrada por la ciudadanía, pendiente de revisión.', actor: 'Citizen' },
      { status: ComplaintStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), notes: 'Asignada a Aguas municipales para reparación.', actor: 'Admin' },
    ]
  },
  {
    id: 'TKT-01204',
    category: 'Seguridad ciudadana',
    description: 'Arqueta abierta junto al parque infantil, los menores podrían tropezar.',
    location: 'Parque de Judimendi, Vitoria-Gasteiz',
    contact: '945000006',
    status: ComplaintStatus.RESOLVED,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    aiConfidence: 90,
    escalationDept: 'Seguridad y emergencias',
    assignedOfficial: { name: 'Idoia Armentia', photoUrl: 'https://i.pravatar.cc/150?u=idoiaarmentia' },
    aiPriority: 'High',
    aiJustification: "Riesgo alto por proximidad a menores en parque infantil.",
    aiSummary: 'Arqueta abierta en Judimendi con riesgo para menores; requiere cierre inmediato.',
    aiRelevanceFlag: 'Actionable',
    aiActionRecommendation: 'Balizar de inmediato y cerrar la tapa en menos de 12 horas.',
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: 'Incidencia registrada por la ciudadanía.', actor: 'Citizen' },
      { status: ComplaintStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Zona balizada y reparación programada.', actor: 'Admin' },
      { status: ComplaintStatus.RESOLVED, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), notes: 'Arqueta cerrada y zona segura.', actor: 'Admin' },
    ]
  }
];

// --- Real-time subscription system ---
type Subscriber = (complaints: Complaint[]) => void;
let subscribers: Subscriber[] = [];

const notify = () => {
    const sortedComplaints = [...complaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
    subscribers.forEach(callback => callback(sortedComplaints));
};

export const subscribeToComplaints = (callback: Subscriber): (() => void) => {
    subscribers.push(callback);
    // Immediately notify with current state
    const sortedComplaints = [...complaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
    callback(sortedComplaints);
    return () => {
        subscribers = subscribers.filter(sub => sub !== callback);
    };
};
// --- End subscription system ---

/**
 * Contrato del servicio de IA (backend simulado)
 * Analiza los detalles de una incidencia para priorizarla.
 * @param {string} category - Categoría de la incidencia.
 * @param {string} description - Descripción facilitada por la ciudadanía.
 * @returns {Promise<Object>} Objeto con las sugerencias de IA.
 *   - escalationDept: Departamento municipal propuesto.
 *   - aiPriority: Prioridad sugerida ('High', 'Medium', 'Low').
 *   - aiJustification: Motivo de la priorización.
 *   - aiSummary: Resumen conciso de la incidencia.
 *   - aiRelevanceFlag: 'Actionable' o 'Normal Complaint'.
 *   - aiActionRecommendation: Siguiente paso recomendado para la administración.
 *   - aiConfidence: Confianza simulada.
 */
export const getAiComplaintAnalysis = async (
  category: string,
  description: string
): Promise<{
  escalationDept: string;
  aiPriority: 'High' | 'Medium' | 'Low';
  aiJustification: string;
  aiSummary: string;
  aiRelevanceFlag: 'Actionable' | 'Normal Complaint';
  aiActionRecommendation: string;
  aiConfidence: number;
}> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY no configurada. Devolvemos un análisis simulado en español.");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          escalationDept: 'Obras públicas y mantenimiento viario',
          aiPriority: 'Medium',
          aiJustification: 'IA simulada: prioridad media por palabras clave en la descripción.',
          aiSummary: 'IA simulada: aquí aparecería un resumen breve de la incidencia.',
          aiRelevanceFlag: 'Actionable',
          aiActionRecommendation: 'IA simulada: se propondría la siguiente acción para el equipo gestor.',
          aiConfidence: 88,
        });
      }, 1000);
    });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      escalationDept: {
        type: Type.STRING,
        description: 'Departamento municipal sugerido para gestionar la incidencia.',
        enum: ['Limpieza y residuos urbanos', 'Obras públicas y mantenimiento viario', 'Alumbrado y eficiencia energética', 'Aguas municipales', 'Parques y jardines', 'Movilidad y tráfico', 'Otro']
      },
      aiPriority: {
        type: Type.STRING,
        description: 'Nivel de prioridad sugerido para esta incidencia.',
        enum: ['High', 'Medium', 'Low']
      },
      aiJustification: {
        type: Type.STRING,
        description: 'Breve justificación del departamento y la prioridad sugeridos.',
      },
      aiSummary: {
        type: Type.STRING,
        description: 'Resumen en una frase del problema descrito en la incidencia.',
      },
      aiRelevanceFlag: {
          type: Type.STRING,
          description: "Indicador de si el texto describe una incidencia accionable.",
          enum: ['Actionable', 'Normal Complaint']
      },
      aiActionRecommendation: {
          type: Type.STRING,
          description: "Próximo paso concreto que debe tomar la administración."
      }
    },
    required: ['escalationDept', 'aiPriority', 'aiJustification', 'aiSummary', 'aiRelevanceFlag', 'aiActionRecommendation'],
  };

  const textPart = {
    text: `Eres una persona experta en gestión municipal en Álava. Analiza la siguiente incidencia ciudadana.
    1. Resume en una frase clara el problema principal.
    2. Indica si el texto es accionable. Si describe una incidencia cívica concreta, márcala como 'Actionable'; si es genérica, 'Normal Complaint'.
    3. Propón el departamento municipal adecuado para la escalada (Limpieza, Obras públicas, Alumbrado, etc.).
    4. Asigna un nivel de prioridad ('High', 'Medium', 'Low').
    5. Explica en breve el motivo de tus decisiones.
    6. Recomienda el siguiente paso concreto para el equipo gestor.

    Categoría: "${category}"
    Descripción: "${description}"`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && result.escalationDept && result.aiPriority && result.aiJustification) {
      return {
        escalationDept: result.escalationDept,
        aiPriority: result.aiPriority,
        aiJustification: result.aiJustification,
        aiSummary: result.aiSummary,
        aiRelevanceFlag: result.aiRelevanceFlag,
        aiActionRecommendation: result.aiActionRecommendation,
        aiConfidence: Math.floor(80 + Math.random() * 20), // Gemini doesn't provide a confidence score, so we'll simulate one.
      };
    }

    throw new Error('Estructura de respuesta de IA no válida al analizar la incidencia.');

  } catch (error) {
    console.error('Error al obtener el análisis de IA para la incidencia:', error);
    throw new Error('No se pudo obtener el análisis automático. Inténtalo de nuevo.');
  }
};


export const submitComplaint = async (data: FormData): Promise<{ ticketId: string }> => {
  console.log('Enviando incidencia:', Object.fromEntries(data.entries()));

  const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
  const category = data.get('category') as string;
  const description = data.get('description') as string;

  // Intentamos obtener el análisis de IA; si falla, continuamos con valores coherentes.
  let aiAnalysis;
  try {
    aiAnalysis = await getAiComplaintAnalysis(category, description);
  } catch (error) {
    console.error('El análisis de IA ha fallado; se envía la incidencia con valores por defecto:', error);
    aiAnalysis = {
      escalationDept: 'Obras públicas y mantenimiento viario',
      aiPriority: 'Medium' as const,
      aiJustification: 'El servicio de IA no está disponible. Se asigna prioridad media por defecto.',
      aiSummary: description,
      aiRelevanceFlag: 'Actionable' as const,
      aiActionRecommendation: 'Registrar la incidencia y asignarla al equipo correspondiente.',
      aiConfidence: 75,
    };
  }

  // En una aplicación real, se subiría el archivo a un almacenamiento y se obtendría la URL.
  // Aquí usamos una URL local como demostración.
  const photoFile = data.get('photo') as File | null;
  const photoBeforeUrl = photoFile ? URL.createObjectURL(photoFile) : undefined;
  
  const newComplaint: Complaint = {
    id: ticketId,
    category: category,
    description: description,
    location: data.get('location') as string,
    contact: data.get('contact') as string,
    status: ComplaintStatus.PENDING,
    submittedAt: new Date(),
    history: [
      { status: ComplaintStatus.PENDING, timestamp: new Date(), notes: 'Incidencia registrada por la ciudadanía y pendiente de revisión.', actor: 'System' },
    ],
    photoBeforeUrl: photoBeforeUrl,
    // Add AI analysis results
    escalationDept: aiAnalysis.escalationDept,
    aiPriority: aiAnalysis.aiPriority,
    aiJustification: aiAnalysis.aiJustification,
    aiSummary: aiAnalysis.aiSummary,
    aiRelevanceFlag: aiAnalysis.aiRelevanceFlag,
    aiActionRecommendation: aiAnalysis.aiActionRecommendation,
    aiConfidence: aiAnalysis.aiConfidence,
    assignedOfficial: { name: 'Edurne Echevarría', photoUrl: 'https://i.pravatar.cc/150?u=edurneeche' }
  };

  // Add the new complaint to the start of the list so it appears first on the dashboard
  complaints.unshift(newComplaint);
  notify(); // Notify subscribers of the new complaint

  return new Promise(resolve => {
    // Simulate a short network delay after AI processing
    setTimeout(() => {
      resolve({ ticketId });
    }, 500);
  });
};


export const fetchComplaintById = async (id: string): Promise<Complaint | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const found = complaints.find(c => c.id.toLowerCase() === id.toLowerCase());
      resolve(found || null);
    }, 1000);
  });
};

export const fetchAllComplaints = async (): Promise<Complaint[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...complaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()));
        }, 1200);
    });
};

export const fetchDashboardStats = (allComplaints: Complaint[]): DashboardStats => {
    const open = allComplaints.filter(c => c.status === ComplaintStatus.PENDING || c.status === ComplaintStatus.IN_PROGRESS || c.status === ComplaintStatus.REOPENED).length;

    const resolved = allComplaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.resolvedAt);
    const totalResolutionTime = resolved.reduce((acc, c) => {
        const resolutionTime = c.resolvedAt!.getTime() - c.submittedAt.getTime();
        return acc + resolutionTime;
    }, 0);
    const avgResolutionMillis = resolved.length > 0 ? totalResolutionTime / resolved.length : 0;
    const avgResolutionHours = (avgResolutionMillis / (1000 * 60 * 60)).toFixed(1);

    // Mock SLA: Any 'In Progress' complaint older than 3 days
    const slaBreaches = allComplaints.filter(c => {
        if (c.status === ComplaintStatus.IN_PROGRESS || c.status === ComplaintStatus.REOPENED) {
            const ageInMillis = new Date().getTime() - c.submittedAt.getTime();
            const ageInDays = ageInMillis / (1000 * 60 * 60 * 24);
            return ageInDays > 3;
        }
        return false;
    }).length;

    return {
        open,
        avgResolutionHours: avgResolutionHours,
        slaBreaches,
    };
};

export const fetchAnalyticsStats = async (): Promise<AnalyticsStats> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                processedLast30Days: '3,247',
                avgResolutionHours: '18,5',
                citizenSatisfaction: '89%',
                duplicateReduction: '40%',
            });
        }, 800);
    });
};

export const sendFeedbackRequest = async ({
  ticketId,
  contact,
}: {
  ticketId: string;
  contact: string;
}): Promise<number> => {
  return new Promise(resolve => {
    // Simulamos el envío de un SMS
    setTimeout(() => {
      const message = `Hola, esperamos que la incidencia #${ticketId} esté resuelta. Valora la atención del 1 (malo) al 5 (excelente) respondiendo a este mensaje.`;
      console.log(`[SIMULACIÓN DE PETICIÓN DE VALORACIÓN]`);
      console.log(`---------------------------`);
      console.log(`Tipo: SMS`);
      console.log(`Para: ${contact}`);
      console.log(`Mensaje: ${message}`);
      console.log(`---------------------------`);

      // Simulamos respuesta ciudadana tras unos segundos
      setTimeout(() => {
          const randomScore = Math.floor(Math.random() * 5) + 1;
          console.log(`[VALORACIÓN RECIBIDA] Para el ticket #${ticketId}, puntuación: ${randomScore}/5`);

          const complaintIndex = complaints.findIndex(c => c.id === ticketId);
          if (complaintIndex !== -1) {
              complaints[complaintIndex].citizenSatisfactionScore = randomScore;
              complaints[complaintIndex].history.push({
                  status: complaints[complaintIndex].status,
                  timestamp: new Date(),
                  notes: `Valoración ciudadana recibida: ${randomScore}/5.`,
                  actor: 'System',
              });
              notify(); // Notify subscribers of the change
          }
          resolve(randomScore);
      }, 3000);

    }, 1000);
  });
};

export const sendCitizenNotification = async ({
  ticketId,
  contact,
  newStatus,
  notes,
}: {
  ticketId: string;
  contact: string;
  newStatus: ComplaintStatus;
  notes: string;
}): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const message = `Hola, el estado de tu incidencia #${ticketId} ha pasado a "${newStatus}". Nota: ${notes}`;
      console.log(`[SIMULACIÓN DE NOTIFICACIÓN]`);
      console.log(`---------------------------`);
      console.log(`Tipo: SMS/Email`);
      console.log(`Para: ${contact}`);
      console.log(`Mensaje: ${message}`);
      console.log(`---------------------------`);
      resolve();
    }, 1000); // Simulate network delay
  });
};

export const updateComplaintStatus = async (
  complaintId: string,
  newStatus: ComplaintStatus,
  notes: string,
  actor: 'Admin' | 'Citizen' | 'System' = 'Admin'
): Promise<Complaint> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const complaintIndex = complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex === -1) {
        return reject(new Error("Incidencia no encontrada"));
      }
      
      const updatedComplaint = { ...complaints[complaintIndex] };
      updatedComplaint.status = newStatus;
      updatedComplaint.history = [
        ...updatedComplaint.history,
        { status: newStatus, timestamp: new Date(), notes, actor }
      ];

      // Set/reset resolvedAt timestamp based on status
      if (newStatus === ComplaintStatus.RESOLVED) {
        updatedComplaint.resolvedAt = new Date();
      } else if (newStatus === ComplaintStatus.IN_PROGRESS || newStatus === ComplaintStatus.REOPENED) {
        // This handles reopening a ticket, clearing the old resolution date.
        updatedComplaint.resolvedAt = undefined;
      }

      complaints[complaintIndex] = updatedComplaint;
      
      // Simulate sending a notification for the citizen's action or admin's update
      sendCitizenNotification({
        ticketId: updatedComplaint.id,
        contact: updatedComplaint.contact,
        newStatus: newStatus,
        notes: notes,
      });
      
      notify(); // Notify subscribers of the change
      resolve(updatedComplaint);
    }, 500);
  });
};

export const updateComplaintDepartment = async (
  complaintId: string,
  newDepartment: string,
  adminId: string = "Admin #007" // Mock admin ID
): Promise<Complaint> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const complaintIndex = complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex === -1) {
        return reject(new Error("Incidencia no encontrada"));
      }
      
      const updatedComplaint = { ...complaints[complaintIndex] };
      updatedComplaint.escalationDept = newDepartment;
      updatedComplaint.history = [
        ...updatedComplaint.history,
        { 
          status: updatedComplaint.status, 
          timestamp: new Date(), 
          notes: `Asignada a ${newDepartment} por ${adminId}.`,
          actor: 'Admin',
        }
      ];

      complaints[complaintIndex] = updatedComplaint;
      notify(); // Notify subscribers of the change
      resolve(updatedComplaint);
    }, 500); // Simulate network delay
  });
};

export const submitSatisfactionFeedback = async (
    complaintId: string,
    rating: number,
    feedback: string,
    photo?: File | null
): Promise<Complaint> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const complaintIndex = complaints.findIndex(c => c.id === complaintId);
            if (complaintIndex === -1) {
                return reject(new Error("Incidencia no encontrada"));
            }

            const updatedComplaint = { ...complaints[complaintIndex] };
            updatedComplaint.status = ComplaintStatus.CLOSED;
            updatedComplaint.citizenSatisfactionScore = rating;
            
            if (photo) {
                updatedComplaint.photoAfterUrl = URL.createObjectURL(photo);
            }

            let notes = `La persona usuaria ha cerrado el ticket con una valoración de ${rating}/5.`;
            if (feedback) {
                notes += ` Comentario: "${feedback}"`;
            }
             if (photo) {
                notes += ` Se adjuntó una foto de la resolución.`;
            }
            
            updatedComplaint.history.push({
                status: ComplaintStatus.CLOSED,
                timestamp: new Date(),
                notes: notes,
                actor: 'Citizen',
            });

            complaints[complaintIndex] = updatedComplaint;
            console.log(`[SIMULACIÓN DE AVISO] Para administración: ticket #${complaintId} cerrado con una valoración de ${rating}/5.`);
            notify();
            resolve(updatedComplaint);
        }, 1200);
    });
};

export const analyzeImage = async (imageFile: File): Promise<{ category: string; description: string }> => {
  const fallback = {
    category: 'other',
    description: 'Adjunte una descripción breve del problema observado en la imagen.',
  } as const;

  if (!process.env.API_KEY) {
    console.error("API_KEY no configurada. Devolvemos datos simulados para la imagen.");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          category: 'road_maintenance',
          description: 'La IA simulada detecta un bache grande en la calzada principal; añada más detalles si es posible. (Respuesta de prueba)',
        });
      }, 1500);
    });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let base64Image: string;

    try {
      base64Image = await fileToBase64(imageFile);
    } catch (conversionError) {
      console.error('Base64 conversion failed, falling back to default analysis:', conversionError);
      return fallback;
    }

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg', // We compress to jpeg, so this is reliable
      },
    };

    const textPart = {
      text: `Analiza la imagen adjunta de una incidencia en Álava. Identifica la categoría más adecuada entre: waste_management, road_maintenance, water_supply, street_lighting, public_safety, other. Después redacta una breve descripción objetiva del problema, apta para un aviso formal al ayuntamiento.`
    };

    const schema = {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'Categoría de la incidencia. Debe ser: waste_management, road_maintenance, water_supply, street_lighting, public_safety u other.',
        enum: ['waste_management', 'road_maintenance', 'water_supply', 'street_lighting', 'public_safety', 'other']
      },
      description: {
        type: Type.STRING,
        description: 'Descripción detallada del problema visible en la imagen, adecuada para un aviso formal.',
      },
      },
      required: ['category', 'description'],
    };

    const safeParse = (jsonText: string) => {
      try {
        return JSON.parse(jsonText);
      } catch (parseError) {
        console.error('No se pudo parsear la respuesta JSON de la IA:', parseError);
        return null;
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const jsonText = response.text.trim();
      const result = safeParse(jsonText);

      if (result && typeof result.category === 'string' && typeof result.description === 'string') {
          const allowedCategories = ['waste_management', 'road_maintenance', 'water_supply', 'street_lighting', 'public_safety', 'other'];
          if (allowedCategories.includes(result.category)) {
              return { category: result.category, description: result.description };
          }
      }

      console.warn('La IA devolvió una estructura no válida. Usamos valores por defecto.');
      return fallback;

    } catch (error: any) {
      console.error('Error analizando la imagen con Gemini:', error);
      if (error?.message && typeof error.message === 'string' && error.message.includes('quota')) {
          return fallback;
      }
      return fallback;
    }
  } catch (fileError) {
    console.error('Error procesando el archivo para el análisis:', fileError);
    return fallback;
  }
};

/**
 * AI Service Contract (Simulated Backend Endpoint for Predictive Analytics)
 * Forecasts potential civic issues based on historical data, weather, etc.
 * @param {string} season - The selected season ('Default', 'Monsoon', 'Summer', 'Winter')
 * @returns {Promise<PredictionData>} An object containing AI-driven forecasts.
 */
export const fetchPredictionData = async (season: string = 'Default'): Promise<PredictionData> => {
  console.log(`Fetching AI-powered predictive analytics for season: ${season}...`);
  
  // Base prediction data
  const baseData: PredictionData = {
    cityWideRisk: RiskLevel.HIGH,
    predictedTrafficCongestion: RiskLevel.MEDIUM,
    waterShortageRisk: RiskLevel.LOW,
    topCriticalAreas: [
      { location: 'Centro - Virgen Blanca', predictedIssue: 'Desbordamiento de contenedores', severityScore: 85 },
      { location: 'Salburua y Zabalgana', predictedIssue: 'Baches en viales y carriles bici', severityScore: 78 },
      { location: 'Lakua-Arriaga', predictedIssue: 'Apagones de alumbrado público', severityScore: 72 },
      { location: 'Riberas del Zadorra', predictedIssue: 'Encharcamientos por lluvias', severityScore: 65 },
      { location: 'Hegoalde y Txagorritxu', predictedIssue: 'Tensión en la red de agua', severityScore: 68 },
    ],
    expectedCategoryDistribution: [
      { name: 'Residuos', value: 45 },
      { name: 'Vías públicas', value: 25 },
      { name: 'Agua', value: 15 },
      { name: 'Alumbrado', value: 10 },
      { name: 'Otras', value: 5 },
    ],
    actionableRecommendations: [
      "Reforzar la recogida selectiva en el centro con un 20% más de rutas nocturnas.",
      "Auditar y reasfaltar baches críticos en los carriles bici de Salburua y Zabalgana.",
      "Programar mantenimiento preventivo de alumbrado en Lakua-Arriaga.",
      "Limpiar imbornales junto al Zadorra y preparar señalización por lluvias.",
    ],
  };

  // Apply seasonal adjustments
  switch (season) {
    case 'Monsoon':
      baseData.cityWideRisk = RiskLevel.CRITICAL;
      baseData.predictedTrafficCongestion = RiskLevel.HIGH;
      baseData.topCriticalAreas.find(a => a.predictedIssue.includes('Encharcamientos'))!.severityScore = 95;
      baseData.topCriticalAreas.find(a => a.predictedIssue.includes('Baches'))!.severityScore = 88;
      baseData.actionableRecommendations = [
          "Activar refuerzo de limpieza y balizamiento en zonas inundables del Zadorra.",
          "Asegurar imbornales despejados en Judimendi y Aranbizkarra.",
          "Colocar señalización preventiva en pasos con riesgo de charcos profundos.",
          "Revisar diariamente la aparición de nuevos baches en accesos principales."
      ];
      baseData.seasonalImpactMessage = "Aviso de lluvias: riesgo elevado de encharcamientos y nuevos baches. Prever demoras.";
      break;
    case 'Summer':
      baseData.cityWideRisk = RiskLevel.HIGH;
      baseData.waterShortageRisk = RiskLevel.CRITICAL;
      baseData.topCriticalAreas.find(a => a.predictedIssue.includes('red de agua'))!.severityScore = 92;
      // Add a new critical area for summer
      baseData.topCriticalAreas.push({ location: 'Polígonos industriales', predictedIssue: 'Riesgo de cortes eléctricos', severityScore: 80 });
      baseData.actionableRecommendations = [
          "Lanzar campaña de ahorro de agua y revisar fugas en barrios periféricos.",
          "Aumentar camiones cisterna de apoyo en zonas altas de Vitoria-Gasteiz.",
          "Coordinar con las suministradoras planes de corte eléctrico programado.",
          "Monitorizar posibles enganches irregulares y pérdidas en la red."
      ];
      baseData.seasonalImpactMessage = "Aviso de verano: riesgo crítico de falta de agua y posibles reclamaciones por cortes eléctricos.";
      break;
    case 'Winter':
      baseData.cityWideRisk = RiskLevel.MEDIUM;
      baseData.predictedTrafficCongestion = RiskLevel.HIGH;
      // Add a new critical area for winter
      baseData.topCriticalAreas.push({ location: 'Entradas a la ciudad', predictedIssue: 'Empeoramiento de calidad del aire', severityScore: 75 });
      baseData.actionableRecommendations = [
          "Refuerzo de tráfico en accesos con niebla y salado preventivo.",
          "Lanzar avisos de salud pública sobre calidad del aire y frío.",
          "Planificar limpieza de calzadas con posibles placas de hielo.",
          "Revisar alumbrado en vías principales para mejorar visibilidad."
      ];
      baseData.seasonalImpactMessage = "Aviso de invierno: más congestión por baja visibilidad y riesgo de empeorar la calidad del aire.";
      break;
    default:
      // No changes, return base data
      break;
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(baseData);
    }, 1500);
  });
};


// --- New services for enhanced tracking page ---

export const fetchTransparencyInsights = async (category: string): Promise<{ estimatedTime: string; queuePosition: number; departmentWorkload: number; }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                estimatedTime: '2-3 días laborables',
                queuePosition: Math.floor(Math.random() * 5) + 1, // Random position from 1 to 5
                departmentWorkload: Math.floor(Math.random() * 20) + 10, // Random workload from 10 to 29
            });
        }, 700);
    });
};

export const fetchSimilarComplaints = async (location: string): Promise<Complaint[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Return 2 random resolved/closed complaints as mock similar issues
            const resolved = complaints.filter(c => c.status === ComplaintStatus.CLOSED || c.status === ComplaintStatus.RESOLVED);
            const shuffled = resolved.sort(() => 0.5 - Math.random());
            resolve(shuffled.slice(0, 2));
        }, 1200);
    });
};

export const addCommentToComplaint = async (complaintId: string, comment: string, additionalPhoto?: File | null): Promise<Complaint> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const complaintIndex = complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex === -1) {
        return reject(new Error("Incidencia no encontrada"));
      }
      
      const updatedComplaint = { ...complaints[complaintIndex] };
      let notes = `Comentario ciudadano: "${comment}"`;

      if (additionalPhoto) {
          const photoUrl = URL.createObjectURL(additionalPhoto);
          // En una app real se subiría la foto y se guardaría la URL.
          // Aquí simplemente la añadimos a las notas.
          notes += ` [Foto adicional aportada: ${photoUrl}]`;
          console.log("La ciudadanía ha aportado una foto adicional:", photoUrl);
      }

      updatedComplaint.history = [
        ...updatedComplaint.history,
        { status: updatedComplaint.status, timestamp: new Date(), notes, actor: 'Citizen' }
      ];

      complaints[complaintIndex] = updatedComplaint;
      
      console.log(`[SIMULACIÓN DE AVISO] Comentario añadido al ticket #${complaintId}.`);
      notify();
      resolve(updatedComplaint);
    }, 800);
  });
};