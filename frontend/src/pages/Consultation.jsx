import { useState, useEffect } from "react";
import API from "../api/api";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Activity,
  HeartPulse,
  Stethoscope,
  Brain,
  Search,
  ClipboardList
} from "lucide-react";

function Consultation() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [newSymptom, setNewSymptom] = useState("");
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    pulse: "",
    bp: ""
  });
  console.log(result);

  useEffect(() => {
    API.get("/symptoms").then(res => setSymptoms(res.data));
  }, []);

  useEffect(() => {
    if (height && weight) {
      const h = height / 100; // convert cm to meters
      const bmiValue = (weight / (h * h)).toFixed(2);
      setBmi(bmiValue);
    }
  }, [height, weight]);

  const addNewSymptom = async () => {
  if (!newSymptom) return;

  await API.post("/add-symptom", { symptom: newSymptom });

  setSymptoms([...symptoms, newSymptom]);
  setSelectedSymptoms([...selectedSymptoms, newSymptom]);
  setNewSymptom("");
};

  const handleSymptomChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await API.post("/predict", {
      symptoms: selectedSymptoms
    });
    setResult(res.data);
    setSelectedDisease(res.data.predictions[0].disease);
    setLoading(false);
  };

  const handleSaveConsultation = async () => {
    if (!result) {
      alert("Please predict first");
      return;
    }

    if(!patient.name){
      alert("Please enter patient name");
      return;
    }

    const consultationData = {
      patient_id: "P001",      // later from login
      doctor_id: "D001",       // later from login
      patient_name: patient.name,
      age: Number(patient.age),
      gender: patient.gender,
      vitals: {
        height: Number(patient.height),
        weight: Number(patient.weight),
        bmi: Number(bmi),
        heart_rate: Number(patient.pulse),
        bp: patient.bp
      },
      symptoms: selectedSymptoms,
      predictions: result.predictions,
      doctor_confirmed_disease: null,
      created_at: new Date()
    };

    await API.post("/consultation", consultationData);

    alert("Consultation Saved Successfully");
  };

  const filteredSymptoms = symptoms.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-800 h-min-[96vh]">
      <div className=" w-full bg-gray-900 rounded-2xl p-6 mb-4">
        <h1 className="font-bold text-white text-2xl mb-4 flex items-center gap-2">
          <User size={24} /> Patient Details
        </h1>

        <div className="grid grid-cols-3 w-full gap-3">

          <div className="flex items-center bg-gray-800 rounded p-2 col-span-2">
            <User className="mr-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Patient Name"
              className="bg-gray-800 w-full text-white outline-none"
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <Calendar className="mr-2 text-gray-400" size={18} />
            <input
              type="number"
              placeholder="Age"
              className="bg-gray-800 w-full text-white outline-none"
              onChange={(e) => setPatient({ ...patient, age: e.target.value })}
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <User className="mr-2 text-gray-400" size={18} />
            <select
              className="bg-gray-800 w-full border-gray-800 text-white outline-none"
              onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <Ruler className="mr-2 text-gray-400" size={18} />
            <input
              type="number"
              placeholder="Height (cm)"
              onChange={(e) => {
                setHeight(e.target.value);
                setPatient({ ...patient, height: e.target.value });
              }}
              className="bg-gray-800 w-full text-white outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <Weight className="mr-2 text-gray-400" size={18} />
            <input
              type="number"
              placeholder="Weight (kg)"
              onChange={(e) => {
                setWeight(e.target.value);
                setPatient({ ...patient, weight: e.target.value });
              }}
              className="bg-gray-800 w-full text-white outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <Activity className="mr-2 text-gray-400" size={18} />
            <input
              type="number"
              value={bmi}
              placeholder="BMI"
              disabled
              className="bg-gray-800 w-full text-white outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <HeartPulse className="mr-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pulse"
              className="bg-gray-800 w-full text-white outline-none"
              onChange={(e) => setPatient({ ...patient, pulse: e.target.value })}
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded p-2">
            <HeartPulse className="mr-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Blood Pressure"
              className="bg-gray-800 w-full text-white outline-none"
              onChange={(e) => setPatient({ ...patient, bp: e.target.value })}
            />
          </div>

        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">

        {/* Symptoms Panel */}
        <div className="bg-gray-900 text-white h-[80vh] shadow-xl rounded-2xl p-6 flex flex-col">

  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
    <ClipboardList /> Select Symptoms
  </h2>

  {/* Scrollable Area */}
  <div className="flex-1 overflow-y-auto no-scrollbar">

    <div className="flex items-center bg-gray-800 rounded p-2 mb-4">
      <Search className="mr-2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search symptoms..."
        className="bg-gray-800 w-full text-white outline-none"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="flex gap-2 mb-2 text-sm w-full flex-wrap">
      {selectedSymptoms.map((s, i) => (
        <div key={i} className="border-2 border-blue-500 flex items-center gap-2 p-2 w-fit rounded">
          <span
            className="cursor-pointer flex items-center font-bold text-blue-500"
            onClick={() => handleSymptomChange(s)}
          >
            x
          </span>
          {s}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2">
      {filteredSymptoms.map((s, i) => (
        // <div key={i} onClick={() => handleSymptomChange(s)} className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
        //   <input
        //     type="checkbox"
        //     checked={selectedSymptoms.includes(s)}
        //     className="bg-blue-400 rounded-xl"
        //     onChange={() => handleSymptomChange(s)}
        //   />
        //   <label>{s}</label>
        // </div>
        <div
  onClick={() => handleSymptomChange(s)}
  className={`cursor-pointer px-3 py-2 rounded border transition
  ${selectedSymptoms.includes(s)
      ? "border-blue-600 font-semibold text-blue-400"
      : "bg-gray-800 border-gray-600 text-gray-300"
  }`}
>
  {s}
</div>
      ))}
    </div>

  </div>

  {/* Fixed Button */}
  <button
    onClick={handleSubmit}
    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
  >
    Predict Disease
  </button>

</div>

        {/* Results Panel */}
        {/* <div className="bg-gray-900 text-white h-[80vh] shadow-xl overflow-x-scroll no-scrollbar rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain /> Prediction Results
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          ) : (result ? (
            <div>
              <h3 className="font-semibold mb-2">Top Predictions</h3>
              <div className="grid grid-cols-2 gap-3">
                {result.predictions.slice(0, 10).map((p, i) => (
                  <div key={i} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{p.disease}</span>
                      <span className="text-blue-400 font-bold">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${p.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Stethoscope size={18} /> Recommended Specialist
                </h3>
                <p className="text-blue-600 text-lg font-bold">
                  {result.recommended_specialist}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <ClipboardList size={18} /> Medical Advice
                </h3>
                <p className="text-white mt-2 whitespace-pre-line">
                  {result.medical_advice}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              Select symptoms and click Predict to see results.
            </div>
          ))}
        </div> */}
        {/* Predictions Panel */}
        <div className="bg-gray-900 text-white overflow-y-scroll no-scrollbar h-[80vh] shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain /> Predictions
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 gap-3">
              {result.predictions.slice(0, 10).map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDisease(p.disease)}
                  className={`bg-gray-800 p-3 rounded-lg cursor-pointer transition
      ${selectedDisease === p.disease ? "border-2 border-blue-500" : "border border-gray-700"}
    `}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{p.disease}</span>
                    <span className="text-blue-400 font-bold">
                      {(p.probability * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${p.probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              No predictions yet.
            </div>
          )}
        </div>
        {/* Specialist & Advice Panel */}
        <div className="flex flex-col gap-4 h-[80vh]">

          {/* Specialist */}
          <div className="bg-gray-900 text-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Stethoscope /> Recommended Specialist
            </h2>

            <p className="text-blue-400 text-lg font-bold">
              {selectedDisease
                ? result.specialists[selectedDisease]
                : "No specialist recommended yet."}
            </p>

            {/* {result ? (
      <p className="text-blue-400 text-lg font-bold">
        {result.recommended_specialist}
      </p>
    ) : (
      <p className="text-gray-500">No specialist recommended yet.</p>
    )} */}
          </div>

          {/* Medical Advice */}
          <div className="bg-gray-900 text-white shadow-xl no-scrollbar rounded-2xl p-6 flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ClipboardList /> Medical Advice
            </h2>

            {/* {result ? (
      <p className="text-gray-300 whitespace-pre-line">
        {result.medical_advice}
      </p>
    ) : (
      <p className="text-gray-500">No advice yet.</p>
    )} */}
            <p className="text-gray-300 whitespace-pre-line">
              {selectedDisease
                ? result.advice[selectedDisease]
                : "No advice yet."}
            </p>
          </div>

        </div>
      </div>
      <button
        onClick={handleSaveConsultation}
        className="mt-4 w-full bg-green-600 font-bold text-white py-2 rounded-lg hover:bg-green-700"
      >
        Save Consultation
      </button>
    </div>
  );
}

export default Consultation;