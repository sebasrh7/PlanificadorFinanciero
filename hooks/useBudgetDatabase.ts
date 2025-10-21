import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

interface Transaction {
  id?: number;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  year: number;
  month: number;
}

export function useBudgetDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('budget.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          type TEXT NOT NULL,
          year INTEGER NOT NULL,
          month INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_year_month ON transactions(year, month);
        CREATE INDEX IF NOT EXISTS idx_type ON transactions(type);
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    if (!db) return;

    try {
      await db.runAsync(
        `INSERT INTO transactions (description, amount, category, type, year, month)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transaction.description,
          transaction.amount,
          transaction.category,
          transaction.type,
          transaction.year,
          transaction.month,
        ]
      );
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const updateTransaction = async (id: number, transaction: Transaction) => {
    if (!db) return;

    try {
      await db.runAsync(
        `UPDATE transactions
         SET description = ?, amount = ?, category = ?, type = ?, year = ?, month = ?
         WHERE id = ?`,
        [
          transaction.description,
          transaction.amount,
          transaction.category,
          transaction.type,
          transaction.year,
          transaction.month,
          id,
        ]
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const deleteTransaction = async (id: number) => {
    if (!db) return;

    try {
      await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const getMonthlyData = async (year: number, month: number) => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<any>(
        'SELECT * FROM transactions WHERE year = ? AND month = ? ORDER BY created_at DESC',
        [year, month]
      );
      return result;
    } catch (error) {
      console.error('Error getting monthly data:', error);
      return [];
    }
  };

  const getYearlyData = async (year: number) => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<any>(
        `SELECT
          month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
         FROM transactions
         WHERE year = ?
         GROUP BY month
         ORDER BY month`,
        [year]
      );

      const allMonths = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expense: 0,
      }));

      result.forEach((row: any) => {
        const index = row.month - 1;
        if (index >= 0 && index < 12) {
          allMonths[index] = row;
        }
      });

      return allMonths;
    } catch (error) {
      console.error('Error getting yearly data:', error);
      return [];
    }
  };

  const getCategoryBreakdown = async (year: number) => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<any>(
        `SELECT
          category,
          SUM(amount) as total
         FROM transactions
         WHERE year = ? AND type = 'expense'
         GROUP BY category
         ORDER BY total DESC`,
        [year]
      );
      return result;
    } catch (error) {
      console.error('Error getting category breakdown:', error);
      return [];
    }
  };

  const getSummary = async () => {
    if (!db) return { totalIncome: 0, totalExpense: 0, balance: 0, monthlyAverage: 0 };

    try {
      const year = new Date().getFullYear();
      const result = await db.getFirstAsync<any>(
        `SELECT
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
          COUNT(DISTINCT month) as monthCount
         FROM transactions
         WHERE year = ?`,
        [year]
      );

      if (!result) {
        return { totalIncome: 0, totalExpense: 0, balance: 0, monthlyAverage: 0 };
      }

      const totalIncome = result.totalIncome || 0;
      const totalExpense = result.totalExpense || 0;
      const balance = totalIncome - totalExpense;
      const monthlyAverage = result.monthCount > 0 ? balance / result.monthCount : 0;

      return {
        totalIncome,
        totalExpense,
        balance,
        monthlyAverage,
      };
    } catch (error) {
      console.error('Error getting summary:', error);
      return { totalIncome: 0, totalExpense: 0, balance: 0, monthlyAverage: 0 };
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    getYearlyData,
    getCategoryBreakdown,
    getSummary,
  };
}
