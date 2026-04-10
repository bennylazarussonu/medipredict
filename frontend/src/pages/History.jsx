

import { useEffect, useState } from "react";
import API from "../api/api";
import { User, ClipboardList, Brain, CheckCircle } from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
const [selectedDisease, setSelectedDisease] = useState({});

useEffect(() => {
  API.get("/history").then(res => setHistory(res.data));
  API.get("/diseases").then(res => setDiseases(res.data));
}, []);

  const confirmDiagnosis = async (id, disease) => {
  await API.post("/confirm-diagnosis", {
    consultation_id: id,
    true_disease: disease
  });

  alert("Diagnosis confirmed");

  // Update state instead of reloading page
  setHistory(prevHistory =>
    prevHistory.map(h =>
      h._id === id
        ? { ...h, doctor_confirmed_disease: disease }
        : h
    )
  );
};

  const filteredHistory = history.filter((h) => {
  const searchText = search.toLowerCase();

  return (
    h.patient_name?.toLowerCase().includes(searchText) ||
    h.symptoms?.some(s => s.toLowerCase().includes(searchText)) ||
    h.predictions?.some(p => p.disease.toLowerCase().includes(searchText)) ||
    (h.doctor_confirmed_disease &&
      h.doctor_confirmed_disease.toLowerCase().includes(searchText))
  );
});

  return (
    <div className="p-8 bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <ClipboardList /> Consultation History
      </h1>

      <div className="mb-6 flex items-center bg-gray-900 rounded p-3 w-full md:w-1/3">
  <input
    type="text"
    placeholder="Search by patient, symptom, disease..."
    className="bg-gray-900 w-full text-white outline-none"
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      <div className="grid grid-cols-2 gap-6">
        {filteredHistory.map((h, i) => (
          <div key={i} className="bg-gray-900 text-white rounded-2xl shadow-lg p-6">

            {/* Patient Info */}
            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={20} /> {h.patient_name}
              </h2>
              <p className="text-gray-400 text-sm">
                Age: {h.age} | Gender: {h.gender}
              </p>
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {h.symptoms.map((s, idx) => (
                  <span key={idx} className="bg-blue-600 text-xs px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Predictions */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain size={18} /> Predictions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {h.predictions.map((p, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span>{p.disease}</span>
                      <span className="text-blue-400 font-bold">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${p.probability * 100}%` }}
                      ></div>
                    </div>

                    {h.doctor_confirmed_disease ? (
                      h.doctor_confirmed_disease === p.disease && (
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle size={16} /> Confirmed
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => confirmDiagnosis(h._id, p.disease)}
                        className="mt-1 bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Confirm Diagnosis
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
  <h3 className="text-sm text-gray-400 mb-1">Confirm Other Disease</h3>

  <div className="flex gap-2">
    <select
      className="bg-gray-800 text-white p-2 rounded w-full"
      onChange={(e) =>
        setSelectedDisease({
          ...selectedDisease,
          [h._id]: e.target.value
        })
      }
    >
      <option value="">Select Disease</option>
      {diseases.map((d, idx) => (
        <option key={idx} value={d}>{d}</option>
      ))}
    </select>

    <button
      onClick={() =>
        confirmDiagnosis(h._id, selectedDisease[h._id])
      }
      className="bg-green-600 px-3 py-2 rounded hover:bg-green-700"
    >
      Confirm
    </button>
  </div>
</div>

            {/* Confirmed Disease */}
            {h.doctor_confirmed_disease && (
              <div className="mt-4 bg-green-900 text-green-300 p-2 rounded text-center font-semibold">
                Confirmed Diagnosis: {h.doctor_confirmed_disease}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
