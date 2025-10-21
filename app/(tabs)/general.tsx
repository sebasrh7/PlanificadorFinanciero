import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { TrendingUp, PieChart, BarChart3 } from 'lucide-react-native';
import { useBudgetDatabase } from '@/hooks/useBudgetDatabase';

const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export default function GeneralScreen() {
  const { getYearlyData, getCategoryBreakdown } = useBudgetDatabase();
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    average: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const year = new Date().getFullYear();
    const yearly = await getYearlyData(year);
    const categories = await getCategoryBreakdown(year);

    setYearlyData(yearly);
    setCategoryData(categories);

    const totalIncome = yearly.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = yearly.reduce((sum, m) => sum + m.expense, 0);
    const monthsWithData = yearly.filter(m => m.income > 0 || m.expense > 0).length;

    setTotals({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      average: monthsWithData > 0 ? (totalIncome - totalExpense) / monthsWithData : 0
    });
  };

  const maxValue = Math.max(...yearlyData.map(m => Math.max(m.income, m.expense)));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presupuesto General</Text>
        <Text style={styles.subtitle}>Año {new Date().getFullYear()}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Resumen Anual</Text>
        </View>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Ingresos</Text>
            <Text style={styles.summaryValue}>${totals.income.toLocaleString('es-ES')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Gastos</Text>
            <Text style={[styles.summaryValue, styles.expenseValue]}>
              ${totals.expense.toLocaleString('es-ES')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Balance Total</Text>
            <Text style={[styles.summaryValue, totals.balance < 0 && styles.negativeValue]}>
              ${totals.balance.toLocaleString('es-ES')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promedio Mensual</Text>
            <Text style={styles.summaryValue}>
              ${totals.average.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <BarChart3 size={24} color="#2196F3" />
          <Text style={styles.cardTitle}>Evolución Mensual</Text>
        </View>
        <View style={styles.chart}>
          {yearlyData.map((month, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.bars}>
                <View
                  style={[
                    styles.bar,
                    styles.incomeBar,
                    { height: maxValue > 0 ? (month.income / maxValue) * 120 : 0 }
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.expenseBar,
                    { height: maxValue > 0 ? (month.expense / maxValue) * 120 : 0 }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{MONTHS[month.month - 1]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.incomeLegend]} />
            <Text style={styles.legendText}>Ingresos</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.expenseLegend]} />
            <Text style={styles.legendText}>Gastos</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <PieChart size={24} color="#FF9800" />
          <Text style={styles.cardTitle}>Distribución por Categoría</Text>
        </View>
        {categoryData.map((category, index) => {
          const percentage = totals.expense > 0 ? (category.total / totals.expense) * 100 : 0;
          return (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryAmount}>
                  ${category.total.toLocaleString('es-ES')}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  summaryItem: {
    width: '50%',
    padding: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  expenseValue: {
    color: '#f44336',
  },
  negativeValue: {
    color: '#f44336',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 4,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 2,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
  incomeBar: {
    backgroundColor: '#4CAF50',
  },
  expenseBar: {
    backgroundColor: '#f44336',
  },
  barLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  incomeLegend: {
    backgroundColor: '#4CAF50',
  },
  expenseLegend: {
    backgroundColor: '#f44336',
  },
  legendText: {
    fontSize: 12,
    color: '#757575',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
});
