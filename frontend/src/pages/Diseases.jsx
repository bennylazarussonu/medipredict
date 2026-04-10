import { useEffect, useState } from "react";
import API from "../api/api";
import { Search, ClipboardList } from "lucide-react";

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allSymptoms, setAllSymptoms] = useState([]);
const [selectedSymptoms, setSelectedSymptoms] = useState([]);
const [symptomSearch, setSymptomSearch] = useState("");
const [newDisease, setNewDisease] = useState({
  disease_name: "",
  description: "",
  symptoms: ""
});

  useEffect(() => {
    API.get("/diseases-full").then(res => setDiseases(res.data));
    API.get("/symptoms").then(res => setAllSymptoms(res.data));
  }, []);

  const filteredDiseases = diseases.filter((d) => {
    const text = search.toLowerCase();
    return (
      d.disease_name.toLowerCase().includes(text) ||
      d.description?.toLowerCase().includes(text) ||
      d.symptoms?.some(s => s.toLowerCase().includes(text))
    );
  });

  const handleAddDisease = async () => {
  if (!newDisease.disease_name) {
    alert("Enter disease name");
    return;
  }

  await API.post("/add-disease", {
    disease_name: newDisease.disease_name,
    description: newDisease.description,
    symptoms: selectedSymptoms
  });

  alert("Disease added");
  setShowModal(false);
  window.location.reload();
};

const toggleSymptom = (symptom) => {
  if (selectedSymptoms.includes(symptom)) {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  } else {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
  }
};
const filteredSymptoms = allSymptoms.filter(s =>
  s.toLowerCase().includes(symptomSearch.toLowerCase())
);

  return (
    <div className="p-8 bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <ClipboardList /> Diseases Database
      </h1>

      {/* Search */}
      {/* <div className="mb-6 flex items-center bg-gray-900 rounded p-3 w-full md:w-1/3">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search disease, symptom, description..."
          className="bg-gray-900 w-full text-white outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}
      <div className="flex justify-between items-center mb-6">
  <div className="flex items-center bg-gray-900 rounded p-3 w-full md:w-1/3">
    <Search className="text-gray-400 mr-2" />
    <input
      type="text"
      placeholder="Search disease, symptom, description..."
      className="bg-gray-900 w-full text-white outline-none"
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <button
    onClick={() => setShowModal(true)}
    className="ml-4 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
  >
    + Add Disease
  </button>
</div>

      <p className="text-gray-400 mb-4">
        Showing {filteredDiseases.length} diseases
      </p>

      {/* Disease Cards */}
      <div className="grid grid-cols-2 gap-6">
        {filteredDiseases.map((d, i) => (
          <div key={i} className="bg-gray-900 text-white rounded-2xl shadow-lg p-6">

            {/* Disease Name */}
            <h2 className="text-xl font-bold text-blue-400 mb-2">
              {d.disease_name}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4">
              {d.description || "No description available"}
            </p>

            {/* Symptoms */}
            <h3 className="font-semibold mb-2">Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {d.symptoms?.map((s, idx) => (
                <span key={idx} className="bg-blue-600 text-xs px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-gray-900 text-white p-6 rounded-xl w-[500px]">
      <h2 className="text-xl font-bold mb-4">Add New Disease</h2>

      <input
        type="text"
        placeholder="Disease Name"
        className="w-full p-2 mb-3 bg-gray-800 rounded"
        onChange={(e) =>
          setNewDisease({ ...newDisease, disease_name: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 mb-3 bg-gray-800 rounded"
        onChange={(e) =>
          setNewDisease({ ...newDisease, description: e.target.value })
        }
      />

      {/* Symptom Search */}
<input
  type="text"
  placeholder="Search symptoms..."
  className="w-full p-2 mb-2 bg-gray-800 rounded"
  onChange={(e) => setSymptomSearch(e.target.value)}
/>

{/* Selected Symptoms */}
<div className="flex flex-wrap gap-2 mb-2">
  {selectedSymptoms.map((s, i) => (
    <span
      key={i}
      onClick={() => toggleSymptom(s)}
      className="bg-blue-600 text-xs px-2 py-1 rounded cursor-pointer"
    >
      {s} ✕
    </span>
  ))}
</div>

{/* Symptoms List */}
<div className="h-40 overflow-y-scroll bg-gray-800 p-2 rounded">
  {filteredSymptoms.map((s, i) => (
    <div
      key={i}
      onClick={() => toggleSymptom(s)}
      className={`p-1 cursor-pointer rounded ${
        selectedSymptoms.includes(s)
          ? "bg-blue-600"
          : "hover:bg-gray-700"
      }`}
    >
      {s}
    </div>
  ))}
</div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-600 px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleAddDisease}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Add Disease
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Diseases;