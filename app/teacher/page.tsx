"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TeacherDashboard() {
  const [students] = useState([
    { id: 1, name: "Ahmad", subject: "Mathematics", progress: 75, engagement: 80, attendance: 90, lastActive: "2 hours ago", recentTopics: ["Algebra", "Fractions"], weakAreas: ["Geometry"] },
    { id: 2, name: "Siti", subject: "Science", progress: 60, engagement: 70, attendance: 85, lastActive: "1 day ago", recentTopics: ["Matter", "Energy"], weakAreas: ["Chemical Reactions"] },
    { id: 3, name: "Raj", subject: "English", progress: 90, engagement: 95, attendance: 95, lastActive: "30 mins ago", recentTopics: ["Grammar", "Vocabulary"], weakAreas: ["Essay Writing"] },
  ])

  const progressData = [
    { name: 'Week 1', avg: 65 },
    { name: 'Week 2', avg: 70 },
    { name: 'Week 3', avg: 75 },
    { name: 'Week 4', avg: 78 },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Last updated: Just now</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="text-lg">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="text-lg">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {Math.round(students.reduce((acc, student) => acc + student.progress, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Average Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {Math.round(students.reduce((acc, student) => acc + student.engagement, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="students">Student Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex justify-between items-center">
                    <span>{student.name}</span>
                    <span className="text-sm text-gray-500">{student.lastActive}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">Subject: {student.subject}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2 bg-blue-100" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement</span>
                        <span>{student.engagement}%</span>
                      </div>
                      <Progress value={student.engagement} className="h-2 bg-purple-100" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span>{student.attendance}%</span>
                      </div>
                      <Progress value={student.attendance} className="h-2 bg-green-100" />
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Recent Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.recentTopics.map((topic) => (
                          <span key={topic} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Areas for Improvement:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.weakAreas.map((area) => (
                          <span key={area} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Class Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      dot={{ fill: '#4F46E5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

