import TransactionPage from "../../components/TransactionPage/TransactionPage";

const config = {
  title: "Withdraw",
  subtitle: "Take money out of a client account",
  endpoint: "/transactions/withdraw",
  sign: "−",
  variant: "danger",
  confirmTitle: "Confirm withdrawal",
  confirmMessage: (amount, account) => `Withdraw ${amount} from account ${account}?`,
  confirmText: "Yes, withdraw",
  loadingText: "Withdrawing...",
  successTitle: "Withdrawal successful",
  amountLabel: "Amount withdrawn",
  newLabel: "New withdrawal",
  failText: "Withdrawal failed",
};

export default function Withdraw() {
  return <TransactionPage config={config} />;
}
