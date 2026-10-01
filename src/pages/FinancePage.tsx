import React, { useState } from 'react';
import {
  Banknote,
  Coins,
  CreditCard,
  Download,
  Filter,
  Plus,
  Printer,
  Receipt,
  Search,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeePayment } from '../types';

export const FinancePage: React.FC = () => {
  const {
    feePayments,
    students,
    currentSchool,
    recordFeePayment,
  } = useAuth();

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [amount, setAmount] = useState(1500000);
  const [paymentMethod, setPaymentMethod] = useState<'Bank' | 'M-Pesa' | 'TigoPesa' | 'AirtelMoney' | 'Cash'>('Bank');
  const [feeType, setFeeType] = useState<FeePayment['feeType']>('Tuition Fee');
  const [refNumber, setRefNumber] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [searchQuery, setSearchQuery] = useState('');

  const [viewingReceipt, setViewingReceipt] = useState<FeePayment | null>(null);

  const totalCollected = feePayments.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredPayments = feePayments.filter(
    (f) =>
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amount <= 0) return;

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const ref = refNumber.trim() || `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment = recordFeePayment({
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      amount,
      paymentMethod,
      feeType,
      referenceNumber: ref,
      term,
      academicYear: currentSchool?.academicYear || '2026',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'user-accountant',
      recordedByName: 'Mr. Baraka Kibona (Accountant)',
    });

    setShowAddPayment(false);
    setSelectedStudentId('');
    setRefNumber('');
    setViewingReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Ada na Fedha za Shule (School Fees & Financial Accounting)
          </h2>
          <p className="text-xs text-slate-500">
            Kusimamia malipo ya ada (TZS), kutoa stakabadhi rasmi, na taarifa za mapato ya shule
          </p>
        </div>

        <button
          onClick={() => setShowAddPayment(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Rekodi Malipo ya Ada (Receive Payment)
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jumla Iliyokusanywa</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">TZS</span>
            <p className="text-2xl font-black text-slate-900">{totalCollected.toLocaleString()}</p>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Stakabadhi {feePayments.length} zimethibitishwa</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Wanafunzi Waliolipa</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">{feePayments.length}</p>
            <span className="text-[11px] text-slate-500">kati ya {students.length} wote</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Malipo kupitia Benki & Mitandao</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Njia Kuu ya Malipo</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-xl font-black text-slate-900">Benki & M-Pesa</p>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">NMB, CRDB, M-Pesa, TigoPesa</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta kwa jina, namba ya stakabadhi au kumbukumbu ya benki..."
            className="w-full rounded-xl border border-slate-300 py-1.5 pr-3 pl-9 text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="py-3 px-3 font-semibold">Namba ya Stakabadhi</th>
                <th className="py-3 px-3 font-semibold">Jina la Mwanafunzi</th>
                <th className="py-3 px-3 font-semibold">Aina ya Ada</th>
                <th className="py-3 px-3 font-semibold text-right">Kiasi (TZS)</th>
                <th className="py-3 px-3 font-semibold">Njia ya Malipo</th>
                <th className="py-3 px-3 font-semibold">Kumbukumbu (Ref)</th>
                <th className="py-3 px-3 font-semibold">Tarehe</th>
                <th className="py-3 px-3 font-semibold text-right">Stakabadhi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-sky-700">{p.receiptNumber}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{p.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.admissionNumber}</p>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{p.feeType}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right">
                    TZS {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{p.referenceNumber}</td>
                  <td className="py-3 px-3 text-slate-500">{p.date}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setViewingReceipt(p)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 ml-auto"
                    >
                      <Receipt className="h-3 w-3 text-slate-600" />
                      Stakabadhi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Rekodi Malipo ya Ada (Receive Payment)</h3>
              <button onClick={() => setShowAddPayment(false)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Chagua Mwanafunzi *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  <option value="">-- Chagua Mwanafunzi --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.admissionNumber}) - {st.streamName || st.formStandard}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Kiasi (Amount in TZS) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Aina ya Ada (Fee Type)</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Tuition Fee">Ada ya Masomo (Tuition)</option>
                    <option value="Boarding Fee">Bweni na Chakula (Boarding)</option>
                    <option value="Uniform & Books">Sare na Vitabu (Uniform)</option>
                    <option value="Examination Fee">Ada ya Mtihani (Exam Fee)</option>
                    <option value="Transport">Usafiri wa Shule (Transport)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Njia ya Malipo</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Bank">Benki (NMB / CRDB / NBC)</option>
                    <option value="M-Pesa">Vodacom M-Pesa</option>
                    <option value="TigoPesa">Tigo Pesa</option>
                    <option value="AirtelMoney">Airtel Money</option>
                    <option value="Cash">Taslimu (Cash)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Muhula (Term)</label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Term 1">Muhula wa 1</option>
                    <option value="Term 2">Muhula wa 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Namba ya Kumbukumbu ya Muamala</label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="mf. NMB-TXN-88129 au MP-994812"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                >
                  Hifadhi na Toa Stakabadhi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  STAKABADHI RASMI YA MALIPO (OFFICIAL RECEIPT)
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{currentSchool?.name}</h3>
                <p className="text-[10px] text-slate-500">Reg: {currentSchool?.registrationNumber}</p>
              </div>
              <button onClick={() => setViewingReceipt(null)} className="rounded p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Stakabadhi Namba:</span>
                <strong className="font-mono text-slate-900">{viewingReceipt.receiptNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jina la Mwanafunzi:</span>
                <strong className="text-slate-900">{viewingReceipt.studentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Namba ya Usajili:</span>
                <span className="font-mono text-slate-700">{viewingReceipt.admissionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aina ya Ada:</span>
                <span className="text-slate-800 font-semibold">{viewingReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Njia & Kumbukumbu:</span>
                <span className="text-slate-800">{viewingReceipt.paymentMethod} ({viewingReceipt.referenceNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarehe ya Malipo:</span>
                <span className="text-slate-800">{viewingReceipt.date}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Jumla Iliyolipwa:</span>
                <span className="font-mono font-black text-emerald-700 text-base">
                  TZS {viewingReceipt.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic text-center">
              Imethibitishwa na {viewingReceipt.recordedByName}. Mfumo umehifadhi kumbukumbu zote kidijitali.
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-800"
              >
                <Printer className="h-4 w-4" /> Chapa Stakabadhi
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
