import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useBudgetDatabase } from '@/hooks/useBudgetDatabase';

export default function HomeScreen() {
  const { getSummary } = useBudgetDatabase();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyAverage: 0
  });

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const data = await getSummary();
    setSummary(data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planificador Financiero</Text>
        <Text style={styles.subtitle}>Resumen General</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <DollarSign size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Total Ingresos</Text>
        </View>
        <Text style={styles.amount}>${summary.totalIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingDown size={24} color="#f44336" />
          <Text style={styles.cardTitle}>Total Gastos</Text>
        </View>
        <Text style={[styles.amount, styles.expense]}>${summary.totalExpense.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
      </View>

      <View style={[styles.card, styles.balanceCard]}>
        <View style={styles.cardHeader}>
          <TrendingUp size={24} color="#fff" />
          <Text style={[styles.cardTitle, styles.balanceTitle]}>Balance</Text>
        </View>
        <Text style={[styles.amount, styles.balance]}>
          ${summary.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <DollarSign size={24} color="#2196F3" />
          <Text style={styles.cardTitle}>Promedio Mensual</Text>
        </View>
        <Text style={styles.amount}>${summary.monthlyAverage.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
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
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 8,
    fontWeight: '500',
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
  },
  expense: {
    color: '#f44336',
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
  },
  balanceTitle: {
    color: '#fff',
  },
  balance: {
    color: '#fff',
  },
});
