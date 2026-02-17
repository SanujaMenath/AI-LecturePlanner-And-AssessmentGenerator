import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { BookOpen, Users, Globe, Award, Heart, CheckCircle2, ArrowLeft } from "lucide-react";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">LMS</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Button className="bg-transparent text-gray-600 hover:text-primary !w-auto !py-2 px-4 flex items-center" onClick={() => navigate("/")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                        <Button className="btn-primary !py-2.5 px-6 !w-auto" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                Empowering the Next Generation of <span className="gradient-text">Digital Learners</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed font-light mb-8">
                                Our mission is to democratize education through cutting-edge AI technology, making high-quality learning accessible, personalized, and efficient for everyone, everywhere.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: Globe, label: "Global Presence" },
                                    { icon: Heart, label: "Student Focused" },
                                    { icon: Award, label: "Excellence Driven" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700">
                                        <item.icon className="w-4 h-4 mr-2 text-primary" />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl overflow-hidden flex items-center justify-center p-12">
                                <Users className="w-48 h-48 text-primary/20 opacity-50" />
                                {/* Floating cards */}
                                <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center space-x-3 animate-bounce shadow-primary/5">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Trusted By</p>
                                        <p className="text-sm font-bold">10k+ Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-16">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Innovation First",
                                desc: "We constantly push the boundaries of what's possible in EdTech with AI-driven solutions."
                            },
                            {
                                title: "Inclusivity",
                                desc: "Every feature we build is designed to be accessible to diverse learners across the globe."
                            },
                            {
                                title: "Quality Content",
                                desc: "We partner with top-tier educators to ensure our LMS provides nothing but the best."
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary font-bold text-xl">
                                    {idx + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-light">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section (Placeholder) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Meet the Visionaries</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Behind every great platform is a dedicated team of educators, engineers, and dreamers.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center group">
                                <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                    {/* Placeholder for images */}
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
                                        <Users className="w-12 h-12 text-gray-300" />
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg">Team Member {i}</h4>
                                <p className="text-sm text-gray-400">Position / Expertise</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-primary rounded-[3rem] p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Globe className="w-32 h-32" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 relative z-10">Ready to transform your learning experience?</h2>
                        <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Join thousands of students and educators who are already using our AI-Powered LMS to achieve their goals.
                        </p>
                        <Button className="bg-white text-primary hover:bg-gray-50 !py-4 px-10 !w-auto text-lg font-bold shadow-xl relative z-10" onClick={() => navigate("/login")}>
                            Get Started Now
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer (Same as Home) */}
            <footer className="mt-auto py-12 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-2 grayscale opacity-70">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-xl font-bold">LMS</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        © 2025 AI-Powered LMS. All rights reserved. Designed for Excellence.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
