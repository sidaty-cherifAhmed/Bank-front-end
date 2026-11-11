import TransactionPage from "../../components/TransactionPage/TransactionPage";

const config = {
  title: "Deposit",
  subtitle: "Add money to a client account",
  endpoint: "/transactions/deposit",
  sign: "+",
  variant: "primary",
  confirmTitle: "Confirm deposit",
  confirmMessage: (amount, account) => `Deposit ${amount} into account ${account}?`,
  confirmText: "Yes, deposit",
  loadingText: "Depositing...",
  successTitle: "Deposit successful",
  amountLabel: "Amount deposited",
  newLabel: "New deposit",
  failText: "Deposit failed",
};

export default function Deposit() {
  return <TransactionPage config={config} />;
}
