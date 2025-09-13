// /app/api/trigger-alert/route.js
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Twilio from "twilio";

// ✅ Directly provide Twilio credentials
const TWILIO_ACCOUNT_SID = "AC71ce937135b95fb83fadea05210ca6db";
const TWILIO_AUTH_TOKEN = "72089ee3b9505288186ad2bd28b122fc";
const TWILIO_NUMBER = "+18449634970";      // Twilio trial number

const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, lat, lng } = body;

    // 1️⃣ Fetch all subscribed volunteers
    const querySnapshot = await getDocs(collection(db, "volunteers"));
    const subscribers = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.subscribed && data.phone) subscribers.push(data.phone);
    });

    if (subscribers.length === 0) {
      console.log("No subscribed volunteers found.");
    } else {
      console.log("Sending SMS to:", subscribers);
    }

    // 2️⃣ Send SMS to each subscriber
    const promises = subscribers.map(phone =>
      client.messages.create({
        from: TWILIO_NUMBER,  // Twilio trial number
        to: phone,             // Volunteer number from Firestore
        body: `🚨 New Disaster Alert!\n${title}\n${description}\nLocation: ${lat || "N/A"}, ${lng || "N/A"}`
      })
    );

    await Promise.all(promises);

    return new Response(JSON.stringify({ message: `Sent ${promises.length} SMS` }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error sending SMS:", err);
    return new Response(JSON.stringify({ error: "Failed to send SMS" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
