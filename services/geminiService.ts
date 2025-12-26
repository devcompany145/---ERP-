
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Removed global instance to ensure dynamic API key injection works correctly for each request per guidelines.

export const getAIInsights = async (context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مستشاراً مالياً وستراتيجياً خبيراً للشركات التقنية، قم بتحليل البيانات التالية:
      ${JSON.stringify(context)}
      
      المطلوب:
      1. تحليل الأداء المالي والنمو.
      2. تحديد الفرص الاستراتيجية.
      3. تقديم توصيات ملموسة.
      
      اللغة: العربية، الأسلوب: مهني ومختصر.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insights Error:", error);
    return "عذراً، واجهت مشكلة في التحليل.";
  }
};

export const getProjectFinancialAnalysis = async (projects: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك مدير عمليات مالية (CFO) لشركة برمجيات، حلل أداء المشاريع التالية من حيث الميزانية، التكلفة الفعلية، وصافي الربح:
      ${JSON.stringify(projects)}
      
      المطلوب:
      1. تقرير موجز عن المشاريع الرابحة والمشاريع المتعثرة مالياً.
      2. تحديد نقاط الخلل (مثل ارتفاع التكاليف التقنية).
      3. 3 توصيات عاجلة لتحسين هامش الربح.
      
      اللغة: العربية، التنسيق: Markdown.`,
      config: { temperature: 0.8 }
    });
    return response.text;
  } catch (error) {
    return "لا يمكن توليد تقرير أداء المشاريع حالياً.";
  }
};

export const getPricingRecommendation = async (productName: string, description: string, currentPrice: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير تسعير SaaS وتحول رقمي، حلل هذا المنتج:
      الاسم: ${productName}
      الوصف: ${description}
      السعر الحالي: ${currentPrice} ر.س
      
      اقترح سعراً جديداً بناءً على قيمة المنتج والطلب المتوقع في السوق التقني السعودي. اشرح السبب باختصار شديد.`,
      config: { temperature: 0.7 }
    });
    return response.text;
  } catch (error) {
    return "لا يمكن الحصول على توصية تسعير حالياً.";
  }
};

export const getStrategicAdvice = async (goals: any, risks: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك CTO وستراتيجي نمو، حلل هذه الأهداف والمخاطر:
      الأهداف: ${JSON.stringify(goals)}
      المخاطر: ${JSON.stringify(risks)}
      
      اقترح 3 سيناريوهات للنمو المتسارع وخطة لتخفيف المخاطر التقنية.`,
      config: { temperature: 0.8 }
    });
    return response.text;
  } catch (error) {
    return "لا يمكن توليد النصيحة الاستراتيجية حالياً.";
  }
};

export const chatWithAssistant = async (message: string, history: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "أنت مساعد ذكي لنظام تكنولوجي ERP. تساعد مديري الشركات التقنية في فهم بياناتهم، وإدارة المشاريع، وتحسين الأداء. إجاباتك يجب أن تكون مهنية وباللغة العربية.",
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "واجهت مشكلة في التواصل مع المساعد الذكي.";
  }
};

/**
 * محاكاة جلب المهام من أدوات خارجية مثل Jira أو Asana
 */
export const fetchExternalTasks = async (projectName: string, tool: 'Jira' | 'Asana') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتوليد قائمة مهام تقنية محاكاة بصيغة JSON لمشروع برمجيات اسمه "${projectName}" يتم استيرادها من أداة "${tool}".
      
      المطلوب JSON Array يحتوي على كائنات بالخصائص التالية:
      - title: عنوان المهمة (بالعربية)
      - assignedTo: اسم الموظف (بالعربية)
      - hours: عدد الساعات (رقم)
      - dueDate: تاريخ بصيغة YYYY-MM-DD
      - status: "pending" أو "completed"
      - externalId: معرف فريد مثل "PROJ-123"
      
      أنتج 3-5 مهام فقط.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              assignedTo: { type: Type.STRING },
              hours: { type: Type.NUMBER },
              dueDate: { type: Type.STRING },
              status: { type: Type.STRING },
              externalId: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Fetch External Tasks Error:", error);
    return [];
  }
};
