import { useBudgetDatabase } from '@/hooks/useBudgetDatabase';
import { Edit, Plus, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CATEGORIES = [
  'Salario',
  'Ingresos Extras',
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Ocio',
  'Salud',
  'Educación',
  'Otros'
];

export default function MonthlyScreen() {
  const { getMonthlyData, addTransaction, deleteTransaction, updateTransaction } = useBudgetDatabase();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: CATEGORIES[0],
    type: 'income' as 'income' | 'expense'
  });

  useEffect(() => {
    loadMonthlyData();
  }, [selectedMonth]);

  const loadMonthlyData = async () => {
    const year = new Date().getFullYear();
    const data = await getMonthlyData(year, selectedMonth + 1);
    setTransactions(data);
  };

  const handleSubmit = async () => {
    const amountValue = parseFloat(formData.amount);
    if (!formData.description.trim() || !formData.amount || isNaN(amountValue) || amountValue <= 0) {
      alert('Por favor, ingresa una descripción válida y un monto positivo.');
      return;
    }

    const year = new Date().getFullYear();
    const amount = parseFloat(formData.amount);

    if (editingId) {
      await updateTransaction(editingId, {
        ...formData,
        amount,
        year,
        month: selectedMonth + 1
      });
    } else {
      await addTransaction({
        ...formData,
        amount,
        year,
        month: selectedMonth + 1
      });
    }

    setModalVisible(false);
    resetForm();
    loadMonthlyData();
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    loadMonthlyData();
  };

  const handleEdit = (transaction: any) => {
    setEditingId(transaction.id);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: CATEGORIES[0],
      type: 'income'
    });
    setEditingId(null);
  };

  const income = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presupuesto Mensual</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthSelector}>
          {MONTHS.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.monthButton, selectedMonth === index && styles.monthButtonActive]}
              onPress={() => setSelectedMonth(index)}
            >
              <Text style={[styles.monthText, selectedMonth === index && styles.monthTextActive]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Ingresos</Text>
          <Text style={styles.summaryIncome}>${totalIncome.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gastos</Text>
          <Text style={styles.summaryExpense}>${totalExpense.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryBalance, balance < 0 && styles.summaryNegative]}>
            ${balance.toLocaleString('es-ES')}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingresos</Text>
          {income.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
              <View style={styles.transactionActions}>
                <Text style={styles.transactionAmount}>${transaction.amount.toLocaleString('es-ES')}</Text>
                <TouchableOpacity onPress={() => handleEdit(transaction)} style={styles.iconButton}>
                  <Edit size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(transaction.id)} style={styles.iconButton}>
                  <Trash2 size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos</Text>
          {expenses.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
              <View style={styles.transactionActions}>
                <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                  -${transaction.amount.toLocaleString('es-ES')}
                </Text>
                <TouchableOpacity onPress={() => handleEdit(transaction)} style={styles.iconButton}>
                  <Edit size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(transaction.id)} style={styles.iconButton}>
                  <Trash2 size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar' : 'Nuevo'} Registro</Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'income' && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: 'income' })}
              >
                <Text style={[styles.typeButtonText, formData.type === 'income' && styles.typeButtonTextActive]}>
                  Ingreso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'expense' && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: 'expense' })}
              >
                <Text style={[styles.typeButtonText, formData.type === 'expense' && styles.typeButtonTextActive]}>
                  Gasto
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Monto"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => {
                // Permite solo números y un punto decimal
                const cleanedText = text.replace(/[^0-9.]/g, '');
                setFormData({ ...formData, amount: cleanedText });
              }}
            />

            <ScrollView style={styles.categoryList}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryItem, formData.category === category && styles.categoryItemActive]}
                  onPress={() => setFormData({ ...formData, category })}
                >
                  <Text style={[styles.categoryText, formData.category === category && styles.categoryTextActive]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSubmit]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  monthSelector: {
    flexDirection: 'row',
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  monthButtonActive: {
    backgroundColor: '#4CAF50',
  },
  monthText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  monthTextActive: {
    color: '#fff',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  summaryIncome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  summaryExpense: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f44336',
  },
  summaryBalance: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  summaryNegative: {
    color: '#f44336',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#757575',
  },
  transactionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginRight: 8,
  },
  expenseAmount: {
    color: '#f44336',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  categoryItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryItemActive: {
    backgroundColor: '#E8F5E9',
  },
  categoryText: {
    fontSize: 16,
    color: '#757575',
  },
  categoryTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonCancel: {
    backgroundColor: '#757575',
  },
  buttonSubmit: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
