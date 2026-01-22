"use client"

import { Users, MapPin, Mail, GraduationCap } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const researchers = [
  {
    name: "Rosemarie Montesa",
    age: 22,
    location: "Mandaluyong City, Metro Manila",
    role: "Model Trainer | Full Stack Engineer",
    image: "/rose.jpg"
  },
  {
    name: "Renalyn Pino",
    age: 21,
    location: "Calauan, Laguna",
    role: "Researcher | Data Annotator | Organizer",
    image: "/renalyn.jpg"
  },
  {
    name: "Betina Grace Lat",
    age: 23,
    location: "Pila, Laguna",
    role: "Researcher | Data Annotator | Organizer",
    image: "/betina.jpg"
  }
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Meet the Team
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            About Us
          </h1>
          <p className="text-lg text-amber-700/80 max-w-2xl mx-auto">
            We’re BSCS 4AIS students who love bees and tech, building smart tools to help beekeepers care for their hives in a smarter way.
          </p>
        </div>

        {/* Research Context */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-8 mb-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-amber-900">Our Research</h2>
          </div>
          <p className="text-amber-700/80 leading-relaxed">
            iBrood is an undergraduate thesis project developed by Bachelor of Science in Computer Science (BSCS) 4A students. 
            Our goal is to assist beekeepers in monitoring queen cell development and brood patterns using 
            advanced AI-powered image segmentation and object detection models. We trained our YOLOv11-Medium 
            segmentation model to achieve 95.6% precision and 98.5% mAP50 for accurate queen cell analysis.
          </p>
        </div>

        {/* Team Members */}
        <h2 className="text-2xl font-heading font-bold text-amber-900 mb-6 text-center">The Researchers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {researchers.map((researcher, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              {researcher.image ? (
                <img 
                  src={researcher.image} 
                  alt={researcher.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-amber-200"
                />
              ) : (
                <div className="w-20 h-20 bg-[#FFA95C] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {researcher.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              {researcher.name === "Rosemarie Montesa" ? (
                <h3 className="font-heading font-bold text-lg text-amber-900 mb-1">
                  <a href="https://rozumary.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 transition-colors">{researcher.name}</a>
                </h3>
              ) : (
                <h3 className="font-heading font-bold text-lg text-amber-900 mb-1">{researcher.name}</h3>
              )}
              <p className="text-sm text-amber-600 font-medium mb-2">{researcher.role}</p>
              <p className="text-sm text-amber-700/70 mb-1">{researcher.age} years old</p>
              <div className="flex items-center justify-center gap-1 text-sm text-amber-700/70">
                <MapPin className="w-3.5 h-3.5" />
                {researcher.location}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl border border-amber-200/50 p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-amber-900 mb-4">Our Mission</h2>
          <p className="text-amber-700/80 leading-relaxed max-w-3xl mx-auto">
            The goal is to provide beekeepers with smart, easy-to-use tools that use Artificial Intelligence and Computer Vision technology to assess hive health, forecast queen cell growth, and maintain healthy bee colonies.
          </p>
        </div>

        {/* About iBrood */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-8 mt-10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-amber-900 mb-4 text-center">About iBrood</h2>
          <p className="text-amber-700/80 leading-relaxed max-w-3xl mx-auto mb-6">
            iBrood is an intelligent system designed to help beekeepers monitor hive health through AI-powered analysis of queen cell development and brood patterns. Our mission is to make advanced hive monitoring accessible to beekeepers of all experience levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-amber-700/70">
            <div><span className="font-semibold">Version:</span> iBrood 2.0</div>
            <div><span className="font-semibold">Last Updated:</span> Jan 22, 2026</div>
            <div><span className="font-semibold">Build:</span> PWA v2.0</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
