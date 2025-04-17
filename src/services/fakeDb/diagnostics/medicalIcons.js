import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  {
    category: "X-Ray Services",
    icon: "☢️",
    items: [
      "📸 Chest X-ray (PA / AP / Lateral View)",
      "🦴 Arm, Wrist, Hand X-ray",
      "🦿 Leg, Knee, Ankle, Foot X-ray",
      "💀 Skull / Sinus X-ray",
      "🧠 Cervical, Thoracic, Lumbar Spine X-ray",
      "🔄 Oblique / Special Views",
      "🛏️ Portable X-ray (if applicable)",
    ],
  },
  {
    category: "Ultrasound (UTZ) Services",
    icon: "🩻",
    items: [
      "🧫 Whole Abdomen / Upper / Lower",
      "🚽 KUB (Kidney, Ureter, Bladder)",
      "🧅 Thyroid / ⚙️ Prostate / 💪 Soft Tissue",
      "🤰 OB Ultrasound (All Trimesters)",
      "🧬 Transvaginal (TVS)",
      "🧸 Biophysical Profile (BPS)",
      "🧭 Gender Determination / Follicle Monitoring",
      "💓 Carotid / Venous / Arterial Doppler (if available)",
    ],
  },
  {
    category: "2D Echocardiography",
    icon: "❤️",
    items: [
      "🫀 2D Echo with Doppler",
      "🌈 Color Flow Mapping",
      "🏃 Stress Echo (if available)",
      "🧴 Transesophageal Echo (hospitals only)",
    ],
  },
  {
    category: "ECG & Cardiac Diagnostics",
    icon: "📈",
    items: [
      "📉 Electrocardiogram (ECG / EKG)",
      "🏃 Treadmill Stress Test",
      "🎧 Holter Monitoring (24-Hour)",
    ],
  },
  {
    category: "Clinical Laboratory",
    icon: "🧪",
    items: [
      "🩸 Hematology (CBC, etc.)",
      "🧫 Chemistry (FBS, Lipid Profile, etc.)",
      "🚽 Urinalysis / Fecalysis",
      "🧬 Serology / Immunology",
      "🧪 Drug Testing",
      "🧠 HBA1c / Electrolytes",
    ],
  },
  {
    category: "Other Services",
    icon: "💉",
    items: [
      "💊 Medical Certificates",
      "🗂️ APE / Pre-Employment Medical",
      "💉 Vaccination",
      "👨‍⚕️ Doctor’s Consultation",
    ],
  },
];

export default function ServicesList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-4">
      {services.map((section, index) => (
        <motion.div key={index} whileHover={{ scale: 1.02 }} className="h-full">
          <Card className="rounded-2xl shadow-md h-full">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>{section.icon}</span> {section.category}
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
