import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY, // Используй переменную окружения
  dangerouslyAllowBrowser: true // Для React Native
});

export interface FinancialAnalysis {
  summary: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  savingsRate: number;
  monthlyTrend: 'improving' | 'stable' | 'declining';
}

export const analyzeFinances = async (financialData: {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  investments: number;
  transactions: Array<{
    type: 'income' | 'expense';
    category: string;
    amount: number;
  }>;
}): Promise<FinancialAnalysis> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Ты финансовый аналитик. Проанализируй данные пользователя и дай краткий анализ на русском языке. 
          Верни ответ в формате JSON:
          {
            "summary": "краткий анализ на русском",
            "recommendations": ["рекомендация 1", "рекомендация 2", ...],
            "riskLevel": "low/medium/high",
            "savingsRate": число от 0 до 100,
            "monthlyTrend": "improving/stable/declining"
          }`
        },
        {
          role: "user",
          content: `Проанализируй мои финансы:
          Доходы за месяц: ${financialData.monthlyIncome}₸
          Расходы за месяц: ${financialData.monthlyExpenses}₸
          Накопления: ${financialData.savings}₸
          Инвестиции: ${financialData.investments}₸
          Транзакции: ${JSON.stringify(financialData.transactions)}`
        }
      ],
      model: "llama-3.3-70b-versatile", // или "mixtral-8x7b-32768" для более качественного анализа
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    return {
      summary: analysis.summary || "Анализ недоступен",
      recommendations: analysis.recommendations || ["Данные для анализа отсутствуют"],
      riskLevel: analysis.riskLevel || 'medium',
      savingsRate: analysis.savingsRate || 0,
      monthlyTrend: analysis.monthlyTrend || 'stable'
    };
  } catch (error) {
    console.error('Ошибка AI анализа:', error);
    // Возвращаем fallback анализ
    return getFallbackAnalysis(financialData);
  }
};

const getFallbackAnalysis = (data: any): FinancialAnalysis => {
  const savingsRate = ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100;
  const riskLevel = savingsRate > 20 ? 'low' : savingsRate > 10 ? 'medium' : 'high';
  const trend = data.monthlyIncome > data.monthlyExpenses * 1.2 ? 'improving' : 'stable';

  return {
    summary: `Ваши доходы составляют ${data.monthlyIncome.toLocaleString('ru-RU')}₸, расходы ${data.monthlyExpenses.toLocaleString('ru-RU')}₸. Соотношение расходов к доходам: ${((data.monthlyExpenses / data.monthlyIncome) * 100).toFixed(1)}%.`,
    recommendations: [
      'Старайтесь сохранять не менее 20% от доходов',
      'Диверсифицируйте источники доходов',
      'Ведите учет всех расходов',
      'Создайте финансовую подушку безопасности'
    ],
    riskLevel,
    savingsRate: Math.max(0, savingsRate),
    monthlyTrend: trend
  };
};