// import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-blue-600">🚨 SurgeAid</h1>
        <p className="mt-2 text-sm text-gray-700">
          Rapid local volunteer mobilization — subscribe to SMS alerts and respond to nearby disaster needs.
        </p>
        <div className="mt-4 flex gap-3">
          <a className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg" href="/volunteer">Sign up to volunteer</a>
          <a className="flex-1 text-center py-2 border rounded-lg" href="/report">Report an incident</a>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg">How it works</h2>
        <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Volunteer signs up and subscribes to SMS alerts.</li>
          <li>Coordinator reports an incident (location + message).</li>
          <li>Subscribers in the radius receive an SMS with a one-tap response link.</li>
        </ol>
      </section>
    </div>
  );
}
