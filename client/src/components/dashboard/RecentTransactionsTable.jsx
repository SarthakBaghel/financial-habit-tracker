import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

export default function RecentTransactionsTable({ currency, transactions }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <p className="mt-1 text-sm text-muted">Latest manual income and expense entries.</p>
        </div>
      </div>

      {transactions.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-muted">
                <th className="py-3 font-semibold">Type</th>
                <th className="py-3 font-semibold">Category</th>
                <th className="py-3 font-semibold">Date</th>
                <th className="py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                const Icon = isIncome ? ArrowUpCircle : ArrowDownCircle;
                return (
                  <tr className="border-b border-slate-100 last:border-0" key={transaction.id}>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold ${
                          isIncome ? "bg-teal-50 text-mint" : "bg-amber-50 text-amber"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-800">{transaction.category}</td>
                    <td className="py-3 text-muted">{formatDate(transaction.date)}</td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(transaction.amount, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="font-semibold text-slate-800">No transactions yet</p>
          <p className="mt-2 text-sm text-muted">Income and expense records will appear here after Phase 5.</p>
        </div>
      )}
    </section>
  );
}
