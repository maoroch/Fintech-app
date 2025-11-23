import React, { useState, useEffect } from 'react';
import { analyzeFinances, FinancialAnalysis } from './aiService';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
}


type Screen = 'home' | 'statistics' | 'profile';




// Главный экран
const HomeScreen = ({ showBalance, setShowBalance }: { showBalance: boolean; setShowBalance: (show: boolean) => void }) => {
  const transactions: Transaction[] = [
    { id: '1', type: 'expense', title: 'Покупка в магазине', category: 'Продукты', amount: 4850, date: '21 ноя', icon: '🛒' },
    { id: '2', type: 'income', title: 'Зарплата', category: 'Доход', amount: 185000, date: '20 ноя', icon: '💰' },
    { id: '3', type: 'expense', title: 'Кафе "Старбакс"', category: 'Рестораны', amount: 1200, date: '20 ноя', icon: '☕' },
    { id: '4', type: 'expense', title: 'Заправка BP', category: 'Транспорт', amount: 3500, date: '19 ноя', icon: '⛽' },
    { id: '5', type: 'income', title: 'Фриланс проект', category: 'Доход', amount: 25000, date: '18 ноя', icon: '💼' },
    { id: '6', type: 'expense', title: 'Netflix подписка', category: 'Подписки', amount: 899, date: '17 ноя', icon: '🎬' },
    { id: '7', type: 'expense', title: 'Аптека', category: 'Здоровье', amount: 1450, date: '17 ноя', icon: '💊' },
  ];

  const totalBalance = 342500;
  const cardNumber = '4532 •••• •••• 8291';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Главная</Text>
          <Text style={styles.headerSubtitle}>Добро пожаловать обратно</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>💳</Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#06b6d4', '#2563eb', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.cardLabel}>
                <Text style={styles.cardLabelText}>💳 Основная карта</Text>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                  {showBalance ? `${totalBalance.toLocaleString('ru-RU')}₸` : '••• •••'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showBalance ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingIcon}>📈</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardFooterLabel}>Номер карты</Text>
              <Text style={styles.cardNumber}>{cardNumber}</Text>
            </View>
            <View style={styles.cardExpiry}>
              <Text style={styles.cardFooterLabel}>Срок действия</Text>
              <Text style={styles.cardNumber}>12/27</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <Text style={styles.statIconText}>↙️</Text>
            </View>
            <Text style={styles.statLabel}>Доходы</Text>
          </View>
          <Text style={[styles.statAmount, { color: '#34d399' }]}>+210.000 ₸</Text>
          <Text style={styles.statPeriod}>За этот месяц</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Text style={styles.statIconText}>↗️</Text>
            </View>
            <Text style={styles.statLabel}>Расходы</Text>
          </View>
          <Text style={[styles.statAmount, { color: '#f87171' }]}>-130.899 ₸</Text>
          <Text style={styles.statPeriod}>За этот месяц</Text>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Недавние операции</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Все</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            activeOpacity={0.7}
          >
            <View style={styles.transactionIcon}>
              <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle} numberOfLines={1}>
                {transaction.title}
              </Text>
              <View style={styles.transactionMeta}>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
                <Text style={styles.transactionDot}>•</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'income' && styles.transactionAmountIncome,
              ]}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {transaction.amount.toLocaleString('ru-RU')} ₸
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Экран статистики
// Экран статистики
const StatisticsScreen = () => {
  const [aiAnalysis, setAiAnalysis] = useState<FinancialAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

const financialData = {
  monthlyIncome: 210000,
  monthlyExpenses: 130899,
  savings: 156420,
  investments: 89750,
  transactions: [
    { type: 'expense' as const, category: 'Продукты', amount: 4850 },
    { type: 'income' as const, category: 'Доход', amount: 185000 },
    { type: 'expense' as const, category: 'Рестораны', amount: 1200 },
    { type: 'expense' as const, category: 'Транспорт', amount: 3500 },
    { type: 'income' as const, category: 'Доход', amount: 25000 },
  ]
};


  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      try {
        const analysis = await analyzeFinances(financialData);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('Ошибка получения анализа:', error);
      } finally {
        setLoading(false);
      }
    };

    getAnalysis();
  }, []);

  // Fallback данные пока загружается AI
  const currentAnalysis = aiAnalysis || {
    summary: `За последний месяц ваши доходы составили ${financialData.monthlyIncome.toLocaleString('ru-RU')}₸, а расходы ${financialData.monthlyExpenses.toLocaleString('ru-RU')}₸.`,
    recommendations: [
      'Загружаем персонализированные рекомендации...',
      'Анализируем ваши финансовые привычки...'
    ],
    riskLevel: 'medium',
    savingsRate: 25.3,
    monthlyTrend: 'stable'
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 60 }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Статистика</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'AI анализирует ваши финансы...' : 'Анализ ваших финансов'}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>📊</Text>
        </View>
      </View>

      {/* Существующая статистика */}
      <View style={styles.statsGrid}>
        <View style={styles.statBigCard}>
          <Text style={styles.statBigTitle}>Общие расходы</Text>
          <Text style={styles.statBigAmount}>342,899 ₸</Text>
          <Text style={styles.statBigSubtitle}>+12% с прошлого месяца</Text>
        </View>
        
        <View style={styles.statBigCard}>
          <Text style={styles.statBigTitle}>Сбережения</Text>
          <Text style={styles.statBigAmount}>156,420 ₸</Text>
          <Text style={styles.statBigSubtitle}>+8% с прошлого месяца</Text>
        </View>

        <View style={styles.statBigCard}>
          <Text style={styles.statBigTitle}>Инвестиции</Text>
          <Text style={styles.statBigAmount}>89,750 ₸</Text>
          <Text style={styles.statBigSubtitle}>+15% с прошлого месяца</Text>
        </View>
      </View>

      {/* AI Анализ */}
      <View style={styles.aiAnalysisContainer}>
        <View style={styles.aiHeader}>
          <View style={styles.aiTitleContainer}>
            <Text style={styles.aiIcon}></Text>
            <Text style={styles.aiTitle}>
              {loading ? 'AI Анализ...' : 'AI анализ'}
            </Text>
          </View>
          {!loading && (
            <View style={[styles.riskBadge, 
              currentAnalysis.riskLevel === 'low' && styles.riskLow,
              currentAnalysis.riskLevel === 'medium' && styles.riskMedium,
              currentAnalysis.riskLevel === 'high' && styles.riskHigh
            ]}>
              <Text style={styles.riskText}>
                Риск: {currentAnalysis.riskLevel === 'low' ? 'Низкий' : 
                      currentAnalysis.riskLevel === 'medium' ? 'Средний' : 'Высокий'}
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>🤖 AI анализирует ваши финансовые данные...</Text>
            <Text style={styles.loadingSubtext}>Это займет несколько секунд</Text>
          </View>
        ) : (
          <>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Выводы</Text>
              <Text style={styles.analysisText}>{currentAnalysis.summary}</Text>
              
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{currentAnalysis.savingsRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Накопления</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {currentAnalysis.monthlyTrend === 'improving' ? '📈' : 
                     currentAnalysis.monthlyTrend === 'stable' ? '➡️' : '📉'}
                  </Text>
                  <Text style={styles.metricLabel}>Тренд</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>Рекомендации</Text>
              {currentAnalysis.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

// Экран профиля
const ProfileScreen = () => {
  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 60 }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Профиль</Text>
          <Text style={styles.headerSubtitle}>Управление аккаунтом</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.profileCardTitle}>Настройки</Text>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Уведомления</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Безопасность</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Валюты</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Категории</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.profileCardTitle}>Поддержка</Text>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Помощь</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>О приложении</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <Text style={styles.profileItemText}>Связаться с нами</Text>
          <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Кастомный Tab Bar
// Кастомный Tab Bar - современный минималистичный
const CustomTabBar = ({ activeScreen, setActiveScreen }: { activeScreen: Screen; setActiveScreen: (screen: Screen) => void }) => {
  const tabs = [
    { id: 'home' as Screen, icon: '●', label: 'Главная', activeIcon: '◉' },
    { id: 'statistics' as Screen, icon: '▤', label: 'Статистика', activeIcon: '▣' },
    { id: 'profile' as Screen, icon: '○', label: 'Профиль', activeIcon: '◎' },
  ];

  return (
    <View style={styles.tabBar}>
      <View style={styles.tabBarContent}>
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive
              ]}
              onPress={() => setActiveScreen(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconContainer}>
                <Text style={[
                  styles.tabIcon,
                  isActive && styles.tabIconActive
                ]}>
                  {isActive ? tab.activeIcon : tab.icon}
                </Text>
                {isActive && <View style={styles.activeDot} />}
              </View>
              <Text style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};


// Главный компонент приложения
const FinTechApp = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [showBalance, setShowBalance] = useState(true);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen showBalance={showBalance} setShowBalance={setShowBalance} />;
      case 'statistics':
        return <StatisticsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen showBalance={showBalance} setShowBalance={setShowBalance} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
        <CustomTabBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </LinearGradient>
    </View>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gradient: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarIcon: {
    fontSize: 24,
  },
  cardContainer: {
    marginBottom: 32,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    minHeight: 200,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  cardLabel: {
    marginBottom: 8,
  },
  cardLabelText: {
    fontSize: 12,
    color: '#e0f2fe',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  trendingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingIcon: {
    fontSize: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardFooterLabel: {
    fontSize: 10,
    color: '#e0f2fe',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 1,
  },
  cardExpiry: {
    alignItems: 'flex-end',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statPeriod: {
    fontSize: 10,
    color: '#64748b',
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  viewAllText: {
    fontSize: 14,
    color: '#06b6d4',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionDot: {
    fontSize: 12,
    color: '#475569',
  },
  transactionDate: {
    fontSize: 11,
    color: '#64748b',
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  transactionAmountIncome: {
    color: '#34d399',
  },
  // Стили для Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#64748b',
  },
  tabIconActive: {
    color: '#06b6d4',
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#06b6d4',
    fontWeight: '600',
  },
  // Стили для новых экранов
  statsGrid: {
    gap: 16,
  },
  statBigCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  statBigTitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  statBigAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statBigSubtitle: {
    fontSize: 14,
    color: '#34d399',
  },
  profileCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    marginBottom: 16,
  },
  profileCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  profileItemText: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  profileItemArrow: {
    fontSize: 20,
    color: '#64748b',
  },
  // Добавь эти стили в объект StyleSheet
aiAnalysisContainer: {
  marginTop: 8,
},
aiHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
aiTitleContainer: {
  marginTop: 15,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
aiIcon: {
  fontSize: 24,
},
aiTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ffffff',
},
riskBadge: {
  marginTop: 15,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
},
riskLow: {
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
},
riskMedium: {
  backgroundColor: 'rgba(234, 179, 8, 0.2)',
},
riskHigh: {
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
},
riskText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#ffffff',
},
analysisCard: {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderRadius: 16,
  padding: 20,
  borderWidth: 1,
  borderColor: 'rgba(51, 65, 85, 0.5)',
  marginBottom: 16,
},
analysisTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#06b6d4',
  marginBottom: 12,
},
analysisText: {
  fontSize: 14,
  lineHeight: 20,
  color: '#e2e8f0',
  marginBottom: 16,
},
metricsRow: {
  flexDirection: 'row',
  gap: 16,
},
metric: {
  flex: 1,
  alignItems: 'center',
  padding: 12,
  backgroundColor: 'rgba(51, 65, 85, 0.3)',
  borderRadius: 12,
},
metricValue: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: 4,
},
metricLabel: {
  fontSize: 12,
  color: '#94a3b8',
},
recommendationsCard: {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderRadius: 16,
  padding: 20,
  borderWidth: 1,
  borderColor: 'rgba(51, 65, 85, 0.5)',
},
recommendationsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#06b6d4',
  marginBottom: 12,
},
recommendationItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 8,
  gap: 8,
},
recommendationBullet: {
  fontSize: 16,
  color: '#06b6d4',
  marginTop: 2,
},
recommendationText: {
  flex: 1,
  fontSize: 14,
  lineHeight: 20,
  color: '#e2e8f0',
},
// Добавь в styles
loadingCard: {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderRadius: 16,
  padding: 40,
  borderWidth: 1,
  borderColor: 'rgba(51, 65, 85, 0.5)',
  alignItems: 'center',
  marginBottom: 16,
},
loadingText: {
  fontSize: 16,
  color: '#06b6d4',
  textAlign: 'center',
  marginBottom: 8,
},
loadingSubtext: {
  fontSize: 14,
  color: '#94a3b8',
  textAlign: 'center',
},
// Стили для Tab Bar
tabBar: {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  borderTopWidth: 1,
  borderTopColor: 'rgba(255, 255, 255, 0.1)',
  height: 84,
  paddingBottom: 8,
  paddingTop: 8,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 8,
},
tabBarContent: {
  flexDirection: 'row',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'space-around',
},
tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  paddingVertical: 8,
  borderRadius: 16,
  marginHorizontal: 4,
},
tabItemActive: {
  backgroundColor: 'rgba(6, 182, 212, 0.1)',
},
tabIconContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  position: 'relative',
},
tabIcon: {
  fontSize: 20,
  color: '#64748b',
  fontWeight: '300',
},
tabIconActive: {
  color: '#06b6d4',
  fontWeight: '400',
},
activeDot: {
  position: 'absolute',
  bottom: -6,
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: '#06b6d4',
},
tabLabel: {
  fontSize: 11,
  color: '#64748b',
  fontWeight: '500',
  letterSpacing: 0.2,
},
tabLabelActive: {
  color: '#06b6d4',
  fontWeight: '600',
},
  
});

export default FinTechApp;