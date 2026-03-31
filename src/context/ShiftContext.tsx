import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import type { Segment, ShiftData } from '../types';
import { getTodayDateString } from '../utils/timeHelpers';

interface ShiftContextType {
  data: ShiftData;
  activeDate: string;
  setActiveDate: (date: string) => void;
  addSegment: (date: string) => void;
  updateSegment: (date: string, segmentId: string, updates: Partial<Segment>) => void;
  deleteSegment: (date: string, segmentId: string) => void;
  toggleOffDay: (date: string, isOff: boolean) => void;
  importData: (jsonStr: string) => boolean;
  exportData: () => string;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<ShiftData>({});
  const isInitialLoad = useRef(true);

  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());

  useEffect(() => {
    if (!user) {
      setData({});
      return;
    }
    const fetchDb = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().shiftData) {
          setData(snap.data().shiftData);
        }
      } catch (e) {
        console.error("DB Fetch Error", e);
      } finally {
        setTimeout(() => { isInitialLoad.current = false; }, 500);
      }
    };
    fetchDb();
  }, [user]);

  useEffect(() => {
    if (isInitialLoad.current || !user) return;
    const saveDb = async () => {
      try {
        await setDoc(doc(db, 'users', user.uid), { shiftData: data }, { merge: true });
      } catch (e) {
        console.error("DB Save Error", e);
      }
    };
    saveDb();
  }, [data, user]);

  const addSegment = (date: string) => {
    setData((prev: ShiftData) => {
      const dayData = prev[date] || { date, segments: [] };
      const currentSegments = dayData.segments;
      
      let startTime = '15:00';
      if (currentSegments.length > 0) {
        const lastSegment = currentSegments[currentSegments.length - 1];
        startTime = lastSegment.endTime;
      }
      
      const newSegment: Segment = {
        id: uuidv4(),
        startTime,
        endTime: startTime,
        category: 'Online',
        notes: ''
      };

      return {
        ...prev,
        [date]: {
          ...dayData,
          segments: [...currentSegments, newSegment]
        }
      };
    });
  };

  const updateSegment = (date: string, segmentId: string, updates: Partial<Segment>) => {
    setData((prev: ShiftData) => {
      const dayData = prev[date];
      if (!dayData) return prev;
      
      const updatedSegments = dayData.segments.map((s: Segment) => 
        s.id === segmentId ? { ...s, ...updates } : s
      );

      return {
        ...prev,
        [date]: { ...dayData, segments: updatedSegments }
      };
    });
  };

  const deleteSegment = (date: string, segmentId: string) => {
    setData((prev: ShiftData) => {
      const dayData = prev[date];
      if (!dayData) return prev;
      
      return {
        ...prev,
        [date]: {
          ...dayData,
          segments: dayData.segments.filter((s: Segment) => s.id !== segmentId)
        }
      };
    });
  };

  const toggleOffDay = (date: string, isOff: boolean) => {
    setData((prev: ShiftData) => {
      const dayData = prev[date] || { date, segments: [] };
      return {
        ...prev,
        [date]: { ...dayData, isOffDay: isOff, segments: isOff ? [] : dayData.segments }
      };
    });
  };

  const importData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      // Minimal validation
      if (typeof parsed === 'object') {
        setData(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <ShiftContext.Provider value={{
      data, activeDate, setActiveDate, addSegment, updateSegment, deleteSegment, toggleOffDay, importData, exportData
    }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShiftData = () => {
  const context = useContext(ShiftContext);
  if (!context) throw new Error('useShiftData must be used within a ShiftProvider');
  return context;
};
