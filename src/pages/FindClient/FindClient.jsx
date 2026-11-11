import { useState } from "react";
import ClientSearch from "../../components/ClientSearch/ClientSearch";
import ClientCard from "../../components/ClientCard/ClientCard";

export default function FindClient() {
  const [client, setClient] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Find Client</h2>
          <p className="page-sub">Search by client ID or by account number</p>
        </div>
      </div>

      <ClientSearch onFound={setClient} onReset={() => setClient(null)} />

      {client && <ClientCard client={client} />}
    </div>
  );
}
