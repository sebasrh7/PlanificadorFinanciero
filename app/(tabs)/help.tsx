import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BookOpen, DollarSign, TrendingUp, PieChart } from 'lucide-react-native';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BookOpen size={32} color="#4CAF50" />
        <Text style={styles.title}>Guía de Uso</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <DollarSign size={24} color="#2196F3" />
          <Text style={styles.sectionTitle}>Presupuesto Mensual</Text>
        </View>
        <Text style={styles.paragraph}>
          En la pestaña "Mensual" puedes gestionar tus ingresos y gastos mes a mes:
        </Text>
        <Text style={styles.bulletPoint}>• Selecciona el mes deseado en la barra superior</Text>
        <Text style={styles.bulletPoint}>• Toca el botón "+" para agregar un nuevo ingreso o gasto</Text>
        <Text style={styles.bulletPoint}>• Indica si es un ingreso o gasto, añade una descripción y el monto</Text>
        <Text style={styles.bulletPoint}>• Selecciona la categoría apropiada (Alimentación, Transporte, etc.)</Text>
        <Text style={styles.bulletPoint}>• Guarda y verás el registro en la lista correspondiente</Text>
        <Text style={styles.bulletPoint}>• Puedes editar o eliminar registros usando los iconos</Text>
        <Text style={styles.paragraph}>
          El resumen en la parte superior muestra tus ingresos totales, gastos totales y el balance del mes.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Presupuesto General</Text>
        </View>
        <Text style={styles.paragraph}>
          La pestaña "General" muestra una vista anual completa:
        </Text>
        <Text style={styles.bulletPoint}>• Resumen anual con totales de ingresos, gastos y balance</Text>
        <Text style={styles.bulletPoint}>• Promedio mensual para planificar mejor</Text>
        <Text style={styles.bulletPoint}>• Gráfico de evolución mensual para visualizar tendencias</Text>
        <Text style={styles.bulletPoint}>• Distribución de gastos por categoría con porcentajes</Text>
        <Text style={styles.paragraph}>
          Esta vista te ayuda a identificar patrones de gasto y áreas donde puedes optimizar tu presupuesto.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PieChart size={24} color="#FF9800" />
          <Text style={styles.sectionTitle}>Categorías de Gastos</Text>
        </View>
        <Text style={styles.paragraph}>
          La aplicación incluye las siguientes categorías predefinidas:
        </Text>
        <Text style={styles.bulletPoint}>• Salario - Para ingresos regulares</Text>
        <Text style={styles.bulletPoint}>• Ingresos Extras - Bonos, freelance, etc.</Text>
        <Text style={styles.bulletPoint}>• Alimentación - Compras de mercado, restaurantes</Text>
        <Text style={styles.bulletPoint}>• Transporte - Combustible, transporte público</Text>
        <Text style={styles.bulletPoint}>• Vivienda - Alquiler, hipoteca, mantenimiento</Text>
        <Text style={styles.bulletPoint}>• Servicios - Luz, agua, internet, teléfono</Text>
        <Text style={styles.bulletPoint}>• Ocio - Entretenimiento, hobbies</Text>
        <Text style={styles.bulletPoint}>• Salud - Medicamentos, consultas médicas</Text>
        <Text style={styles.bulletPoint}>• Educación - Cursos, libros, material educativo</Text>
        <Text style={styles.bulletPoint}>• Otros - Gastos varios no clasificados</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consejos de Uso</Text>
        <Text style={styles.paragraph}>
          Para aprovechar al máximo la aplicación:
        </Text>
        <Text style={styles.bulletPoint}>
          • Registra tus transacciones regularmente para mantener datos actualizados
        </Text>
        <Text style={styles.bulletPoint}>
          • Revisa el balance mensual para evitar gastos excesivos
        </Text>
        <Text style={styles.bulletPoint}>
          • Usa las categorías correctamente para obtener análisis precisos
        </Text>
        <Text style={styles.bulletPoint}>
          • Consulta el presupuesto general para planificar a largo plazo
        </Text>
        <Text style={styles.bulletPoint}>
          • Todos los datos se guardan automáticamente en tu dispositivo
        </Text>
        <Text style={styles.bulletPoint}>
          • No necesitas conexión a internet, la app funciona completamente offline
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Almacenamiento de Datos</Text>
        <Text style={styles.paragraph}>
          Todos tus datos financieros se almacenan de forma segura en tu dispositivo.
          No se envía ninguna información a servidores externos, garantizando tu privacidad.
        </Text>
        <Text style={styles.paragraph}>
          Los datos persisten incluso si cierras la aplicación, permitiéndote llevar
          un registro continuo de tus finanzas mes a mes.
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 8,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22.5,
    color: '#424242',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22.5,
    color: '#424242',
    marginBottom: 8,
    paddingLeft: 8,
  },
});
