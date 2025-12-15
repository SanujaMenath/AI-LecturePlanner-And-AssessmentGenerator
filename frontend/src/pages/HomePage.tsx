import { useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-6 gradient-text">
          AI Powered Learning Management System
        </h1>
        <p className="text-lg text-text-light max-w-2xl mx-auto mb-10">
          Smart lesson planning, automated assessments, and intelligent analytics
          built for modern education.
        </p>

        <div className="flex justify-center gap-4">
          <Button className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            className="btn-accent"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "AI Lesson Planner",
            desc: "Generate structured lesson plans instantly using AI."
          },
          {
            title: "Smart Assessments",
            desc: "Auto-generate quizzes, exams, and assignments."
          },
          {
            title: "Role Based System",
            desc: "Admins, Lecturers, and Students with clear access control."
          }
        ].map(feature => (
          <div key={feature.title} className="card-hover text-center">
            <h3 className="text-xl font-semibold mb-3">
              {feature.title}
            </h3>
            <p className="text-text-light">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-text-lighter">
        © 2025 AI LMS. Built for modern education.
      </footer>
    </div>
  )
}

export default HomePage
