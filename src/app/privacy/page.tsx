import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none space-y-12 text-gray-600 font-medium">
                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, make a booking, or communicate with us. This includes your name, contact information, vehicle details (including VIN and plate numbers), and service history.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">2. How We Use Your Information</h2>
                        <p>
                            Your information is used to provide, maintain, and improve our services. Specifically, we use it to manage your service bookings, process payments, send service reminders, and provide personalized technical advice for your performance vehicles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">3. Data Security</h2>
                        <p>
                            Smart Motor utilizes industry-standard security measures to protect your personal and vehicle data. We restrict access to your information to employees and contractors who need to know that information to process it on our behalf.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">4. Location Services</h2>
                        <p>
                            Our emergency towing feature may require access to your GPS location to provide accurate arrival estimates and dispatch recovery units to your precise position. This data is only used during the active request period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at privacy@smartmotor.ae or visit our headquarters in Musaffah, Abu Dhabi.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    )
}
