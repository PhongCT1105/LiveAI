// StreakContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface StreakContextType {
    streak: number;
    incrementStreak: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const Streak: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [streak, setStreak] = useState<number>(0);
    const [lastUsageDate, setLastUsageDate] = useState<string | null>(null);

    useEffect(() => {
        // Load streak and last usage date from localStorage
        const savedStreak = localStorage.getItem("streak");
        const savedLastUsageDate = localStorage.getItem("lastUsageDate");

        if (savedStreak) setStreak(parseInt(savedStreak, 10));
        if (savedLastUsageDate) setLastUsageDate(savedLastUsageDate);
    }, []);

    const incrementStreak = () => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        if (lastUsageDate === today) {
            // User already used a recipe today, do not increment streak
            alert(`You already used a recipe today! Streak: ${streak}`);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayFormatted = yesterday.toISOString().split("T")[0];

            if (lastUsageDate === yesterdayFormatted) {
                // Consecutive day, increment streak
                const newStreak = streak + 1;
                setStreak(newStreak);
                localStorage.setItem("streak", newStreak.toString());
            } else {
                // Not consecutive, reset streak
                setStreak(1);
                localStorage.setItem("streak", "1");
            }

            // Update last usage date
            setLastUsageDate(today);
            localStorage.setItem("lastUsageDate", today);
        }
    };

    return (
        <StreakContext.Provider value={{ streak, incrementStreak }}>
            {children}
        </StreakContext.Provider>
    );
};

export const useStreak = () => {
    const context = useContext(StreakContext);
    if (!context) {
        throw new Error("useStreak must be used within a StreakProvider");
    }
    return context;
};