import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Bill, Item, Participant, Extra, ExtraSplitMode } from './types';
import BillSetup from './components/BillSetup';
import BillDetails from './components/BillDetails';
import HistoryView from './components/HistoryView';
import { calculateBill } from './services/calculationService';
import { getBills, saveBills } from './services/historyService';


const App: React.FC = () => {
    const [bill, setBill] = useState<Bill | null>(null);
    const [historicalBills, setHistoricalBills] = useState<Bill[]>([]);
    const [view, setView] = useState<'bill' | 'history'>('bill');

    useEffect(() => {
        const loadedBills = getBills();
        setHistoricalBills(loadedBills);
    }, []);

    const handleCreateBill = (title: string, participants: Participant[]) => {
        const newBill: Bill = {
            id: Date.now().toString(),
            title,
            date: new Date().toISOString(),
            hostId: participants[0].id,
            participants,
            items: [],
            extras: [],
            currency: 'IDR'
        };
        setBill(newBill);
        setView('bill');
    };

    const handleSaveAndReset = () => {
        if (bill && bill.items.length > 0) {
            const now = new Date().toISOString();
            const billToSave = { ...bill, date: bill.date || now };
            const updatedHistory = [...historicalBills.filter(b => b.id !== bill.id), billToSave];
            setHistoricalBills(updatedHistory);
            saveBills(updatedHistory);
        }
        setBill(null);
        setView('bill');
    };
    
    const handleLoadBill = (billId: string) => {
        const billToLoad = historicalBills.find(b => b.id === billId);
        if (billToLoad) {
            setBill(billToLoad);
            setView('bill');
        }
    };

    const handleViewHistory = () => {
        setView('history');
    }

    const handleBackToBill = () => {
        setView('bill');
    }


    const updateBill = useCallback((updatedBill: Bill) => {
        setBill(updatedBill);
    }, []);

    const billCalculation = useMemo(() => {
        if (!bill) return null;
        return calculateBill(bill);
    }, [bill]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-receipt text-3xl text-green-500"></i>
                        <h1 className="text-3xl font-bold text-gray-900">SplitBill Pro</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                         {historicalBills.length > 0 && view === 'bill' && (
                            <button
                                onClick={handleViewHistory}
                                className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 border border-gray-300"
                                title="View History"
                            >
                                <i className="fa-solid fa-calendar-days"></i>
                                <span className="hidden sm:inline">History</span>
                            </button>
                        )}
                        {bill && (
                            <button
                                onClick={handleSaveAndReset}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                title="Save and start new bill"
                            >
                                <i className="fa-solid fa-power-off"></i>
                                <span className="hidden sm:inline">New Bill</span>
                            </button>
                        )}
                    </div>
                </header>
                <main>
                    {view === 'history' ? (
                        <HistoryView bills={historicalBills} onLoadBill={handleLoadBill} onBack={handleBackToBill} />
                    ) : !bill ? (
                        <BillSetup 
                            onCreateBill={handleCreateBill} 
                            onShowHistory={handleViewHistory}
                            hasHistory={historicalBills.length > 0}
                        />
                    ) : (
                        <BillDetails 
                            bill={bill} 
                            updateBill={updateBill} 
                            billCalculation={billCalculation}
                        />
                    )}
                </main>
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>KELOMPOK 24</p>
                </footer>
            </div>
        </div>
    );
};

export default App;